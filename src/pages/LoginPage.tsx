import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useToast } from "../hooks/useToast";
import "./LoginPage.scss";
import { loginWithGoogle, loginWithGithub } from "../service/firebase/login";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { verifyToken } from "../service/api/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "../components/ui/input";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Ingresa un email válido"),
  password: z.string(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const validatedData = loginSchema.parse(data);
      console.log("Datos validados:", validatedData);

      toast.success("¡Inicio de sesión exitoso!");
      // navigate("/dashboard");

    } catch (error) {
      console.error(typeof error)
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al iniciar sesión. Intenta de nuevo");
      }
    } finally {
      setLoading(false);
    }
  };

  async function handleGoogle() {
    try {
      const user = await loginWithGoogle();
      const token = await user.getIdToken();
      const data = await verifyToken(token);
      console.log("Backend response:", data);
      toast.success("¡Inicio de sesión con Google exitoso!");
      // navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al iniciar sesión con Google");
    }
  }

  async function handleGithub() {
    try {
      const user = await loginWithGithub();
      const token = await user.getIdToken();
      console.log("Token:", token);
      const data = await verifyToken(token);
      console.log("Backend response:", data);
      toast.success("¡Inicio de sesión con GitHub exitoso!");
      // navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al iniciar sesión con GitHub");
    }
  }

  return (
    <div className="full-view">
      <div className="card login-card">
        <div className="login-header">
          <img src="/logo.png" alt="VidSync" className="auth-logo" />
          <p className="subtitle">
            Tienes cuenta en VidSync?
            <br />
            Ingresa
          </p>
        </div>

        <div className="social-buttons">
          <button className="btn-github" onClick={handleGithub}>
            <img src="/github-logo.svg" alt="GitHub" width="30" height="30" />
            Ingresar con GitHub
          </button>
          <button className="btn-google" onClick={handleGoogle}>
            <img src="/google-logo.svg" alt="Google" width="30" height="30" />
            Ingresar con Google
          </button>
        </div>

        <div className="divider" />

        <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            label="Email"
            type="email"
            register={register("email")}
            error={errors.email}
            icon={<Mail size={20} />}
          />

          <FormField
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            register={register("password")}
            error={errors.password}
            icon={<Lock size={20} />}
            endIcon={
              {
                activeIcon: <Eye size={20} />,
                inactiveIcon: <EyeOff size={20} />,
                onClick: () => setShowPassword(!showPassword),
                isActive: showPassword,
              }
            }
          />

          <div className="form-options">
            <label>
              <input
                type="checkbox"
                name="rememberMe"
              />{" "}
              Recordarme
            </label>
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-flex"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
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
