import { useState } from "react";

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
  onClose: () => void;
}

const EmojiPicker = ({ onSelect, onClose }: Props) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="absolute bottom-full mb-2 left-0 right-0 bg-card border border-border rounded-2xl shadow-lg z-50 max-h-64 overflow-hidden animate-slide-up">
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
            onClick={() => { onSelect(emoji); onClose(); }}
            className="text-xl hover:bg-muted rounded-lg p-1 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
