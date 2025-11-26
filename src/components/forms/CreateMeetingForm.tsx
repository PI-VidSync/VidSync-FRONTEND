import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { FormField } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../hooks/useToast";
import { Modal } from "bootstrap";
import "./MeetingForm.scss";

const createMeetingSchema = z.object({
  meetingName: z.string().min(1, "El nombre de la reunión es requerido")
});

type CreateMeetingFormData = z.infer<typeof createMeetingSchema>;

const CreateMeetingForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateMeetingFormData>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      meetingName: "",
    },
  });

  const onSubmit = (data: CreateMeetingFormData) => {
    try {
      setLoading(true);
      const validationResult = createMeetingSchema.safeParse(data);
      if (!validationResult.success) {
        toast.error("Nombre de reunión inválido");
        return;
      }
      const meetingCode = encodeURIComponent(data.meetingName.trim());

      const modalEl = document.getElementById("modal-create-meeting");
      if (modalEl) {
        const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
        modal.hide();
      }

      navigate(`/meeting/${meetingCode}`);
      toast.success("Reunión creada exitosamente");
    } catch {
      toast.error("Error al crear la reunión");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="modal-subtitle">
        Crea una reunión para reunirte con tus amigos y compañeros vía chat, audio y video
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          label="Nombre de la reunión"
          type="text"
          register={register("meetingName")}
          error={errors.meetingName}
        />

        <div className="form-buttons">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear videollamada"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMeetingForm;