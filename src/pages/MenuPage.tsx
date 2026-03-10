import { X, FileText, Shield, Lock, Trash2, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: FileText, label: "أخبار الشات" },
  { icon: Shield, label: "الاعتداء CSAE" },
  { icon: Globe, label: "محتوى المستخدم UGC" },
  { icon: Lock, label: "الخصوصية Privacy Policy" },
  { icon: Trash2, label: "حذف العضوية Delete User", danger: true },
];

const MenuPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/chat")} className="text-secondary-foreground">
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-cairo text-secondary-foreground/70">الغرفة الحالية</span>
          <h1 className="text-base font-cairo font-bold text-secondary-foreground">الغرفة العامة</h1>
          <span className="text-2xl">🌍</span>
        </div>
        <div className="w-6" />
      </div>

      {/* Menu items */}
      <div className="px-6 py-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 py-4 border-b border-border transition-colors ${
              item.danger
                ? "text-destructive hover:text-destructive/80"
                : "text-foreground hover:text-primary"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-cairo font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
