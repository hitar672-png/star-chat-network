import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const NOTIFICATION_SOUND_URL = "https://cdn.pixabay.com/audio/2022/12/12/audio_e7e6b1e040.mp3";

export const useNotificationSound = () => {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const profileCacheRef = useRef<Record<string, string>>({});

  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
    audioRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("global-pm-notify")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "private_messages" },
        async (payload) => {
          const msg = payload.new as any;
          if (msg.receiver_id === user.id && msg.sender_id !== user.id) {
            // Play sound
            audioRef.current?.play().catch(() => {});

            // Get sender name for banner
            let senderName = profileCacheRef.current[msg.sender_id];
            if (!senderName) {
              const { data } = await supabase
                .from("profiles")
                .select("username")
                .eq("user_id", msg.sender_id)
                .maybeSingle();
              senderName = data?.username || "مجهول";
              profileCacheRef.current[msg.sender_id] = senderName;
            }

            // Show banner notification
            const preview = msg.text?.length > 40 ? msg.text.slice(0, 40) + "..." : msg.text;
            toast(`💬 ${senderName}`, {
              description: preview,
              duration: 5000,
              action: {
                label: "عرض",
                onClick: () => {
                  window.location.href = `/private/${msg.sender_id}`;
                },
              },
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
};
