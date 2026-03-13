import { useState, useEffect } from "react";
import { UserPlus, UserCheck, Clock, UserX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Props {
  targetUserId: string;
}

type FriendStatus = "none" | "sent" | "received" | "accepted";

const FriendRequestButton = ({ targetUserId }: Props) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<FriendStatus>("none");
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const check = async () => {
      const { data } = await supabase
        .from("friend_requests" as any)
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
        .limit(1);

      const req = (data as any)?.[0];
      if (!req) { setStatus("none"); return; }
      setRequestId(req.id);
      if (req.status === "accepted") setStatus("accepted");
      else if (req.sender_id === user.id) setStatus("sent");
      else setStatus("received");
    };
    check();
  }, [user, targetUserId]);

  const sendRequest = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("friend_requests" as any).insert({
      sender_id: user.id,
      receiver_id: targetUserId,
    } as any);
    if (error) {
      toast.error("لم يتم إرسال الطلب");
    } else {
      setStatus("sent");
      toast.success("تم إرسال طلب الصداقة");
    }
    setLoading(false);
  };

  const acceptRequest = async () => {
    if (!requestId) return;
    setLoading(true);
    await supabase.from("friend_requests" as any).update({ status: "accepted" } as any).eq("id", requestId);
    setStatus("accepted");
    toast.success("تم قبول طلب الصداقة");
    setLoading(false);
  };

  const cancelRequest = async () => {
    if (!requestId) return;
    setLoading(true);
    await supabase.from("friend_requests" as any).delete().eq("id", requestId);
    setStatus("none");
    setRequestId(null);
    toast.success("تم إلغاء الطلب");
    setLoading(false);
  };

  if (!user || user.id === targetUserId) return null;

  const config = {
    none: { icon: UserPlus, label: "طلب صداقة", action: sendRequest, cls: "bg-accent text-accent-foreground" },
    sent: { icon: Clock, label: "تم الإرسال", action: cancelRequest, cls: "bg-muted text-muted-foreground" },
    received: { icon: UserCheck, label: "قبول الصداقة", action: acceptRequest, cls: "bg-primary text-primary-foreground" },
    accepted: { icon: UserCheck, label: "أصدقاء ✓", action: () => {}, cls: "bg-accent/20 text-accent" },
  }[status];

  return (
    <button
      onClick={config.action}
      disabled={loading || status === "accepted"}
      className={`flex items-center justify-center gap-2 font-cairo font-bold py-3 rounded-xl transition-all w-full disabled:opacity-60 ${config.cls}`}
    >
      <config.icon className="w-5 h-5" />
      <span>{config.label}</span>
    </button>
  );
};

export default FriendRequestButton;
