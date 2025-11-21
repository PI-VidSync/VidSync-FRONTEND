import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./RegisterPage.scss";

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<string | number>("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const checks = useMemo(() => {
    return {
      length: password.length >= 8,
      letters: /[A-Za-z]/.test(password),
      numbers: /[0-9]/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password),
      match: password !== "" && password === confirm,
    };
  }, [password, confirm]);

  const allValid = checks.length && checks.letters && checks.numbers && checks.symbols && checks.match;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
    // Aquí puedes añadir la lógica real de registro (API)
    alert("Cuenta creada correctamente (simulado)");
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-icon" aria-hidden="true"></div>
          <h1 className="title">VidSync</h1>
          <h2 className="subtitle">Crea tu cuenta</h2>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="Nombre(s)" required />
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Apellido(s)" required />
          </div>

          <div className="form-row">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Correo electrónico" required />
            <input value={age} onChange={(e) => setAge(e.target.value)} type="number" placeholder="Edad" required />
          </div>

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Contraseña"
            required
          />

          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            placeholder="Confirmar contraseña"
            required
          />

          <div className="password-strength">
            <ul className="criteria-list">
              <li className={`criteria-item ${checks.length ? "valid" : "invalid"}`}>Al menos 8 caracteres</li>
              <li className={`criteria-item ${checks.letters ? "valid" : "invalid"}`}>Contiene letras</li>
              <li className={`criteria-item ${checks.numbers ? "valid" : "invalid"}`}>Contiene números</li>
              <li className={`criteria-item ${checks.symbols ? "valid" : "invalid"}`}>Contiene símbolos</li>
              <li className={`criteria-item ${checks.match ? "valid" : "invalid"}`}>Las contraseñas coinciden</li>
            </ul>
          </div>

          <button type="submit" className="btn-register-main" disabled={!allValid}>
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