import { motion } from "framer-motion";
import soulLogo from "@/assets/soul-logo.png";
import soulTextLogo from "@/assets/soul-nation-textlogo.png";

/**
 * Bold, content-rich hero — no particle/snow effect.
 * Big logo + name, tagline, CTAs, animated gradient + tag marquee.
 */
export function Hero3D() {
  return (
    <div className="relative w-full min-h-[auto] lg:min-h-[88vh] overflow-hidden select-none flex items-center">
      {/* Animated gradient mesh */}
      <motion.div
        aria-hidden
        className="absolute -top-1/3 -left-1/4 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--flame) 55%, transparent), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-1/3 -right-1/4 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(120,180,255,0.45), transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ opacity: [0.4, 0.75, 0.4], scale: [1.05, 1, 1.05] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-8 py-16 md:py-28 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Left: copy */}
        <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Banner: emblem + text logo together (mobile + tablet) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative flex lg:hidden items-center justify-center gap-3 sm:gap-5 w-full"
          >
            <div className="relative flex-shrink-0">
              <motion.div
                aria-hidden
                className="absolute inset-0 m-auto w-full aspect-square rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in oklab, var(--flame) 45%, transparent), transparent 70%)",
                  filter: "blur(22px)",
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <img
                src={soulLogo}
                alt="The Soul Nation"
                className="relative z-10 w-24 sm:w-36 md:w-44 aspect-square object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                draggable={false}
              />
            </div>
            <img
              src={soulTextLogo}
              alt="THE SOUL NATION"
              className="relative z-10 flex-1 max-w-[220px] sm:max-w-[360px] md:max-w-[460px] h-auto object-contain drop-shadow-[0_0_30px_var(--flame-glow)]"
              draggable={false}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 lg:mt-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-flame/40 bg-flame/10 text-flame text-[10px] font-mono uppercase tracking-[0.3em]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-flame animate-pulse" />
            EST. 10 · NOV · 2012
          </motion.div>

          {/* Desktop text logo */}
          <motion.img
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            src={soulTextLogo}
            alt="THE SOUL NATION"
            className="hidden lg:block mt-5 w-full max-w-[640px] h-auto drop-shadow-[0_0_40px_var(--flame-glow)]"
            draggable={false}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 flex flex-row flex-nowrap items-stretch justify-center lg:justify-start gap-2 sm:gap-3 w-full"
          >
            <a
              href="#roster"
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-6 py-3 rounded-full bg-flame text-background font-display font-bold uppercase tracking-[0.08em] sm:tracking-[0.2em] text-[11px] sm:text-sm whitespace-nowrap shadow-[0_0_28px_var(--flame-glow)] hover:scale-105 transition active:scale-95"
            >
              ► Conoce el Roster
            </a>
            <a
              href="#reclutamiento"
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-6 py-3 rounded-full border-2 border-flame text-flame font-display font-bold uppercase tracking-[0.08em] sm:tracking-[0.2em] text-[11px] sm:text-sm whitespace-nowrap hover:bg-flame hover:text-background transition active:scale-95"
            >
              Únete a la Nación
            </a>
          </motion.div>
        </div>

        {/* Right: logo emblem (desktop only) */}
        <div className="hidden lg:flex md:col-span-5 relative items-center justify-center">

          <motion.div
            aria-hidden
            className="absolute inset-0 m-auto w-[80%] aspect-square rounded-full border border-flame/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-0 m-auto w-[95%] aspect-square rounded-full border border-flame/15 border-dashed"
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-0 m-auto w-[60%] aspect-square rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--flame) 40%, transparent), transparent 70%)",
              filter: "blur(30px)",
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            src={soulLogo}
            alt="The Soul Nation"
            className="relative z-10 w-[65%] max-w-[360px] min-w-[200px] aspect-square object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 inset-x-0 border-t border-flame/30 bg-background/40 backdrop-blur-sm py-2 overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap animate-marquee font-mono text-[10px] uppercase tracking-[0.4em] text-flame">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>★ The Soul Nation</span>
              <span className="text-muted-foreground">Gears of War</span>
              <span>★ Streamers</span>
              <span className="text-muted-foreground">México</span>
              <span>★ Desde 2012</span>
              <span className="text-muted-foreground">Familia</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
