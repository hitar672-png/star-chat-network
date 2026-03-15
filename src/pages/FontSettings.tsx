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

const FONT_COLORS = [
  { label: "افتراضي", value: "" },
  { label: "أبيض", value: "#ffffff" },
  { label: "برتقالي", value: "#ff6b00" },
  { label: "أخضر", value: "#22c55e" },
  { label: "أزرق", value: "#3b82f6" },
  { label: "أحمر", value: "#ef4444" },
  { label: "وردي", value: "#ec4899" },
  { label: "ذهبي", value: "#eab308" },
  { label: "بنفسجي", value: "#a855f7" },
  { label: "سماوي", value: "#06b6d4" },
];

const FontSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState(() => localStorage.getItem("chat_font_size") || "medium");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("name_color").eq("user_id", user.id).single().then(({ data }) => {
      if (data?.name_color) setSelectedColor(data.name_color);
    });
  }, [user]);

  const handleSave = async () => {
    localStorage.setItem("chat_font_size", selectedSize);
    if (user) {
      await supabase.from("profiles").update({ name_color: selectedColor || null }).eq("user_id", user.id);
    }
    toast({ title: "تم الحفظ", description: "تم حفظ إعدادات الخط بنجاح" });
    navigate(-1);
  };

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

        <h2 className="text-sm font-cairo font-bold text-foreground mb-3 mt-6">لون الخط في الدردشة</h2>
        <div className="flex flex-wrap gap-3">
          {FONT_COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => setSelectedColor(c.value)}
              className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                selectedColor === c.value ? "border-primary scale-110" : "border-border"
              }`}
              style={{ backgroundColor: c.value || "hsl(var(--muted))" }}
            >
              {selectedColor === c.value && <Check className="w-4 h-4 text-primary-foreground" />}
            </button>
          ))}
        </div>

        <div className="mt-6 bg-card border border-border rounded-xl p-4">
          <p className="text-sm font-cairo text-muted-foreground mb-2">معاينة:</p>
          <p
            className={`font-cairo ${fontSizes.find(f => f.value === selectedSize)?.size}`}
            style={{ color: selectedColor || "hsl(var(--foreground))" }}
          >
            هذا نص تجريبي لمعاينة حجم ولون الخط المحدد في الدردشة 💬
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontSettings;
