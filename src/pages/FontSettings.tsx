import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const fontSizes = [
  { label: "صغير", value: "small", size: "text-xs" },
  { label: "متوسط", value: "medium", size: "text-sm" },
  { label: "كبير", value: "large", size: "text-base" },
  { label: "كبير جداً", value: "xlarge", size: "text-lg" },
];

const NAME_COLORS = [
  { label: "افتراضي", value: "" },
  { label: "برتقالي", value: "#ff6b00" },
  { label: "أخضر", value: "#22c55e" },
  { label: "أزرق", value: "#3b82f6" },
  { label: "أحمر", value: "#ef4444" },
  { label: "وردي", value: "#ec4899" },
  { label: "ذهبي", value: "#eab308" },
  { label: "بنفسجي", value: "#a855f7" },
  { label: "سماوي", value: "#06b6d4" },
];

const FONT_COLORS = [
  { label: "افتراضي", value: "" },
  { label: "أبيض", value: "#ffffff" },
  { label: "رمادي فاتح", value: "#d1d5db" },
  { label: "برتقالي", value: "#ff6b00" },
  { label: "أخضر", value: "#22c55e" },
  { label: "أزرق", value: "#3b82f6" },
  { label: "أحمر", value: "#ef4444" },
  { label: "وردي", value: "#ec4899" },
  { label: "ذهبي", value: "#eab308" },
  { label: "بنفسجي", value: "#a855f7" },
];

const FONT_STYLES = [
  { label: "عادي", value: "", family: "Cairo, sans-serif" },
  { label: "كلاسيكي", value: "serif", family: "Georgia, 'Times New Roman', serif" },
  { label: "تقني", value: "mono", family: "'Courier New', Consolas, monospace" },
  { label: "مزخرف", value: "cursive", family: "'Segoe Script', cursive" },
  { label: "حديث", value: "sans", family: "system-ui, -apple-system, sans-serif" },
];

const FontSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState(() => localStorage.getItem("chat_font_size") || "medium");
  const [selectedNameColor, setSelectedNameColor] = useState("");
  const [selectedFontColor, setSelectedFontColor] = useState("");
  const [selectedFontStyle, setSelectedFontStyle] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("name_color, font_color, font_style").eq("user_id", user.id).single().then(({ data }) => {
      if ((data as any)?.name_color) setSelectedNameColor((data as any).name_color);
      if ((data as any)?.font_color) setSelectedFontColor((data as any).font_color);
      if ((data as any)?.font_style) setSelectedFontStyle((data as any).font_style);
    });
  }, [user]);

  const handleSave = async () => {
    localStorage.setItem("chat_font_size", selectedSize);
    if (user) {
      await supabase.from("profiles").update({
        name_color: selectedNameColor || null,
        font_color: selectedFontColor || null,
        font_style: selectedFontStyle || null,
      } as any).eq("user_id", user.id);
    }
    toast({ title: "تم الحفظ", description: "تم حفظ إعدادات الخط بنجاح" });
    navigate(-1);
  };

  const currentFontFamily = FONT_STYLES.find(f => f.value === selectedFontStyle)?.family || "Cairo, sans-serif";

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">إعدادات الخط</h1>
        <button onClick={handleSave} className="text-sm font-cairo font-bold text-accent">حفظ</button>
      </div>

      <div className="px-6 py-6 space-y-4">
        <h2 className="text-sm font-cairo font-bold text-foreground mb-3">حجم الخط</h2>
        {fontSizes.map((fs) => (
          <button
            key={fs.value}
            onClick={() => setSelectedSize(fs.value)}
            className={`w-full flex items-center justify-between py-4 px-4 rounded-xl border transition-all ${
              selectedSize === fs.value ? "border-primary bg-primary/10" : "border-border bg-card"
            }`}
          >
            <span className={`font-cairo font-medium text-foreground ${fs.size}`}>{fs.label}</span>
            {selectedSize === fs.value && <span className="text-primary text-lg">✓</span>}
          </button>
        ))}

        <h2 className="text-sm font-cairo font-bold text-foreground mb-3 mt-6">لون الاسم</h2>
        <div className="flex flex-wrap gap-3">
          {NAME_COLORS.map(c => (
            <button
              key={`name-${c.value}`}
              onClick={() => setSelectedNameColor(c.value)}
              className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                selectedNameColor === c.value ? "border-primary scale-110" : "border-border"
              }`}
              style={{ backgroundColor: c.value || "hsl(var(--muted))" }}
            >
              {selectedNameColor === c.value && <Check className="w-4 h-4 text-primary-foreground" />}
            </button>
          ))}
        </div>

        <h2 className="text-sm font-cairo font-bold text-foreground mb-3 mt-6">لون خط الرسائل</h2>
        <div className="flex flex-wrap gap-3">
          {FONT_COLORS.map(c => (
            <button
              key={`font-${c.value}`}
              onClick={() => setSelectedFontColor(c.value)}
              className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                selectedFontColor === c.value ? "border-primary scale-110" : "border-border"
              }`}
              style={{ backgroundColor: c.value || "hsl(var(--muted))" }}
            >
              {selectedFontColor === c.value && <Check className="w-4 h-4 text-primary-foreground" />}
            </button>
          ))}
        </div>

        <h2 className="text-sm font-cairo font-bold text-foreground mb-3 mt-6">شكل الخط</h2>
        <div className="space-y-2">
          {FONT_STYLES.map(fs => (
            <button
              key={fs.value}
              onClick={() => setSelectedFontStyle(fs.value)}
              className={`w-full flex items-center justify-between py-3 px-4 rounded-xl border transition-all ${
                selectedFontStyle === fs.value ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
            >
              <span className="text-sm text-foreground" style={{ fontFamily: fs.family }}>
                {fs.label} - مرحباً بالعالم
              </span>
              {selectedFontStyle === fs.value && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>

        <div className="mt-6 bg-card border border-border rounded-xl p-4">
          <p className="text-sm font-cairo text-muted-foreground mb-2">معاينة:</p>
          <p className="font-bold text-sm mb-1" style={{ color: selectedNameColor || "hsl(var(--foreground))", fontFamily: currentFontFamily }}>
            اسم المستخدم
          </p>
          <p
            className={`${fontSizes.find(f => f.value === selectedSize)?.size}`}
            style={{ color: selectedFontColor || "hsl(var(--foreground))", fontFamily: currentFontFamily }}
          >
            هذا نص تجريبي لمعاينة لون وشكل خط الرسائل 💬
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontSettings;
