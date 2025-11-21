import React from "react";
import { Link } from "react-router-dom";
import "./DashboardPage.scss";
import Header from "../components/Header";

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard">
      <Header />

      {/* CONTENIDO */}
      <main className="dashboard-main">
        <div className="cards-container">
          <Link to="/create-meeting" className="dashboard-card">
            <div className="card-icon create">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="12" rx="2" ry="2"></rect>
                <line x1="8" y1="20" x2="16" y2="20"></line>
                <line x1="12" y1="16" x2="12" y2="20"></line>
                <path d="M16 2v4M8 2v4"></path>
              </svg>
            </div>
            <h3>Crear una videollamada</h3>
            <p>Crea una reunión para reunirte con tus amigos o compañeros vía chat, audio y video</p>
          </Link>

          <Link to="/join-meeting" className="dashboard-card">
            <div className="card-icon join">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                parameterized path
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>Unirme a una videollamada</h3>
            <p>Únete a una videollamada creada por otra persona mediante el código de reunión</p>
          </Link>

          {/* Perfil moved to header - card removed to avoid duplication */}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;