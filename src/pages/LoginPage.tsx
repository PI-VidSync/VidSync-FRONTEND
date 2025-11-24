import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.scss";
import { useAuth } from "../auth/AuthContext";
import { loginWithGoogle, loginWithFacebook } from "../service/firebase/login";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  async function handleGoogle() {
    try {
      const user = await loginWithGoogle();

      console.log("User:", user);

      const token = await user.getIdToken();

      console.log("Token:", token);

      const res = await fetch("http://localhost:3001/api/auth/verify-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Backend response:", data);

    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleFacebook() {
    try {
      const user = await loginWithFacebook();

      console.log("User:", user);

      const token = await user.getIdToken();

      console.log("Token:", token);

      const res = await fetch("http://localhost:3001/api/auth/verify-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Backend response:", data);

    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="full-view">
      <div className="card login-card">
        <div className="login-header">
          <img src="/logo.png" alt="VidSync" className="auth-logo" />
          <p className="subtitle">Tienes cuenta en VidSync?<br />Ingresa</p>
        </div>

        <div className="social-buttons">
          <button className="btn-github" onClick={handleFacebook}>
            <img src="/github-logo.svg" alt="GitHub" width="30" height="30" />
            Ingresar con GitHub
          </button>
          <button className="btn-google" onClick={handleGoogle}>
            <img src="/google-logo.svg" alt="Google" width="30" height="30" />
            Ingresar con Google
          </button>
        </div>

        <div className="divider" />

        <form className="login-form">
          <div className="input-group">
            <span className="input-group-text">
              <Mail size={20}/>
            </span>
            <div className="form-floating">
              <input className="form-control" type="email" placeholder="Email" required />
              <label htmlFor="email">Email</label>
            </div>
          </div>

          <div className="input-group">
            <span className="input-group-text">
              <Lock size={20}/>
            </span>
            <div className="form-floating">
              <input className="form-control" type={showPassword ? "text" : "password"} placeholder="Contraseña" required />
              <label htmlFor="password">Contraseña</label>
            </div>
            <button className="btn btn-input"  type="button" onClick={() => setShowPassword(!showPassword)} aria-hidden={false} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
              {showPassword ? (
                <Eye />
              ) : (
                <EyeOff />
              )}
            </button>
          </div>

          <div className="form-options">
            <label>
              <input type="checkbox" /> Recordarme
            </label>
            <Link to="/forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary btn-flex">
            Iniciar sesión
          </button>
        </form>

        <p className="login-register">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
