import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopToolbar from "@/components/TopToolbar";
import BottomNav from "@/components/BottomNav";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeBanner from "@/components/WelcomeBanner";
import UserProfileModal from "@/components/UserProfileModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

interface MessageWithProfile {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  room_id: string;
  profiles: Tables<"profiles"> | null;
}

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [roomName, setRoomName] = useState("الغرفة العامة");
  const [selectedUser, setSelectedUser] = useState<Tables<"profiles"> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId) return;

    // Fetch room name
    supabase.from("rooms").select("name").eq("id", roomId).single().then(({ data }) => {
      if (data) setRoomName(data.name);
    });

    // Fetch messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*, profiles!inner(*)")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) setMessages(data as unknown as MessageWithProfile[]);
    };
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        async (payload) => {
          const { data } = await supabase
            .from("messages")
            .select("*, profiles!messages_user_id_fkey(*)")
            .eq("id", payload.new.id)
            .single();
          if (data) {
            setMessages((prev) => [...prev, data as unknown as MessageWithProfile]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!user || !roomId) return;
    await supabase.from("messages").insert({
      room_id: roomId,
      user_id: user.id,
      text,
    });
  };

  const handleAvatarClick = (profile: Tables<"profiles"> | null) => {
    if (profile && profile.user_id !== user?.id) {
      setSelectedUser(profile);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopToolbar roomName={roomName} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide pb-36">
        <WelcomeBanner />
        <div className="mt-2">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={{
                id: msg.id,
                username: msg.profiles?.username || "مجهول",
                text: msg.text,
                time: new Date(msg.created_at).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
                isOwn: msg.user_id === user?.id,
                level: msg.profiles?.level || 1,
                country: msg.profiles?.country || undefined,
                gender: msg.profiles?.gender || undefined,
              }}
              onAvatarClick={() => handleAvatarClick(msg.profiles)}
            />
          ))}
        </div>
      </div>

      <ChatInput onSend={handleSend} />
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

export default ChatRoom;
