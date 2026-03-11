import { X, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const Levels = () => {
  const navigate = useNavigate();
  const [topUsers, setTopUsers] = useState<Tables<"profiles">[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("level", { ascending: false })
        .limit(20);
      if (data) setTopUsers(data);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">المستويات</h1>
        <div className="w-6" />
      </div>

      <div className="px-4 py-4 space-y-2">
        {topUsers.map((u, i) => (
          <button
            key={u.id}
            onClick={() => navigate(`/user/${u.user_id}`)}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/30 transition-all"
          >
            <span className={`text-lg font-space font-bold w-8 text-center ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>
              {i + 1}
            </span>
            <div className={`w-10 h-10 rounded-full bg-muted border-2 ${u.gender === "female" ? "border-primary" : "border-accent"} flex items-center justify-center flex-shrink-0`}>
              <span className="text-sm">👤</span>
            </div>
            <div className="flex-1 text-right">
              <span className="text-sm font-cairo font-bold text-foreground">{u.username}</span>
            </div>
            <span className="text-xs font-space font-bold bg-accent/20 text-accent px-3 py-1 rounded-full">
              Lv.{u.level}
            </span>
          </button>
        ))}
        {topUsers.length === 0 && (
          <div className="text-center py-16">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-cairo text-muted-foreground">لا توجد بيانات بعد</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Levels;
