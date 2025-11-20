import React from "react";
import { Link } from "react-router-dom";
import "./RegisterPage.scss";

const RegisterPage: React.FC = () => {
  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-icon">Chat</div>
          <h1 className="title">VidSync</h1>
          <h2 className="subtitle">Crea tu cuenta</h2>
        </div>

        <form className="register-form">
          <div className="form-row">
            <input type="text" placeholder="Nombre(s)" required />
            <input type="text" placeholder="Apellido(s)" required />
          </div>

          <div className="form-row">
            <input type="email" placeholder="Correo electrónico" required />
            <input type="number" placeholder="Edad" required />
          </div>

          <input type="password" placeholder="Contraseña" required />
          <input type="password" placeholder="Confirmar contraseña" required />

          <div className="password-strength">
            <span className="strength-text">
              La contraseña debe tener al menos 8 caracteres, incluir letras, números y símbolos
            </span>
          </div>

          <button type="submit" className="btn-register-main">
            Crear cuenta
          </button>
        </form>

        <p className="login-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>

        <p className="terms">
          Al continuar, aceptas las <a href="#">Condiciones del Servicio</a> de VidSync y su <a href="#">Política de Privacidad</a>.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;