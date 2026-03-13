import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, UserPlus } from "lucide-react";

const UpgradeAccount = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isGuest = user?.email?.includes("@globalchat.app");

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    setLoading(true);
    try {
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) throw emailError;

      const { error: passError } = await supabase.auth.updateUser({ password });
      if (passError) throw passError;

      toast.success("تم ترقية حسابك بنجاح! تحقق من بريدك الإلكتروني لتأكيد التغيير");
      navigate("/rooms");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الترقية");
    } finally {
      setLoading(false);
    }
  };

  if (!isGuest) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="text-6xl mb-4 block">✅</span>
          <h1 className="text-xl font-cairo font-bold text-foreground mb-2">أنت عضو بالفعل!</h1>
          <p className="text-sm font-cairo text-muted-foreground mb-6">حسابك مسجل ببريد إلكتروني حقيقي</p>
          <button onClick={() => navigate(-1)} className="bg-secondary text-secondary-foreground font-cairo font-bold py-3 px-8 rounded-xl">
            <ArrowRight className="w-4 h-4 inline ml-2" />
            العودة
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">⭐</span>
          <h1 className="text-2xl font-cairo font-bold text-foreground">ترقية إلى عضو</h1>
          <p className="text-sm font-cairo text-muted-foreground mt-2">
            سجل بريدك الإلكتروني وكلمة مرور لتحويل حسابك من زائر إلى عضو دائم
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h3 className="text-sm font-cairo font-bold text-foreground mb-3">مميزات العضوية:</h3>
          <ul className="space-y-2 text-sm font-cairo text-muted-foreground" dir="rtl">
            <li>✅ حفظ حسابك بشكل دائم</li>
            <li>✅ تسجيل الدخول من أي جهاز</li>
            <li>✅ استعادة الحساب عند الحاجة</li>
            <li>✅ ميزات إضافية حصرية</li>
          </ul>
        </div>

        <form onSubmit={handleUpgrade} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني الجديد"
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm font-cairo text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            dir="ltr"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور الجديدة"
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm font-cairo text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            dir="ltr"
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground font-cairo font-bold py-3 rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? "جاري الترقية..." : "ترقية الحساب"}
          </button>
        </form>

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-4 text-sm font-cairo text-muted-foreground hover:text-foreground transition-colors"
        >
          العودة
        </button>
      </motion.div>
    </div>
  );
};

export default UpgradeAccount;
