import { useEffect, useMemo } from "react";
import { useEasterEggs } from "@/lib/easter-eggs";

export function EasterEggNotification() {
  const { notification, dismissNotification } = useEasterEggs();

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(dismissNotification, 4200);
    return () => clearTimeout(t);
  }, [notification, dismissNotification]);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        x: (Math.random() - 0.5) * 280,
        y: (Math.random() - 0.5) * 180 - 40,
        d: 600 + Math.random() * 700,
        delay: Math.random() * 80,
        color: i % 2 === 0 ? "var(--flame)" : "#3b82f6",
        size: 4 + Math.random() * 5,
      })),
    [notification?.key],
  );

  if (!notification) return null;

  const { config, already } = notification;

  return (
    <div
      key={notification.key}
      className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex justify-center px-4"
    >
      <div className="pointer-events-auto relative w-full max-w-md">
        {!already && (
          <div className="pointer-events-none absolute inset-0 -z-10">
            {particles.map((p, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 block rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  boxShadow: `0 0 8px ${p.color}`,
                  animation: `eegg-burst ${p.d}ms ease-out ${p.delay}ms forwards`,
                  // @ts-expect-error css var
                  "--tx": `${p.x}px`,
                  "--ty": `${p.y}px`,
                }}
              />
            ))}
          </div>
        )}

        <div
          className={`relative overflow-hidden rounded-xl border bg-background/90 backdrop-blur-md ${
            already
              ? "border-white/15 shadow-[0_0_24px_rgba(255,255,255,0.08)]"
              : "border-flame shadow-[0_0_42px_var(--flame-glow),0_0_80px_rgba(59,130,246,0.35)]"
          }`}
          style={{ animation: "eegg-pop 380ms cubic-bezier(.2,.9,.25,1.2), eegg-shake 420ms ease-in-out" }}
        >
          <div
            className="absolute inset-0 -z-10 opacity-60"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(255,130,40,0.18) 50%, transparent 70%), linear-gradient(245deg, transparent 30%, rgba(59,130,246,0.18) 50%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-y-0 left-0 w-1"
            style={{ background: already ? "rgba(255,255,255,0.3)" : "var(--flame)" }}
          />
          <div className="flex items-start gap-3 p-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border text-2xl ${
                already ? "border-white/20 bg-white/5" : "border-flame bg-flame/10 text-flame shadow-[0_0_18px_var(--flame-glow)]"
              }`}
              style={!already ? { animation: "eegg-pulse 1.2s ease-in-out infinite" } : undefined}
            >
              {config.icono}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    already ? "text-white/60" : "text-flame"
                  }`}
                >
                  {already ? "Ya descubierto" : "Easter Egg encontrado"}
                </span>
                {!already && (
                  <span className="rounded-sm bg-flame/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-flame">
                    Badge desbloqueado
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground leading-snug">
                {already ? "Este Easter Egg ya fue descubierto." : config.mensaje}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {config.nombre} · {config.seccion}
              </p>
            </div>
            <button
              type="button"
              onClick={dismissNotification}
              className="rounded-md p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes eegg-pop {
          0% { transform: translateY(-20px) scale(0.92); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes eegg-shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
        }
        @keyframes eegg-pulse {
          0%,100% { box-shadow: 0 0 18px var(--flame-glow); }
          50% { box-shadow: 0 0 32px var(--flame-glow), 0 0 60px rgba(59,130,246,0.5); }
        }
        @keyframes eegg-burst {
          0% { transform: translate(-50%, -50%) scale(0.4); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
