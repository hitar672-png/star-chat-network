import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import RoomCard from "@/components/RoomCard";
import { mockRooms } from "@/data/mockData";

const Rooms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/chat")} className="text-secondary-foreground">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">الدخول إلى الغرف</h1>
        <div className="w-6" />
      </div>

      {/* Room list */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {mockRooms.map((room, i) => (
          <div key={room.id} style={{ animationDelay: `${i * 0.05}s` }}>
            <RoomCard room={room} onClick={() => navigate("/chat")} />
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Rooms;
