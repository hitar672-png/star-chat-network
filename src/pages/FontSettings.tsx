import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const fontSizes = [
  { label: "صغير", value: "small", size: "text-xs" },
  { label: "متوسط", value: "medium", size: "text-sm" },
  { label: "كبير", value: "large", size: "text-base" },
  { label: "كبير جداً", value: "xlarge", size: "text-lg" },
];

const FontSettings = () => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("medium");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">إعدادات الخط</h1>
        <div className="w-6" />
      </div>

      <div className="px-6 py-6 space-y-4">
        <h2 className="text-sm font-cairo font-bold text-foreground mb-3">حجم الخط</h2>
        {fontSizes.map((fs) => (
          <button
            key={fs.value}
            onClick={() => setSelectedSize(fs.value)}
            className={`w-full flex items-center justify-between py-4 px-4 rounded-xl border transition-all ${
              selectedSize === fs.value
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            }`}
          >
            <span className={`font-cairo font-medium text-foreground ${fs.size}`}>{fs.label}</span>
            {selectedSize === fs.value && (
              <span className="text-primary text-lg">✓</span>
            )}
          </button>
        ))}

        <div className="mt-6 bg-card border border-border rounded-xl p-4">
          <p className="text-sm font-cairo text-muted-foreground mb-2">معاينة:</p>
          <p className={`font-cairo text-foreground ${fontSizes.find(f => f.value === selectedSize)?.size}`}>
            هذا نص تجريبي لمعاينة حجم الخط المحدد في الدردشة 💬
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontSettings;
