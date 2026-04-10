import { useState, useRef, useEffect } from "react";
import { Mic, Square, Send, X } from "lucide-react";

interface Props {
  onSend: (blob: Blob, duration: number) => void;
}

const VoiceRecorder = ({ onSend }: Props) => {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      console.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob, duration);
      setAudioBlob(null);
      setDuration(0);
    }
  };

  const handleCancel = () => {
    if (recording) stopRecording();
    setAudioBlob(null);
    setDuration(0);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (audioBlob) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={handleCancel} className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive">
          <X className="w-4 h-4" />
        </button>
        <div className="flex-1 bg-muted rounded-full px-3 py-1.5 flex items-center gap-2">
          <span className="text-xs font-space text-accent">🎤 {formatTime(duration)}</span>
          <div className="flex-1 h-1 bg-border rounded-full">
            <div className="h-full bg-accent rounded-full w-full" />
          </div>
        </div>
        <button onClick={handleSend} className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
          <Send className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (recording) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={handleCancel} className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive">
          <X className="w-4 h-4" />
        </button>
        <div className="flex-1 bg-destructive/10 border border-destructive/30 rounded-full px-3 py-1.5 flex items-center gap-2">
          <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          <span className="text-xs font-cairo text-destructive">جاري التسجيل...</span>
          <span className="text-xs font-space text-destructive mr-auto">{formatTime(duration)}</span>
        </div>
        <button onClick={stopRecording} className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground">
          <Square className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={startRecording}
      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
      title="رسالة صوتية"
    >
      <Mic className="w-5 h-5" />
    </button>
  );
};

export default VoiceRecorder;
