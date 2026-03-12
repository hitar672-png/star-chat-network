import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import RoomCard from "@/components/RoomCard";
import TopToolbar from "@/components/TopToolbar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeBanner from "@/components/WelcomeBanner";
import UserProfileModal from "@/components/UserProfileModal";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, List } from "lucide-react";

const PUBLIC_ROOM_ID = "c4e3b9ac-aa54-4eb7-b992-d1e22e0fc74a";

interface MessageWithProfile {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  room_id: string;
  profile?: Tables<"profiles"> | null;
}

const Rooms = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"chat" | "rooms">("chat");
  const [rooms, setRooms] = useState<Tables<"rooms">[]>([]);
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Tables<"profiles"> | null>(null);
  const [profilesCache, setProfilesCache] = useState<Record<string, Tables<"profiles">>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchProfile = async (userId: string): Promise<Tables<"profiles"> | null> => {
    if (profilesCache[userId]) return profilesCache[userId];
    const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
    if (data) {
      setProfilesCache((prev) => ({ ...prev, [userId]: data }));
    }
    return data;
  };

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase
        .from("rooms")
        .select("*")
        .order("is_pinned", { ascending: false });
      if (data) setRooms(data);
    };
    fetchRooms();
  }, []);

  // Fetch public chat messages
  useEffect(() => {
    if (activeTab !== "chat") return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", PUBLIC_ROOM_ID)
        .order("created_at", { ascending: true })
        .limit(100);

      if (!data) return;

      const userIds = [...new Set(data.map((m) => m.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", userIds);

      const profileMap: Record<string, Tables<"profiles">> = {};
      profiles?.forEach((p) => { profileMap[p.user_id] = p; });
      setProfilesCache((prev) => ({ ...prev, ...profileMap }));
      setMessages(data.map((m) => ({ ...m, profile: profileMap[m.user_id] || null })));
    };
    fetchMessages();

    const channel = supabase
      .channel(`room-public`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${PUBLIC_ROOM_ID}` },
        async (payload) => {
          const msg = payload.new as Tables<"messages">;
          const profile = await fetchProfile(msg.user_id);
          setMessages((prev) => [...prev, { ...msg, profile }]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeTab]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!user) return;
    await supabase.from("messages").insert({
      room_id: PUBLIC_ROOM_ID,
      user_id: user.id,
      text,
    });
  };

  const handleAvatarClick = (profile: Tables<"profiles"> | null | undefined) => {
    if (profile && profile.user_id !== user?.id) {
      setSelectedUser(profile);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopToolbar roomName={activeTab === "chat" ? "الدردشة العامة" : undefined} />

      {/* Tabs */}
      <div className="flex border-b border-border bg-card sticky top-[auto] z-40">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 font-cairo font-bold text-sm transition-all ${
            activeTab === "chat"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>الدردشة العامة</span>
        </button>
        <button
          onClick={() => setActiveTab("rooms")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 font-cairo font-bold text-sm transition-all ${
            activeTab === "rooms"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <List className="w-4 h-4" />
          <span>الغرف</span>
        </button>
      </div>

      {activeTab === "chat" ? (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide pb-36">
            <WelcomeBanner />
            <div className="mt-2">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={{
                    id: msg.id,
                    username: msg.profile?.username || "مجهول",
                    text: msg.text,
                    time: new Date(msg.created_at).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
                    isOwn: msg.user_id === user?.id,
                    level: msg.profile?.level || 1,
                    country: msg.profile?.country || undefined,
                    gender: msg.profile?.gender || undefined,
                  }}
                  onAvatarClick={() => handleAvatarClick(msg.profile)}
                />
              ))}
            </div>
          </div>
          <ChatInput onSend={handleSend} />
        </>
      ) : (
        <div className="flex-1 px-4 py-4 space-y-3 pb-20">
          {rooms.map((room, i) => (
            <div key={room.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <RoomCard
                room={{
                  id: room.id,
                  name: room.name,
                  description: room.description || "",
                  image: room.image || "🌍",
                  onlineCount: 0,
                  isPinned: room.is_pinned,
                }}
                onClick={() => navigate(`/chat/${room.id}`)}
              />
            </div>
          ))}
        </div>
      )}

      <BottomNav />

      {selectedUser && (
        <UserProfileModal
          profile={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default Rooms;
