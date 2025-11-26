import React, { useState } from "react";
import "./IntoMeeting.scss";

import { Mic, MicOff, PhoneOff, Send, Video, VideoOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MeetCard } from "@/components/meet/meetCard";
import { ChatPanel } from "@/components/meet/ChatCard";

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
  const [micEnabled, setMicEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);

  const controls: ControlButton[] = [
    { id: "mic", enabled: micEnabled, onClick: () => setMicEnabled((prev) => !prev) },
    { id: "video", enabled: videoEnabled, onClick: () => setVideoEnabled((prev) => !prev) },
    { id: "hangup", onClick: () => navigate("/dashboard") },
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

      <ChatPanel />
    </section>
  );
};

export default IntoMeeting;
