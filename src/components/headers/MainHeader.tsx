import React from "react";
import { Link } from "react-router-dom";
import "./MainHeader.scss";
import { useAuth } from "../../auth/AuthContext";
import { User2, LogOut } from "lucide-react";
import { useToast } from "../../hooks/useToast";

const MainHeader: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const toast = useToast();

  const handleLogout = async () => {
    await logout();
    toast.success("Sesión cerrada exitosamente");
  };

  return (
    <header className="main-header">
      <Link to="/">
        <img className="logo-img" src="/logo.png" alt="VidSync" />
      </Link>

      <div className="main-header-buttons">
        <Link to="/profile" className="btn btn-primary">
          <User2 size={24} /><span className="btn-text">{currentUser?.displayName}</span>
        </Link>
        <Link onClick={handleLogout} to="/login" className="btn btn-white">
          <LogOut size={24} /><span className="btn-text">Cerrar sesión</span>
        </Link>
      </div>
    </header>
  );
};

export default MainHeader;
