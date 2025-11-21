import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Header.scss";

const Header: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  const displayName = auth.user
    ? ((auth.user.firstName || auth.user.lastName)
        ? `${auth.user.firstName ?? ""} ${auth.user.lastName ?? ""}`.trim()
        : auth.user.email)
    : null;

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">
          <img
            src="/logo.png"
            alt="VidSync"
            className="logo-img"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(false)}
          />
        </Link>
        {!imgLoaded && <span className="logo-text">VidSync</span>}
      </div>

      <nav className="main-nav">
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <div className="header-right">
        {auth.isAuthenticated ? (
          <>
            <div className="user-email">{displayName}</div>
            <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
            <Link to="/profile" className="profile-button" aria-label="Perfil">
              <div className="profile-avatar" />
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">Iniciar sesión</Link>
            <Link to="/register" className="btn btn-primary">Regístrate</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
