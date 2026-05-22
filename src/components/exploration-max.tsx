import { useEffect, useMemo, useState } from "react";
import { useExploration, MAX_FLAG } from "@/lib/exploration";
import maxLogo from "@/assets/max-level-logo.png";

export function ExplorationMax() {
  const { complete, reset, totalPoints } = useExploration();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!complete) return;
    if (localStorage.getItem(MAX_FLAG)) return;
    setOpen(true);
    localStorage.setItem(MAX_FLAG, "1");
  }, [complete]);

  const sparks = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        x: (Math.random() - 0.5) * 900,
        y: (Math.random() - 0.5) * 600 - 60,
        d: 1000 + Math.random() * 1600,
        delay: Math.random() * 250,
        color: i % 3 === 0 ? "#3b82f6" : "var(--flame)",
        size: 4 + Math.random() * 8,
      })),
    [open],
  );

  if (!open) return null;

  const handleReplay = () => {
    setOpen(false);
    reset();
  };

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center px-4"
      style={{ animation: "expmax-fade 350ms ease-out" }}
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {sparks.map((p, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 block rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 14px ${p.color}`,
              animation: `eegg-burst ${p.d}ms ease-out ${p.delay}ms forwards`,
              // @ts-expect-error css var
              "--tx": `${p.x}px`,
              "--ty": `${p.y}px`,
            }}
          />
        ))}
      </div>

      <div
        className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center text-center"
        style={{ animation: "expmax-pop 600ms cubic-bezier(.2,.9,.25,1.2)" }}
      >
        <div className="relative w-full rounded-3xl border-2 border-flame bg-background/85 px-6 py-8 sm:px-12 sm:py-12 shadow-[0_0_100px_var(--flame-glow),0_0_180px_rgba(59,130,246,0.5)]">
          <span className="absolute top-3 left-3 h-8 w-8 border-l-2 border-t-2 border-flame" />
          <span className="absolute top-3 right-3 h-8 w-8 border-r-2 border-t-2 border-flame" />
          <span className="absolute bottom-3 left-3 h-8 w-8 border-l-2 border-b-2 border-flame" />
          <span className="absolute bottom-3 right-3 h-8 w-8 border-r-2 border-b-2 border-flame" />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-flame to-transparent shadow-[0_0_14px_var(--flame-glow)] animate-[scan_2.6s_ease-in-out_infinite]" />

          <div className="text-[10px] font-mono font-bold uppercase tracking-[0.45em] text-flame">
            ◆ Nivel Máximo Alcanzado ◆
          </div>

          {/* BIG logo */}
          <div className="relative mx-auto mt-5 h-56 w-56 sm:h-72 sm:w-72">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--flame-glow), transparent 65%)",
                animation: "expmax-glow 2s ease-in-out infinite",
                filter: "blur(10px)",
              }}
            />
            <img
              src={maxLogo}
              alt="The Soul Nation"
              className="relative h-full w-full object-contain"
              style={{
                animation: "expmax-float 3.4s ease-in-out infinite",
                filter:
                  "drop-shadow(0 0 22px var(--flame-glow)) drop-shadow(0 0 50px rgba(59,130,246,0.6))",
              }}
            />
          </div>

          <h2 className="mt-5 font-display text-2xl sm:text-4xl font-black leading-tight text-foreground">
            ¡Llegaste al Nivel Máximo!
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Eres oficialmente <span className="text-flame font-bold">Élite Soul</span>. Exploraste
            cada miembro y cada rincón de The Soul Nation.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-flame/60 bg-flame/10 px-4 py-1.5 text-xs font-bold text-flame">
            <span>★</span> {totalPoints} XP · Explorador Total
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md bg-flame px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_24px_var(--flame-glow)]"
            >
              Continuar
            </button>
            <button
              type="button"
              onClick={handleReplay}
              className="rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-all hover:border-flame/50 hover:text-flame"
            >
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes expmax-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes expmax-pop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes expmax-float { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-12px) rotate(1deg); } }
        @keyframes expmax-glow { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.18); } }
      `}</style>
    </div>
  );
}
