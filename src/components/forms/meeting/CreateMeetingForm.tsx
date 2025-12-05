import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { FormField } from "../../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../../hooks/useToast";
import { Modal } from "bootstrap";
import "./MeetingForm.scss";
import { useMeetingsService } from "../../../service/api/meetings.service";

const createMeetingSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
});

type CreateMeetingFormData = z.infer<typeof createMeetingSchema>;

const CreateMeetingForm: React.FC = () => {
  const { createMeeting } = useMeetingsService();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateMeetingFormData>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = async (data: CreateMeetingFormData) => {
    setLoading(true);
    try {
      const resp: any = await createMeeting({ title: data.title.trim()});
      if (!resp?.meeting?.meetingId) {
        toast.error("Respuesta inválida del servidor");
        return;
      }

      // close modal if exists
      const modalEl = document.getElementById("modal-create-meeting");
      if (modalEl) {
        const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
        modal.hide();
      }

      const meetingCode = encodeURIComponent(resp.meeting.meetingId);
      toast.success("Reunión creada");
      navigate(`/meeting/${meetingCode}`);
    } catch (err: any) {
      toast.error(err?.message ?? "Error al crear la reunión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="modal-subtitle">Crea una nueva videollamada y comparte el código con los participantes</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          label="Título de la reunión"
          type="text"
          register={register("title")}
          error={errors.title}
        />

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creando..." : "Crear reunión"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMeetingForm;