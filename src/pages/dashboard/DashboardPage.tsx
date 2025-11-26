import React from "react";
import { Link } from "react-router-dom";
import "./DashboardPage.scss";
import { Monitor, Users } from "lucide-react";

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-main">
      <div className="cards-container">
        <Link to="/create-meeting" className="dashboard-card">
          <div className="card-icon create">
            <Monitor size={48} />
          </div>
          <h3>Crear una videollamada</h3>
          <p>Crea una reunión para reunirte con tus amigos o compañeros vía chat, audio y video</p>
        </Link>

        <Link to="/join-meeting" className="dashboard-card">
          <div className="card-icon join">
            <Users size={48} />
          </div>
          <h3>Unirme a una videollamada</h3>
          <p>Únete a una videollamada creada por otra persona mediante el código de reunión</p>
        </Link>

        {/* Perfil moved to header - card removed to avoid duplication */}
      </div>
    </div>
  );
};

export default DashboardPage;