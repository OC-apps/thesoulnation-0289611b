import { useEffect, useRef, useState } from "react";

interface Props {
  id?: string;
  logo: string;
  title: string;
  subtitle: string;
  desc: string;
  members: string[];
  accentSeed?: number;
}

export function HoloSquadCard({ id, logo, title, subtitle, desc, members, accentSeed = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  const [revealed, setRevealed] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Reveal on view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setRevealed(true)),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer tilt (desktop) + touch drag tilt (mobile)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = (cx: number, cy: number) => {
      const r = el.getBoundingClientRect();
      const x = (cx - r.left) / r.width;
      const y = (cy - r.top) / r.height;
      setTilt({
        rx: (0.5 - y) * 18,
        ry: (x - 0.5) * 22,
        mx: x * 100,
        my: y * 100,
      });
    };
    const onMove = (e: PointerEvent) => handle(e.clientX, e.clientY);
    const onLeave = () => setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Idle floating animation when not interacting
  const [idle, setIdle] = useState(0);
  useEffect(() => {
    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 0.012;
      setIdle(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const idleRx = Math.sin(idle + accentSeed) * 2.5;
  const idleRy = Math.cos(idle * 0.8 + accentSeed) * 3.5;
  const rx = tilt.rx || idleRx;
  const ry = tilt.ry || idleRy;

  return (
    <div
      id={id}
      ref={ref}
      className="relative scroll-mt-24 [perspective:1400px] select-none"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
    >
      {/* Outer aura removed per request */}


      <div
        className="relative rounded-[1.75rem] overflow-hidden border-2 transition-transform duration-200 will-change-transform"
        style={{
          borderColor: "var(--flame)",
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) ${pressed ? "scale(0.985)" : "scale(1)"}`,
          transformStyle: "preserve-3d",
          background:
            "linear-gradient(135deg, oklch(0.20 0.16 258 / 0.94), oklch(0.07 0.10 258 / 0.94))",
          boxShadow:
            "0 30px 80px -25px var(--flame-glow), inset 0 0 40px oklch(0 0 0 / 0.6)",
        }}
      >
        {/* Holographic grid */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.70 0.24 45 / 0.22) 1px, transparent 1px), linear-gradient(90deg, oklch(0.70 0.24 45 / 0.22) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            transform: `translate3d(${(tilt.mx - 50) * 0.4}px, ${(tilt.my - 50) * 0.4}px, 0)`,
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />

        {/* Cursor-following spotlight */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            background: `radial-gradient(420px circle at ${tilt.mx}% ${tilt.my}%, oklch(0.70 0.28 45 / 0.35), transparent 60%)`,
          }}
        />



        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 2px, oklch(1 0 0 / 0.08) 2px, oklch(1 0 0 / 0.08) 3px)",
          }}
        />

        {/* HUD corners */}
        {[
          "top-3 left-3 border-l-2 border-t-2",
          "top-3 right-3 border-r-2 border-t-2",
          "bottom-3 left-3 border-l-2 border-b-2",
          "bottom-3 right-3 border-r-2 border-b-2",
        ].map((c) => (
          <span key={c} className={`absolute ${c} w-6 h-6 border-flame pointer-events-none`} />
        ))}

        {/* Animated scan bar */}
        <span
          className="pointer-events-none absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-flame to-transparent"
          style={{
            top: `${((Math.sin(idle * 1.5 + accentSeed) + 1) / 2) * 100}%`,
            filter: "drop-shadow(0 0 12px var(--flame-glow))",
          }}
        />

        {/* Content */}
        <div className="relative p-6 sm:p-8 md:p-12 grid md:grid-cols-12 gap-6 md:gap-8 items-center">
          {/* Logo with parallax layers */}
          <div
            className="md:col-span-5 flex flex-col items-center md:items-start"
            style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
          >
            <div className="relative">
              <img
                src={logo}
                alt={title}
                className="relative h-28 sm:h-32 md:h-40 w-auto object-contain"
                style={{
                  filter:
                    "drop-shadow(0 0 24px var(--flame-glow)) drop-shadow(0 0 60px oklch(0.55 0.24 255 / 0.5))",
                  transform: `translate3d(${(tilt.mx - 50) * 0.15}px, ${(tilt.my - 50) * 0.15}px, 40px)`,
                }}
              />
              {/* Echo layer */}
              <img
                src={logo}
                alt=""
                aria-hidden
                className="absolute inset-0 h-28 sm:h-32 md:h-40 w-auto object-contain opacity-30 mix-blend-screen pointer-events-none"
                style={{
                  filter: "blur(6px) hue-rotate(40deg)",
                  transform: `translate3d(${(tilt.mx - 50) * -0.25}px, ${(tilt.my - 50) * -0.25}px, 0)`,
                }}
              />
            </div>
            <p
              className="mt-5 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-flame font-mono"
              style={{ transform: "translateZ(30px)" }}
            >
              ► {subtitle}
            </p>
            <p
              className="mt-3 text-sm text-foreground/80 text-center md:text-left leading-relaxed"
              style={{ transform: "translateZ(20px)" }}
            >
              {desc}
            </p>
          </div>

          {/* Members grid */}
          <div
            className="md:col-span-7 w-full"
            style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
          >
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: "oklch(0.75 0.18 250 / 0.85)" }}>
              <span>◢ Roster · {members.length.toString().padStart(2, "0")}</span>
              <span className="hidden sm:inline">STATUS · ACTIVE</span>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {members.map((m, i) => (
                <li
                  key={m}
                  className="group/chip relative overflow-hidden rounded-lg border border-sky-400/30 bg-background/50 backdrop-blur px-3 py-2 text-xs sm:text-sm font-display font-bold tracking-wide text-foreground/90 transition-all duration-300 hover:border-sky-400 hover:text-sky-300 hover:bg-sky-400/10 active:scale-95"
                  style={{
                    transform: revealed
                      ? `translate3d(0,0,${20 + (i % 3) * 10}px)`
                      : "translate3d(0, 24px, 0)",
                    opacity: revealed ? 1 : 0,
                    transition: `transform 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms, opacity 0.7s ease ${i * 60}ms, border-color 0.3s, background 0.3s, color 0.3s`,
                  }}
                >
                  <span className="relative z-10 block truncate">{m}</span>
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-sky-400/30 to-transparent transition-transform duration-700 group-hover/chip:translate-x-full" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom HUD strip */}
        <div className="relative border-t border-sky-400/20 bg-background/40 px-4 py-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: "oklch(0.75 0.18 250 / 0.75)" }}>
          <span>◤ {title}</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </span>
        </div>
      </div>
    </div>
  );
}
