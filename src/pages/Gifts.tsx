import { ArrowRight, Gift, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";

const GIFT_TYPES = [
  { type: "rose", name: "وردة", icon: "🌹" },
  { type: "heart", name: "قلب", icon: "❤️" },
  { type: "star", name: "نجمة", icon: "⭐" },
  { type: "diamond", name: "ماسة", icon: "💎" },
  { type: "crown", name: "تاج", icon: "👑" },
  { type: "cake", name: "كعكة", icon: "🎂" },
  { type: "teddy", name: "دبدوب", icon: "🧸" },
  { type: "chocolate", name: "شوكولاتة", icon: "🍫" },
  { type: "ring", name: "خاتم", icon: "💍" },
  { type: "bouquet", name: "باقة ورد", icon: "💐" },
  { type: "kiss", name: "قبلة", icon: "💋" },
  { type: "coffee", name: "قهوة", icon: "☕" },
];

interface GiftRecord {
  id: string;
  sender_id: string;
  receiver_id: string;
  gift_type: string;
  gift_name: string;
  gift_icon: string;
  created_at: string;
  sender_name?: string;
  receiver_name?: string;
}

const Gifts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [gifts, setGifts] = useState<GiftRecord[]>([]);
  const [showSend, setShowSend] = useState(false);
  const [targetUsername, setTargetUsername] = useState("");
  const [selectedGift, setSelectedGift] = useState<typeof GIFT_TYPES[0] | null>(null);
  const [sending, setSending] = useState(false);

  const fetchGifts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("gifts" as any)
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    if (!data) return;

    const userIds = [...new Set((data as any[]).flatMap((g: any) => [g.sender_id, g.receiver_id]))];
    const { data: profiles } = await supabase.from("profiles").select("user_id, username").in("user_id", userIds);
    const nameMap: Record<string, string> = {};
    profiles?.forEach(p => { nameMap[p.user_id] = p.username; });

    setGifts((data as any[]).map((g: any) => ({
      ...g,
      sender_name: nameMap[g.sender_id] || "مجهول",
      receiver_name: nameMap[g.receiver_id] || "مجهول",
    })));
  };

  useEffect(() => { fetchGifts(); }, [user]);

  const handleSendGift = async () => {
    if (!user || !selectedGift || !targetUsername.trim()) return;
    setSending(true);
    const { data: target } = await supabase.from("profiles").select("user_id").eq("username", targetUsername.trim()).maybeSingle();
    if (!target) {
      setSending(false);
      return alert("المستخدم غير موجود");
    }
    await supabase.from("gifts" as any).insert({
      sender_id: user.id,
      receiver_id: target.user_id,
      gift_type: selectedGift.type,
      gift_name: selectedGift.name,
      gift_icon: selectedGift.icon,
    });
    setSending(false);
    setShowSend(false);
    setTargetUsername("");
    setSelectedGift(null);
    fetchGifts();
  };

  const filtered = gifts.filter(g =>
    tab === "received" ? g.receiver_id === user?.id : g.sender_id === user?.id
  );

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">الهدايا</h1>
        <button onClick={() => setShowSend(true)} className="text-accent">
          <Send className="w-5 h-5" />
        </button>
      </div>

      <div className="flex border-b border-border">
        <button onClick={() => setTab("received")} className={`flex-1 py-3 text-sm font-cairo font-bold text-center ${tab === "received" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
          المستلمة ({gifts.filter(g => g.receiver_id === user?.id).length})
        </button>
        <button onClick={() => setTab("sent")} className={`flex-1 py-3 text-sm font-cairo font-bold text-center ${tab === "sent" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
          المرسلة ({gifts.filter(g => g.sender_id === user?.id).length})
        </button>
      </div>

      <div className="flex-1 px-4 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Gift className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-sm font-cairo text-muted-foreground">لا توجد هدايا بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(g => (
              <div key={g.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                <span className="text-3xl">{g.gift_icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-cairo font-bold text-foreground">{g.gift_name}</p>
                  <p className="text-xs font-cairo text-muted-foreground">
                    {tab === "received" ? `من ${g.sender_name}` : `إلى ${g.receiver_name}`}
                  </p>
                </div>
                <span className="text-[10px] font-space text-muted-foreground">
                  {new Date(g.created_at).toLocaleDateString("ar-EG")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Gift Modal */}
      {showSend && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={() => setShowSend(false)}>
          <div className="bg-card w-full max-w-md rounded-t-2xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-cairo font-bold text-foreground text-center">إرسال هدية</h3>
            <input
              type="text"
              placeholder="اسم المستخدم المستلم"
              value={targetUsername}
              onChange={e => setTargetUsername(e.target.value)}
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm font-cairo text-foreground placeholder:text-muted-foreground"
              dir="rtl"
            />
            <div className="grid grid-cols-4 gap-3">
              {GIFT_TYPES.map(g => (
                <button
                  key={g.type}
                  onClick={() => setSelectedGift(g)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                    selectedGift?.type === g.type ? "border-primary bg-primary/10" : "border-border"
                  }`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <span className="text-[10px] font-cairo text-muted-foreground">{g.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleSendGift}
              disabled={!selectedGift || !targetUsername.trim() || sending}
              className="w-full bg-primary text-primary-foreground font-cairo font-bold py-3 rounded-xl disabled:opacity-50"
            >
              {sending ? "جاري الإرسال..." : "إرسال"}
            </button>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default Gifts;
