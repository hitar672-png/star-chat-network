import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import OnlineUserAvatar from "@/components/OnlineUserAvatar";
import { mockOnlineUsers } from "@/data/mockData";

const OnlineUsers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/chat")} className="text-secondary-foreground">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">
          المتصلين ({mockOnlineUsers.length})
        </h1>
        <div className="w-6" />
      </div>

      {/* Users grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-4 gap-4">
          {mockOnlineUsers.map((user) => (
            <OnlineUserAvatar key={user.id} user={user} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default OnlineUsers;
