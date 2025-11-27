import React, { useState } from "react";
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
    name: string;
    lastName: string;
    email: string;
    age: string | number;
  };
  onSuccess?: (data: EditProfileFormData) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialData = { name: "", lastName: "", email: "", age: 13 },
  onSuccess,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm<EditProfileFormData>({
    defaultValues: {
      firstName: initialData.name,
      lastName: initialData.lastName,
      email: initialData.email,
      age: Number(initialData.age) || 13,
    },
  });

  const onSubmit = async (data: EditProfileFormData) => {
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
      await new Promise((r) => setTimeout(r, 800));
      toast.success("¡Perfil actualizado!");
      onSuccess?.(result.data);
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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