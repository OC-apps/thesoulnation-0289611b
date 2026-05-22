import { EASTER_EGGS, useEasterEggs } from "@/lib/easter-eggs";

export function ExplorerPanel() {
  const { state, total, panelOpen, togglePanel, reset } = useEasterEggs();
  const found = state.found.length;
  const pct = total > 0 ? Math.round((found / total) * 100) : 0;
  const isDev = typeof import.meta !== "undefined" && import.meta.env?.DEV;

  const foundBadges = EASTER_EGGS.filter((e) => state.found.includes(e.id));

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={togglePanel}
        aria-label="Progreso de explorador"
        className="fixed bottom-3 left-[7.5rem] z-[100] flex h-9 items-center gap-1.5 rounded-full border border-flame/60 bg-background/90 px-2.5 text-[10px] font-bold uppercase tracking-wider text-flame backdrop-blur-md transition-all hover:border-flame hover:bg-flame/10 hover:shadow-[0_0_22px_var(--flame-glow)] sm:bottom-5 sm:left-auto sm:right-4 sm:h-10 sm:px-3 sm:text-xs"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame" />
        </span>
        <span>Explorador</span>
        <span className="rounded bg-flame/15 px-1 py-0.5 text-[9px] text-flame sm:text-[10px]">
          {found}/{total}
        </span>
      </button>

      {/* Panel */}
      <div
        className={`fixed bottom-14 left-3 z-[100] w-[min(360px,calc(100vw-1.5rem))] origin-bottom-left transition-all duration-300 sm:bottom-20 sm:left-auto sm:right-4 sm:origin-bottom-right ${
          panelOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="relative overflow-hidden rounded-xl border border-flame/40 bg-background/95 backdrop-blur-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6),0_0_40px_var(--flame-glow)]">
          {/* HUD diagonal lines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, var(--flame) 0 1px, transparent 1px 12px)",
            }}
          />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame to-transparent" />

          <div className="relative p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-flame">
                  Soul Easter Eggs
                </div>
                <h3 className="text-base font-bold text-foreground">Progreso de Explorador</h3>
              </div>
              <button
                type="button"
                onClick={togglePanel}
                className="rounded-md p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                aria-label="Cerrar panel"
              >
                ✕
              </button>
            </div>

            {/* Stats */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Stat label="XP" value={state.xp} />
              <Stat label="Encontrados" value={`${found}/${total}`} />
              <Stat label="Restantes" value={total - found} />
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>Progreso del legado Soul</span>
                <span className="text-flame">{pct}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full border border-flame/30 bg-background/60">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #3b82f6, var(--flame))",
                    boxShadow: "0 0 12px var(--flame-glow)",
                  }}
                />
              </div>
            </div>

            {/* Badges */}
            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                Badges desbloqueados
              </div>
              {foundBadges.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Aún no descubres ningún badge. Explora cada sección para encontrarlos.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {foundBadges.map((b) => (
                    <span
                      key={b.id}
                      className="inline-flex items-center gap-1 rounded-full border border-flame/60 bg-flame/10 px-2 py-1 text-[10px] font-semibold text-flame"
                    >
                      <span>{b.icono}</span>
                      {b.badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* List */}
            <div className="mt-4 space-y-1">
              {EASTER_EGGS.map((e) => {
                const ok = state.found.includes(e.id);
                return (
                  <div
                    key={e.id}
                    className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs ${
                      ok
                        ? "border-flame/40 bg-flame/5 text-foreground"
                        : "border-white/10 bg-white/[0.02] text-muted-foreground"
                    }`}
                  >
                    <span className={`text-base ${ok ? "" : "grayscale opacity-40"}`}>{e.icono}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">
                        {ok ? e.nombre : "???"}
                      </div>
                      <div className="truncate text-[10px] uppercase tracking-wider opacity-70">
                        {ok ? e.seccion : "???"}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold ${ok ? "text-flame" : "text-muted-foreground"}`}
                    >
                      {ok ? `+${e.xp} XP` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>

            {isDev && (
              <button
                type="button"
                onClick={reset}
                className="mt-4 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:border-flame/40 hover:text-flame"
              >
                Reiniciar progreso
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-flame/20 bg-background/60 px-2 py-1.5 text-center">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}
