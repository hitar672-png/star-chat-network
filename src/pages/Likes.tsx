import { ArrowRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";

interface LikeRecord {
  id: string;
  liker_id: string;
  created_at: string;
  username: string;
  avatar_url: string | null;
}

const Likes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [likes, setLikes] = useState<LikeRecord[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchLikes = async () => {
      const { data } = await supabase
        .from("likes" as any)
        .select("*")
        .eq("liked_id", user.id)
        .order("created_at", { ascending: false });
      if (!data) return;

      const likerIds = (data as any[]).map((l: any) => l.liker_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, username, avatar_url").in("user_id", likerIds);
      const pMap: Record<string, any> = {};
      profiles?.forEach(p => { pMap[p.user_id] = p; });

      setLikes((data as any[]).map((l: any) => ({
        ...l,
        username: pMap[l.liker_id]?.username || "مجهول",
        avatar_url: pMap[l.liker_id]?.avatar_url || null,
      })));
    };
    fetchLikes();
  }, [user]);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">الإعجابات</h1>
        <div className="w-6" />
      </div>

      <div className="flex-1 px-4 py-4">
        {likes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-sm font-cairo text-muted-foreground">لا توجد إعجابات بعد</p>
            <p className="text-xs font-cairo text-muted-foreground mt-1">سيظهر هنا من أعجب بملفك الشخصي</p>
          </div>
        ) : (
          <div className="space-y-2">
            {likes.map(l => (
              <button
                key={l.id}
                onClick={() => navigate(`/user/${l.liker_id}`)}
                className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/30 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-muted border-2 border-accent flex items-center justify-center overflow-hidden">
                  {l.avatar_url ? <img src={l.avatar_url} alt="" className="w-full h-full object-cover" /> : <span>👤</span>}
                </div>
                <span className="text-sm font-cairo font-bold text-foreground flex-1 text-right">{l.username}</span>
                <Heart className="w-4 h-4 text-destructive fill-destructive" />
                <span className="text-[10px] font-space text-muted-foreground">
                  {new Date(l.created_at).toLocaleDateString("ar-EG")}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Likes;
