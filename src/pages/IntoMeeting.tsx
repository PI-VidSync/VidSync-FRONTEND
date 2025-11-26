import React, { useState } from "react";
import "./IntoMeeting.scss";

import { Mic, MicOff, PhoneOff, Send, Video, VideoOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

type StageParticipant = {
  id: string;
  name: string;
  initials: string;
  micEnabled: boolean;
  videoEnabled: boolean;
};

type ChatMessage = {
  id: string;
  author: string;
  message: string;
  side: "left" | "right";
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
  initials: "UA",
  micEnabled: true,
  videoEnabled: false,
};

const attendeeTiles: StageParticipant[] = [
  {
    id: "camilo",
    name: "Camilo Torres",
    initials: "CT",
    micEnabled: false,
    videoEnabled: false,
  },
  {
    id: "lina",
    name: "Lina López",
    initials: "LL",
    micEnabled: true,
    videoEnabled: false,
  },
];

const chatMessages: ChatMessage[] = [
  { id: "1", author: "Camilo", message: "hola, saludos", side: "left" },
  {
    id: "2",
    author: "Lina",
    message: "bienvenido a la llamada grupal",
    side: "left",
  },
  { id: "3", author: "Camilo", message: "gracias por aceptarme", side: "left" },
  { id: "4", author: "Tú", message: "bienvenido camilo", side: "right" },
  { id: "5", author: "Tú", message: "bienvenida lina", side: "right" },
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

  const renderStatusIcon = (enabled: boolean, media: "mic" | "video") => {
    const Icon = enabled
      ? media === "mic"
        ? Mic
        : Video
      : media === "mic"
      ? MicOff
      : VideoOff;

    return (
      <span className={`media-state${enabled ? "" : " is-off"}`}>
        <Icon size={18} />
      </span>
    );
  };

  return (
    <section className="meeting-screen">
      <div className="meeting-screen__content">
        <div className="meeting-stage">
          <div className="meeting-tile meeting-tile--primary">
            <span className="meeting-tile__name">{primaryParticipant.name}</span>
            <div className="meeting-tile__avatar">{primaryParticipant.initials}</div>
            <div className="meeting-tile__status">
              {renderStatusIcon(primaryParticipant.micEnabled, "mic")}
              {renderStatusIcon(primaryParticipant.videoEnabled, "video")}
            </div>
          </div>

          <div className="secondary-tiles">
            {attendeeTiles.map((participant) => (
              <div key={participant.id} className="meeting-tile meeting-tile--secondary">
                <span className="meeting-tile__name">{participant.name}</span>
                <div className="meeting-tile__avatar">{participant.initials}</div>
                <div className="meeting-tile__status">
                  {renderStatusIcon(participant.micEnabled, "mic")}
                  {renderStatusIcon(participant.videoEnabled, "video")}
                </div>
              </div>
            ))}
          </div>

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

        <aside className="chat-panel">
          <header className="chat-header">
            <h2>Mensajes</h2>
          </header>

          <div className="chat-messages">
            {chatMessages.map((message) => (
              <div key={message.id} className={`chat-message chat-message--${message.side}`}>
                <span className="chat-message__author">{message.author}</span>
                <div className="chat-message__bubble">{message.message}</div>
              </div>
            ))}
          </div>

          <form className="chat-input" onSubmit={(event) => event.preventDefault()}>
            <input type="text" placeholder="Mensaje" />
            <button type="button">
              <Send size={18} />
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
};

export default IntoMeeting;
