import { ArrowRight, MessageSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import FriendRequestButton from "@/components/FriendRequestButton";
import ImagePreviewModal from "@/components/ImagePreviewModal";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (!userId) return;
    supabase.from("profiles").select("*").eq("user_id", userId).single().then(({ data }) => {
      setProfile(data);
    });
  }, [userId]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-cairo">جاري التحميل...</p>
      </div>
    );
  }

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
        <h2 className="text-xl font-cairo font-bold" style={{ color: (profile as any)?.name_color || "hsl(var(--foreground))" }}>
          {profile.username}
        </h2>
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
        {(profile as any)?.status && (
          <p className="text-xs font-cairo text-muted-foreground mt-2 bg-muted inline-block px-3 py-1 rounded-full">{(profile as any).status}</p>
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
      </div>

      {showImage && profile.avatar_url && (
        <ImagePreviewModal imageUrl={profile.avatar_url} onClose={() => setShowImage(false)} />
      )}
    </div>
  );
};

export default UserProfile;
