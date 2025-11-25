import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProfilePage.scss";
import { useAuth } from "../auth/AuthContext";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  return (
    <div className="profile-page">
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
              <h2>{auth.user?.firstName ?? "Usuario"} {auth.user?.lastName ?? ""}</h2>
              <p>{auth.user?.email ?? "usuario.apellido@email.com"}</p>
            </div>
            <button className="edit-btn" onClick={() => navigate('/profile/edit')}>Editar Perfil</button>
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