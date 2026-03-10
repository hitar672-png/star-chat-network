import { useState, useRef, useEffect } from "react";
import TopToolbar from "@/components/TopToolbar";
import BottomNav from "@/components/BottomNav";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeBanner from "@/components/WelcomeBanner";
import { mockMessages, ChatMessage as ChatMessageType } from "@/data/mockData";

const ChatRoom = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>(mockMessages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string) => {
    const newMsg: ChatMessageType = {
      id: Date.now().toString(),
      username: "أنت",
      text,
      time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
      level: 7,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopToolbar />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-hide pb-36"
      >
        <WelcomeBanner />

        <div className="mt-2">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      </div>

      <ChatInput onSend={handleSend} />
      <BottomNav />
    </div>
  );
};

export default ChatRoom;
