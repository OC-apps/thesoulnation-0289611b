import { motion } from "framer-motion";
import soulLogo from "@/assets/soul-logo.png";

/**
 * Bold, content-rich hero — no particle/snow effect.
 * Big logo + name, tagline, CTAs, animated gradient + tag marquee.
 */
export function Hero3D() {
  return (
    <div className="relative w-full min-h-[88vh] overflow-hidden select-none flex items-center">
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
      <div className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-8 py-20 md:py-28 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Left: copy */}
        <div className="md:col-span-7 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-flame/40 bg-flame/10 text-flame text-[10px] font-mono uppercase tracking-[0.3em]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-flame animate-pulse" />
            EST. 10 · NOV · 2012
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-5 font-display font-black italic tracking-tight leading-[0.85] text-[clamp(3rem,11vw,8.5rem)]"
          >
            <span className="block text-foreground">THE SOUL</span>
            <span className="block text-flame drop-shadow-[0_0_30px_var(--flame-glow)]">
              NATION
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <a
              href="#roster"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-flame text-background font-display font-bold uppercase tracking-[0.2em] text-sm shadow-[0_0_28px_var(--flame-glow)] hover:scale-105 transition active:scale-95"
            >
              ► Conoce el Roster
            </a>
            <a
              href="#reclutamiento"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-flame text-flame font-display font-bold uppercase tracking-[0.2em] text-sm hover:bg-flame hover:text-background transition active:scale-95"
            >
              Únete a la Nación
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10 grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-md"
          >
            {[
              { v: "12+", k: "Años" },
              { v: "35", k: "Miembros" },
              { v: "∞", k: "Familia" },
            ].map((s) => (
              <div key={s.k} className="border-l-2 border-flame/60 pl-3">
                <div className="font-display font-black text-2xl sm:text-3xl text-foreground">
                  {s.v}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                  {s.k}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: logo emblem */}
        <div className="md:col-span-5 relative flex items-center justify-center order-first md:order-last">
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
