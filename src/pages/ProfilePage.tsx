import React from "react";
import { Link } from "react-router-dom";
import "./ProfilePage.scss";

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page">
      {/* HEADER */}
      <header className="profile-header">
        <Link to="/" className="logo">
          <span className="logo-icon"></span>
          <span className="logo-text">VidSync</span>
        </Link>
        <div className="header-actions">
          <button className="icon-btn">
            
            
          </button>
        </div>
      </header>

      <main className="profile-content">
        <div className="profile-card">
          {/* Saludo */}
          <div className="greeting">
            <h1>Hola, Usuario</h1>
          </div>

          <div className="user-info">
            <div className="avatar">
              
            </div>
            <div className="user-details">
              <h2>Usuario Apellido</h2>
              <p>usuario.apellido@email.com</p>
            </div>
            <button className="edit-btn">Editar Perfil</button>
          </div>

          {/* Campos del perfil */}
          <div className="profile-fields">
            <div className="field">
              <span className="label">Nombre</span>
              <span className="value">Usuario</span>
            </div>
            <div className="field">
              <span className="label">Apellido</span>
              <span className="value">Apellido</span>
            </div>
            <div className="field">
              <span className="label">Correo electrónico</span>
              <span className="value">usuario.apellido@email.com</span>
            </div>
            <div className="field">
              <span className="label">Edad</span>
              <span className="value">27</span>
            </div>
            <div className="field">
              <span className="label">Contraseña</span>
              <span className="value">••••••••••••••••</span>
            </div>
          </div>

          {/* Botón eliminar cuenta */}
          <div className="delete-section">
            <button className="delete-btn">Eliminar Cuenta</button>
            <button className="delete-confirm">Eliminar</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;