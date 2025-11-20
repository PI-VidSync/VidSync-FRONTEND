import React from "react";
import { Link } from "react-router-dom";
import "./ForgotPasswordPage.scss";

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-header">
          <div className="logo-icon" aria-hidden="true"></div>
          <h1 className="title">VidSync</h1>
          <h2 className="subtitle">¿Olvidaste tu contraseña?</h2>
          <p className="description">Recupera el acceso</p>
        </div>

        <form className="forgot-form">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@correo.com"
            defaultValue=""
            required
          />

          <button type="submit" className="btn-recovery">
            Enviar enlace de recuperación
          </button>
        </form>

        <div className="divider">
          <span>o</span>
        </div>

        <Link to="/login" className="back-link">
          Volver al inicio de sesión
        </Link>

        <p className="info-text">
          Te enviaremos un enlace para restablecer tu contraseña, revisa la bandeja de entrada y spam.
        </p>

        <p className="terms">
          Al continuar, aceptas las <a href="#">Condiciones de uso</a> de Canva. Consulta nuestra <a href="#">Política de privacidad</a>.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;