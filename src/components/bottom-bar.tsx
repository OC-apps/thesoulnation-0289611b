import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Pause, Play, Share2, Youtube, Facebook } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { useExploration, LEVELS } from "@/lib/exploration";
import { useEasterEggs } from "@/lib/easter-eggs";
import { SOCIALS } from "@/lib/socials";

const SECTIONS = [
  { id: "top", label: "Inicio" },
  { id: "roster", label: "Roster" },
  { id: "videos", label: "Videos" },
  { id: "wallpapers", label: "Wallpapers" },
  { id: "jersey", label: "Jersey" },
  { id: "music", label: "Música" },
  { id: "reclutamiento", label: "Únete" },
  { id: "redes", label: "Redes" },
];

export function BottomBar() {
  const { playing, toggle: toggleAudio } = useAudio();
  const {
    found,
    total,
    points,
    totalPoints,
    level,
    progressInLevel,
    complete,
    togglePanel: toggleMissions,
    panelOpen: missionsOpen,
  } = useExploration();
  const easter = useEasterEggs();

  const [active, setActive] = useState("top");
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean,
    ) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -58% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSectionsOpen(false);
  };

  const activeLabel = SECTIONS.find((s) => s.id === active)?.label ?? "Secciones";
  const pct = complete ? 100 : progressInLevel;

  return (
    <>
      {/* Sections popover */}
      <div
        className={`fixed bottom-16 left-1/2 z-[95] w-[min(560px,calc(100vw-1.5rem))] -translate-x-1/2 transition-all duration-300 sm:bottom-20 ${
          sectionsOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-flame/40 bg-background/95 p-2 shadow-[0_22px_70px_-30px_var(--flame-glow)] backdrop-blur-xl">
          <div className="flex flex-wrap justify-center gap-1.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(s.id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] transition active:scale-95 ${
                  active === s.id
                    ? "border-flame bg-flame text-primary-foreground"
                    : "border-border bg-card/60 text-muted-foreground hover:border-flame hover:text-flame"
                }`}
              >
                {s.label}
              </button>
            ))}
            <Link
              to="/xplicit-cup"
              data-explore="nav:xplicit-cup"
              onClick={() => setSectionsOpen(false)}
              className="shrink-0 rounded-full border border-flame bg-card/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-flame transition active:scale-95 hover:bg-flame hover:text-primary-foreground"
            >
              Xplicit Cup
            </Link>
          </div>
        </div>
      </div>

      {/* Redes popover */}
      {socialsOpen && (
        <>
          <div className="fixed inset-0 z-[94]" onClick={() => setSocialsOpen(false)} />
          <div className="fixed bottom-16 right-3 z-[95] w-52 rounded-lg border border-flame/40 bg-background/95 p-2 shadow-[0_0_30px_var(--flame-glow)] backdrop-blur-md sm:bottom-20 sm:right-4">
            <div className="border-b border-flame/20 px-2 pb-2 pt-1 text-[10px] font-mono uppercase tracking-[0.3em] text-flame">
              Síguenos
            </div>
            {[
              { label: "YouTube", href: SOCIALS.youtube, key: "youtube", icon: <Youtube className="h-4 w-4" /> },
              { label: "TikTok", href: SOCIALS.tiktok, key: "tiktok", icon: <span className="text-sm font-bold">♪</span> },
              { label: "Facebook", href: SOCIALS.facebook, key: "facebook", icon: <Facebook className="h-4 w-4" /> },
              { label: "X / Twitter", href: SOCIALS.x, key: "x", icon: <span className="text-sm font-bold">𝕏</span> },
              { label: "Discord", href: SOCIALS.discord, key: "discord", icon: <span className="text-sm font-bold">◆</span> },
            ].map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-explore={`social:${s.key}`}
                onClick={() => setSocialsOpen(false)}
                className="flex items-center gap-2 rounded-md px-2 py-2 text-xs font-semibold text-foreground transition hover:bg-flame/15 hover:text-flame"
              >
                {s.icon}
                {s.label}
              </a>
            ))}
          </div>
        </>
      )}

      {/* Unified bottom bar */}
      <div className="fixed inset-x-0 bottom-2 z-[90] px-2 pointer-events-none sm:bottom-4 sm:px-4">
        <div className="mx-auto flex max-w-5xl items-center gap-1 sm:gap-2 rounded-full border border-flame/50 bg-background/90 px-1.5 py-1 sm:px-2 sm:py-1.5 shadow-[0_20px_60px_-25px_var(--flame-glow)] backdrop-blur-xl pointer-events-auto overflow-hidden">
          {/* Misiones */}
          <BarButton
            onClick={toggleMissions}
            active={missionsOpen}
            label="Misiones"
            badge={`${found.length}/${total}`}
          />

          {/* Explorador */}
          <BarButton
            onClick={easter.togglePanel}
            active={easter.panelOpen}
            label="Explorador"
            badge={`${easter.state.found.length}/${easter.total}`}
          />

          {/* Progress (HUD) */}
          <div className="flex min-w-0 flex-1 items-center gap-1.5 px-1 sm:gap-2 sm:px-2">
            <span className="hidden xs:flex items-center gap-1 text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.2em] text-flame whitespace-nowrap">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame" />
              </span>
              Lv{level.index + 1}
            </span>
            <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider text-foreground truncate">
              {level.name}
            </span>
            <div className="flex-1 min-w-[30px]">
              <div className="h-1.5 overflow-hidden rounded-full border border-flame/30 bg-background/60">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: complete
                      ? "linear-gradient(90deg, #f59e0b, var(--flame))"
                      : "linear-gradient(90deg, #3b82f6, var(--flame))",
                    boxShadow: "0 0 8px var(--flame-glow)",
                  }}
                />
              </div>
            </div>
            <span className="hidden sm:inline text-[9px] font-mono uppercase tracking-[0.2em] text-flame whitespace-nowrap">
              {points}/{totalPoints} XP
            </span>
          </div>

          {/* Música */}
          <button
            type="button"
            onClick={toggleAudio}
            data-explore={playing ? "music:stop" : "music:play"}
            aria-label={playing ? "Pausar" : "Reproducir"}
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-flame px-2 text-[9px] font-mono uppercase tracking-[0.18em] text-background transition hover:scale-105 active:scale-95 sm:h-9 sm:px-3 sm:text-[10px]"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden md:inline">{playing ? "Pausar" : "Música"}</span>
          </button>

          {/* Secciones */}
          <button
            type="button"
            onClick={() => {
              setSectionsOpen((v) => !v);
              setSocialsOpen(false);
            }}
            aria-expanded={sectionsOpen}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-flame bg-background px-2 text-left transition hover:bg-flame/10 active:scale-95 sm:h-9 sm:px-3"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-flame text-background sm:h-6 sm:w-6">
              <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current sm:h-3.5 sm:w-3.5">
                <path d="M4 7h16v2H4zm0 4h16v2H4zm0 4h16v2H4z" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block text-[7px] font-bold uppercase tracking-[0.22em] text-flame sm:text-[8px]">
                Sección
              </span>
              <span className="block max-w-[20vw] truncate text-[10px] font-bold text-foreground sm:max-w-none sm:text-xs">
                {activeLabel}
              </span>
            </span>
          </button>

          {/* Redes */}
          <button
            type="button"
            onClick={() => {
              setSocialsOpen((v) => !v);
              setSectionsOpen(false);
            }}
            aria-label="Redes sociales"
            aria-expanded={socialsOpen}
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-flame bg-background px-2 text-[9px] font-mono uppercase tracking-[0.18em] text-flame transition hover:bg-flame hover:text-background active:scale-95 sm:h-9 sm:px-3 sm:text-[10px]"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Redes</span>
          </button>
        </div>
      </div>
    </>
  );
}

function BarButton({
  onClick,
  active,
  label,
  badge,
}: {
  onClick: () => void;
  active: boolean;
  label: string;
  badge: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 shrink-0 items-center gap-1 rounded-full border px-2 text-[9px] font-bold uppercase tracking-wider transition active:scale-95 sm:h-9 sm:px-2.5 sm:text-[10px] ${
        active
          ? "border-flame bg-flame/15 text-flame"
          : "border-flame/50 bg-background/60 text-flame hover:bg-flame/10"
      }`}
    >
      <span className="hidden md:inline">{label}</span>
      <span className="md:hidden">{label.slice(0, 3)}</span>
      <span className="rounded bg-flame/20 px-1 py-0.5 text-[8px] sm:text-[9px]">{badge}</span>
    </button>
  );
}

// Used in LEVELS reference to keep import even if visually unused
void LEVELS;
