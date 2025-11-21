import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./JoinMeetingPage.scss";

const JoinMeetingPage: React.FC = () => {
  const [meetingCode, setMeetingCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!meetingCode.trim()) return;
    // Aquí iría la lógica real de validar el código y entrar a la reunión
    alert(`Uniéndote a la reunión: ${meetingCode}`);
    // navigate(`/meeting/${meetingCode}`);
  };

  return (
    <div className="join-meeting">
      <Header />

      {/* CONTENIDO */}
      <main className="main-content">
        <div className="modal-card">
          <h1>Unirme a una videollamada</h1>
          <p>
            Unirme a una videollamada creada por otra persona mediante el código de reunión
          </p>

          <div className="form-group">
            <input
              type="text"
              placeholder="Ingresa el código de la reunión"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              className="code-input"
              autoFocus
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={!meetingCode.trim()}
            className="join-btn"
          >
            Unirme a la videollamada
          </button>
        </div>
      </main>
    </div>
  );
};

export default JoinMeetingPage;