import React, { useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, User } from "lucide-react";
import { attachLocalVideoElement, bindRemoteVideoElement } from "@/service/webrtc/webrtc";
import "./MeetCard.scss";

export type MeetParticipant = {
  id: string;
  name: string;
  micEnabled?: boolean;
  videoEnabled?: boolean;
};

type MeetCardProps = MeetParticipant & {
  meetingId: string;
  isLocal?: boolean;
};

const MeetCard: React.FC<MeetCardProps> = ({
  id,
  name,
  micEnabled,
  videoEnabled,
  meetingId,
  isLocal = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasStream, setHasStream] = useState(false);

  const tileClassName = useMemo(() => {
    const classes = ["meeting-tile"];
    if (isLocal) classes.push("is-local");
    if (hasStream && videoEnabled !== false) classes.push("has-video");
    if (videoEnabled === false) classes.push("video-off");
    return classes.join(" ");
  }, [isLocal, hasStream, videoEnabled]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const updateStreamState = () => {
      setHasStream(videoEl.dataset.hasStream === "true");
    };

    updateStreamState();

    const observer = new MutationObserver(updateStreamState);
    observer.observe(videoEl, { attributes: true, attributeFilter: ["data-has-stream"] });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.muted = isLocal;

    if (isLocal) {
      attachLocalVideoElement(videoEl);
      return () => {
        videoEl.srcObject = null;
        videoEl.setAttribute("data-has-stream", "false");
      };
    }

    bindRemoteVideoElement(meetingId, id, videoEl);
    return () => {
      bindRemoteVideoElement(meetingId, id, null);
    };
  }, [id, meetingId, isLocal]);

  const shouldShowAvatar = !hasStream || videoEnabled === false;

  return (
    <div className={tileClassName} data-peer-id={id} data-room-id={meetingId}>
      <div className="video-layer">
        <video
          ref={videoRef}
          id={`${meetingId}_${id}_video`}
          playsInline
          autoPlay
          muted={isLocal}
          data-has-stream="false"
        />
      </div>

      <span className="name">{name}</span>

      <div className="avatar" aria-hidden={!shouldShowAvatar}>
        <User />
      </div>

      {micEnabled !== undefined && (
        <div className="status">
          <StatusIcon enabled={micEnabled} />
        </div>
      )}
    </div>
  );
};

const StatusIcon = ({ enabled }: { enabled: boolean }) => {
  const Icon = enabled ? Mic : MicOff;
  return (
    <span className={`media-state${enabled ? "" : " is-off"}`}>
      <Icon size={18} />
    </span>
  );
};

export { MeetCard };