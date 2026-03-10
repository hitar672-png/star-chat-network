import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PrivateMsg {
  id: string;
  text: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  is_read: boolean;
}

const PrivateChat = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<PrivateMsg[]>([]);
  const [text, setText] = useState("");
  const [partnerName, setPartnerName] = useState("...");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId || !user) return;

    supabase.from("profiles").select("username").eq("user_id", userId).single().then(({ data }) => {
      if (data) setPartnerName(data.username);
    });

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("private_messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);

      // Mark as read
      await supabase
        .from("private_messages")
        .update({ is_read: true })
        .eq("sender_id", userId)
        .eq("receiver_id", user.id)
        .eq("is_read", false);
    };
    fetchMessages();

    const channel = supabase
      .channel(`private-${user.id}-${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "private_messages" },
        (payload) => {
          const msg = payload.new as PrivateMsg;
          if (
            (msg.sender_id === user.id && msg.receiver_id === userId) ||
            (msg.sender_id === userId && msg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, user]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !user || !userId) return;
    await supabase.from("private_messages").insert({
      sender_id: user.id,
      receiver_id: userId,
      text: text.trim(),
    });
    setText("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/private")} className="text-secondary-foreground">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">{partnerName}</h1>
        <div className="w-12 h-12 rounded-full bg-muted border-2 border-accent flex items-center justify-center">
          <span className="text-lg">👤</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex ${msg.sender_id === user?.id ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.sender_id === user?.id
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-card border border-border text-foreground"
              }`}
            >
              <p className="text-sm font-cairo">{msg.text}</p>
              <span className="text-[10px] font-space text-muted-foreground block mt-1">
                {new Date(msg.created_at).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border px-3 py-2 flex items-center gap-2">
        <button
          onClick={handleSend}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-secondary/80 transition-colors flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="اكتب رسالتك..."
          className="flex-1 bg-muted border border-border rounded-full px-4 py-2 text-sm font-cairo text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          dir="rtl"
        />
      </div>
    </div>
  );
};

export default PrivateChat;
