import { useNavigate } from "react-router-dom";
import HomeHeader from "../../components/headers/HomeHeader";
import { useAuth } from "../../auth/AuthContext";
import "./HomePage.scss";

const HomePage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    if (auth.isAuthenticated) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <div>

      {/* Home-only header */}
      <HomeHeader />

      <div className="container">
        {/* Hero */}
        <section className="hero-content">
          <img className="logo-img" src="/logo.png" alt="VidSync" />
          <h1 className="title title-white">Bienvenido a VidSync</h1>
          <p>
            Una plataforma moderna para videoconferencias eficientes. Conéctate, colabora y comunica tus ideas con nuestra interfaz intuitiva y potentes herramientas de comunicación.
          </p>
          <button onClick={handleStart} className="btn btn-white">Empezar →</button>
        </section>

        {/* Cards */}
        <section className="cards-section">
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
        </section>
      </div>

      <div className="container-fluid footer">
        {/* Sitemap */}
        <section className="sitemap">
          <h2>Mapa del Sitio</h2>

          <div className="sitemap-grid">
            <div>
              <h4>Acceso</h4>
              <ul className="list-group">
                <li className="list-group-item">Iniciar Sesión</li>
                <li className="list-group-item">Registrarse</li>
                <li className="list-group-item">Recuperar Contraseña</li>
              </ul>
            </div>

            <div>
              <h4>Gestión de Videollamada</h4>
              <ul className="list-group">
                <li className="list-group-item">Dashboard/Lista de Videollamadas</li>
                <li className="list-group-item">Crear Videollamada</li>
                <li className="list-group-item">Unirse a una Videollamada</li>
              </ul>
            </div>

            <div className="col">
              <h4>Perfil de Usuario</h4>
              <ul className="list-group">
                <li className="list-group-item">Ver Perfil</li>
                <li className="list-group-item">Editar Perfil</li>
                <li className="list-group-item">Eliminar Perfil</li>
              </ul>
            </div>

            <div className="col">
              <h4>Información</h4>
              <ul className="list-group">
                <li className="list-group-item">Inicio</li>
                <li className="list-group-item">Beneficios</li>
                <li className="list-group-item">Acerca de VidSync</li>
                <li className="list-group-item">Contacto</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <p>© 2025 VidSync. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
