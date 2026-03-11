import { X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const SearchUsers = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Tables<"profiles">[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `%${query.trim()}%`)
      .limit(20);
    setResults(data || []);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">بحث</h1>
        <div className="w-6" />
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="ابحث عن مستخدم..."
            className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-sm font-cairo text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            dir="rtl"
          />
          <button
            onClick={handleSearch}
            className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {searched && results.length === 0 && (
          <p className="text-center text-sm font-cairo text-muted-foreground py-8">لا توجد نتائج</p>
        )}

        <div className="space-y-2">
          {results.map((u) => (
            <button
              key={u.id}
              onClick={() => navigate(`/user/${u.user_id}`)}
              className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/30 transition-all"
            >
              <div className={`w-12 h-12 rounded-full bg-muted border-2 ${u.gender === "female" ? "border-primary" : "border-accent"} flex items-center justify-center flex-shrink-0`}>
                <span className="text-lg">👤</span>
              </div>
              <div className="flex-1 text-right">
                <span className="text-sm font-cairo font-bold text-foreground">{u.username}</span>
                <p className="text-xs font-cairo text-muted-foreground">
                  {u.gender === "male" ? "♂ ذكر" : "♀ أنثى"} • مستوى {u.level}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default SearchUsers;
