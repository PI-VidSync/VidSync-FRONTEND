import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import "./ForgotPasswordPage.scss";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/input";
import { resetPassword } from "@/service/firebase/reset-password";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Ingresa un email válido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const validatedData = forgotPasswordSchema.parse(data);
      await resetPassword(validatedData.email);

      toast.success("¡Enlace de recuperación enviado! Revisa tu correo.");
      navigate("/login");

    } catch (error) {
      console.error(typeof error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al enviar el enlace. Intenta de nuevo");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-view">
      <div className="card forgot-card">
        <div className="forgot-header">
          <img src="/logo.png" alt="VidSync" className="auth-logo" />
          <p className="subtitle">
            ¿Olvidaste tu contraseña? <br /> 
            Recupera el acceso a tu cuenta
          </p>
        </div>

        <form className="forgot-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            label="Correo electrónico"
            type="email"
            register={register("email")}
            error={errors.email}
            icon={<Mail size={20} />}
          />

          <button
            type="submit"
            className="btn btn-primary btn-flex"
            disabled={loading || isSubmitting}
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>

        <p className="info-text">
          Te enviaremos un enlace para restablecer tu contraseña. <br />
          Revisa la bandeja de entrada y spam.
        </p>

        <Link to="/login">
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;