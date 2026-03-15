import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import RoomCard from "@/components/RoomCard";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const RoomsList = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Tables<"rooms">[]>([]);

  useEffect(() => {
    supabase.from("rooms").select("*").order("is_pinned", { ascending: false }).then(({ data }) => {
      if (data) setRooms(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">الغرف</h1>
        <div className="w-6" />
      </div>

      <div className="flex-1 px-4 py-4 space-y-3 pb-20">
        {rooms.map((room, i) => (
          <div key={room.id} style={{ animationDelay: `${i * 0.05}s` }}>
            <RoomCard
              room={{
                id: room.id,
                name: room.name,
                description: room.description || "",
                image: room.image || "🌍",
                onlineCount: 0,
                isPinned: room.is_pinned,
              }}
              onClick={() => navigate(`/chat/${room.id}`)}
            />
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default RoomsList;
