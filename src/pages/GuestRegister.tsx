import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const GuestRegister = () => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("يرجى إدخال اسم المستخدم");
      return;
    }
    if (!age || parseInt(age) < 13 || parseInt(age) > 100) {
      toast.error("يرجى إدخال عمر صحيح (13-100)");
      return;
    }
    setLoading(true);
    try {
      const guestEmail = `guest_${Date.now()}@globalchat.app`;
      const guestPassword = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      await signUp(guestEmail, guestPassword, {
        username: username.trim(),
        age: parseInt(age),
        gender,
      });
      toast.success("مرحباً بك! جاري الدخول...");
      navigate("/rooms");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">👤</span>
          <h1 className="text-2xl font-cairo font-bold text-foreground">دخول كزائر</h1>
          <p className="text-sm font-cairo text-muted-foreground mt-1">أدخل بياناتك للمتابعة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm font-cairo text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            dir="rtl"
            required
            maxLength={20}
          />
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="العمر"
            min="13"
            max="100"
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm font-cairo text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            dir="rtl"
            required
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setGender("male")}
              className={`flex-1 py-3 rounded-xl text-sm font-cairo font-bold transition-all ${
                gender === "male"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              ♂ ذكر
            </button>
            <button
              type="button"
              onClick={() => setGender("female")}
              className={`flex-1 py-3 rounded-xl text-sm font-cairo font-bold transition-all ${
                gender === "female"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              ♀ أنثى
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground font-cairo font-bold py-3 rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50"
          >
            {loading ? "جاري الدخول..." : "🌐 دخول الآن"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-sm font-cairo text-muted-foreground hover:text-foreground transition-colors"
        >
          العودة لتسجيل الدخول
        </button>
      </motion.div>
    </div>
  );
};

export default GuestRegister;
