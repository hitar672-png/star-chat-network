import { Reply, AlertCircle } from "lucide-react";

interface MessageData {
  id: string;
  username: string;
  text: string;
  time: string;
  isOwn: boolean;
  level: number;
  country?: string;
  gender?: string;
  avatarUrl?: string | null;
  nameColor?: string | null;
}

interface Props {
  message: MessageData;
  onAvatarClick?: () => void;
}

const ChatMessage = ({ message, onAvatarClick }: Props) => {
  return (
    <div
      className={`animate-slide-up border-b border-border/50 px-4 py-3 ${
        message.isOwn ? "bg-card/60" : "bg-background"
      }`}
    >
      <div className="flex items-start gap-3">
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

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-sm font-cairo font-bold"
              style={{
                color: message.nameColor || (message.isOwn ? "hsl(var(--primary))" : message.gender === "female" ? "hsl(var(--primary))" : "hsl(var(--foreground))"),
              }}
            >
              {message.username}
            </span>
            {message.country && <span className="text-sm">{message.country}</span>}
            {message.gender && (
              <span className="text-[10px] text-muted-foreground">
                {message.gender === "male" ? "♂" : "♀"}
              </span>
            )}
          </div>
          <p className={`text-sm font-cairo leading-relaxed ${message.isOwn ? "text-chat-user" : "text-chat-other"}`}>
            {message.text}
          </p>
        </div>

        <button onClick={onAvatarClick} className="flex flex-col items-center gap-1">
          <div className={`w-12 h-12 rounded-full bg-muted border-2 ${message.gender === "female" ? "border-primary" : "border-accent"} flex items-center justify-center overflow-hidden`}>
            {message.avatarUrl ? (
              <img src={message.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg">👤</span>
            )}
          </div>
          <span className="text-[10px] font-space font-bold text-accent bg-accent/20 px-2 py-0.5 rounded-full">
            {message.level}
          </span>
        </button>
      </div>

      <div className="flex justify-end mt-1">
        <span className={`text-[10px] font-space ${message.isOwn ? "text-foreground" : "text-muted-foreground"}`}>
          {message.time}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
