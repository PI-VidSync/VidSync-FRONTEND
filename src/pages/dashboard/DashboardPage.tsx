import React from "react";
import "./DashboardPage.scss";
import { Monitor, Users } from "lucide-react";
import { ModalCustomTrigger } from "@/components/ui/modalCustomTrigger";
import CreateMeetingForm from "@/components/forms/meeting/CreateMeetingForm";
import JoinMeetingForm from "@/components/forms/meeting/JoinMeetingForm";

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-main">
      <div className="cards-container">
        <ModalCustomTrigger 
          name="create-meeting"
          title="Crear una videollamada"
          trigger={<div className="dashboard-card">
            <div className="card-icon create">
              <Monitor size={48} />
            </div>
            <h3>Crear una videollamada</h3>
            <p>Crea una reunión para reunirte con tus amigos o compañeros vía chat, audio y video</p>
          </div>}
          >
            <CreateMeetingForm />
        </ModalCustomTrigger>

        <ModalCustomTrigger 
          name="join-meeting"
          title="Unirme a una videollamada"
          trigger={<div className="dashboard-card">
            <div className="card-icon join">
              <Users size={48} />
            </div>
            <h3>Unirme a una videollamada</h3>
            <p>Únete a una videollamada creada por otra persona mediante el código de reunión</p>
          </div>}
          >
            <JoinMeetingForm />
        </ModalCustomTrigger>

        {/* Perfil moved to header - card removed to avoid duplication */}
      </div>
    </div>
  );
};

export default DashboardPage;