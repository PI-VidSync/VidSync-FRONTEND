import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import "./ProfilePage.scss";
import { Modal } from "@/components/ui/modal";
import EditProfileForm from "@/components/forms/EditProfileForm";
import { useToast } from "@/hooks/useToast";

const ProfilePage: React.FC = () => {
  const { currentUser, deleteAccount } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteAccount();
      toast.success("Cuenta eliminada correctamente");
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo eliminar la cuenta";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

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
          confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
          danger
          onFinish={handleDeleteAccount}
        >
          <p>¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.</p>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;