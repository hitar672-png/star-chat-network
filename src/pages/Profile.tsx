import { X, Eye, CreditCard, Heart, Volume2, Shield, LogOut, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const profileMenuItems = [
  { icon: Edit, label: "تحرير البيانات", route: "/edit-profile" },
  { icon: Heart, label: "تعديل الحالة", route: "" },
  { icon: Volume2, label: "إعدادات الصوت", route: "/sound" },
];

const settingsTabs = [
  { label: "حساب" },
  { label: "هدايا" },
  { label: "مزيد" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("حساب");

  const handleSignOut = async () => {
    await signOut();
    toast.success("تم تسجيل الخروج");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-secondary h-56">
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-secondary-foreground">
            <X className="w-6 h-6" />
          </button>
          <button className="text-secondary-foreground">
            <Eye className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-muted border-4 border-primary flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">👤</span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-16 text-center px-6">
        <p className="text-xs font-cairo text-muted-foreground">
          {profile?.gender === "male" ? "♂ ذكر" : profile?.gender === "female" ? "♀ أنثى" : ""}
          {profile?.age ? ` • ${profile.age} سنة` : ""}
        </p>
        <h2
          className="text-xl font-cairo font-bold mt-1"
          style={{ color: (profile as any)?.name_color || "hsl(var(--foreground))" }}
        >
          {profile?.username || "مستخدم جديد"}
        </h2>
        <span className="text-xs font-space font-bold bg-accent/20 text-accent px-3 py-1 rounded-full inline-block mt-2">
          مستوى {profile?.level || 1}
        </span>
      </div>

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

      <div className="px-6 space-y-0">
        {profileMenuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.route && navigate(item.route)}
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
      </div>

      {/* Sign out */}
      <div className="px-6 mt-6 mb-8">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 bg-destructive text-destructive-foreground font-cairo font-bold py-3 rounded-xl hover:bg-destructive/90 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
