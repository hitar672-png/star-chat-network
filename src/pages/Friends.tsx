import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, UserCheck, Clock, UserX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";
import BottomNav from "@/components/BottomNav";

interface FriendWithProfile {
  id: string;
  status: string;
  isSender: boolean;
  profile: Tables<"profiles"> | null;
}

const Friends = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"accepted" | "pending">("accepted");
  const [friends, setFriends] = useState<FriendWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("friend_requests")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (!data) { setLoading(false); return; }

      const otherIds = data.map(r => r.sender_id === user.id ? r.receiver_id : r.sender_id);
      const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", otherIds);
      const profileMap: Record<string, Tables<"profiles">> = {};
      profiles?.forEach(p => { profileMap[p.user_id] = p; });

      setFriends(data.map(r => ({
        id: r.id,
        status: r.status,
        isSender: r.sender_id === user.id,
        profile: profileMap[r.sender_id === user.id ? r.receiver_id : r.sender_id] || null,
      })));
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleAccept = async (id: string) => {
    await supabase.from("friend_requests").update({ status: "accepted" }).eq("id", id);
    setFriends(prev => prev.map(f => f.id === id ? { ...f, status: "accepted" } : f));
  };

  const filtered = friends.filter(f =>
    activeTab === "accepted" ? f.status === "accepted" : (f.status === "pending" && !f.isSender)
  );

  const sentPending = friends.filter(f => f.status === "pending" && f.isSender);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">الأصدقاء</h1>
        <div className="w-6" />
      </div>

      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("accepted")}
          className={`flex-1 py-3 text-sm font-cairo font-bold transition-colors ${activeTab === "accepted" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
        >
          <UserCheck className="w-4 h-4 inline ml-1" /> أصدقائي
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 py-3 text-sm font-cairo font-bold transition-colors ${activeTab === "pending" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
        >
          <Clock className="w-4 h-4 inline ml-1" /> طلبات واردة
        </button>
      </div>

      <div className="px-4 py-4 space-y-3">
        {loading ? (
          <p className="text-center text-muted-foreground font-cairo py-8">جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground font-cairo py-8">
            {activeTab === "accepted" ? "لا يوجد أصدقاء بعد" : "لا توجد طلبات واردة"}
          </p>
        ) : (
          filtered.map(f => (
            <div key={f.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
              <button onClick={() => f.profile && navigate(`/user/${f.profile.user_id}`)} className="w-12 h-12 rounded-full bg-muted border-2 border-accent overflow-hidden flex-shrink-0">
                {f.profile?.avatar_url ? (
                  <img src={f.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="flex items-center justify-center h-full text-lg">👤</span>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-cairo font-bold text-foreground truncate">{f.profile?.username || "مجهول"}</p>
                <p className="text-xs font-cairo text-muted-foreground">مستوى {f.profile?.level || 1}</p>
              </div>
              {activeTab === "pending" && (
                <button
                  onClick={() => handleAccept(f.id)}
                  className="bg-accent text-accent-foreground text-xs font-cairo font-bold px-4 py-2 rounded-lg"
                >
                  قبول
                </button>
              )}
              {activeTab === "accepted" && (
                <button
                  onClick={() => f.profile && navigate(`/private/${f.profile.user_id}`)}
                  className="bg-secondary text-secondary-foreground text-xs font-cairo font-bold px-4 py-2 rounded-lg"
                >
                  رسالة
                </button>
              )}
            </div>
          ))
        )}

        {activeTab === "pending" && sentPending.length > 0 && (
          <>
            <h3 className="text-sm font-cairo font-bold text-muted-foreground mt-6 mb-2">طلبات مرسلة</h3>
            {sentPending.map(f => (
              <div key={f.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 opacity-60">
                <div className="w-12 h-12 rounded-full bg-muted border-2 border-border overflow-hidden flex-shrink-0">
                  {f.profile?.avatar_url ? (
                    <img src={f.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="flex items-center justify-center h-full text-lg">👤</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-cairo font-bold text-foreground truncate">{f.profile?.username || "مجهول"}</p>
                </div>
                <span className="text-xs font-cairo text-muted-foreground">بانتظار القبول</span>
              </div>
            ))}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Friends;
