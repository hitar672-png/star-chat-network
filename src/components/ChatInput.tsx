import { Send, Smile } from "lucide-react";
import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
}

const ChatInput = ({ onSend }: Props) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <div className="fixed bottom-14 left-0 right-0 glass-panel border-t border-border px-3 py-2 z-40">
      {/* Subscribe banner */}
      <button className="w-full bg-accent text-accent-foreground text-sm font-cairo font-bold py-2 rounded-lg mb-2 hover:bg-accent/90 transition-colors">
        💚 أكمل الاشتراك بالضغط هنا
      </button>
      
      <div className="flex items-center gap-2">
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
          placeholder="اكتب هنا..."
          className="flex-1 bg-muted border border-border rounded-full px-4 py-2 text-sm font-cairo text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          dir="rtl"
        />
        <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
          <Smile className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
