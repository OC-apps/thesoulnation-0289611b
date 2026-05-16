import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "top", label: "Inicio" },
  { id: "about", label: "Quiénes somos" },
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
  const [expanded, setExpanded] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
        setShowTop(window.scrollY > 400);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Navegación rápida"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-50 flex-col items-end gap-2"
    >
      <div className="flex flex-col gap-2 p-2 rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              className="group relative flex items-center justify-end gap-3 h-9 pr-2"
              aria-label={`Ir a ${s.label}`}
            >
              <span
                className={`text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 ${
                  expanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
                } ${isActive ? "text-flame" : "text-foreground/80"}`}
              >
                {s.label}
              </span>
              <span
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  isActive ? "w-5 h-5" : "w-3 h-3 group-hover:w-4 group-hover:h-4"
                }`}
              >
                <span
                  className={`absolute inset-0 rounded-full transition-all ${
                    isActive
                      ? "bg-flame shadow-[0_0_20px_var(--flame-glow)] scale-100"
                      : "bg-foreground/30 group-hover:bg-flame/70 scale-75"
                  }`}
                />
                {isActive && <span className="absolute inset-0 rounded-full bg-flame animate-ping opacity-60" />}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => go("top")}
        aria-label="Subir arriba"
        className={`w-11 h-11 rounded-full bg-flame text-primary-foreground flex items-center justify-center shadow-[0_0_40px_-5px_var(--flame-glow)] hover:scale-110 active:scale-95 transition-all duration-300 ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 4l8 8h-5v8h-6v-8H4z" /></svg>
      </button>
    </nav>
  );
}
