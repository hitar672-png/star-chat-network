import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Camera, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [age, setAge] = useState(profile?.age?.toString() || "");
  const [nameColor, setNameColor] = useState(
    (profile as any)?.name_color || ""
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile?.avatar_url || null
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 2 ميجابايت");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      let avatarUrl = profile?.avatar_url || null;

      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `${user.id}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: username.trim() || profile?.username,
          bio: bio.trim() || null,
          age: age ? parseInt(age) : null,
          avatar_url: avatarUrl,
          name_color: nameColor || null,
        } as any)
        .eq("user_id", user.id);

      if (error) throw error;

      await refreshProfile();
      toast.success("تم تحديث الملف الشخصي");
      navigate("/profile");
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-muted-foreground">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-foreground">
          تعديل الملف الشخصي
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-primary disabled:opacity-50"
        >
          <Check className="w-6 h-6" />
        </button>
      </div>

      {/* Avatar */}
      <div className="flex justify-center py-8">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="relative"
        >
          <div className="w-28 h-28 rounded-full bg-muted border-4 border-primary flex items-center justify-center overflow-hidden">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl">👤</span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2">
            <Camera className="w-4 h-4" />
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Form */}
      <div className="px-6 space-y-5">
        <div>
          <label className="text-sm font-cairo font-bold text-foreground mb-2 block">
            الاسم
          </label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="font-cairo"
            dir="rtl"
            maxLength={20}
          />
        </div>

        <div>
          <label className="text-sm font-cairo font-bold text-foreground mb-2 block">
            العمر
          </label>
          <Input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="font-cairo"
            min={13}
            max={99}
          />
        </div>

        <div>
          <label className="text-sm font-cairo font-bold text-foreground mb-2 block">
            نبذة عنك
          </label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="font-cairo"
            dir="rtl"
            rows={3}
            maxLength={150}
            placeholder="اكتب شيئاً عن نفسك..."
          />
        </div>

        {/* Name Color */}
        <div>
          <label className="text-sm font-cairo font-bold text-foreground mb-3 block">
            لون الاسم في الدردشة
          </label>
          <div className="flex flex-wrap gap-3">
            {NAME_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setNameColor(c.value)}
                className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                  nameColor === c.value
                    ? "border-primary scale-110"
                    : "border-border"
                }`}
                style={{
                  backgroundColor: c.value || "hsl(var(--muted))",
                }}
              >
                {nameColor === c.value && (
                  <Check className="w-4 h-4 text-primary-foreground" />
                )}
              </button>
            ))}
          </div>
          {/* Preview */}
          <div className="mt-3 bg-card rounded-xl p-3 border border-border">
            <span className="text-xs font-cairo text-muted-foreground">
              معاينة:{" "}
            </span>
            <span
              className="text-sm font-cairo font-bold"
              style={{ color: nameColor || "hsl(var(--foreground))" }}
            >
              {username || "اسمك"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
