import React from "react";
import { Link } from "react-router-dom";
import "./DashboardPage.scss";

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="logo">
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

          <Link to="/profile" className="dashboard-card">
            <div className="card-icon profile">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3>Perfil de Usuario</h3>
            <p>Valida la información de tu perfil de usuario, edita tu información personal y verifica tus conexiones</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;