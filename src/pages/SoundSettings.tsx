import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const soundSettings = [
  { label: "صوت العام", key: "public" },
  { label: "صوت الخاص", key: "private" },
  { label: "صوت الاشعارات", key: "notifications" },
  { label: "صوت الضغط على الاسم", key: "nameClick" },
  { label: "أصوات المكالمة", key: "calls" },
];

const SoundSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Record<string, boolean>>({
    public: true,
    private: true,
    notifications: true,
    nameClick: true,
    calls: true,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">إعدادات الصوت</h1>
        <div className="w-6" />
      </div>

      <div className="px-6 py-4">
        {soundSettings.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-4 border-b border-border"
          >
            <Switch
              checked={settings[item.key]}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, [item.key]: checked }))
              }
            />
            <span className="text-sm font-cairo font-medium text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoundSettings;
