import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "top", label: "Inicio" },
  { id: "about", label: "Quiénes somos" },
  { id: "vision", label: "Visión" },
  { id: "objetivo", label: "Objetivo" },
  { id: "roster", label: "Roster" },
  { id: "videos", label: "Videos" },
  { id: "wallpapers", label: "Wallpapers" },
  { id: "jersey", label: "Jersey" },
  { id: "music", label: "Música" },
  { id: "reclutamiento", label: "Únete" },
  { id: "redes", label: "Redes" },
];

export function SideNav() {
  const [active, setActive] = useState("top");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const els = SECTIONS.map((section) => document.getElementById(section.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -58% 0px", threshold: 0 },
    );

    els.forEach((el) => io.observe(el));
    const onScroll = () => setScrolled(window.scrollY > 160);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  const activeLabel = SECTIONS.find((section) => section.id === active)?.label ?? "Secciones";

  return (
    <nav className="fixed inset-x-0 bottom-3 z-50 px-3 sm:bottom-5 pointer-events-none" aria-label="Navegación rápida">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2">
        <div
          className={`max-w-[calc(100vw-1.5rem)] rounded-full border border-border bg-background/95 p-1.5 shadow-[0_22px_70px_-35px_var(--flame-glow)] backdrop-blur-xl transition-all duration-300 pointer-events-auto ${
            open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex max-w-full gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => go(section.id)}
                className={`min-h-9 shrink-0 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] transition active:scale-95 ${
                  active === section.id
                    ? "border-flame bg-flame text-primary-foreground shadow-[0_0_30px_-12px_var(--flame-glow)]"
                    : "border-border bg-card/60 text-muted-foreground hover:border-flame hover:bg-flame hover:text-primary-foreground"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {scrolled && (
            <button
              type="button"
              onClick={() => go("top")}
              aria-label="Subir al inicio"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/90 text-flame shadow-lg backdrop-blur-xl transition active:scale-95 hover:border-flame"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M12 5 5 12l1.4 1.4L11 8.8V20h2V8.8l4.6 4.6L19 12z" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="group flex min-h-12 items-center gap-3 rounded-full border border-flame bg-background/95 px-4 py-2 text-left shadow-[0_18px_60px_-28px_var(--flame-glow)] backdrop-blur-xl transition active:scale-95 hover:bg-flame sm:px-5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a1e8f] text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M4 7h16v2H4zm0 4h16v2H4zm0 4h16v2H4z" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-flame transition group-hover:text-primary-foreground">Secciones</span>
              <span className="block max-w-[44vw] truncate text-xs text-foreground transition group-hover:text-primary-foreground sm:max-w-none sm:text-sm">{activeLabel}</span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}