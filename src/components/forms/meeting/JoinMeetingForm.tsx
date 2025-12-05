import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { FormField } from "../../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../../hooks/useToast";
import { Modal } from "bootstrap";
import "./MeetingForm.scss";

const joinMeetingSchema = z.object({
  meetingCode: z.string().min(1, "El código de la reunión es requerido")
});

type JoinMeetingFormData = z.infer<typeof joinMeetingSchema>;

const JoinMeetingForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<JoinMeetingFormData>({
    resolver: zodResolver(joinMeetingSchema),
    defaultValues: {
      meetingCode: "",
    },
  });

  const onSubmit = (data: JoinMeetingFormData) => {
    try {
      setLoading(true);
      const validationResult = joinMeetingSchema.safeParse(data);
      if (!validationResult.success) {
        toast.error("Código de reunión inválido");
        return;
      }
      const meetingCode = encodeURIComponent(data.meetingCode.trim());

      const modalEl = document.getElementById("modal-join-meeting");
      if (modalEl) {
        const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
        modal.hide();
      }

      navigate(`/meeting/${meetingCode}`);
      toast.success("Unido a la reunión exitosamente");
    } catch {
      toast.error("Error al unirse a la reunión");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="modal-subtitle">
        Unirme a una videollamada creada por otra persona mediante el código de reunión
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          label="Código de la reunión"
          type="text"
          register={register("meetingCode")}
          error={errors.meetingCode}
        />

        <div className="form-buttons">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Uniendo..." : "Unirse a la videollamada"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JoinMeetingForm;