import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import { Mail, User, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/ui/input";
import "./EditProfileForm.scss";

const editProfileSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  age: z.coerce.number().min(13, "Debes tener al menos 13 años").max(120),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  initialData?: {
    firstName: string;
    lastName: string;
    email: string;
    age: string | number;
  };
  onSubmit?: (data: EditProfileFormData) => Promise<void> | void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialData = { firstName: "", lastName: "", email: "", age: 13 },
  onSubmit,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<EditProfileFormData>({
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      age: Number(initialData.age) || 13,
    },
  });

  useEffect(() => {
    reset({
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      age: Number(initialData.age) || 13,
    });
  }, [initialData.firstName, initialData.lastName, initialData.email, initialData.age, reset]);

  const handleFormSubmit = async (data: EditProfileFormData) => {
    setLoading(true);

    const result = editProfileSchema.safeParse({
      firstName: (data.firstName ?? "").trim(),
      lastName: (data.lastName ?? "").trim(),
      email: (data.email ?? "").trim(),
      age: Number(data.age) || 13,
    });

    if (!result.success) {
      setLoading(false);
      const firstError = result.error.issues[0]?.message ?? "Revisa los datos";
      toast.error(firstError);
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(result.data);
      }
      reset(result.data);
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
      <FormField label="Edad" type="number" register={register("age")} icon={<Calendar size={20} />} />

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;