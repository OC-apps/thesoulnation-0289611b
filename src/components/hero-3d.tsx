import { motion } from "framer-motion";
import soulLogo from "@/assets/soul-logo.png";

/**
 * Minimal hero — transparent (uses page background), bigger logo,
 * subtle particles + soft pulse glow. No hex grid, no brackets.
 */
export function Hero3D() {
  return (
    <div className="relative w-full h-[46vh] min-h-[380px] overflow-hidden select-none">
      {/* Soft pulsing glow behind logo */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(150,210,255,0.35), rgba(60,140,255,0.12) 45%, transparent 70%)",
          filter: "blur(20px)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.97, 1.03, 0.97] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle floating particles */}
      <Particles />

      {/* Center stage */}
      <div className="absolute inset-0 grid place-items-center px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="h-px w-10 bg-white/50" />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-white/80">
              Desde el 2012
            </span>
            <span className="h-px w-10 bg-white/50" />
          </motion.div>

          <div className="flex items-center justify-center gap-5 md:gap-8">
            <motion.img
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              src={soulLogo}
              alt="The Soul Nation"
              className="w-[26vw] max-w-[320px] min-w-[160px] aspect-square object-contain drop-shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
              draggable={false}
            />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9 }}
              className="font-display font-black italic tracking-tight leading-[0.85] text-left"
            >
              <span className="block text-white text-[clamp(2.2rem,7vw,7rem)]">
                THE SOUL
              </span>
              <span className="block text-white text-[clamp(2.2rem,7vw,7rem)]">
                NATION
              </span>
            </motion.h1>
          </div>
        </div>
      </div>
    </div>
  );
}

function Particles() {
  const items = Array.from({ length: 18 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((_, i) => {
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const dur = 9 + ((i * 7) % 8);
        const delay = (i * 0.4) % 6;
        return (
          <span
            key={i}
            className="absolute block rounded-full bg-white"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: 2 + ((i * 3) % 3),
              height: 2 + ((i * 3) % 3),
              boxShadow: "0 0 8px rgba(200,225,255,0.8)",
              opacity: 0.45,
              animation: `hero-float ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
