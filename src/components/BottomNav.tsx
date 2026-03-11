import { Moon, Sun, RefreshCw, Gift, BarChart3, ThumbsUp, Search, MessageSquare, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  const handleThemeToggle = () => {
    setIsDark(!isDark);
    // Theme toggle placeholder
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const navItems = [
    { icon: Users, label: "متصلين", path: "/online", action: undefined },
    { icon: MessageSquare, label: "الغرف", path: "/rooms", action: undefined },
    { icon: Search, label: "بحث", path: "/search", action: undefined },
    { icon: ThumbsUp, label: "إعجاب", path: "/likes", action: undefined },
    { icon: BarChart3, label: "مستوى", path: "/levels", action: undefined },
    { icon: Gift, label: "هدايا", path: "/gifts", action: undefined },
    { icon: RefreshCw, label: "تنشيط", path: "", action: handleRefresh },
    { icon: isDark ? Sun : Moon, label: isDark ? "فاتح" : "داكن", path: "", action: handleThemeToggle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = item.path && location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
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
