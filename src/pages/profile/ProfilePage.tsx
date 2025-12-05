import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, updateEmail, updateProfile } from "firebase/auth";
import "./ProfilePage.scss";
import { Modal } from "@/components/ui/modal";
import EditProfileForm from "@/components/forms/EditProfileForm";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/auth/useAuth";

type EditProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
};

const DEFAULT_AGE = "13";

/**
 * Profile page displaying user info and actions to edit or delete the account.
 */
const ProfilePage: React.FC = () => {
  const { currentUser, deleteAccount } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState(currentUser);
  const [age, setAge] = useState(DEFAULT_AGE);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  const { firstName, lastName, email } = useMemo(() => {
    if (!user) {
      return { firstName: "Usuario", lastName: "", email: "—" };
    }

    const displayName = user.displayName?.trim() ?? "";
    const parts = displayName.split(" ").filter(Boolean);
    const first = parts.shift() ?? "Usuario";
    const last = parts.join(" ");

    return {
      firstName: first,
      lastName: last,
      email: user.email ?? "—",
    };
  }, [user]);

  const avatarInitial = firstName.charAt(0).toUpperCase() || "U";

  const cleanModalArtifacts = () => {
    document.body.style.overflow = "";
    document.body.classList.remove("modal-open");
    document.querySelectorAll(".modal-backdrop, .modal-overlay, [data-backdrop]").forEach((element) => {
      element.remove();
    });
  };

  const handleProfileUpdate = async (data: EditProfileData) => {
    const auth = getAuth();
    const activeUser = auth.currentUser;

    if (!activeUser) {
      throw new Error("No hay usuario autenticado");
    }

    const sanitizedName = `${data.firstName} ${data.lastName}`.replace(/\s+/g, " ").trim();
    const hasNameChange = sanitizedName !== (activeUser.displayName ?? "");
    const hasEmailChange = data.email !== (activeUser.email ?? "");

    try {
      if (hasNameChange) {
        await updateProfile(activeUser, { displayName: sanitizedName });
      }

      if (hasEmailChange) {
        await updateEmail(activeUser, data.email);
      }

      await activeUser.reload();
      setUser(auth.currentUser);
      setAge(String(data.age || DEFAULT_AGE));
      setModalKey(Date.now());
      window.setTimeout(cleanModalArtifacts, 75);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar el perfil";
      throw new Error(message);
    }
  };

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

  if (!user) {
    return null;
  }

  return (
    <div className="profile-card">
      <div className="greeting">
        <h1>👋 Hola, {firstName}</h1>
      </div>

      <section className="user-info">
        <div className="avatar">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Avatar" />
          ) : (
            <div className="avatar-placeholder">
              <span>{avatarInitial}</span>
            </div>
          )}
        </div>

        <div className="user-details">
          <h2>{lastName ? `${firstName} ${lastName}` : firstName}</h2>
          <p>{email}</p>
        </div>

        <Modal
          key={modalKey}
          name="edit-profile"
          title="Editar Perfil"
          triggerText="Editar Perfil"
          hideFooter
        >
          <EditProfileForm
            initialData={{
              firstName,
              lastName,
              email: email === "—" ? "" : email,
              age: +age,
            }}
            onSubmit={handleProfileUpdate}
          />
        </Modal>
      </section>

      <div className="profile-fields">
        <div className="field">
          <span className="label">Nombre</span>
          <span className="value">{firstName}</span>
        </div>

        <div className="field">
          <span className="label">Apellido</span>
          <span className="value">{lastName || "—"}</span>
        </div>

        <div className="field">
          <span className="label">Correo electrónico</span>
          <span className="value">{email}</span>
        </div>

        <div className="field">
          <span className="label">Edad</span>
          <span className="value">{age}</span>
        </div>

        <div className="field">
          <span className="label">Contraseña</span>
          <span className="value">••••••••••••••••</span>
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
