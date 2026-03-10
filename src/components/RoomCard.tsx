import { Users, Globe } from "lucide-react";
import { Room } from "@/data/mockData";

interface Props {
  room: Room;
  onClick: () => void;
}

const RoomCard = ({ room, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-right bg-card hover:bg-card/80 border border-border rounded-lg p-4 transition-all duration-200 hover:border-primary/30 animate-slide-up"
    >
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-3xl flex-shrink-0">
          {room.image}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-cairo font-bold text-foreground mb-1">
            {room.name}
          </h3>
          <p className="text-xs font-cairo text-muted-foreground line-clamp-2 leading-relaxed">
            {room.description}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-space font-semibold text-muted-foreground">{room.onlineCount}</span>
            </div>
            <Globe className="w-3 h-3 text-online" />
            {room.isPinned && (
              <span className="text-xs text-primary">📌</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default RoomCard;
