import { X, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const Gifts = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <div className="sticky top-0 z-50 bg-toolbar px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-secondary-foreground">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-cairo font-bold text-secondary-foreground">الهدايا</h1>
        <div className="w-6" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <Gift className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-sm font-cairo text-muted-foreground">لا توجد هدايا بعد</p>
        <p className="text-xs font-cairo text-muted-foreground mt-1">يمكنك إرسال واستقبال الهدايا من الأصدقاء</p>
      </div>
      <BottomNav />
    </div>
  );
};

export default Gifts;
