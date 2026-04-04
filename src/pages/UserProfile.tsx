import { ArrowRight, MessageSquare, Ban, Flag, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import FriendRequestButton from "@/components/FriendRequestButton";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import { toast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [showImage, setShowImage] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    supabase.from("profiles").select("*").eq("user_id", userId).single().then(({ data }) => {
      setProfile(data);
      setLikesCount((data as any)?.likes_count || 0);
    });

    if (user) {
      supabase.from("likes" as any).select("id").eq("liker_id", user.id).eq("liked_id", userId).maybeSingle().then(({ data }) => {
        setLiked(!!data);
      });
    }
  }, [userId, user]);

  const handleLike = async () => {
    if (!user || !userId || userId === user.id) return;
    if (liked) {
      await supabase.from("likes" as any).delete().eq("liker_id", user.id).eq("liked_id", userId);
      setLiked(false);
      setLikesCount(prev => Math.max(0, prev - 1));
    } else {
      await supabase.from("likes" as any).insert({ liker_id: user.id, liked_id: userId });
      setLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  const handleBlock = async () => {
    if (!user || !userId) return;
    await supabase.from("blocks" as any).insert({ blocker_id: user.id, blocked_id: userId });
    toast({ title: "تم الحظر", description: `تم حظر ${profile?.username}` });
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-cairo">جاري التحميل...</p>
      </div>
    );
  }

  const formatLastSeen = () => {
    if (profile.is_online) return "🟢 متصل الآن";
    if (profile.last_seen) {
      const d = new Date(profile.last_seen);
      return `آخر ظهور ${d.toLocaleDateString("ar-EG")} ${d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}`;
    }
    return "غير متصل";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-secondary h-56">
        <button onClick={() => navigate(-1)} className="absolute top-4 right-4 text-secondary-foreground">
          <ArrowRight className="w-6 h-6" />
        </button>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <button onClick={() => profile.avatar_url && setShowImage(true)} className="w-24 h-24 rounded-full bg-muted border-4 border-primary flex items-center justify-center overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">👤</span>
            )}
          </button>
        </div>
      </div>

      <div className="pt-16 text-center px-6">
        <h2 className="text-xl font-cairo font-bold" style={{ color: profile.name_color || "hsl(var(--foreground))" }}>
          {profile.username}
        </h2>
        
        <p className={`text-xs font-cairo mt-1 ${profile.is_online ? "text-accent" : "text-muted-foreground"}`}>
          {formatLastSeen()}
        </p>

        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="text-xs font-space font-bold bg-accent/20 text-accent px-3 py-1 rounded-full">
            مستوى {profile.level}
          </span>
          {profile.gender && (
            <span className="text-xs font-cairo text-muted-foreground">{profile.gender === "male" ? "♂ ذكر" : "♀ أنثى"}</span>
          )}
          {profile.age && (
            <span className="text-xs font-cairo text-muted-foreground">{profile.age} سنة</span>
          )}
        </div>

        {/* Like button */}
        {user && userId !== user.id && (
          <button
            onClick={handleLike}
            className={`mt-3 inline-flex items-center gap-2 px-5 py-2 rounded-full font-cairo font-bold text-sm transition-all ${
              liked ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-destructive" : ""}`} />
            <span>{likesCount}</span>
            <span>{liked ? "معجب" : "إعجاب"}</span>
          </button>
        )}

        {profile.status && (
          <p className="text-xs font-cairo text-muted-foreground mt-2 bg-muted inline-block px-3 py-1 rounded-full">
            💭 {profile.status}
          </p>
        )}

        {profile.country && (
          <p className="text-xs font-cairo text-muted-foreground mt-2">📍 {profile.country}</p>
        )}

        {profile.bio && (
          <p className="text-sm font-cairo text-muted-foreground mt-4">{profile.bio}</p>
        )}
      </div>

      <div className="px-6 mt-6 space-y-3">
        <FriendRequestButton targetUserId={profile.user_id} />
        <button onClick={() => navigate(`/private/${profile.user_id}`)}
          className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-cairo font-bold py-3 rounded-xl hover:bg-secondary/90 transition-all">
          <MessageSquare className="w-5 h-5" />
          <span>رسالة خاصة</span>
        </button>
        <button onClick={handleBlock}
          className="w-full flex items-center justify-center gap-2 bg-muted text-destructive font-cairo font-bold py-3 rounded-xl hover:bg-destructive/20 transition-all">
          <Ban className="w-5 h-5" />
          <span>حظر</span>
        </button>
      </div>

      {showImage && profile.avatar_url && (
        <ImagePreviewModal imageUrl={profile.avatar_url} onClose={() => setShowImage(false)} />
      )}
    </div>
  );
};

export default UserProfile;
