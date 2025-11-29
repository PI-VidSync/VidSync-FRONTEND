import React, { useEffect, useState } from "react";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatPanel } from "@/components/meet/ChatCard";
import "./IntoMeeting.scss";
import { MeetCard } from "@/components/meet/MeetCard";
import { deleteCookie } from "@/utils/cookie"; // new import

type StageParticipant = {
  id: string;
  name: string;
  micEnabled?: boolean;
  videoEnabled?: boolean;
};

type ControlId = "mic" | "video" | "hangup";

type ControlButton = {
  id: ControlId;
  enabled?: boolean;
  onClick: () => void;
};

const primaryParticipant: StageParticipant = {
  id: "host",
  name: "Usuario Apellido",
};

const attendeeTiles: StageParticipant[] = [
  {
    id: "camilo",
    name: "Camilo Torres",
    micEnabled: false,
    videoEnabled: false,
  },
  {
    id: "lina",
    name: "Lina López",
    micEnabled: true,
    videoEnabled: false,
  },
];

const IntoMeeting: React.FC = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>(); // get meeting id from route params
  const [micEnabled, setMicEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);

  // debug to confirm route param
  useEffect(() => {
    console.log("IntoMeeting mounted, meetingId =", meetingId);
  }, [meetingId]);

  // remove cookies when user closes tab/window
  useEffect(() => {
    const onBeforeUnload = () => {
      deleteCookie("chat_room");
      deleteCookie("chat_username");
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const handleHangup = () => {
    // delete chat cookies when leaving the call
    deleteCookie("chat_room");
    deleteCookie("chat_username");
    navigate("/dashboard");
  };

  const controls: ControlButton[] = [
    { id: "mic", enabled: micEnabled, onClick: () => setMicEnabled((prev) => !prev) },
    { id: "video", enabled: videoEnabled, onClick: () => setVideoEnabled((prev) => !prev) },
    { id: "hangup", onClick: handleHangup }, // use handler that clears cookies
  ];

  return (
    <section className="meeting-screen">
      <div className="meeting-stage">
        <MeetCard {...primaryParticipant} />

        {attendeeTiles.map((participant) => (
          <MeetCard key={participant.id} {...participant} />
        ))}

        <div className="meeting-controls-container">
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
              const isActive = isMediaControl ? control.enabled === true : true;
              const classNames = [
                "control-button",
                !isActive && isMediaControl ? "is-off" : "",
                control.id === "hangup" ? "is-hangup" : "",
              ]
                .filter(Boolean)
                .join(" ");

              const label = (() => {
                if (control.id === "mic") return "Micrófono";
                if (control.id === "video") return "Video";
                return "Colgar llamada";
              })();

              return (
                <button
                  key={control.id}
                  type="button"
                  className={classNames}
                  aria-label={label}
                  onClick={control.onClick}
                >
                  <Icon size={26} />
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* pass meetingId to chat panel so it joins the correct room */}
      <ChatPanel meetingId={meetingId ?? ""} />
    </section>
  );
};

export default IntoMeeting;
