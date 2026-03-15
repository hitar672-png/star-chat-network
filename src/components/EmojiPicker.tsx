import { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";

const EMOJI_CATEGORIES = [
  {
    label: "وجوه",
    emojis: ["😀","😂","🤣","😍","😘","🥰","😊","😎","🤩","😇","🤗","🤔","😏","😢","😭","😡","🥺","😴","🤮","🤯","😱","🥳","😈","👻","💀","🤡","👽","🤖","💩"]
  },
  {
    label: "إيماءات",
    emojis: ["👍","👎","👋","🤝","🙏","💪","✌️","🤞","👌","🫶","❤️","💔","💕","💖","🔥","⭐","✨","💫","🎉","🎊","🏆","👑","💎","🌹","🌺"]
  },
  {
    label: "أعلام",
    emojis: ["🇾🇪","🇮🇶","🇸🇾","🇱🇧","🇶🇦","🇸🇦","🇪🇬","🇦🇪","🇯🇴","🇰🇼","🇧🇭","🇴🇲","🇲🇦","🇹🇳","🇩🇿","🇱🇾","🇸🇩","🇵🇸"]
  },
];

interface Props {
  onSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onSelect }: Props) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
      >
        <Smile className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 left-0 w-72 bg-card border border-border rounded-2xl shadow-lg z-50 max-h-64 overflow-hidden animate-slide-up">
          <div className="flex border-b border-border">
            {EMOJI_CATEGORIES.map((cat, i) => (
              <button
                key={cat.label}
                onClick={() => setActiveTab(i)}
                className={`flex-1 py-2 text-xs font-cairo font-bold transition-colors ${
                  activeTab === i ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="p-3 grid grid-cols-8 gap-1 overflow-y-auto max-h-44 scrollbar-hide">
            {EMOJI_CATEGORIES[activeTab].emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => { onSelect(emoji); setOpen(false); }}
                className="text-xl hover:bg-muted rounded-lg p-1 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
