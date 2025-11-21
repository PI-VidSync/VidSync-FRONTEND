import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.scss";
import HomeHeader from "../components/HomeHeader";
import { useAuth } from "../auth/AuthContext";

const HomePage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    if (auth.isAuthenticated) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <div className="landing">

      {/* Home-only header */}
      <HomeHeader />

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Bienvenido a VidSync</h1>
            <p>
              Una plataforma moderna para videoconferencias eficientes. Conéctate, colabora y comunica tus ideas con nuestra interfaz intuitiva y potentes herramientas de comunicación.
            </p>
            <button type="button" onClick={handleStart} className="btn-start">Empezar →</button>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="cards">
        <div className="container cards-inner">
          <div className="card">
            <h3>Beneficios de VidSync</h3>
            <p>
              VidSync ofrece un entorno dinámico que se adapta a tus necesidades de comunicación e interacción. Diseñada para una experiencia fluida, moderna y efectiva para mejorar tu colaboración.
            </p>
          </div>

          <div className="card">
            <h3>Funciones Avanzadas de Video</h3>
            <p>
              VidSync utiliza tecnología de punta para ofrecerte la mejor calidad de video y audio. Podrás compartir pantalla, grabar sesiones y disfrutar de una experiencia sin interrupciones.
            </p>
          </div>
        </div>
      </section>

      {/* SITEMAP */}
      <section className="sitemap">
        <div className="container">
          <h2>Mapa del Sitio</h2>

          <div className="sitemap-grid">
            <div className="col">
              <h4>Acceso</h4>
              <ul>
                <li>Iniciar Sesión</li>
                <li>Registrarse</li>
                <li>Recuperar Contraseña</li>
              </ul>
            </div>

            <div className="col">
              <h4>Gestión de Videollamada</h4>
              <ul>
                <li>Dashboard/Lista de Videollamadas</li>
                <li>Crear Videollamada</li>
                <li>Unirse a una Videollamada</li>
              </ul>
            </div>

            <div className="col">
              <h4>Perfil de Usuario</h4>
              <ul>
                <li>Ver Perfil</li>
                <li>Editar Perfil</li>
                <li>Eliminar Perfil</li>
              </ul>
            </div>

            <div className="col">
              <h4>Información</h4>
              <ul>
                <li>Inicio</li>
                <li>Beneficios</li>
                <li>Acerca de VidSync</li>
                <li>Contacto</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 VidSync. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
};

export default HomePage;
