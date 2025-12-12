import React, { useEffect, useState, useCallback } from "react";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatPanel } from "@/components/meet/ChatCard";
import "./IntoMeeting.scss";
import { MeetCard, type MeetParticipant } from "@/components/meet/MeetCard";
import { deleteCookie, getCookie } from "@/utils/cookie";
import {
  initWebRTC as initWebRTCfn,
  toggleAudio,
  toggleVideo,
  stopLocalStream,
  leaveRoom,
  getLocalSocketId,
  onPeersChange
} from "@/service/webrtc/webrtc";

type ControlId = "mic" | "video" | "hangup";

type ControlButton = {
  id: ControlId;
  enabled?: boolean;
  onClick: () => void;
};

const IntoMeeting: React.FC = () => {
  const navigate = useNavigate();
  // get current user from context (hook must be called at top-level)

  // always call the hook (stable hooks order), then compute meetingId using cookie fallback
  const params = useParams<{ meetingId: string }>();
  const meetingId = getCookie("chat_room") || params.meetingId;
  // display name from cookie or auth context
  const displayName = getCookie("username") ?? "Yo";

  const [participants, setParticipants] = useState<MeetParticipant[]>([]);
  const [localSocketId, setLocalSocketId] = useState<string | null>(null);

  // states for join / device availability
  const [joined, setJoined] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [hasMic, setHasMic] = useState<boolean | null>(null);

  // check available devices (microphone / camera)
  const checkDevices = useCallback(async (): Promise<{ hasCamera: boolean; hasMic: boolean }> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      setHasCamera(false);
      setHasMic(false);
      return { hasCamera: false, hasMic: false };
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cam = devices.some(d => d.kind === "videoinput");
      const mic = devices.some(d => d.kind === "audioinput");
      setHasCamera(cam);
      setHasMic(mic);
      return { hasCamera: cam, hasMic: mic };
    } catch {
      setHasCamera(false);
      setHasMic(false);
      return { hasCamera: false, hasMic: false };
    }
  }, []);

  useEffect(() => {
    checkDevices();
    const onChange = () => checkDevices();
    navigator.mediaDevices?.addEventListener?.("devicechange", onChange);
    return () => navigator.mediaDevices?.removeEventListener?.("devicechange", onChange);
  }, [checkDevices]);

  // Auto-join room with media scoped to meetingId
  useEffect(() => {
    if (!meetingId) return;
    let mounted = true;

    (async () => {
      const devices = await checkDevices();
      const wantVideo = devices.hasCamera === true;
      const wantAudio = devices.hasMic === true;

      // If no microphone and no camera, mark unavailable and don't init
      if (!wantAudio && !wantVideo) {
        if (!mounted) return;
        setHasMic(false);
        setHasCamera(false);
        setMicEnabled(false);
        setVideoEnabled(false);
        setJoined(false);
        return;
      }

      try {
        // pass displayName from AuthContext to initWebRTC
        await initWebRTCfn({ room: meetingId, audio: wantAudio, video: wantVideo, displayName });
        if (!mounted) return;
        setHasMic(wantAudio);
        setHasCamera(wantVideo);
        setMicEnabled(Boolean(wantAudio));
        setVideoEnabled(Boolean(wantVideo));
        setJoined(true);
      } catch (err) {
        console.warn("Auto-join media failed:", err);
        // fallback to audio-only if possible
        if (wantAudio) {
          try {
            await initWebRTCfn({ room: meetingId, audio: true, video: false, displayName });
            if (!mounted) return;
            setHasMic(true);
            setHasCamera(false);
            setMicEnabled(true);
            setVideoEnabled(false);
            setJoined(true);
            return;
          } catch (e) {
            console.warn("Fallback audio-only failed:", e);
          }
        }
        setMicEnabled(false);
        setVideoEnabled(false);
        setJoined(false);
      }
    })();

    // subscribe to peers changes for this meeting
    const unsub = onPeersChange(meetingId, (list) => {
      if (!mounted) return;
      const localId = getLocalSocketId();
      if (localId && !localSocketId) setLocalSocketId(localId);

      const mapped: MeetParticipant[] = list.map(p => {
        const isLocalPeer = p.id === (localId ?? localSocketId);
        const display = isLocalPeer ? (displayName ?? p.name ?? p.id) : (p.name ?? p.id);
        const audioState = p.media?.audio;
        const videoState = p.media?.video;

        return {
          id: p.id,
          name: display,
          micEnabled: audioState,
          videoEnabled: videoState ?? true,
        };
      });

      const me = localId ?? localSocketId;
      const ordered = me ? [...mapped].sort((a, b) => (a.id === me ? -1 : b.id === me ? 1 : 0)) : mapped;
      setParticipants(ordered);
    });

    return () => {
      mounted = false;
      if (meetingId) leaveRoom(meetingId).catch(() => { });
      stopLocalStream();
      unsub();
      // clear participants on unmount
      setParticipants([]);
      setLocalSocketId(null);
    };
  }, [meetingId, displayName]);

  const leaveAll = useCallback(() => {
    stopLocalStream();
    setJoined(false);
    setMicEnabled(false);
    setVideoEnabled(false);
    // delete user-scoped cookie on leave
    const username = getCookie("username");
    if (username) deleteCookie("chat_room");
  }, []);

  const toggleMicHandler = useCallback(async () => {
    if (hasMic === false) return; // disabled when no mic
    if (!joined && meetingId) {
      // init only audio if not joined yet
      try {
        await initWebRTCfn({ room: meetingId, audio: true, video: false });
        setJoined(true);
        setMicEnabled(true);
        return;
      } catch (err) {
        console.warn("init audio failed:", err);
        return;
      }
    }
    try {
      toggleAudio(!micEnabled);
      setMicEnabled(v => !v);
    } catch (err) {
      console.warn("toggleAudio failed", err);
    }
  }, [hasMic, joined, micEnabled, meetingId]);

  const toggleCamHandler = useCallback(async () => {
    if (hasCamera === false) return; // disabled when no camera
    if (!joined && meetingId) {
      // attempt to init audio+video
      try {
        await initWebRTCfn({ room: meetingId, audio: hasMic === true, video: true });
        setJoined(true);
        setVideoEnabled(true);
        if (hasMic === null) await checkDevices();
      } catch (err) {
        console.warn("init with video failed:", err);
        setVideoEnabled(false);
      }
      return;
    }
    try {
      toggleVideo(!videoEnabled);
      setVideoEnabled(v => !v);
    } catch (err) {
      console.warn("toggleVideo failed", err);
    }
  }, [hasCamera, joined, videoEnabled, hasMic, checkDevices, meetingId]);

  // remove cookies when user closes tab/window
  useEffect(() => {
    const onBeforeUnload = () => {
      const username = getCookie("username");
      if (username) {
        deleteCookie("chat_room");
      }
      // keep username
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const handleHangup = () => {
    // delete user-scoped chat_room when leaving the call
    const username = getCookie("username");
    if (username) deleteCookie("chat_room");
    if (meetingId) leaveRoom(meetingId).catch(() => { });
    leaveAll();
    navigate("/dashboard");
  };

  const controls: ControlButton[] = [
    {
      id: "mic",
      enabled: micEnabled,
      onClick: toggleMicHandler
    },
    {
      id: "video",
      enabled: videoEnabled,
      onClick: toggleCamHandler
    },
    { id: "hangup", onClick: handleHangup }
  ];

  const localParticipant = localSocketId ? participants.find(p => p.id === localSocketId) : undefined;
  const remoteParticipants = participants.filter(p => (localSocketId ? p.id !== localSocketId : true));

  return (
    <section className="meeting-screen">
      <div className="meeting-stage">
        <section className="participants-grid">
          {meetingId && localParticipant && (
            <MeetCard
              key={localParticipant.id}
              {...localParticipant}
              micEnabled={micEnabled}
              videoEnabled={videoEnabled}
              meetingId={meetingId}
              isLocal
            />
          )}

          {meetingId && remoteParticipants.map(participant => (
            <MeetCard
              key={participant.id}
              {...participant}
              meetingId={meetingId}
            />
          ))}
        </section>

        <section className="meeting-controls-container">
          <nav className="meeting-controls">
            {controls.map((control) => {
              const Icon = (() => {
                if (control.id === "mic") {
                  return control.enabled ? Mic : MicOff;
                }
                if (control.id === "video") {
                  return control.enabled ? Video : VideoOff;
                }
                return PhoneOff;
              })();

              const isMediaControl = control.id === "mic" || control.id === "video";
              const available = control.id === "mic" ? (hasMic !== false) : control.id === "video" ? (hasCamera !== false) : true;
              const isActive = isMediaControl ? control.enabled === true : true;
              const classNames = [
                "control-button",
                !isActive && isMediaControl ? "is-off" : "",
                !available ? "is-disabled" : "",
                control.id === "hangup" ? "is-hangup" : "",
              ]
                .filter(Boolean)
                .join(" ");

              const label = (() => {
                if (control.id === "mic") return hasMic === false ? "No se detecta mic" : !joined ? "Unirse para usar el micrófono" : (control.enabled ? "Silenciar micrófono" : "Activar micrófono");
                if (control.id === "video") return hasCamera === false ? "No se detecta camara" : !joined ? "Unirse para usar la cámara" : (control.enabled ? "Apagar cámara" : "Encender cámara");
                return "Colgar llamada";
              })();

              return (
                <button
                  key={control.id}
                  type="button"
                  className={classNames}
                  aria-label={label}
                  title={label}
                  onClick={control.onClick}
                  disabled={!available && isMediaControl}
                >
                  <Icon size={26} />
                </button>
              );
            })}
          </nav>
        </section>
      </div>
      <ChatPanel meetingId={meetingId ?? ""} />
    </section>
  );
};

export default IntoMeeting;

