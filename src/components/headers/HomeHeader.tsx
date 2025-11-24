import React from "react";
import { Link } from "react-router-dom";
import "./HomeHeader.scss";

const HomeHeader: React.FC = () => {
  return (
    <header className="home-header">
      <Link to="/">
        <img className="logo-img" src="/logo.png" alt="VidSync" />
      </Link>

      <div className="home-header-buttons">
        <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
        <Link to="/register" className="btn btn-white">Regístrate</Link>
      </div>
    </header>
  );
};

export default HomeHeader;
