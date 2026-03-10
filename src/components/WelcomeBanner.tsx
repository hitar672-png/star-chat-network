import { X, ExternalLink } from "lucide-react";
import { useState } from "react";

const WelcomeBanner = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-secondary/20 border border-secondary/30 rounded-lg mx-4 mt-2 p-4 relative animate-slide-up">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 left-2 text-muted-foreground hover:text-foreground"
      >
        <X className="w-5 h-5" />
      </button>
      <p className="text-xs font-cairo text-secondary leading-relaxed mb-2 text-right">
        تذكّر قوله تعالى: ﴿مَا يَلْفِظُ مِنْ قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ﴾ صدق الله العظيم.
      </p>
      <div className="border-t border-border/50 my-2" />
      <p className="text-xs font-cairo text-muted-foreground leading-relaxed text-right">
        أهلا بك 😊 في أكبر دردشة تفاعلية في الوطن العربي 🌍 نحن نحرص في تطبيقنا على إثراء الدردشة 💬 بمعلومات قيمة ومفيدة
      </p>
      <button className="mt-3 flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 text-xs font-cairo text-foreground hover:bg-muted transition-colors mr-auto">
        <ExternalLink className="w-3 h-3" />
        قوانين UGC
      </button>
    </div>
  );
};

export default WelcomeBanner;
