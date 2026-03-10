import { Moon, RefreshCw, Gift, BarChart3, ThumbsUp, Search, MessageSquare, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: Users, label: "متصلين", path: "/online" },
  { icon: MessageSquare, label: "الغرف", path: "/rooms" },
  { icon: Search, label: "بحث", path: "/search" },
  { icon: ThumbsUp, label: "إعجاب", path: "/likes" },
  { icon: BarChart3, label: "مستوى", path: "/levels" },
  { icon: Gift, label: "هدايا", path: "/gifts" },
  { icon: RefreshCw, label: "تنشيط", path: "/refresh" },
  { icon: Moon, label: "داكن", path: "/theme" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg transition-all duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-cairo font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
