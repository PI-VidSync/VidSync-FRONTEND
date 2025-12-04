import React, { useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import { Mail, User, Calendar, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/input";
import "./EditProfileForm.scss";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useAuth } from "@/auth/useAuth";
import { Modal as BsModal } from "bootstrap";

/**
 * Base profile schema for editable fields.
 * Includes first/last name, email and age validation.
 */
const baseProfileSchema = z.object({
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
});

/**
 * Extended profile edit schema including optional password change fields.
 * Validates conditional requirements when a password change is requested.
 */
const editProfileSchema = baseProfileSchema
  .extend({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres").optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const wantsPasswordChange = !!(data.newPassword || data.confirmPassword);
    if (wantsPasswordChange) {
      if (!data.currentPassword || data.currentPassword.length === 0) {
        ctx.addIssue({
          path: ["currentPassword"],
          code: z.ZodIssueCode.custom,
          message: "Debes ingresar tu contraseña actual",
        });
      }
      if (!data.newPassword || data.newPassword.length < 6) {
        ctx.addIssue({
          path: ["newPassword"],
          code: z.ZodIssueCode.custom,
          message: "Ingresa una nueva contraseña válida",
        });
      }
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          code: z.ZodIssueCode.custom,
          message: "Las contraseñas no coinciden",
        });
      }
    }
  });

/**
 * Form data inferred from the edit profile schema.
 */
type EditProfileFormData = z.infer<typeof editProfileSchema>;

/**
 * Props for the EditProfileForm component.
 */
interface EditProfileFormProps {
  onSuccess?: () => void;
}

/**
 * EditProfileForm renders the editable user profile form.
 * It supports optional password change via re-authentication.
 */
export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  onSuccess,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    // defaultValues: {
    //   firstName: auth.user?.firstName ?? "",
    //   lastName: auth.user?.lastName ?? "",
    //   email: auth.user?.email ?? "",
    //   age: auth.user?.age ?? 13,
    //   password: "",
    //   confirmPassword: "",
    // },
  });

  /**
   * Handle profile submit and optional password update.
   * @param data Validated form values
   */
  const onSubmit = async (data: EditProfileFormData) => {
    setLoading(true);
    try {
      const validatedData = editProfileSchema.parse(data);
      console.log("Datos validados:", validatedData);

      // Update local auth profile (in a real app call backend API)
      // auth.updateProfile({
      //   email: validatedData.email,
      //   firstName: validatedData.firstName,
      //   lastName: validatedData.lastName,
      //   age: validatedData.age,
      // });

      if (validatedData.newPassword) {
        if (!currentUser || !currentUser.email) {
          throw new Error("Usuario no disponible para cambiar la contraseña");
        }

        const credential = EmailAuthProvider.credential(
          currentUser.email,
          validatedData.currentPassword || ""
        );

        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, validatedData.newPassword);

        toast.success("¡Contraseña actualizada exitosamente!");
      }

      toast.success("¡Perfil actualizado exitosamente!");

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      const modalEl = document.getElementById("modal-edit-profile");
      if (modalEl) {
        const modal = BsModal.getInstance(modalEl) || new BsModal(modalEl);
        modal.hide();
      }
    } catch (error) {
      console.error(typeof error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar el perfil. Intenta de nuevo");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
        label="Contraseña actual"
        type={showCurrentPassword ? "text" : "password"}
        register={register("currentPassword")}
        error={errors.currentPassword}
        icon={<Lock size={20} />}
        endIcon={{
          icon: <EyeOff size={18} />,
          inactiveIcon: <Eye size={18} />,
          isActive: showCurrentPassword,
          onClick: () => setShowCurrentPassword((s) => !s),
        }}
      />

      <FormField
        label="Nueva contraseña"
        type={showNewPassword ? "text" : "password"}
        register={register("newPassword")}
        error={errors.newPassword}
        icon={<Lock size={20} />}
        endIcon={{
          icon: <EyeOff size={18} />,
          inactiveIcon: <Eye size={18} />,
          isActive: showNewPassword,
          onClick: () => setShowNewPassword((s) => !s),
        }}
      />

      <FormField
        label="Confirmar nueva contraseña"
        type={showConfirmPassword ? "text" : "password"}
        register={register("confirmPassword")}
        error={errors.confirmPassword}
        icon={<Lock size={20} />}
        endIcon={{
          icon: <EyeOff size={18} />,
          inactiveIcon: <Eye size={18} />,
          isActive: showConfirmPassword,
          onClick: () => setShowConfirmPassword((s) => !s),
        }}
      />

      <div className="form-buttons">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || isSubmitting}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
