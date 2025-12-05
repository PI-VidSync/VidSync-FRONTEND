import Peer from "simple-peer/simplepeer.min.js";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export function getLocalSocketId(): string | null {
  return socket?.id ?? null;
}

type PeersListener = (peers: { id: string; name?: string }[]) => void;
const peersListeners: Record<string, Set<PeersListener>> = {};

/**
 * Emit the current list of peers in a room to all registered listeners
 * 
 * @param room 
 */

function emitPeers(room: string) {
  const roomPeers = peersByRoom[room] ?? {};
  const list = Object.keys(roomPeers).map(id => ({ id, name: roomPeers[id]?.name }));
  peersListeners[room]?.forEach(cb => {
    try { cb(list); }
     catch (e) 
      { console.warn("peers listener err", e); }
  });
}

/**
 * Register a callback to be notified when the list of peers in a room changes
 * 
 * @param room 
 * @param cb 
 * @returns 
 */

export function onPeersChange(room: string, cb: PeersListener) {
  peersListeners[room] = peersListeners[room] ?? new Set();
  peersListeners[room].add(cb);
  // initial push
  emitPeers(room);
  return () => {
    peersListeners[room]?.delete(cb);
    if (!peersListeners[room]?.size) delete peersListeners[room];
  };
}

const peersByRoom: Record<string, Record<string, { peerConnection: any; name?: string }>> = {};
let currentRoom: string | null = null;
let localMediaStream: MediaStream | null = null;
let localDisplayName: string | null = null;

const serverWebRTCUrl = import.meta.env.VITE_WEBRTC_URL as string;
if (!serverWebRTCUrl) {
  throw new Error("VITE_WEBRTC_URL no está definido");
}

const iceServerUrl = import.meta.env.VITE_ICE_SERVER_URL as string | undefined;
const iceServerUsername = import.meta.env.VITE_ICE_SERVER_USERNAME as string | undefined;
const iceServerCredential = import.meta.env.VITE_ICE_SERVER_CREDENTIAL as string | undefined;

/**
 * initWebRTC(options)
 * - options.audio (default true)
 * - options.video (default false)
 * - options.room (meeting code) REQUIRED to scope peers per meeting
 * - options.displayName (optional display name to announce to peers)
 *
 * Initializes signalling and joins the given room (unique peer set per room).
 */
export const initWebRTC = async (options?: { audio?: boolean; video?: boolean; room?: string; displayName?: string }): Promise<void> => {
  if (!options?.room) {
    throw new Error("initWebRTC: 'room' is required to scope peer connections");
  }

  const room = options.room;
  const opts = { audio: true, video: false, ...(options ?? {}) };
  // capture displayName
  if (typeof options?.displayName === "string") localDisplayName = options!.displayName;

  // if already connected to same room, do nothing
  if (socket && currentRoom === room) return;

  // if connected to another room, cleanup first
  if (socket && currentRoom && currentRoom !== room) {
    await leaveRoom(currentRoom);
  }

  try {
    try {
      // Request audio/video according to options
      localMediaStream = await getMedia(opts);
    } catch (err) {
      console.warn("Could not access requested media (audio/video):", err);
      // fallback: try audio only if requested
      if (opts.audio) {
        try {
          localMediaStream = await getMedia({ audio: true, video: false });
        } catch {
          localMediaStream = null;
        }
      } else {
        localMediaStream = null;
      }
    }

    initSocketConnection();

    // join requested room and create container for peers
    currentRoom = room;
    peersByRoom[currentRoom] = peersByRoom[currentRoom] ?? {};
    socket?.emit("joinRoom", currentRoom);
    // announce display name to room (server should re-broadcast to others)
    if (localDisplayName) {
      socket?.emit("announce", { room: currentRoom, name: localDisplayName });
    }
  } catch (error) {
    console.error("Failed to initialize WebRTC connection:", error);
    throw error;
  }
};

/**
 * Request media according to passed options
 * 
 * @param opts 
 * @returns 
 */
async function getMedia(opts: { audio?: boolean; video?: boolean } = { audio: true, video: false }): Promise<MediaStream> {
  const constraints: MediaStreamConstraints = {
    audio: !!opts.audio,
    video: !!opts.video
  };
  return await navigator.mediaDevices.getUserMedia(constraints);
}

/**
 * Initialize the socket connection for signalling
 */
function initSocketConnection() {
  if (socket) return;
  socket = io(serverWebRTCUrl, { autoConnect: true });

  socket.on("connect", () => {
    //console.log("Connected to signalling server", socket?.id);

    // snapshot current room
    const room = currentRoom;
    if (!room || !socket) return;

    // asure entry in peersByRoom
    peersByRoom[room] = peersByRoom[room] ?? {};
    if (socket?.id && !peersByRoom[room][socket.id]) {
      if (socket?.id) {
        peersByRoom[room][socket.id] = { peerConnection: null, name: localDisplayName ?? undefined };
      }
    }
    emitPeers(room);

    // announce our name to room
    if (localDisplayName) {
      socket.emit("announce", { room, name: localDisplayName });
    }
  });

  socket.on("introduction", (otherClientIds: string[]) => handleIntroduction(otherClientIds));
  socket.on("newUserConnected", (theirId: string) => handleNewUserConnected(theirId));
  socket.on("userDisconnected", (theirId: string) => handleUserDisconnected(theirId));
  socket.on("signal", (to: string, from: string, data: any) => handleSignal(to, from, data));

  socket.on("announce", (payload: { socketId: string; name?: string }) => {
    const room = currentRoom;
    if (!room) return;
    const { socketId, name } = payload;
    const roomPeers = (peersByRoom[room] ||= {});
    roomPeers[socketId] = roomPeers[socketId] ?? { peerConnection: null };
    if (name) roomPeers[socketId].name = name;
    emitPeers(room);
  });

  socket.on("askToAnnounce", () => {
    const room = currentRoom;
    if (room && localDisplayName) {
      socket?.emit("announce", { room, name: localDisplayName });
    }
  });
}

/**
 * Handle introduction message with list of other client IDs in the room
 * 
 * @param otherClientIds 
 */
function handleIntroduction(otherClientIds: string[]) {
  const s = socket;
  const room = currentRoom;
  if (!s || !room) return;

  const roomPeers = (peersByRoom[room] ||= {});

  // asure entry for local peer
  if (s.id) {
    roomPeers[s.id] = roomPeers[s.id] ?? { peerConnection: null, name: localDisplayName };
  }

  // create connections as initiator and request identity
  for (const theirId of otherClientIds) {
    if (theirId === s.id) continue;

    if (!roomPeers[theirId]?.peerConnection) {
      roomPeers[theirId] = {
        peerConnection: createPeerConnection(theirId, true),
        name: roomPeers[theirId]?.name
      };
      //createClientMediaElements(room, theirId);
    }

    // request identity for each peer
    s.emit("requestIdentityFor", { room, socketId: theirId });
  }

  // re-announce our name to those who don't have it
  if (localDisplayName) {
    s.emit("announce", { room, name: localDisplayName });
  }

  emitPeers(room);
}

/** Handle a new user connection
 * 
 * @param theirId 
 */
function handleNewUserConnected(theirId: string) {
  if (!socket || !currentRoom) return;
  if (theirId === socket.id) return;
  const roomPeers = peersByRoom[currentRoom] ?? (peersByRoom[currentRoom] = {});
  if (!roomPeers[theirId]) {
    roomPeers[theirId] = { peerConnection: null };
   createClientMediaElements(currentRoom!, theirId);
  }
  // request identity for new user and emit updated list
  socket.emit("requestIdentityFor", { room: currentRoom, socketId: theirId });
  emitPeers(currentRoom);
}

/** Handle user disconnection
 * 
 * @param theirId 
 */
function handleUserDisconnected(theirId: string) {
  if (!currentRoom) return;
  const roomPeers = peersByRoom[currentRoom] ?? {};
  if (roomPeers[theirId]) {
    roomPeers[theirId].peerConnection?.destroy?.();
    removeClientMediaElements(currentRoom, theirId);
    delete roomPeers[theirId];
  }
  emitPeers(currentRoom);
}

/** Handle incoming signalling data
 * 
 * @param to
 * @param from
 * @param data
 */
function handleSignal(to: string, from: string, data: any) {
  if (!socket) return;
  if (to !== socket.id) return;

  if (!currentRoom) {
    console.warn("Received signal but not joined to any room");
    return;
  }

  const roomPeers = peersByRoom[currentRoom] ?? {};
  let peer = roomPeers[from];
  if (peer && peer.peerConnection) {
    peer.peerConnection.signal(data);
  } else {
    const peerConnection = createPeerConnection(from, false);
    peersByRoom[currentRoom] = peersByRoom[currentRoom] ?? {};
    peersByRoom[currentRoom][from] = { peerConnection };
    peerConnection.signal(data);
  }
}

/** Create a new peer connection
 * 
 * @param theirSocketId 
 * @param isInitiator 
 */
function createPeerConnection(theirSocketId: string, isInitiator = false) {
   const iceServers: any[] = [];
   if (iceServerUrl) {
     const urls = iceServerUrl
       .split(",")
       .map(url => url.trim())
       .filter(Boolean)
       .map(url => {
         if (!/^stun:|^turn:|^turns:/.test(url)) return `turn:${url}`;
         return url;
       });
     urls.forEach(url => {
       const serverConfig: any = { urls: url };
       if (iceServerUsername) serverConfig.username = iceServerUsername;
       if (iceServerCredential) serverConfig.credential = iceServerCredential;
       iceServers.push(serverConfig);
     });
   }

   if (!iceServers.length) {
     console.warn("No ICE servers configured. Connection may fail.");
   }

   const peerOptions: any = {
     initiator: isInitiator,
     config: { iceServers },
     stream: localMediaStream ? localMediaStream : undefined,
     trickle: true
   };

  // instantiate simple-peer 
  let peer: any;
  try {
    peer = new (Peer as any)(peerOptions);
  } catch (err) {
    console.error("Failed to instantiate simple-peer:", err, { peerOptions, Peer });
    // return a safe stub to avoid crashing the app
    const stub: any = {
      on: (_: string, __?: any) => {},
      signal: (_: any) => {},
      destroy: () => {},
    };
    return stub;
  }

   peer.on("signal", (data: any) => {
     if (!socket) return;
     // emit signal to target peer (server will route it)
     socket.emit("signal", theirSocketId, socket.id, data);
   });

   peer.on("stream", (stream: MediaStream) => {
     updateClientMediaElements(theirSocketId, stream);
   });

  peer.on("close", () => {
     if (currentRoom) removeClientMediaElements(currentRoom, theirSocketId);
   });

   peer.on("error", (err: any) => {
     console.warn("Peer error", theirSocketId, err);
   });

   return peer;
}

function createClientMediaElements(room: string, peerId: string) {
  const containerId = `${room}_${peerId}_container`;
  if (document.getElementById(containerId)) return;

  const parent = document.getElementById("remote_videos") ?? document.body;

  const container = document.createElement("div");
  container.id = containerId;
  container.className = "remote-media";
  container.style.cssText = "display:inline-block;margin:1px;";

  const videoEl = document.createElement("video");
  videoEl.id = `${room}_${peerId}_video`;
  videoEl.autoplay = true;
  videoEl.playsInline = true;
  videoEl.width = 320;
  videoEl.height = 240;
  videoEl.style.cssText = "background:#000;border-radius:6px;";

  container.appendChild(videoEl);
  parent.appendChild(container);
}

function updateClientMediaElements(peerId: string, stream: MediaStream) {
  // Try to find element by current room scope first
  if (!currentRoom) return;
  const videoEl = document.getElementById(`${currentRoom}_${peerId}_video`) as HTMLVideoElement | null;
  if (videoEl) {
    videoEl.srcObject = stream;
    videoEl.play().catch(() => {});
  }
}

function removeClientMediaElements(room: string, peerId: string) {
  const container = document.getElementById(`${room}_${peerId}_container`);
  if (container) container.remove();
}

export function attachLocalVideoElement(el: HTMLMediaElement | null) {
  if (!el) return;
  if (localMediaStream) {
    el.srcObject = localMediaStream;
    el.autoplay = true;
    el.play().catch(() => {});
    el.style.backgroundImage = "";
  } else {
    el.srcObject = null;
    el.style.backgroundImage = "";
  }
}

/** Toggle audio tracks enabled/disabled
 * 
 * @param enabled 
 */
export function toggleAudio(enabled: boolean) {
  if (!localMediaStream) return;
  localMediaStream.getAudioTracks().forEach(t => (t.enabled = enabled));
}

/** Toggle video tracks enabled/disabled
 * 
 * @param enabled 
 */
export function toggleVideo(enabled: boolean) {
  if (!localMediaStream) return;
  localMediaStream.getVideoTracks().forEach(t => (t.enabled = enabled));
}

/** Leave a room and clean up resources
 * 
 * @param room 
 */
export async function leaveRoom(room?: string) {
  const target = room ?? currentRoom;
  if (!target) return;

  // cerrar peers y limpiar UI
  const roomPeers = peersByRoom[target] ?? {};
  Object.keys(roomPeers).forEach(k => {
    roomPeers[k].peerConnection?.destroy?.();
    removeClientMediaElements(target, k);
  });
  delete peersByRoom[target];

  if (socket && socket.connected) {
    socket.emit("leaveRoom", target);
  }

  emitPeers(target);

  if (target === currentRoom) currentRoom = null;
}

/** 
 * Stop local media stream and disconnect from signalling server
 */
export function stopLocalStream() {
  if (localMediaStream) {
    localMediaStream.getTracks().forEach(t => t.stop());
    localMediaStream = null;
  }
  if (currentRoom) {
    // dejar la room y notificar listeners
    leaveRoom(currentRoom);
  }
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/** Get the list of peers in a room
 * 
 * @param room 
 * @returns 
 */
export function getPeersInRoom(room: string): { id: string; name?: string }[] {
  const roomPeers = peersByRoom[room] ?? {};
  return Object.keys(roomPeers).map(id => ({ id, name: roomPeers[id]?.name }));
}

/** Check if local media stream is active
 * 
 * @returns 
 */
export function hasLocalMedia(): boolean {
  return !!localMediaStream && localMediaStream.getTracks().length > 0;
}

export default {
  initWebRTC,
  //attachLocalVideoElement,
  toggleAudio,
  toggleVideo,
  stopLocalStream,
  hasLocalMedia,
  leaveRoom
};