import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import "./ProfilePage.scss";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="profile-card">
      {/* Saludo */}
      <div className="greeting">
        <h1>👋 Hola, {currentUser?.displayName?.split(' ')[0]}</h1>
      </div>

      <div className="user-info">
        <section className="user-info">
          <div className="avatar">
            {currentUser?.photoURL ? (
              <img src={currentUser?.photoURL || ""} alt="avatar" />
            ) : (
              <div className="avatar-placeholder">
                <span>{currentUser?.displayName?.split(' ')[0][0]}</span>
              </div>
            )}
          </div>
          <div className="user-details">
            <h2>{currentUser?.displayName}</h2>
            <p>{currentUser?.email}</p>
          </div>
        </section>
        <button className="btn btn-primary" onClick={() => navigate('/profile/edit')}>Editar Perfil</button>
      </div>

      {/* Campos del perfil */}
      <div className="profile-fields">
        <div className="field">
          <span className="label">Nombre</span>
          <span className="value">{currentUser?.displayName}</span>
        </div>
        <div className="field">
          <span className="label">Apellido</span>
          <span className="value">{currentUser?.displayName}</span>
        </div>
        <div className="field">
          <span className="label">Correo electrónico</span>
          <span className="value">{currentUser?.email}</span>
        </div>
        <div className="field">
          <span className="label">Edad</span>
          <span className="value">13</span>
        </div>
        <div className="field">
          <span className="label">Contraseña</span>
          <span className="value">••••••••••••••••</span>
        </div>
      </div>

      <div className="divider" />

      {/* Botón eliminar cuenta */}
      <div className="delete-section">
        <button className="btn btn-danger">Eliminar Cuenta</button>
      </div>
    </div>
  );
};

export default ProfilePage;