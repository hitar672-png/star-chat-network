import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import OnlineUserAvatar from "@/components/OnlineUserAvatar";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const OnlineUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<Tables<"profiles">[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("level", { ascending: false })
        .limit(50);
      if (data) setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">
          المتصلين ({users.length})
        </h1>
        <div className="w-6" />
      </div>

      <div className="px-4 py-6">
        <div className="grid grid-cols-4 gap-4">
          {users.map((u) => (
            <OnlineUserAvatar
              key={u.id}
              user={{
                id: u.id,
                username: u.username,
                level: u.level,
                borderColor: u.gender === "female" ? "border-primary" : "border-accent",
              }}
              onClick={() => navigate(`/user/${u.user_id}`)}
            />
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default OnlineUsers;
