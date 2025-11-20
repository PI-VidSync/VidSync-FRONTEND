import React from "react";
import { Link } from "react-router-dom";
import "./LoginPage.scss";

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">Chat</div>
          <h1>VidSync</h1>
          <p className="subtitle">Tienes cuenta en VidSync?</p>
          <strong className="title">Ingresa!</strong>
        </div>

        <div className="social-buttons">
          <button className="btn-facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.648c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.512c-1.491 0-1.956.925-1.956 1.874v2.255h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" />
            </svg>
            Ingresar con Facebook
          </button>

          <button className="btn-google">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Ingresar con Google
          </button>

          <button className="btn-microsoft">
            <svg width="20" height="20" viewBox="0 0 23 23">
              <path fill="#f25022" d="M0 0h11v11H0z" />
              <path fill="#7fba00" d="M12 0h11v11H12z" />
              <path fill="#00a4ef" d="M0 12h11v11H0z" />
              <path fill="#ffb900" d="M12 12h11v11H12z" />
            </svg>
            Ingresar con Microsoft
          </button>
        </div>

        <div className="divider">
          <span>o</span>
        </div>

        <form className="login-form">
          <div className="input-wrapper">
            <svg
              className="input-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input type="email" placeholder="Email" required />
          </div>

          <div className="input-wrapper">
            <svg
              className="input-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input type="password" placeholder="Contraseña" required />
          </div>

          <div className="form-options">
            <label>
              <input type="checkbox" /> Recordarme
            </label>
            <Link to="/forgot-password" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="btn-login-main">
            Iniciar sesión
          </button>
        </form>

        <p className="register-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>

        <p className="terms">
          Al continuar, aceptas las <a href="#">Condiciones del Servicio</a> de
          VidSync y su <a href="#">Política de Privacidad</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
