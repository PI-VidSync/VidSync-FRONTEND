import React, { useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import { Mail, User, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/input";
import "./EditProfileForm.scss";

const editProfileSchema = z
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
  })

type EditProfileFormData = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  onSuccess?: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  onSuccess,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

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

      toast.success("¡Perfil actualizado exitosamente!");

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
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