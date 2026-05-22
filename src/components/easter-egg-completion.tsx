import { useEffect, useMemo, useState } from "react";
import { useEasterEggs } from "@/lib/easter-eggs";
import eggLogo from "@/assets/easter-egg-logo.png";

const FLAG = "soul-easter-eggs-celebrated-v1";

export function EasterEggCompletion() {
  const { state, total, reset } = useEasterEggs();
  const complete = state.found.length >= total && total > 0;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!complete) return;
    if (localStorage.getItem(FLAG)) return;
    setOpen(true);
    localStorage.setItem(FLAG, "1");
  }, [complete]);

  // Reset celebration flag if user resets progress
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (state.found.length === 0) localStorage.removeItem(FLAG);
  }, [state.found.length]);

  const sparks = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        x: (Math.random() - 0.5) * 700,
        y: (Math.random() - 0.5) * 500 - 60,
        d: 900 + Math.random() * 1400,
        delay: Math.random() * 200,
        color: i % 2 === 0 ? "var(--flame)" : "#3b82f6",
        size: 5 + Math.random() * 7,
      })),
    [open],
  );

  if (!open) return null;

  const handleReplay = () => {
    setOpen(false);
    reset();
    if (typeof window !== "undefined") localStorage.removeItem(FLAG);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ animation: "eegg-fade 350ms ease-out" }}
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-background/85 backdrop-blur-md"
      />

      {/* Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {sparks.map((p, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 block rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 12px ${p.color}`,
              animation: `eegg-burst ${p.d}ms ease-out ${p.delay}ms forwards`,
              // @ts-expect-error css var
              "--tx": `${p.x}px`,
              "--ty": `${p.y}px`,
            }}
          />
        ))}
      </div>

      <div
        className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center text-center"
        style={{ animation: "eegg-pop 500ms cubic-bezier(.2,.9,.25,1.2)" }}
      >
        {/* HUD frame */}
        <div className="relative rounded-3xl border border-flame bg-background/80 px-6 py-8 sm:px-10 sm:py-12 shadow-[0_0_80px_var(--flame-glow),0_0_140px_rgba(59,130,246,0.45)]">
          <span className="absolute top-3 left-3 h-6 w-6 border-l-2 border-t-2 border-flame" />
          <span className="absolute top-3 right-3 h-6 w-6 border-r-2 border-t-2 border-flame" />
          <span className="absolute bottom-3 left-3 h-6 w-6 border-l-2 border-b-2 border-flame" />
          <span className="absolute bottom-3 right-3 h-6 w-6 border-r-2 border-b-2 border-flame" />
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, var(--flame) 0 1px, transparent 1px 14px)",
            }}
          />

          {/* Big logo */}
          <div className="relative mx-auto h-40 w-40 sm:h-52 sm:w-52">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--flame-glow), transparent 65%)",
                animation: "eegg-glow 2s ease-in-out infinite",
                filter: "blur(8px)",
              }}
            />
            <img
              src={eggLogo}
              alt="The Soul Nation"
              className="relative h-full w-full object-contain"
              style={{
                animation: "eegg-float 3s ease-in-out infinite",
                filter:
                  "drop-shadow(0 0 22px var(--flame-glow)) drop-shadow(0 0 40px rgba(59,130,246,0.55))",
              }}
            />
          </div>

          <div className="mt-6 text-[10px] font-bold uppercase tracking-[0.35em] text-flame">
            Legado completado
          </div>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-black leading-tight text-foreground">
            ¡Encontraste todos los Easter Eggs!
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Has descubierto los 10 secretos de The Soul Nation. Eres parte del legado Soul.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-flame/50 bg-flame/10 px-3 py-1 text-xs font-bold text-flame">
            <span>★</span> {state.xp} XP totales · {total}/{total} eggs
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md bg-flame px-5 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_22px_var(--flame-glow)]"
            >
              Continuar
            </button>
            <button
              type="button"
              onClick={handleReplay}
              className="rounded-md border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-all hover:border-flame/50 hover:text-flame"
            >
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes eegg-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes eegg-float { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
        @keyframes eegg-glow { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
      `}</style>
    </div>
  );
}
