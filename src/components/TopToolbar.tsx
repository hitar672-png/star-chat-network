import { Menu, Heart, Mail, Bell, Paintbrush, Volume2, UserCheck, DoorOpen } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  roomName?: string;
}

const toolbarItems = [
  { icon: Menu, label: "قائمة", path: "/menu" },
  { icon: DoorOpen, label: "الغرف", path: "/rooms-list" },
  { icon: Mail, label: "خاص", path: "/private", notification: true },
  { icon: Bell, label: "إشعار", path: "/notifications" },
  { icon: Paintbrush, label: "الخط", path: "/font" },
  { icon: Volume2, label: "الصوت", path: "/sound" },
  { icon: UserCheck, label: "", path: "/profile", isAvatar: true },
];

const TopToolbar = ({ roomName }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      const { count } = await supabase
        .from("private_messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("is_read", false);
      setUnreadCount(count || 0);
    };
    fetchUnread();
  }, [user, location.pathname]);

  return (
    <div className="sticky top-0 z-50 bg-toolbar">
      {roomName && (
        <div className="text-center py-1 border-b border-secondary/30">
          <span className="text-xs font-cairo font-bold text-secondary-foreground">{roomName}</span>
        </div>
      )}
      <div className="flex items-center justify-between px-2 py-2">
        {toolbarItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label || "avatar"}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                isActive
                  ? "text-primary-foreground bg-secondary/60"
                  : "text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {item.isAvatar ? (
                <div className="w-10 h-10 rounded-full bg-muted border-2 border-primary flex items-center justify-center">
                  <span className="text-sm">
                    {profile?.gender === "female" ? "👩" : "👤"}
                  </span>
                </div>
              ) : (
                <>
                  <item.icon className="w-6 h-6" />
                  {item.notification && unreadCount > 0 && (
                    <span className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-space font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                  <span className="text-[10px] font-cairo font-semibold">{item.label}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TopToolbar;
