import { Reply, AlertCircle } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/data/mockData";

interface Props {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: Props) => {
  return (
    <div
      className={`animate-slide-up border-b border-border/50 px-4 py-3 ${
        message.isOwn ? "bg-card/60" : "bg-background"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Actions - left side */}
        {!message.isOwn && (
          <div className="flex flex-col gap-1 mt-1 opacity-40 hover:opacity-100 transition-opacity">
            <button className="text-muted-foreground hover:text-foreground">
              <Reply className="w-4 h-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <AlertCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-sm font-cairo font-bold ${
                message.isOwn ? "text-primary" : "text-foreground"
              }`}
            >
              {message.username}
            </span>
            {message.country && (
              <span className="text-sm">{message.country}</span>
            )}
          </div>
          <p
            className={`text-sm font-cairo leading-relaxed ${
              message.isOwn ? "text-chat-user" : "text-chat-other"
            }`}
          >
            {message.text}
          </p>
        </div>

        {/* Avatar & Level */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-muted border-2 border-accent flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <span className="text-[10px] font-space font-bold text-accent bg-accent/20 px-2 py-0.5 rounded-full">
            {message.level}
          </span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="flex justify-end mt-1">
        <span
          className={`text-[10px] font-space transition-colors duration-500 ${
            message.isOwn ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
