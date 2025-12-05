import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/input";

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
  });

type EditPasswordFormData = z.infer<typeof editPasswordSchema>;

const EditPasswordForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<EditPasswordFormData>({
    resolver: zodResolver(editPasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: EditPasswordFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField
        label="Contraseña actual"
        type="password"
        register={register("password")}
        error={errors.password}
      />
      <FormField
        label="Nueva contraseña"
        type="password"
        register={register("newPassword")}
        error={errors.newPassword}
      />
      <FormField
        label="Confirmar nueva contraseña"
        type="password"
        register={register("confirmPassword")}
        error={errors.confirmPassword}
      />
    </form>
  );
};

export { EditPasswordForm }