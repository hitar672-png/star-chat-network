import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Send, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && user && !showSplash) {
      navigate("/rooms");
    }
  }, [user, loading, navigate, showSplash]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{
              backgroundImage: "url('/splash.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <motion.img
              src="/favicon.png"
              alt="شات عالمي"
              className="w-24 h-24 mb-6 rounded-2xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-cairo font-bold text-white mb-2"
            >
              شات عالمي
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-sm font-cairo text-white/70"
            >
              أكبر دردشة تفاعلية في الوطن العربي
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <motion.img
          src="/favicon.png"
          alt="شات عالمي"
          className="w-20 h-20 mb-6 rounded-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl font-cairo font-bold text-foreground mb-2">شات عالمي</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-sm font-cairo text-muted-foreground text-center max-w-xs">أكبر دردشة تفاعلية في الوطن العربي</motion.p>
      </div>

      <div className="px-6 pb-8 space-y-3">
        <motion.button initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} onClick={() => navigate("/guest-register")} className="w-full flex items-center justify-center gap-3 bg-accent text-accent-foreground font-cairo font-bold text-lg py-4 rounded-xl hover:bg-accent/90 transition-all">
          <span>دخول كزائر</span>
          <Cloud className="w-6 h-6" />
        </motion.button>

        <motion.button initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} onClick={() => navigate("/auth")} className="w-full flex items-center justify-center gap-3 bg-secondary text-secondary-foreground font-cairo font-bold text-lg py-4 rounded-xl hover:bg-secondary/90 transition-all">
          <span>تسجيل الدخول</span>
          <Send className="w-6 h-6" />
        </motion.button>

        <motion.button initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} onClick={() => navigate("/auth")} className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground font-cairo font-bold text-lg py-4 rounded-xl hover:bg-primary/90 transition-all">
          <span>إنشاء حساب جديد</span>
          <UserPlus className="w-6 h-6" />
        </motion.button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mx-6 mb-6 bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-cairo font-bold text-primary text-center mb-2">ـ شروط UGC ـ</h3>
        <p className="text-xs font-cairo text-muted-foreground text-center leading-relaxed">المحتوى الهادف والمفيد يساعد المشتركين للحصول على المزيد من الأفكار والخبرات، في حال مخالفتك لسياسة التطبيق سيتم حظرك نهائياً</p>
      </motion.div>
    </div>
  );
};

export default Landing;
