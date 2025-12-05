import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthService } from "@/service/api/auth.service";
import { useToast } from "@/hooks/useToast";

const editPasswordSchema = z.object({
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  newPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Za-z]/, "Debe contener letras")
    .regex(/[0-9]/, "Debe contener números")
    .regex(/[^A-Za-z0-9]/, "Debe contener símbolos"),
  confirmPassword: z.string(),
})
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine((data) => data.password !== data.newPassword, {
    message: "La contraseña actual no puede ser la misma que la nueva",
    path: ["newPassword"],
  });

type EditPasswordFormData = z.infer<typeof editPasswordSchema>;

const EditPasswordForm: React.FC = () => {
  const { updatePassword } = useAuthService();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<EditPasswordFormData>({
    resolver: zodResolver(editPasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const password = watch("newPassword");
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

  const onSubmit = async (data: EditPasswordFormData) => {
    setLoading(true);
    try {
      await updatePassword(data.password, data.newPassword);
      toast.success("Contraseña actualizada exitosamente");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField
        label="Contraseña actual"
        type={showPassword ? "text" : "password"}
        register={register("password")}
        error={errors.password}
        endIcon={{
          icon: <Eye size={20} />,
          inactiveIcon: <EyeOff size={20} />,
          onClick: () => setShowPassword(!showPassword),
          isActive: showPassword,
        }}
      />
      <FormField
        label="Nueva contraseña"
        type={showNewPassword ? "text" : "password"}
        register={register("newPassword")}
        error={errors.newPassword}
        endIcon={{
          icon: <Eye size={20} />,
          inactiveIcon: <EyeOff size={20} />,
          onClick: () => setShowNewPassword(!showNewPassword),
          isActive: showNewPassword,
        }}
      />
      <FormField
        label="Confirmar nueva contraseña"
        type={showConfirmPassword ? "text" : "password"}
        register={register("confirmPassword")}
        error={errors.confirmPassword}
        endIcon={{
          icon: <Eye size={20} />,
          inactiveIcon: <EyeOff size={20} />,
          onClick: () => setShowConfirmPassword(!showPassword),
          isActive: showConfirmPassword,
        }}
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

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
};

export { EditPasswordForm }