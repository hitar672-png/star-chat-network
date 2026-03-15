import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Conversation {
  user_id: string;
  username: string;
  avatar_url: string | null;
  last_message: string;
  last_time: string;
  unread_count: number;
  is_online: boolean;
}

const PrivateMessages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async () => {
    if (!user) return;
    const { data: messages } = await supabase
      .from("private_messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!messages) return;

    const partnerIds = [...new Set(messages.map(m => m.sender_id === user.id ? m.receiver_id : m.sender_id))];
    const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", partnerIds);
    const profileMap: Record<string, any> = {};
    profiles?.forEach(p => { profileMap[p.user_id] = p; });

    const convMap = new Map<string, Conversation>();
    for (const msg of messages) {
      const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      const partner = profileMap[partnerId];
      if (!convMap.has(partnerId)) {
        convMap.set(partnerId, {
          user_id: partnerId,
          username: partner?.username || "مجهول",
          avatar_url: partner?.avatar_url || null,
          last_message: msg.text,
          last_time: new Date(msg.created_at).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
          unread_count: 0,
          is_online: partner?.is_online || false,
        });
      }
      if (msg.receiver_id === user.id && !msg.is_read) {
        const conv = convMap.get(partnerId)!;
        conv.unread_count++;
      }
    }
    setConversations(Array.from(convMap.values()));
  };

  useEffect(() => {
    fetchConversations();

    if (!user) return;
    const channel = supabase
      .channel("private-msgs-list")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "private_messages" },
        (payload) => {
          const msg = payload.new as any;
          if (msg.sender_id === user.id || msg.receiver_id === user.id) {
            fetchConversations();
          }
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">الرسائل الخاصة</h1>
        <div className="w-6" />
      </div>

      <div className="flex-1 px-4 py-4">
        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">💬</span>
            <p className="text-sm font-cairo text-muted-foreground">لا توجد رسائل خاصة بعد</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.user_id}
                onClick={() => navigate(`/private/${conv.user_id}`)}
                className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/30 transition-all"
              >
                <div className="relative w-12 h-12 rounded-full bg-muted border-2 border-accent flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {conv.avatar_url ? (
                    <img src={conv.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                  {conv.is_online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 text-right min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-space text-muted-foreground">{conv.last_time}</span>
                    <span className="text-sm font-cairo font-bold text-foreground">{conv.username}</span>
                  </div>
                  <p className="text-xs font-cairo text-muted-foreground truncate">{conv.last_message}</p>
                </div>
                {conv.unread_count > 0 && (
                  <span className="w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                    {conv.unread_count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default PrivateMessages;
