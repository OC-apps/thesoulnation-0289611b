import { useEffect, useRef, useState } from "react";
import { gearsTime, gearsUrl } from "@/lib/gears";
import type { GearsEpisode, GearsMedia, GearsSegment } from "@/lib/gears";
import "./gears-player.css";

export function GearsPlayer({ episode, media }: { episode: GearsEpisode; media: GearsMedia[] }) {
  const videos = useRef<Partial<Record<GearsSegment, HTMLVideoElement>>>({});
  const audio = useRef<HTMLAudioElement>(null);
  const [segment, setSegment] = useState<GearsSegment>("intro");
  const current = useRef<GearsSegment>("intro");
  const wanted = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState("");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const generation = useRef(0);
  const [mobileVolume, setMobileVolume] = useState(false);
  const seekTarget = useRef<number | null>(null);
  const ready = (["intro", "background", "outro"] as const).every((id) =>
    media.some((m) => m.id === id),
  );
  const pauseAll = () => {
    Object.values(videos.current).forEach((v) => v?.pause());
    audio.current?.pause();
  };
  const fail = (message: string) => {
    wanted.current = false;
    pauseAll();
    setPlaying(false);
    setBuffering(false);
    setError(message);
  };
  async function resume() {
    const turn = ++generation.current;
    const active = current.current;
    if (!wanted.current) return;
    const video = videos.current[active],
      voice = audio.current;
    if (!video || !voice) return;
    setError("");
    setBuffering(true);
    try {
      if (video.error) video.load();
      if (active === "background" && voice.error) voice.load();
      video.volume = active === "background" ? 0.08 * volume : volume;
      voice.volume = volume;
      if (active === "background" && seekTarget.current !== null && voice.readyState >= 1) {
        voice.currentTime = seekTarget.current;
        seekTarget.current = null;
      }
      await Promise.all([video.play(), ...(active === "background" ? [voice.play()] : [])]);
      if (turn !== generation.current || !wanted.current || current.current !== active) return;
      setPlaying(true);
      setBuffering(false);
    } catch (e) {
      if (
        turn === generation.current &&
        wanted.current &&
        (e as DOMException).name !== "AbortError"
      )
        fail("Pulsa reproducir para continuar. Si el problema persiste, revisa tu conexión.");
    }
  }
  function change(next: GearsSegment) {
    generation.current++;
    pauseAll();
    current.current = next;
    setSegment(next);
    setBuffering(wanted.current);
    const v = videos.current[next];
    if (v) v.currentTime = 0;
    if (next === "background" && audio.current && seekTarget.current === null)
      audio.current.currentTime = 0;
    void resume();
  }
  function toggle() {
    if (wanted.current) {
      wanted.current = false;
      generation.current++;
      pauseAll();
      setPlaying(false);
      setBuffering(false);
      return;
    }
    wanted.current = true;
    setStarted(true);
    setEnded(false);
    // Unlock the voice element within the user gesture for mobile Safari.
    if (current.current !== "background" && audio.current) {
      const voice = audio.current;
      voice.muted = true;
      void voice
        .play()
        .then(() => {
          if (current.current !== "background") voice.pause();
          voice.muted = false;
        })
        .catch(() => {
          voice.muted = false;
        });
    }
    if (ended) change("intro");
    else void resume();
  }
  function seek(value: number) {
    const target = Math.max(0, Math.min(value, duration));
    setEnded(false);
    setTime(target);
    seekTarget.current = target;
    if (current.current !== "background") change("background");
    const voice = audio.current,
      background = videos.current.background;
    if (voice && voice.readyState >= 1) {
      voice.currentTime = target;
      seekTarget.current = null;
    }
    if (background && Number.isFinite(background.duration) && background.duration > 0)
      background.currentTime = target % background.duration;
  }
  function waiting() {
    if (!wanted.current || current.current !== "background") return;
    setBuffering(true);
    videos.current.background?.pause();
    audio.current?.pause();
  }
  function canContinue() {
    if (
      wanted.current &&
      current.current === "background" &&
      (videos.current.background?.readyState ?? 0) >= 3 &&
      (audio.current?.readyState ?? 0) >= 3
    )
      void resume();
  }
  useEffect(() => {
    // iOS uses the device volume and ignores per-element volume mixing.
    // Keep the visual bed silent there so it cannot overpower the narrator.
    setMobileVolume(
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    );
    const nodes = videos.current;
    const voice = audio.current;
    return () => {
      wanted.current = false;
      // This ref is an async playback counter, not a DOM node.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      generation.current++;
      Object.values(nodes).forEach((v) => v?.pause());
      voice?.pause();
    };
  }, []);
  useEffect(() => {
    Object.entries(videos.current).forEach(([key, v]) => {
      if (v) v.volume = key === "background" ? 0.08 * volume : volume;
    });
    if (audio.current) audio.current.volume = volume;
  }, [volume]);
  return (
    <div className="gears-player" aria-label={`Reproductor: ${episode.title}`}>
      <div className="gears-stage" data-segment={segment}>
        {(["intro", "background", "outro"] as const).map((id) => {
          const asset = media.find((m) => m.id === id);
          return (
            asset && (
              <video
                key={id}
                ref={(el) => {
                  if (el) videos.current[id] = el;
                }}
                src={gearsUrl(asset.path)}
                preload={started ? "metadata" : "none"}
                playsInline
                muted={id === "background" && mobileVolume}
                loop={id === "background"}
                className={`gears-video ${segment === id ? "is-active" : ""}`}
                aria-hidden="true"
                onWaiting={() => {
                  if (current.current === id) waiting();
                }}
                onCanPlay={canContinue}
                onError={() => {
                  if (current.current === id)
                    fail("No se pudo cargar el video. Intenta reproducir de nuevo.");
                }}
                onEnded={() => {
                  if (current.current !== id) return;
                  if (id === "intro") change("background");
                  if (id === "outro") {
                    wanted.current = false;
                    pauseAll();
                    setPlaying(false);
                    setEnded(true);
                  }
                }}
              />
            )
          );
        })}
        <audio
          ref={audio}
          src={gearsUrl(episode.audio_path)}
          preload={started ? "metadata" : "none"}
          onLoadedMetadata={() => {
            const a = audio.current;
            if (a) {
              setDuration(Number.isFinite(a.duration) ? a.duration : 0);
              if (seekTarget.current !== null) {
                a.currentTime = seekTarget.current;
                seekTarget.current = null;
              }
            }
          }}
          onTimeUpdate={() => {
            const position = audio.current?.currentTime ?? 0;
            setTime(position);
            const v = videos.current.background;
            if (
              current.current === "background" &&
              v &&
              v.readyState >= 3 &&
              Number.isFinite(v.duration) &&
              v.duration > 0
            ) {
              const target = position % v.duration;
              const delta = Math.abs(v.currentTime - target);
              if (Math.min(delta, v.duration - delta) > 0.5) v.currentTime = target;
            }
          }}
          onWaiting={waiting}
          onCanPlay={canContinue}
          onEnded={() => {
            if (current.current === "background") change("outro");
          }}
          onError={() => fail("No se pudo cargar el MP3. Intenta de nuevo.")}
        />
        <div key={segment} className={started ? "gears-sweep" : ""} aria-hidden="true" />
        {!started && (
          <div className="gears-cover">
            <span>SOUL NEWS · DIZZY</span>
            <strong>
              GEARS
              <br />
              AL CARBÓN<span>.</span>
            </strong>
            <button disabled={!ready} onClick={toggle}>
              {ready ? "▶ Reproducir episodio" : "Videos base pendientes"}
            </button>
          </div>
        )}
        {started && segment === "intro" && (
          <button className="gears-skip" onClick={() => change("background")}>
            Saltar intro ⏭
          </button>
        )}
        {started && (
          <span className="gears-segment">
            {segment === "intro" ? "Intro" : segment === "background" ? "Con Dizzy" : "Cierre"}
          </span>
        )}
      </div>
      <div className="gears-controls">
        <button onClick={toggle} disabled={!ready} aria-label={playing ? "Pausar" : "Reproducir"}>
          {playing ? "❚❚" : ended ? "↻" : "▶"}
        </button>
        <label className="gears-seek">
          Episodio · {gearsTime(time)} / {gearsTime(duration)}
          <input
            aria-label="Posición del MP3 del episodio"
            type="range"
            min={0}
            max={duration || 1}
            step="0.1"
            value={time}
            disabled={!duration}
            onChange={(e) => seek(Number(e.target.value))}
          />
        </label>
        <label className="gears-volume">
          Volumen
          <input
            aria-label="Volumen"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </label>
      </div>
      <p role="status" className="gears-status">
        {error ||
          (buffering
            ? "Cargando…"
            : ended
              ? "Episodio terminado"
              : !started
                ? "Intro con jingle · Narración · Cierre"
                : "")}
      </p>
    </div>
  );
}
