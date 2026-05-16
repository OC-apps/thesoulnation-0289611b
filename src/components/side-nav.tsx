import { useEffect, useRef, useState } from "react";

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
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const clearHide = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = null;
  };
  const scheduleHide = (ms = 1800) => {
    clearHide();
    hideTimer.current = window.setTimeout(() => setOpen(false), ms);
  };

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    scheduleHide(900);
  };

  return (
    <>
      {/* Edge trigger zone — invisible, captura hover/touch en el borde derecho */}
      <div
        aria-hidden
        onMouseEnter={() => {
          clearHide();
          setOpen(true);
        }}
        onTouchStart={() => {
          clearHide();
          setOpen(true);
          scheduleHide(4000);
        }}
        className="fixed right-0 top-0 h-full w-6 md:w-8 z-40"
      />

      <nav
        aria-label="Navegación rápida"
        onMouseEnter={() => {
          clearHide();
          setOpen(true);
        }}
        onMouseLeave={() => scheduleHide()}
        className={`fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-2 transition-all duration-500 ${
          open ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-6 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-1.5 md:gap-2 p-1.5 md:p-2 rounded-2xl bg-background/60 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => go(s.id)}
                className="group relative flex items-center justify-end gap-3 h-8 md:h-9 pr-1.5 md:pr-2"
                aria-label={`Ir a ${s.label}`}
              >
                <span
                  className={`text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${
                    isActive ? "text-flame" : "text-foreground/80"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    isActive ? "w-4 h-4" : "w-2.5 h-2.5 group-hover:w-3.5 group-hover:h-3.5"
                  }`}
                >
                  <span
                    className={`absolute inset-0 rounded-full transition-all ${
                      isActive
                        ? "bg-flame shadow-[0_0_20px_var(--flame-glow)]"
                        : "bg-foreground/40 group-hover:bg-flame/70"
                    }`}
                  />
                  {isActive && <span className="absolute inset-0 rounded-full bg-flame animate-ping opacity-60" />}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Botón "arriba" minimalista — aparece tras scroll y se oculta solo */}
      <button
        type="button"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          scheduleHide(600);
        }}
        onMouseEnter={() => {
          clearHide();
          setOpen(true);
        }}
        onMouseLeave={() => scheduleHide()}
        aria-label="Subir arriba"
        className={`fixed right-3 md:right-5 bottom-5 md:bottom-6 z-50 w-10 h-10 md:w-11 md:h-11 rounded-full bg-flame text-primary-foreground flex items-center justify-center shadow-[0_0_40px_-5px_var(--flame-glow)] hover:scale-110 active:scale-95 transition-all duration-300 ${
          showTop ? "opacity-90 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 4l8 8h-5v8h-6v-8H4z" /></svg>
      </button>
    </>
  );
}
