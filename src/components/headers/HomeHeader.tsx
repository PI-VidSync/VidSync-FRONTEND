import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomeHeader.scss";
import { Menu } from "lucide-react";

const HomeHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="home-header">
      <Link to="/">
        <img className="logo-img" src="/logo.png" alt="VidSync" />
      </Link>

      <section className="login-buttons">
        <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
        <Link to="/register" className="btn btn-white">Regístrate</Link>
      </section>
      <div className="dropdown">
        <button className="btn btn-icon color-primary" type="button" data-bs-toggle="dropdown" aria-expanded="false"><Menu /></button>
        <ul className="dropdown-menu dropdown">
          <li><a className="dropdown-item" onClick={() => navigate('/login')}>Iniciar Sesión</a></li>
          <li><a className="dropdown-item" onClick={() => navigate('/register')}>Registrarse</a></li>
        </ul>
      </div>
    </header>
  );
};

export default HomeHeader;
