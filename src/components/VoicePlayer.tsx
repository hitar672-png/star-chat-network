import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface Props {
  voiceUrl: string;
}

const VoicePlayer = ({ voiceUrl }: Props) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      const audio = new Audio(voiceUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setDuration(Math.floor(audio.duration));
      };
      audio.ontimeupdate = () => {
        if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
      };
      audio.onended = () => {
        setPlaying(false);
        setProgress(0);
      };
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 min-w-[160px]">
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent flex-shrink-0"
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-space text-muted-foreground">
          🎤 {duration > 0 ? formatTime(duration) : "0:00"}
        </span>
      </div>
    </div>
  );
};

export default VoicePlayer;
