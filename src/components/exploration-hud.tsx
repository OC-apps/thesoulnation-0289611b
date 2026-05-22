import { useExploration, LEVELS } from "@/lib/exploration";

export function ExplorationHUD() {
  const { points, totalPoints, level, nextLevel, progressInLevel, found, total, complete } =
    useExploration();

  return (
    <div className="fixed top-2 left-1/2 z-[90] -translate-x-1/2 w-[min(420px,calc(100vw-1rem))] pointer-events-none">
      <div className="pointer-events-auto relative overflow-hidden rounded-full border border-flame/50 bg-background/80 backdrop-blur-xl px-3 py-1.5 shadow-[0_0_24px_var(--flame-glow)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--flame) 0 1px, transparent 1px 10px)",
          }}
        />
        <div className="relative flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame" />
            </span>
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-flame whitespace-nowrap">
              Lv {level.index + 1}/{LEVELS.length}
            </span>
          </div>

          <div className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-foreground truncate">
            {level.name}
          </div>

          <div className="flex-1 min-w-0">
            <div className="h-1.5 overflow-hidden rounded-full border border-flame/30 bg-background/60">
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

          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-flame whitespace-nowrap">
            {points}/{totalPoints} XP
          </span>
          <span className="hidden sm:inline text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
            {found.length}/{total}
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
