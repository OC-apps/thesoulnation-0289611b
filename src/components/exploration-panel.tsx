import { useState } from "react";
import { EXPLORE_IDS, useExploration, LEVELS, type ExploreId } from "@/lib/exploration";

const LABELS: Record<ExploreId, { nombre: string; seccion: string; icono: string }> = {
  "member:soul-maverick-z": { nombre: "Abrir Maverick Z", seccion: "Roster", icono: "👤" },
  "member:soul-aleman": { nombre: "Abrir Alemán", seccion: "Roster", icono: "👤" },
  "member:soul-gizzmo": { nombre: "Abrir Gizzmo", seccion: "Roster", icono: "👤" },
  "member:soul-pxlmaa": { nombre: "Abrir Pxlmaa", seccion: "Roster", icono: "👤" },
  "member:soul-systeem": { nombre: "Abrir Systeem", seccion: "Roster", icono: "👤" },
  "member:soul-templa": { nombre: "Abrir Templa", seccion: "Roster", icono: "👤" },
  "member:soul-enri": { nombre: "Abrir Enri", seccion: "Roster", icono: "👤" },
  "member:soul-emi-x": { nombre: "Abrir Emi X", seccion: "Roster", icono: "👤" },
  "member:soul-bellatriix": { nombre: "Abrir Bellatriix", seccion: "Roster", icono: "👤" },
  "social:youtube": { nombre: "Click en YouTube", seccion: "Redes", icono: "📺" },
  "social:tiktok": { nombre: "Click en TikTok", seccion: "Redes", icono: "🎵" },
  "social:facebook": { nombre: "Click en Facebook", seccion: "Redes", icono: "📘" },
  "social:x": { nombre: "Click en X / Twitter", seccion: "Redes", icono: "✖" },
  "social:discord": { nombre: "Click en Discord", seccion: "Redes", icono: "💬" },
  "nav:about": { nombre: "Ir a About", seccion: "Navegación", icono: "🧭" },
  "nav:roster": { nombre: "Ir a Roster", seccion: "Navegación", icono: "🧭" },
  "nav:videos": { nombre: "Ir a Videos", seccion: "Navegación", icono: "🧭" },
  "nav:wallpapers": { nombre: "Ir a Wallpapers", seccion: "Navegación", icono: "🧭" },
  "nav:jersey": { nombre: "Ir a Jersey", seccion: "Navegación", icono: "🧭" },
  "nav:xplicit-cup": { nombre: "Ir a Xplicit Cup", seccion: "Navegación", icono: "🧭" },
  "nav:music": { nombre: "Ir a Música", seccion: "Navegación", icono: "🧭" },
  "nav:reclutamiento": { nombre: "Ir a Reclutamiento", seccion: "Navegación", icono: "🧭" },
  "nav:redes": { nombre: "Ir a Redes", seccion: "Navegación", icono: "🧭" },
  "jersey:specs": { nombre: "Botón Specs", seccion: "Jersey", icono: "🎽" },
  "jersey:showcase": { nombre: "Botón Showcase", seccion: "Jersey", icono: "🎽" },
  "jersey:tiktok": { nombre: "Botón TikTok del Jersey", seccion: "Jersey", icono: "🎽" },
  "about:vision": { nombre: "Tab Visión", seccion: "About", icono: "📑" },
  "about:objetivo": { nombre: "Tab Objetivo", seccion: "About", icono: "📑" },
};

export function ExplorationPanel({ hideButton = false }: { hideButton?: boolean } = {}) {
  const { found, points, totalPoints, total, level, nextLevel, complete, reset, panelOpen, togglePanel, setPanelOpen } =
    useExploration();
  const [filter, setFilter] = useState<"all" | "missing" | "done">("missing");
  const isDev = typeof import.meta !== "undefined" && import.meta.env?.DEV;

  const items = EXPLORE_IDS.map((id) => ({ id, done: found.includes(id), ...LABELS[id] }));
  const filtered = items.filter((i) =>
    filter === "all" ? true : filter === "missing" ? !i.done : i.done,
  );

  // Group by section
  const grouped = filtered.reduce<Record<string, typeof items>>((acc, it) => {
    (acc[it.seccion] ||= []).push(it);
    return acc;
  }, {});

  const missingCount = total - found.length;
  const open = panelOpen;
  const setOpen = setPanelOpen;

  return (
    <>
      {!hideButton && (
        <button
          type="button"
          onClick={togglePanel}
          aria-label="Misiones de exploración"
          className="fixed bottom-3 left-3 z-[100] flex h-9 items-center gap-1.5 rounded-full border border-flame/60 bg-background/90 px-2.5 text-[10px] font-bold uppercase tracking-wider text-flame backdrop-blur-md transition-all hover:border-flame hover:bg-flame/10 hover:shadow-[0_0_22px_var(--flame-glow)] sm:bottom-5 sm:h-10 sm:px-3 sm:text-xs"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame" />
          </span>
          <span>Misiones</span>
          <span className="rounded bg-flame/15 px-1 py-0.5 text-[9px] text-flame sm:text-[10px]">
            {found.length}/{total}
          </span>
        </button>
      )}

      <div
        className={`fixed bottom-16 left-3 z-[100] w-[min(380px,calc(100vw-1.5rem))] origin-bottom-left transition-all duration-300 sm:bottom-20 sm:left-4 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="relative overflow-hidden rounded-xl border border-flame/40 bg-background/95 backdrop-blur-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6),0_0_40px_var(--flame-glow)]">
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
                  Nivel de Exploración
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {level.name} · Lv {level.index + 1}/{LEVELS.length}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <Stat label="XP" value={`${points}/${totalPoints}`} />
              <Stat label="Acciones" value={`${found.length}/${total}`} />
              <Stat label="Faltan" value={missingCount} />
            </div>

            {nextLevel && !complete && (
              <div className="mt-3 rounded-md border border-flame/20 bg-flame/5 px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                Próximo: <span className="text-flame font-bold">{nextLevel.name}</span> ·{" "}
                {nextLevel.min - points} XP restantes
              </div>
            )}

            <div className="mt-3 flex gap-1">
              {(["missing", "all", "done"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`flex-1 rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                    filter === f
                      ? "border-flame bg-flame/15 text-flame"
                      : "border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "missing" ? "Faltantes" : f === "all" ? "Todas" : "Hechas"}
                </button>
              ))}
            </div>

            <div className="mt-3 max-h-[55vh] space-y-3 overflow-y-auto pr-1">
              {Object.keys(grouped).length === 0 ? (
                <p className="py-6 text-center text-xs italic text-muted-foreground">
                  {filter === "missing"
                    ? "¡Completaste todas las acciones! 🔥"
                    : "Sin elementos."}
                </p>
              ) : (
                Object.entries(grouped).map(([sec, list]) => (
                  <div key={sec}>
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-flame/80">
                      {sec}
                    </div>
                    <div className="space-y-1">
                      {list.map((it) => (
                        <div
                          key={it.id}
                          className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs ${
                            it.done
                              ? "border-flame/40 bg-flame/5 text-foreground"
                              : "border-white/10 bg-white/[0.02] text-muted-foreground"
                          }`}
                        >
                          <span className={`text-base ${it.done ? "" : "opacity-60"}`}>
                            {it.icono}
                          </span>
                          <div className="min-w-0 flex-1 truncate font-semibold">
                            {it.nombre}
                          </div>
                          <span
                            className={`text-[10px] font-bold ${
                              it.done ? "text-flame" : "text-muted-foreground"
                            }`}
                          >
                            {it.done ? "✓ +10" : "+10 XP"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {isDev && (
              <button
                type="button"
                onClick={reset}
                className="mt-3 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:border-flame/40 hover:text-flame"
              >
                Reiniciar exploración
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
