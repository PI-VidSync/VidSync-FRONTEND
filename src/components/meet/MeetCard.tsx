import { Mic, MicOff, User, Video, VideoOff } from "lucide-react";
import "./MeetCard.scss"

type StageParticipant = {
  id: string;
  name: string;
  micEnabled?: boolean;
  videoEnabled?: boolean;
};

const MeetCard = (data: StageParticipant) => {
  const { id, name, micEnabled, videoEnabled } = data;

  return (
    <div key={id} className="meeting-tile">
      <span className="name">{name}</span>
      <div className="avatar"><User /></div>
      {micEnabled !== undefined && videoEnabled !== undefined && (
        <div className="status">
          <StatusIcon enabled={micEnabled} />
        </div>
      )}
    </div>
  );
};

const StatusIcon = ({ enabled }: { enabled: boolean }) => {
  const Icon = enabled
    ? Mic
    : MicOff;

  return (
    <span className={`media-state${enabled ? "" : " is-off"}`}>
      <Icon size={18} />
    </span>
  );
}

export { MeetCard }