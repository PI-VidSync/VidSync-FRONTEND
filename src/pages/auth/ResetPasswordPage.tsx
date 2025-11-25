import React, { useState, useMemo } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import "./ResetPasswordPage.scss";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/input";

const resetPasswordSchema = z
  .object({
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
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

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    try {
      const validatedData = resetPasswordSchema.parse(data);
      console.log("Datos validados:", validatedData);

      toast.success("¡Contraseña actualizada exitosamente!");
      // navigate("/login");

    } catch (error) {
      console.error(typeof error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al cambiar la contraseña. Intenta de nuevo");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-view">
      <div className="card reset-card">
        <div className="reset-header">
          <img src="/logo.png" alt="VidSync" className="auth-logo" />
          <p className="subtitle">Cambiar contraseña</p>
        </div>

        <form className="reset-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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

          <FormField
            label="Confirmar contraseña"
            type={showConfirmPassword ? "text" : "password"}
            register={register("confirmPassword")}
            error={errors.confirmPassword}
            icon={<Lock size={20} />}
            endIcon={
              {
                activeIcon: <Eye size={20} />,
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
            {loading ? "Cambiando contraseña..." : "Cambiar contraseña"}
          </button>
        </form>

        <p className="terms">
           Al continuar, aceptas las <a href="#">Condiciones del Servicio</a> de VidSync y su{" "}
          <a href="#">Política de Privacidad</a>.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;