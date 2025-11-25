// import React, { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";
// import "./auth/RegisterPage.scss";

// const EditProfilePage: React.FC = () => {
//   const auth = useAuth();
//   const navigate = useNavigate();

//   const [firstName, setFirstName] = useState(auth.user?.firstName ?? "");
//   const [lastName, setLastName] = useState(auth.user?.lastName ?? "");
//   const [email, setEmail] = useState(auth.user?.email ?? "");
//   const [age, setAge] = useState<string | number>(auth.user?.age ?? "");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const checks = useMemo(() => {
//     return {
//       length: password.length >= 8,
//       letters: /[A-Za-z]/.test(password),
//       numbers: /[0-9]/.test(password),
//       symbols: /[^A-Za-z0-9]/.test(password),
//       match: password !== "" && password === confirm,
//     };
//   }, [password, confirm]);

//   const allValid = checks.length && checks.letters && checks.numbers && checks.symbols && checks.match;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // If user filled password fields, validate they pass checks
//     if ((password || confirm) && !allValid) return;
//     // Update local auth profile (in a real app call backend API)
//     auth.updateProfile({ email, firstName, lastName, age });
//     // Note: we don't persist password in this simulated example
//     navigate("/profile");
//   };

//   return (
//     <div className="register-page">
//       <div className="register-card edit-profile-card">
//         <div className="register-header">
//           <img src="/logo.png" alt="VidSync" className="edit-page-logo" />
//           <h1 className="title">Editar perfil</h1>
//         </div>

//         <form className="register-form" onSubmit={handleSubmit}>
//           <div className="form-row">
//             <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="Nombre(s)" required />
//             <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Apellido(s)" required />
//           </div>

//           <div className="form-row">
//             <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Correo electrónico" required />
//             <input value={age} onChange={(e) => setAge(e.target.value)} type="number" placeholder="Edad" />
//           </div>

//           <div className="input-wrapper">
//             <input
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               type={showPassword ? "text" : "password"}
//               placeholder="Contraseña (si deseas cambiarla)"
//             />
//             <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
//               {showPassword ? (
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
//                   <circle cx="12" cy="12" r="3"></circle>
//                 </svg>
//               ) : (
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
//                   <line x1="1" y1="1" x2="23" y2="23"></line>
//                 </svg>
//               )}
//             </span>
//           </div>

//           <div className="input-wrapper">
//             <input
//               value={confirm}
//               onChange={(e) => setConfirm(e.target.value)}
//               type={showConfirm ? "text" : "password"}
//               placeholder="Confirmar contraseña"
//             />
//             <span className="eye-icon" onClick={() => setShowConfirm(!showConfirm)}>
//               {showConfirm ? (
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
//                   <circle cx="12" cy="12" r="3"></circle>
//                 </svg>
//               ) : (
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
//                   <line x1="1" y1="1" x2="23" y2="23"></line>
//                 </svg>
//               )}
//             </span>
//           </div>

//           <div className="password-strength">
//             <ul className="criteria-list">
//               <li className={`criteria-item ${checks.length ? "valid" : "invalid"}`}>Al menos 8 caracteres</li>
//               <li className={`criteria-item ${checks.letters ? "valid" : "invalid"}`}>Contiene letras</li>
//               <li className={`criteria-item ${checks.numbers ? "valid" : "invalid"}`}>Contiene números</li>
//               <li className={`criteria-item ${checks.symbols ? "valid" : "invalid"}`}>Contiene símbolos</li>
//               <li className={`criteria-item ${checks.match ? "valid" : "invalid"}`}>Las contraseñas coinciden</li>
//             </ul>
//           </div>

//           <button type="submit" className="btn-register-main" disabled={(password || confirm) ? !allValid : false}>
//             Guardar cambios
//           </button>

//           <p className="login-link">
//             <a onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
//               Cancelar
//             </a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfilePage;
