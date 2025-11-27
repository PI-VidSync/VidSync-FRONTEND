import React, { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import "./ProfilePage.scss";
import { Modal } from "@/components/ui/modal";
import EditProfileForm from "@/components/forms/EditProfileForm";
import {
  getAuth,
  updateProfile,
  updateEmail,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(currentUser);
  const [age, setAge] = useState("13");
  const [modalKey, setModalKey] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  if (!user) return null;

  const fullName = user.displayName || "Usuario";
  const parts = fullName.trim().split(" ");
  const half = Math.ceil(parts.length / 2);
  const firstName = parts.slice(0, half).join(" ");
  const lastName = parts.slice(half).join(" ");

  const cleanModalArtifacts = () => {
    document.body.style.overflow = "";
    document.body.classList.remove("modal-open");

    const backdrops = document.querySelectorAll(
      ".modal-backdrop, .modal-overlay, [data-backdrop]"
    );

    backdrops.forEach((el) => el.remove());
  };

  const handleProfileUpdate = async (data: any) => {
    const auth = getAuth();
    const current = auth.currentUser;
    if (!current) return;

    const newName = `${data.firstName} ${data.lastName}`.trim();

    try {
      if (newName !== current.displayName) {
        await updateProfile(current, { displayName: newName });
      }

      if (data.email && data.email !== current.email) {
        await updateEmail(current, data.email);
      }

      setUser({
        ...current,
        displayName: newName,
        email: data.email,
      } as any);

      setAge(data.age);

      setModalKey(Date.now());

      setTimeout(() => {
        cleanModalArtifacts();
      }, 50);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
    }
  };

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const current = auth.currentUser;
    if (!current) return;

    try {
      await deleteUser(current);
      console.log("Cuenta eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
    }
  };

  return (
    <div className="profile-card">
      <div className="greeting">
        <h1>👋 Hola, {currentUser?.displayName?.split(' ')[0]}</h1>
      </div>

      <section className="user-info">
        <div className="avatar">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Avatar" />
          ) : (
            <div className="avatar-placeholder">
              <span>{firstName[0] || "U"}</span>
            </div>
          )}
        </div>

        <div className="user-details">
          <h2>
            {firstName} {lastName}
          </h2>
          <p>{user.email}</p>
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
              name: firstName,
              lastName: lastName,
              email: user.email || "",
              age: age,
            }}
            onSuccess={handleProfileUpdate}
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
          <span className="value">{lastName}</span>
        </div>

        <div className="field">
          <span className="label">Correo electrónico</span>
          <span className="value">{user.email}</span>
        </div>

        <div className="field">
          <span className="label">Edad</span>
          <span className="value">{age}</span>
        </div>

        <div className="field">
          <span className="label">Contraseña</span>
          <span className="value">••••••••</span>
        </div>
      </div>

      <div className="divider" />

      <div className="delete-section">
        <Modal
          name="delete-account"
          title="Eliminar Cuenta"
          triggerText="Eliminar Cuenta"
          confirmText="Eliminar"
          danger
          onFinish={handleDeleteAccount}
        >
          <p>
            ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se
            puede deshacer.
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;
