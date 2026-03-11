import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import RoomCard from "@/components/RoomCard";
import TopToolbar from "@/components/TopToolbar";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Tables<"rooms">[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase
        .from("rooms")
        .select("*")
        .order("is_pinned", { ascending: false });
      if (data) setRooms(data);
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <TopToolbar />

      <div className="flex-1 px-4 py-4 space-y-3">
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

export default Rooms;
