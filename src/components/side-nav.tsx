import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "top", label: "Inicio", icon: "M3 12l9-9 9 9v9h-6v-6h-6v6H3z" },
  { id: "about", label: "Quiénes somos", icon: "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z" },
  { id: "roster", label: "Roster", icon: "M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-8 2-8 5v2h12v-2c0-1 .3-2 .8-3-1.4-1.2-3.3-2-4.8-2zm8 0c-1 0-2 .2-3 .6 1.2 1.2 2 2.7 2 4.4v2h7v-2c0-3-4-5-6-5z" },
  { id: "videos", label: "Videos", icon: "M21 7l-7 5 7 5V7zM3 6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H3z" },
  { id: "wallpapers", label: "Wallpapers", icon: "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5L19 18H5l3.5-4.5z" },
  { id: "jersey", label: "Jersey", icon: "M14 4l4 1 4 3-3 4-2-1v9H7v-9l-2 1-3-4 4-3 4-1c0 1 1 2 2 2s2-1 2-2z" },
  { id: "music", label: "Música", icon: "M12 3v10.5A3.5 3.5 0 1 1 10 10V5h8V3h-6z" },
  { id: "reclutamiento", label: "Únete", icon: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" },
  { id: "redes", label: "Redes", icon: "M18 8a3 3 0 1 0-2.8-4H15a4 4 0 0 0-4 4v1l-5 2a3 3 0 1 0 0 4l5 2v1a4 4 0 0 0 4 4h.2a3 3 0 1 0 2.8-4 3 3 0 0 0-2.8 2H15a2 2 0 0 1-2-2v-1l4-1.5a3 3 0 0 0 1 .5 3 3 0 1 0-3-3l-4 1.5V8a2 2 0 0 1 2-2h.2A3 3 0 0 0 18 8z" },
];

export function SideNav() {
  const [active, setActive] = useState("top");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | null>(null);

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
    const onScroll = () => setScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-sidenav]")) setOpen(false);
    };
    window.addEventListener("pointerdown", onClick);
    return () => window.removeEventListener("pointerdown", onClick);
  }, [open]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 400);
  };

  const count = SECTIONS.length;
  const radius = 130; // px

  return (
    <div
      data-sidenav
      className={`fixed bottom-5 right-5 md:bottom-7 md:right-7 z-50 transition-all duration-500 ${
        scrolled || open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Backdrop blur cuando está abierto */}
      <div
        aria-hidden
        className={`fixed inset-0 -z-10 bg-background/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Menú radial */}
      <div className="relative w-14 h-14 md:w-16 md:h-16">
        {SECTIONS.map((s, i) => {
          // Arco de -180° (izquierda) a -90° (arriba) → cuarto superior-izquierdo
          const angle = (-180 + (i * 90) / (count - 1)) * (Math.PI / 180);
          const x = open ? Math.cos(angle) * radius : 0;
          const y = open ? Math.sin(angle) * radius : 0;
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              aria-label={s.label}
              title={s.label}
              style={{
                transform: `translate(${x}px, ${y}px) scale(${open ? 1 : 0.3})`,
                transitionDelay: `${open ? i * 35 : (count - i) * 15}ms`,
              }}
              className={`group absolute inset-0 m-auto w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "opacity-100" : "opacity-0 pointer-events-none"
              } ${
                isActive
                  ? "bg-flame text-primary-foreground border-flame shadow-[0_0_30px_-5px_var(--flame-glow)]"
                  : "bg-background/80 backdrop-blur-md text-foreground border-white/15 hover:bg-flame hover:text-primary-foreground hover:border-flame hover:scale-110"
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d={s.icon} /></svg>
              <span className="absolute right-full mr-3 px-2 py-1 rounded-md bg-background/90 border border-border text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                {s.label}
              </span>
            </button>
          );
        })}

        {/* Botón principal */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú de navegación"}
          aria-expanded={open}
          className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-flame text-primary-foreground flex items-center justify-center shadow-[0_10px_40px_-5px_var(--flame-glow)] hover:scale-110 active:scale-95 transition-all duration-300 ${
            open ? "rotate-45" : "rotate-0"
          }`}
        >
          <span className="absolute inset-0 rounded-full bg-flame animate-ping opacity-30" />
          <svg viewBox="0 0 24 24" className="relative w-7 h-7 fill-current">
            <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
