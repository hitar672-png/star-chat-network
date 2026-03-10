import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        if (!username.trim()) {
          toast.error("يرجى إدخال اسم المستخدم");
          return;
        }
        if (!age || parseInt(age) < 13 || parseInt(age) > 100) {
          toast.error("يرجى إدخال عمر صحيح (13-100)");
          return;
        }
        await signUp(email, password, { username: username.trim(), age: parseInt(age), gender });
        toast.success("تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني");
      } else {
        await signIn(email, password);
        toast.success("تم تسجيل الدخول بنجاح!");
        navigate("/rooms");
      }
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEntry = async () => {
    navigate("/guest-register");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">🌍</span>
          <h1 className="text-2xl font-cairo font-bold text-foreground">شات عالمي</h1>
          <p className="text-sm font-cairo text-muted-foreground mt-1">
            {isSignUp ? "إنشاء حساب جديد" : "تسجيل الدخول"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="اسم المستخدم"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm font-cairo text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                dir="rtl"
                required
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
            </>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm font-cairo text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            dir="ltr"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm font-cairo text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            dir="ltr"
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-secondary-foreground font-cairo font-bold py-3 rounded-xl hover:bg-secondary/90 transition-all disabled:opacity-50"
          >
            {loading ? "جاري التحميل..." : isSignUp ? "إنشاء حساب" : "تسجيل الدخول"}
          </button>
        </form>

        <button
          onClick={handleGuestEntry}
          className="w-full mt-3 bg-accent text-accent-foreground font-cairo font-bold py-3 rounded-xl hover:bg-accent/90 transition-all"
        >
          🌐 دخول كزائر
        </button>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-4 text-sm font-cairo text-muted-foreground hover:text-foreground transition-colors"
        >
          {isSignUp ? "لديك حساب؟ تسجيل الدخول" : "ليس لديك حساب؟ إنشاء حساب جديد"}
        </button>
      </motion.div>
    </div>
  );
};

export default Auth;
