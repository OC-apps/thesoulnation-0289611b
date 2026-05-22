import { useEffect, useRef, useState } from "react";
import { useExploration, LEVELS } from "@/lib/exploration";

const POS_KEY = "soul-exploration-hud-pos-v1";

type Pos = { x: number; y: number };

export function ExplorationHUD() {
  const { points, totalPoints, level, nextLevel, progressInLevel, found, total, complete } =
    useExploration();

  const [pos, setPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);
  const movedRef = useRef(false);
  const dragOffset = useRef<Pos>({ x: 0, y: 0 });
  const hudRef = useRef<HTMLDivElement | null>(null);

  // Load saved position
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) setPos(JSON.parse(raw));
    } catch {}
  }, []);

  // Clamp on resize
  useEffect(() => {
    if (typeof window === "undefined") return;
    const clamp = () => {
      setPos((p) => {
        if (!p || !hudRef.current) return p;
        const r = hudRef.current.getBoundingClientRect();
        const x = Math.min(Math.max(8, p.x), window.innerWidth - r.width - 8);
        const y = Math.min(Math.max(8, p.y), window.innerHeight - r.height - 8);
        return { x, y };
      });
    };
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      if (!hudRef.current) return;
      movedRef.current = true;
      const r = hudRef.current.getBoundingClientRect();
      const x = Math.min(
        Math.max(8, e.clientX - dragOffset.current.x),
        window.innerWidth - r.width - 8,
      );
      const y = Math.min(
        Math.max(8, e.clientY - dragOffset.current.y),
        window.innerHeight - r.height - 8,
      );
      setPos({ x, y });
    };
    const onUp = () => {
      setDragging(false);
      if (movedRef.current && pos) {
        try {
          localStorage.setItem(POS_KEY, JSON.stringify(pos));
        } catch {}
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, pos]);

  const startDrag = (e: React.PointerEvent) => {
    if (!hudRef.current) return;
    const r = hudRef.current.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    movedRef.current = false;
    setDragging(true);
    e.preventDefault();
  };

  // Default position: bottom-center aligned with side-nav row
  const style: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" }
    : { left: "50%", bottom: "0.75rem", transform: "translateX(-50%)" };

  return (
    <div
      ref={hudRef}
      className="fixed z-[80] w-[min(220px,calc(100vw-10rem))] sm:w-[min(440px,calc(100vw-1rem))]"
      style={style}
    >
      <div
        className={`pointer-events-auto relative overflow-hidden rounded-full border border-flame/50 bg-background/85 backdrop-blur-xl px-2 py-1 sm:py-1.5 shadow-[0_0_24px_var(--flame-glow)] ${
          dragging ? "cursor-grabbing select-none ring-2 ring-flame" : "cursor-grab"
        }`}
        onPointerDown={startDrag}
        title="Arrastra para mover"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--flame) 0 1px, transparent 1px 10px)",
          }}
        />
        <div className="relative flex items-center gap-1.5 sm:gap-2">
          <span
            aria-hidden="true"
            className="hidden sm:flex flex-col items-center justify-center gap-[2px] px-1 text-flame/70"
          >
            <span className="block h-[2px] w-3 rounded-full bg-current" />
            <span className="block h-[2px] w-3 rounded-full bg-current" />
            <span className="block h-[2px] w-3 rounded-full bg-current" />
          </span>

          <div className="flex items-center gap-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame" />
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.2em] text-flame whitespace-nowrap">
              Lv{level.index + 1}<span className="hidden sm:inline">/{LEVELS.length}</span>
            </span>
          </div>

          <div className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-foreground truncate">
            {level.name}
          </div>

          <div className="flex-1 min-w-[30px]">
            <div className="h-1 sm:h-1.5 overflow-hidden rounded-full border border-flame/30 bg-background/60">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${complete ? 100 : progressInLevel}%`,
                  background: complete
                    ? "linear-gradient(90deg, #f59e0b, var(--flame))"
                    : "linear-gradient(90deg, #3b82f6, var(--flame))",
                  boxShadow: "0 0 8px var(--flame-glow)",
                }}
              />
            </div>
          </div>

          <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.2em] text-flame whitespace-nowrap">
            {found.length}/{total}
          </span>
          <span className="hidden sm:inline text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
            {points}/{totalPoints} XP
          </span>
        </div>

        {nextLevel && !complete && (
          <div className="relative mt-0.5 hidden sm:block text-[8px] font-mono uppercase tracking-[0.25em] text-muted-foreground text-center">
            Próximo: {nextLevel.name} · {nextLevel.min - points} XP
          </div>
        )}
      </div>
    </div>
  );
}
