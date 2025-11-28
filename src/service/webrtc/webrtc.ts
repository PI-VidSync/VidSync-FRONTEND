import Peer from "simple-peer";
import { io, Socket } from "socket.io-client";

const serverWebRTCUrl = import.meta.env.VITE_WEBRTC_URL as string;
if (!serverWebRTCUrl) {
  throw new Error("VITE_WEBRTC_URL no está definido");
}

const iceServerUrl = import.meta.env.VITE_ICE_SERVER_URL as string | undefined;
const iceServerUsername = import.meta.env.VITE_ICE_SERVER_USERNAME as string | undefined;
const iceServerCredential = import.meta.env.VITE_ICE_SERVER_CREDENTIAL as string | undefined;

let socket: Socket | null = null;
let peers: Record<string, { peerConnection: any }> = {};
let localMediaStream: MediaStream | null = null;

export const initWebRTC = async (): Promise<void> => {
  if (socket) return; // ya inicializado
  try {
    try {
      localMediaStream = await getMedia();
    } catch (err) {
      console.warn("No se pudo acceder a mic/cámara, continuando sin medios locales:", err);
      localMediaStream = null;
    }

    initSocketConnection();
  } catch (error) {
    console.error("Failed to initialize WebRTC connection:", error);
    throw error;
  }
};

async function getMedia(): Promise<MediaStream> {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 640, height: 480 }
    });
  } catch (err) {
    throw err;
  }
}

function initSocketConnection() {
  socket = io(serverWebRTCUrl, { autoConnect: true });

  socket.on("connect", () => {
    console.log("Connected to signalling server", socket?.id);
  });

  socket.on("introduction", handleIntroduction);
  socket.on("newUserConnected", handleNewUserConnected);
  socket.on("userDisconnected", handleUserDisconnected);
  socket.on("signal", handleSignal);
}

function handleIntroduction(otherClientIds: string[]) {
  otherClientIds.forEach((theirId) => {
    if (!socket) return;
    if (theirId !== socket.id) {
      peers[theirId] = { peerConnection: createPeerConnection(theirId, true) };
      createClientMediaElements(theirId);
    }
  });
}

function handleNewUserConnected(theirId: string) {
  if (!socket) return;
  if (theirId !== socket.id && !(theirId in peers)) {
    peers[theirId] = { peerConnection: null };
    createClientMediaElements(theirId);
  }
}

function handleUserDisconnected(_id: string) {
  if (!socket) return;
  if (_id !== socket.id) {
    removeClientMediaElements(_id);
    if (peers[_id] && peers[_id].peerConnection) {
      peers[_id].peerConnection.destroy?.();
    }
    delete peers[_id];
  }
}

function handleSignal(to: string, from: string, data: any) {
  if (!socket) return;
  if (to !== socket.id) return;

  let peer = peers[from];
  if (peer && peer.peerConnection) {
    peer.peerConnection.signal(data);
  } else {
    const peerConnection = createPeerConnection(from, false);
    peers[from] = { peerConnection };
    peerConnection.signal(data);
  }
}

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

  const peer = new Peer(peerOptions);

  peer.on("signal", (data: any) => {
    if (!socket) return;
    socket.emit("signal", theirSocketId, socket.id, data);
  });

  peer.on("stream", (stream: MediaStream) => {
    updateClientMediaElements(theirSocketId, stream);
  });

  peer.on("close", () => {
    removeClientMediaElements(theirSocketId);
  });

  peer.on("error", (err: any) => {
    console.warn("Peer error", theirSocketId, err);
  });

  return peer;
}

function createClientMediaElements(_id: string) {
  const containerId = `${_id}_container`;
  if (document.getElementById(containerId)) return;

  const parent = document.getElementById("remote_videos") ?? document.body;

  const container = document.createElement("div");
  container.id = containerId;
  container.className = "remote-media";
  container.style.cssText = "display:inline-block;margin:1px;";

  const videoEl = document.createElement("video");
  videoEl.id = `${_id}_video`;
  videoEl.autoplay = true;
  videoEl.playsInline = true;
  videoEl.width = 320;
  videoEl.height = 240;
  videoEl.style.cssText = "background:#000;border-radius:6px;";

  container.appendChild(videoEl);
  parent.appendChild(container);
}

function updateClientMediaElements(_id: string, stream: MediaStream) {
  const videoEl = document.getElementById(`${_id}_video`) as HTMLVideoElement | null;
  if (videoEl) {
    videoEl.srcObject = stream;
    videoEl.play().catch(() => {});
  }
}

function removeClientMediaElements(_id: string) {
  const container = document.getElementById(`${_id}_container`);
  if (container) container.remove();
}

export function attachLocalVideoElement(el: HTMLVideoElement | null) {
  if (!el) return;
  if (localMediaStream) {
    el.srcObject = localMediaStream;
    el.autoplay = true;
    el.playsInline = true;
    el.muted = true;
    el.play().catch(() => {});

    el.style.backgroundImage = "";
  } else {
    el.srcObject = null;
    el.style.backgroundImage = "";
  }
}

export function toggleAudio(enabled: boolean) {
  if (!localMediaStream) return;
  localMediaStream.getAudioTracks().forEach(t => (t.enabled = enabled));
}

export function toggleVideo(enabled: boolean) {
  if (!localMediaStream) return;
  localMediaStream.getVideoTracks().forEach(t => (t.enabled = enabled));
}

export function stopLocalStream() {
  if (localMediaStream) {
    localMediaStream.getTracks().forEach(t => t.stop());
    localMediaStream = null;
  }
  Object.keys(peers).forEach(k => {
    peers[k].peerConnection?.destroy?.();
    removeClientMediaElements(k);
    delete peers[k];
  });
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function hasLocalMedia(): boolean {
  return !!localMediaStream;
}

export default {
  initWebRTC,
  attachLocalVideoElement,
  toggleAudio,
  toggleVideo,
  stopLocalStream,
  hasLocalMedia
};