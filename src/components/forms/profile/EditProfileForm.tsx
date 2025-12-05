import React, { useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import { Mail, User, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/ui/input";
import "./EditProfileForm.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/auth/useAuth";
import { useAuthService } from "@/service/api/auth.service";

const editProfileSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  age: z.number().min(13, "Debes tener al menos 13 años").max(120),
});

/**
 * Form data inferred from the edit profile schema.
 */
type EditProfileFormData = z.infer<typeof editProfileSchema>;

const EditProfileForm: React.FC = () => {
  const { currentUser } = useAuth();
  const { updateProfile } = useAuthService();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  if (!currentUser) {
    return null;
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditProfileFormData>({
    defaultValues: {
      firstName: currentUser?.displayName?.split(" ")[0] ?? "",
      lastName: currentUser?.displayName?.split(" ").slice(1).join(" ") ?? "",
      email: currentUser?.email ?? undefined,
      age: 13,
    },
    resolver: zodResolver(editProfileSchema),
  });

  const handleFormSubmit = async (data: EditProfileFormData) => {
    setLoading(true);

    try {
      await updateProfile(data);
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        age: data.age,
      });
      toast.success("¡Perfil actualizado!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al guardar";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <FormField label="Nombre" type="text" register={register("firstName")} icon={<User size={20} />} />
      <FormField label="Apellido" type="text" register={register("lastName")} icon={<User size={20} />} />
      <FormField label="Email" type="email" register={register("email")} icon={<Mail size={20} />} />
      <FormField label="Edad" type="number" register={register("age", { valueAsNumber: true })} icon={<Calendar size={20} />} />

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
