import { X, Eye, CreditCard, Heart, Volume2, Shield, Trash2, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const profileMenuItems = [
  { icon: CreditCard, label: "تحرير البيانات" },
  { icon: Heart, label: "تعديل الحالة" },
  { icon: Volume2, label: "إعدادات الصوت" },
];

const settingsTabs = [
  { label: "حساب", active: true },
  { label: "هدايا", active: false },
  { label: "مزيد", active: false },
];

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("حساب");

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient */}
      <div className="relative bg-secondary h-56">
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-secondary-foreground">
            <X className="w-6 h-6" />
          </button>
          <button className="text-secondary-foreground">
            <Eye className="w-6 h-6" />
          </button>
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-muted border-4 border-primary flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="pt-16 text-center px-6">
        <p className="text-xs font-cairo text-muted-foreground">🔒 زائر</p>
        <h2 className="text-xl font-cairo font-bold text-foreground mt-1">مستخدم جديد</h2>
      </div>

      {/* Subscribe banner */}
      <button className="w-full bg-accent text-accent-foreground text-sm font-cairo font-bold py-3 mt-4 hover:bg-accent/90 transition-colors">
        ⚠️ أكمل الاشتراك بالضغط هنا
      </button>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-3 py-4">
        {settingsTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-5 py-2 rounded-full text-sm font-cairo font-semibold transition-all ${
              activeTab === tab.label
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Menu items */}
      <div className="px-6 space-y-0">
        {profileMenuItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 py-4 border-b border-border text-foreground hover:text-primary transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-cairo font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Account ID */}
      <div className="mx-6 mt-6 bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-sm font-cairo font-bold text-foreground">رمز هوية الحساب</span>
        </div>
        <div className="bg-muted rounded-lg px-3 py-2 flex items-center gap-2 mb-3">
          <span className="text-xs font-space text-muted-foreground tracking-widest">• • • • • • • •</span>
          <Eye className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-[11px] font-cairo text-muted-foreground leading-relaxed">
          عند فقدان الحساب، قم بإنشاء حساب جديد مؤقتاً ثم تواصل مع إدارة التطبيق وأعطهم رمز هوية الحساب ليتم استرجاع حسابك فوراً
        </p>
      </div>
    </div>
  );
};

export default Profile;
