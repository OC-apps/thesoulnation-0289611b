import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type AudioCtx = {
  playing: boolean;
  currentTime: number;
  duration: number;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (seconds: number) => void;
  skip: (delta: number) => void;
};

const Ctx = createContext<AudioCtx | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = new Audio("/teamtage.mp3");
    a.loop = true;
    a.volume = 0.55;
    a.preload = "none";
    audioRef.current = a;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setCurrentTime(a.currentTime);
    const onMeta = () => setDuration(a.duration || 0);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
      a.pause();
    };
  }, []);

  const play = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = false;
    a.play().catch(() => {});
  };
  const pause = () => audioRef.current?.pause();
  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) play(); else pause();
  };
  const stop = () => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setCurrentTime(0);
  };
  const seek = (s: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(s, a.duration || s));
  };
  const skip = (delta: number) => {
    const a = audioRef.current;
    if (!a) return;
    seek(a.currentTime + delta);
  };

  return (
    <Ctx.Provider value={{ playing, currentTime, duration, toggle, play, pause, stop, seek, skip }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used inside AudioProvider");
  return ctx;
}
