import { X, MessageSquare, User, Flag, Ban } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import FriendRequestButton from "@/components/FriendRequestButton";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import { toast } from "@/hooks/use-toast";

interface Props {
  profile: Tables<"profiles">;
  onClose: () => void;
}

const UserProfileModal = ({ profile, onClose }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showImage, setShowImage] = useState(false);
  const [showReportInput, setShowReportInput] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const handleBlock = async () => {
    if (!user) return;
    await supabase.from("blocks" as any).insert({ blocker_id: user.id, blocked_id: profile.user_id });
    toast({ title: "تم الحظر", description: `تم حظر ${profile.username}` });
    onClose();
  };

  const handleReport = async () => {
    if (!user || !reportReason.trim()) return;
    await supabase.from("reports" as any).insert({ reporter_id: user.id, reported_id: profile.user_id, reason: reportReason.trim() });
    toast({ title: "تم الإبلاغ", description: "شكراً لإبلاغك، سيتم مراجعة البلاغ" });
    setShowReportInput(false);
    setReportReason("");
    onClose();
  };

  return (
    <>
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
            <button
              onClick={() => profile.avatar_url && setShowImage(true)}
              className="w-20 h-20 rounded-full bg-muted border-3 border-accent flex items-center justify-center mb-3 overflow-hidden"
            >
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">👤</span>
              )}
            </button>
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
            {(profile as any)?.status && (
              <p className="text-xs font-cairo text-muted-foreground mt-2 bg-muted px-3 py-1 rounded-full">
                {(profile as any).status}
              </p>
            )}
            {profile.country && (
              <p className="text-xs font-cairo text-muted-foreground mt-1">
                📍 {profile.country}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <FriendRequestButton targetUserId={profile.user_id} />
            <button
              onClick={() => { onClose(); navigate(`/private/${profile.user_id}`); }}
              className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-cairo font-bold py-3 rounded-xl hover:bg-secondary/90 transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span>رسالة خاصة</span>
            </button>
            <button
              onClick={() => { onClose(); navigate(`/user/${profile.user_id}`); }}
              className="w-full flex items-center justify-center gap-2 bg-muted text-foreground font-cairo font-bold py-3 rounded-xl hover:bg-muted/80 transition-all"
            >
              <User className="w-5 h-5" />
              <span>عرض الملف الشخصي</span>
            </button>
            <button
              onClick={handleBlock}
              className="w-full flex items-center justify-center gap-2 bg-muted text-destructive font-cairo font-bold py-3 rounded-xl hover:bg-destructive/20 transition-all"
            >
              <Ban className="w-5 h-5" />
              <span>حظر</span>
            </button>
            {!showReportInput ? (
              <button
                onClick={() => setShowReportInput(true)}
                className="w-full flex items-center justify-center gap-2 bg-muted text-destructive font-cairo font-bold py-3 rounded-xl hover:bg-destructive/20 transition-all"
              >
                <Flag className="w-5 h-5" />
                <span>إبلاغ</span>
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="سبب الإبلاغ..."
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2 text-sm font-cairo text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  dir="rtl"
                />
                <button
                  onClick={handleReport}
                  className="w-full bg-destructive text-destructive-foreground font-cairo font-bold py-3 rounded-xl"
                >
                  إرسال البلاغ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showImage && profile.avatar_url && (
        <ImagePreviewModal imageUrl={profile.avatar_url} onClose={() => setShowImage(false)} />
      )}
    </>
  );
};

export default UserProfileModal;
