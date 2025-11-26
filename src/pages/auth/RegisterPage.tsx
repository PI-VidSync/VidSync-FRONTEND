import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import "./RegisterPage.scss";
import { Eye, EyeOff, Lock, Mail, User, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/input";

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "El nombre es requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z
      .string()
      .min(1, "El apellido es requerido")
      .min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z
      .string()
      .min(1, "El email es requerido")
      .email("Ingresa un email válido"),
    age: z
      .number()
      .min(13, "Debes tener al menos 13 años")
      .max(120, "Ingresa una edad válida"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Za-z]/, "Debe contener letras")
      .regex(/[0-9]/, "Debe contener números")
      .regex(/[^A-Za-z0-9]/, "Debe contener símbolos"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 13,
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const checks = useMemo(() => {
    return {
      length: password.length >= 8,
      letters: /[A-Za-z]/.test(password),
      numbers: /[0-9]/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password),
      match: password !== "" && password === confirmPassword,
    };
  }, [password, confirmPassword]);

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const validatedData = registerSchema.parse(data);
      console.log("Datos validados:", validatedData);

      toast.success("¡Registro exitoso!");
      // navigate("/dashboard");

    } catch (error) {
      console.error(typeof error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al registrarse. Intenta de nuevo");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-view">
      <div className="card register-card">
        <div className="register-header">
          <img src="/logo.png" alt="VidSync" className="auth-logo" />
          <p className="subtitle">
            Crea tu cuenta en VidSync y comienza ahora
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            label="Nombre"
            type="text"
            register={register("firstName")}
            error={errors.firstName}
            icon={<User size={20} />}
          />
          <FormField
            label="Apellido"
            type="text"
            register={register("lastName")}
            error={errors.lastName}
            icon={<User size={20} />}
          />

          <FormField
            label="Email"
            type="email"
            register={register("email")}
            error={errors.email}
            icon={<Mail size={20} />}
          />
          <FormField
            label="Edad"
            type="number"
            register={register("age", { valueAsNumber: true })}
            error={errors.age}
            icon={<Calendar size={20} />}
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

          <FormField
            label="Confirmar contraseña"
            type={showConfirmPassword ? "text" : "password"}
            register={register("confirmPassword")}
            error={errors.confirmPassword}
            icon={<Lock size={20} />}
            endIcon={
              {
                icon: <Eye size={20} />,
                inactiveIcon: <EyeOff size={20} />,
                onClick: () => setShowConfirmPassword(!showConfirmPassword),
                isActive: showConfirmPassword,
              }
            }
          />

          <div className="password-strength">
            <ul className="criteria-list">
              <li className={`criteria-item ${checks.length ? "valid" : "invalid"}`}>
                Al menos 8 caracteres
              </li>
              <li className={`criteria-item ${checks.letters ? "valid" : "invalid"}`}>
                Contiene letras
              </li>
              <li className={`criteria-item ${checks.numbers ? "valid" : "invalid"}`}>
                Contiene números
              </li>
              <li className={`criteria-item ${checks.symbols ? "valid" : "invalid"}`}>
                Contiene símbolos
              </li>
              <li className={`criteria-item ${checks.match ? "valid" : "invalid"}`}>
                Las contraseñas coinciden
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-flex"
            disabled={loading || isSubmitting}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="login-register">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>

        <p className="terms">
          Al continuar, aceptas las <a href="#">Condiciones del Servicio</a> de VidSync y su{" "}
          <a href="#">Política de Privacidad</a>.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;