import React, { useState, useMemo } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import {  Mail, User, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/input";
import { useAuth } from "../../auth/AuthContext";
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
    password: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 8,
        "La contraseña debe tener al menos 8 caracteres"
      )
      .refine((val) => !val || /[A-Za-z]/.test(val), "Debe contener letras")
      .refine((val) => !val || /[0-9]/.test(val), "Debe contener números")
      .refine(
        (val) => !val || /[^A-Za-z0-9]/.test(val),
        "Debe contener símbolos"
      ),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Solo validar coincidencia si se ingresó una contraseña
      if (data.password) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }
  );

type EditProfileFormData = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  onSuccess?: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  onSuccess,
}) => {
  const auth = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
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

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const checks = useMemo(() => {
    return {
      length: (password?.length ?? 0) >= 8,
      letters: /[A-Za-z]/.test(password ?? ""),
      numbers: /[0-9]/.test(password ?? ""),
      symbols: /[^A-Za-z0-9]/.test(password ?? ""),
      match: password !== "" && password === confirmPassword,
    };
  }, [password, confirmPassword]);

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

      <div className="submit-container">
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