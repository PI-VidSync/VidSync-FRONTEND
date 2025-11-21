import React from "react";
import { Link } from "react-router-dom";
import "./HomeHeader.scss";

const HomeHeader: React.FC = () => {
  return (
    <header className="home-header">
      <div className="home-header-inner">
        <div className="home-logo">
          <Link to="/">
            <img src="/logo.png" alt="VidSync" className="home-logo-img" onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />
          </Link>
        </div>

        <div className="home-header-center">
          <Link to="/login" className="btn btn-login">Iniciar sesión</Link>
          <Link to="/register" className="btn btn-register">Regístrate</Link>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
