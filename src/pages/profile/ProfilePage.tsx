import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import "./ProfilePage.scss";
import { Modal } from "@/components/ui/modal";
import EditProfileForm from "@/components/forms/EditProfileForm";

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
                <span>{currentUser?.displayName ? currentUser?.displayName[0] : 'U'}</span>
              </div>
            )}
          </div>
          <div className="user-details">
            <h2>{currentUser?.displayName}</h2>
            <p>{currentUser?.email}</p>
          </div>
        </section>
        <Modal 
          name="edit-profile" 
          title="Editar Perfil" 
          triggerText="Editar Perfil"
          confirmText="Guardar"
          hideFooter
        >
          <EditProfileForm />
        </Modal>
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
        <Modal 
          name="delete-account" 
          title="Eliminar Cuenta" 
          triggerText="Eliminar Cuenta"
          confirmText="Eliminar"
          danger
          onFinish={() => console.log('Eliminar cuenta')}
        >
          <p>¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.</p>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;