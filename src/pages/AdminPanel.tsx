import { useState, useEffect } from "react";
import { ArrowRight, Shield, Users, Flag, CheckCircle, XCircle, UserPlus, UserMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Report {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  status: string;
  created_at: string;
  reporter_name?: string;
  reported_name?: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"reports" | "users" | "moderators">("reports");
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [moderators, setModerators] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
      setIsAdmin(!!data);
      setLoading(false);
      if (data) {
        fetchReports();
        fetchUsers();
        fetchModerators();
      }
    });
  }, [user]);

  const fetchReports = async () => {
    const { data } = await supabase.from("reports" as any).select("*").order("created_at", { ascending: false });
    if (!data) return;
    const userIds = [...new Set((data as any[]).flatMap((r: any) => [r.reporter_id, r.reported_id]))];
    const { data: profiles } = await supabase.from("profiles").select("user_id, username").in("user_id", userIds);
    const nameMap: Record<string, string> = {};
    profiles?.forEach(p => { nameMap[p.user_id] = p.username; });
    setReports((data as any[]).map((r: any) => ({
      ...r,
      reporter_name: nameMap[r.reporter_id] || "مجهول",
      reported_name: nameMap[r.reported_id] || "مجهول",
    })));
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(50);
    if (data) setUsers(data);
  };

  const fetchModerators = async () => {
    const { data: roles } = await supabase.from("user_roles").select("*");
    if (!roles || roles.length === 0) { setModerators([]); return; }
    const userIds = roles.map(r => r.user_id);
    const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", userIds);
    const profileMap: Record<string, any> = {};
    profiles?.forEach(p => { profileMap[p.user_id] = p; });
    setModerators(roles.map(r => ({ ...r, profile: profileMap[r.user_id] })));
  };

  const updateReportStatus = async (id: string, status: string) => {
    await supabase.from("reports" as any).update({ status }).eq("id", id);
    toast.success(`تم تحديث حالة البلاغ`);
    fetchReports();
  };

  const addModerator = async (userId: string) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "moderator" as any });
    if (error) {
      toast.error("هذا المستخدم مشرف بالفعل أو حدث خطأ");
      return;
    }
    toast.success("تم تعيين المشرف بنجاح");
    setSelectedUserId(null);
    fetchModerators();
  };

  const removeModerator = async (roleId: string) => {
    await supabase.from("user_roles").delete().eq("id", roleId);
    toast.success("تم إزالة المشرف");
    fetchModerators();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-cairo">جاري التحميل...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Shield className="w-16 h-16 text-destructive" />
        <p className="text-lg font-cairo font-bold text-foreground">ليس لديك صلاحية الوصول</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-primary text-primary-foreground font-cairo font-bold rounded-xl">رجوع</button>
      </div>
    );
  }

  const pendingReports = reports.filter(r => r.status === "pending");
  const resolvedReports = reports.filter(r => r.status !== "pending");

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground flex items-center gap-2">
          <Shield className="w-5 h-5" /> لوحة الإدارة
        </h1>
        <div className="w-6" />
      </div>

      <div className="px-4 py-4 grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <Flag className="w-5 h-5 text-destructive mx-auto mb-1" />
          <p className="text-lg font-space font-bold text-foreground">{pendingReports.length}</p>
          <p className="text-[10px] font-cairo text-muted-foreground">بلاغات معلقة</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <CheckCircle className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-lg font-space font-bold text-foreground">{resolvedReports.length}</p>
          <p className="text-[10px] font-cairo text-muted-foreground">تم المعالجة</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <Users className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-space font-bold text-foreground">{users.length}</p>
          <p className="text-[10px] font-cairo text-muted-foreground">مستخدمين</p>
        </div>
      </div>

      <div className="flex border-b border-border">
        {(["reports", "users", "moderators"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-cairo font-bold text-center ${tab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
            {t === "reports" ? `البلاغات (${reports.length})` : t === "users" ? `المستخدمين (${users.length})` : `المشرفين (${moderators.length})`}
          </button>
        ))}
      </div>

      <div className="px-4 py-4">
        {tab === "reports" ? (
          reports.length === 0 ? (
            <div className="text-center py-16">
              <Flag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-cairo text-muted-foreground">لا توجد بلاغات</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map(r => (
                <div key={r.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-cairo px-2 py-0.5 rounded-full ${
                      r.status === "pending" ? "bg-destructive/20 text-destructive" :
                      r.status === "resolved" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                    }`}>
                      {r.status === "pending" ? "معلق" : r.status === "resolved" ? "تم المعالجة" : "مرفوض"}
                    </span>
                    <span className="text-[10px] font-space text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                  <p className="text-sm font-cairo text-foreground mb-1">
                    <span className="text-muted-foreground">المُبلّغ:</span> {r.reporter_name}
                  </p>
                  <p className="text-sm font-cairo text-foreground mb-1">
                    <span className="text-muted-foreground">المُبلّغ عنه:</span> {r.reported_name}
                  </p>
                  {r.reason && (
                    <p className="text-xs font-cairo text-muted-foreground bg-muted rounded-lg px-3 py-2 mt-2">{r.reason}</p>
                  )}
                  {r.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => updateReportStatus(r.id, "resolved")}
                        className="flex-1 flex items-center justify-center gap-1 bg-accent/20 text-accent font-cairo font-bold text-xs py-2 rounded-lg">
                        <CheckCircle className="w-4 h-4" /> معالجة
                      </button>
                      <button onClick={() => updateReportStatus(r.id, "dismissed")}
                        className="flex-1 flex items-center justify-center gap-1 bg-muted text-muted-foreground font-cairo font-bold text-xs py-2 rounded-lg">
                        <XCircle className="w-4 h-4" /> رفض
                      </button>
                      <button onClick={() => navigate(`/user/${r.reported_id}`)}
                        className="flex items-center justify-center gap-1 bg-primary/10 text-primary font-cairo font-bold text-xs py-2 px-3 rounded-lg">
                        عرض
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : tab === "users" ? (
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                <button onClick={() => navigate(`/user/${u.user_id}`)}
                  className="w-10 h-10 rounded-full bg-muted border-2 border-accent flex items-center justify-center overflow-hidden flex-shrink-0">
                  {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : <span>👤</span>}
                </button>
                <div className="flex-1 text-right min-w-0">
                  <p className="text-sm font-cairo font-bold text-foreground">{u.username}</p>
                  <p className="text-[10px] font-cairo text-muted-foreground">
                    مستوى {u.level} • {u.is_online ? "🟢 متصل" : "⚪ غير متصل"}
                  </p>
                </div>
                <button onClick={() => addModerator(u.user_id)}
                  className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-cairo font-bold px-3 py-1.5 rounded-lg">
                  <UserPlus className="w-3 h-3" /> مشرف
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {moderators.length === 0 ? (
              <div className="text-center py-16">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-cairo text-muted-foreground">لا يوجد مشرفين</p>
              </div>
            ) : (
              moderators.map(m => (
                <div key={m.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                  <div className="w-10 h-10 rounded-full bg-muted border-2 border-primary flex items-center justify-center overflow-hidden flex-shrink-0">
                    {m.profile?.avatar_url ? <img src={m.profile.avatar_url} alt="" className="w-full h-full object-cover" /> : <span>👤</span>}
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <p className="text-sm font-cairo font-bold text-foreground">{m.profile?.username || "مجهول"}</p>
                    <p className="text-[10px] font-cairo text-muted-foreground">
                      الدور: <span className="text-primary font-bold">{m.role === "admin" ? "مدير" : "مشرف"}</span>
                    </p>
                  </div>
                  {m.role !== "admin" && (
                    <button onClick={() => removeModerator(m.id)}
                      className="flex items-center gap-1 bg-destructive/10 text-destructive text-xs font-cairo font-bold px-3 py-1.5 rounded-lg">
                      <UserMinus className="w-3 h-3" /> إزالة
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
