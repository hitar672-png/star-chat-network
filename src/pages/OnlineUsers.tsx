import { X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import BottomNav from "@/components/BottomNav";
import OnlineUserAvatar from "@/components/OnlineUserAvatar";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type GenderFilter = "all" | "male" | "female";

const OnlineUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<Tables<"profiles">[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("level", { ascending: false })
        .limit(50);
      if (data) setUsers(data);
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = !searchQuery || u.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGender = genderFilter === "all" || u.gender === genderFilter;
      return matchesSearch && matchesGender;
    });
  }, [users, searchQuery, genderFilter]);

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">
          المتصلين ({filteredUsers.length})
        </h1>
        <button onClick={() => setShowSearch(!showSearch)} className="text-secondary-foreground">
          <Search className="w-6 h-6" />
        </button>
      </div>

      {/* Search & Filters */}
      {showSearch && (
        <div className="sticky top-[52px] z-40 bg-card border-b border-border px-4 py-3 space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن عضو..."
              className="w-full bg-muted border border-border rounded-full pr-10 pl-4 py-2 text-sm font-cairo text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              dir="rtl"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setGenderFilter("all")}
              className={`flex-1 py-2 rounded-lg text-xs font-cairo font-bold transition-all ${
                genderFilter === "all"
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setGenderFilter("male")}
              className={`flex-1 py-2 rounded-lg text-xs font-cairo font-bold transition-all ${
                genderFilter === "male"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              ♂ ذكر
            </button>
            <button
              onClick={() => setGenderFilter("female")}
              className={`flex-1 py-2 rounded-lg text-xs font-cairo font-bold transition-all ${
                genderFilter === "female"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              ♀ أنثى
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-6">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-sm font-cairo text-muted-foreground">لا توجد نتائج</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {filteredUsers.map((u) => (
              <OnlineUserAvatar
                key={u.id}
                user={{
                  id: u.id,
                  username: u.username,
                  level: u.level,
                  borderColor: u.gender === "female" ? "border-primary" : "border-accent",
                }}
                onClick={() => navigate(`/user/${u.user_id}`)}
              />
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default OnlineUsers;
