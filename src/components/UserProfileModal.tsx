import { X, MessageSquare, User, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";
import FriendRequestButton from "@/components/FriendRequestButton";

interface Props {
  profile: Tables<"profiles">;
  onClose: () => void;
}

const UserProfileModal = ({ profile, onClose }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-end justify-center" onClick={onClose}>
      <div
        className="w-full max-w-md bg-card border-t border-border rounded-t-3xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-base font-cairo font-bold text-foreground">الملف الشخصي</h3>
          <div className="w-5" />
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-muted border-3 border-accent flex items-center justify-center mb-3 overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>
          <h4
            className="text-lg font-cairo font-bold"
            style={{ color: (profile as any)?.name_color || "hsl(var(--foreground))" }}
          >
            {profile.username}
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-space font-bold bg-accent/20 text-accent px-2 py-0.5 rounded-full">
              مستوى {profile.level}
            </span>
            {profile.gender && (
              <span className="text-xs font-cairo text-muted-foreground">
                {profile.gender === "male" ? "♂ ذكر" : "♀ أنثى"}
              </span>
            )}
            {profile.age && (
              <span className="text-xs font-cairo text-muted-foreground">
                {profile.age} سنة
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <FriendRequestButton targetUserId={profile.user_id} />
          <button
            onClick={() => {
              onClose();
              navigate(`/private/${profile.user_id}`);
            }}
            className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-cairo font-bold py-3 rounded-xl hover:bg-secondary/90 transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            <span>رسالة خاصة</span>
          </button>
          <button
            onClick={() => {
              onClose();
              navigate(`/user/${profile.user_id}`);
            }}
            className="w-full flex items-center justify-center gap-2 bg-muted text-foreground font-cairo font-bold py-3 rounded-xl hover:bg-muted/80 transition-all"
          >
            <User className="w-5 h-5" />
            <span>عرض الملف الشخصي</span>
          </button>
          <button
            className="w-full flex items-center justify-center gap-2 bg-muted text-destructive font-cairo font-bold py-3 rounded-xl hover:bg-destructive/20 transition-all"
          >
            <Flag className="w-5 h-5" />
            <span>إبلاغ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
