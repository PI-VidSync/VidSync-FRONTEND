import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateMeetingPage.scss";

const CreateMeetingPage: React.FC = () => {
  const [meetingName, setMeetingName] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (meetingName.trim()) {
      // Aquí iría la lógica real para crear la reunión
      alert(`¡Reunión "${meetingName}" creada con éxito!`);
      // navigate("/meeting-room"); // cuando tengas la sala
    }
  };

  return (
    <div className="create-meeting-page">
      {/* HEADER (igual que el dashboard) */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">Chat</span>
          <span className="logo-text">VidSync</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </button>
          <button className="icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* MODAL CENTRADO */}
      <div className="modal-container">
        <div className="create-modal">
          <h2>Crear una videollamada</h2>
          <p className="modal-subtitle">
            Crea una reunión para reunirte con tus amigos y compañeros vía chat, audio y video
          </p>

          <input
            type="text"
            placeholder="Ingresa el nombre de la reunión"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            className="meeting-input"
          />

          <button
            onClick={handleCreate}
            className="btn-create"
            disabled={!meetingName.trim()}
          >
            Crear videollamada
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMeetingPage;