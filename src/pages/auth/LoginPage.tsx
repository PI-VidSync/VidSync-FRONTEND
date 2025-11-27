import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import "./LoginPage.scss";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/input";
import { useAuth } from "@/auth/AuthContext";

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

  const { login, loginWithGoogle, loginWithGithub } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      const { email, password } = loginSchema.parse(data);
      await login(email, password);

      toast.success("¡Inicio de sesión exitoso!");
      navigate("/dashboard");

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
      await loginWithGoogle();
      toast.success("¡Inicio de sesión con Google exitoso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al iniciar sesión con Google");
    }
  }

  async function handleGithub() {
    try {
      await loginWithGithub();
      toast.success("¡Inicio de sesión con GitHub exitoso!");
      navigate("/dashboard");
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
                icon: <Eye size={20} />,
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
