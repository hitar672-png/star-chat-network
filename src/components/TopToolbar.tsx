import { Menu, Heart, Mail, Bell, Paintbrush, Volume2, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  roomName?: string;
}

const toolbarItems = [
  { icon: Menu, label: "قائمة", path: "/menu" },
  { icon: Heart, label: "دردش", path: "/rooms" },
  { icon: Mail, label: "خاص", path: "/private", notification: true },
  { icon: Bell, label: "إشعار", path: "/notifications" },
  { icon: Paintbrush, label: "الخط", path: "/font" },
  { icon: Volume2, label: "الصوت", path: "/sound" },
  { icon: UserCheck, label: "", path: "/profile", isAvatar: true },
];

const TopToolbar = ({ roomName }: Props) => {
  const navigate = useNavigate();
  const [notifCount] = useState(1);

  return (
    <div className="sticky top-0 z-50 bg-toolbar">
      {roomName && (
        <div className="text-center py-1 border-b border-secondary/30">
          <span className="text-xs font-cairo font-bold text-secondary-foreground">{roomName}</span>
        </div>
      )}
      <div className="flex items-center justify-between px-2 py-2">
        {toolbarItems.map((item) => (
          <button
            key={item.label || "avatar"}
            onClick={() => navigate(item.path)}
            className="relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-secondary-foreground hover:bg-secondary/80 transition-all"
          >
            {item.isAvatar ? (
              <div className="w-10 h-10 rounded-full bg-muted border-2 border-primary flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
            ) : (
              <>
                <item.icon className="w-6 h-6" />
                {item.notification && notifCount > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-space font-bold rounded-full flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
                <span className="text-[10px] font-cairo font-semibold">{item.label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopToolbar;
