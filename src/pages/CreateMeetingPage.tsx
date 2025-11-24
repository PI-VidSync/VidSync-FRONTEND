import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/headers/Header";
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
      <Header />

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