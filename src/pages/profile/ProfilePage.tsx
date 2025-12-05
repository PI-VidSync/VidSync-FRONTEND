import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.scss";
import { Modal } from "@/components/ui/modal";
import EditProfileForm from "@/components/forms/EditProfileForm";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/auth/useAuth";
import { useApi } from "@/hooks/useApi";
import { PencilLineIcon } from "lucide-react";

/**
 * Profile page displaying user info and actions to edit or delete the account.
 */
const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { api } = useApi();
  const toast = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await api("/auth/delete", "DELETE");
      toast.success("Cuenta eliminada correctamente");
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo eliminar la cuenta";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="profile-card">
      <div className="greeting">
        <h1>👋 Hola, {currentUser.displayName}</h1>
      </div>

      <section className="user-info">
        <div className="avatar">
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="Avatar" />
          ) : (
            <div className="avatar-placeholder">
              <span>{currentUser.displayName?.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>

        <div className="user-details">
          <h2>{currentUser.displayName}</h2>
          <p>{currentUser.email}</p>
        </div>

        <Modal
          name="edit-profile"
          title="Editar Perfil"
          triggerText="Editar Perfil"
          hideFooter
        >
          <EditProfileForm />
        </Modal>
      </section>

      <div className="profile-fields">
        <div className="field">
          <span className="label">Nombre</span>
          <span className="value">{currentUser.displayName?.split(" ")[0]}</span>
        </div>

        <div className="field">
          <span className="label">Apellido</span>
          <span className="value">{currentUser.displayName?.split(" ").slice(1).join(" ") || "—"}</span>
        </div>

        <div className="field">
          <span className="label">Correo electrónico</span>
          <span className="value">{currentUser.email}</span>
        </div>

        <div className="field">
          <span className="label">Edad</span>
          <span className="value">13</span>
        </div>

        <div className="field">
          <span className="label">Contraseña</span>
          <section className="flex">
            <button type="button" className="btn btn-icon"><PencilLineIcon size={20} /></button>
            <span className="value">••••••••••••••••</span>
          </section>
        </div>
      </div>

      <div className="divider" />

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
