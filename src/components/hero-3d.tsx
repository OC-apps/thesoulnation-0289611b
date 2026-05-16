import { motion } from "framer-motion";
import soulLogo from "@/assets/soul-logo.png";

/**
 * AAA esports hero — flat orange broadcast aesthetic.
 * - Solid orange gradient background covering anything beneath.
 * - Hex grid, scan-line sweep, corner HUD brackets, soft particles.
 * - Flat text (no 3D extrusion, no glow) in the same display font.
 */
export function Hero3D() {
  return (
    <div className="relative w-full h-[88vh] min-h-[620px] overflow-hidden select-none isolate">
      {/* Solid orange base — kills any background underneath */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 40%, #ff8a2a 0%, #f0590c 35%, #b8330a 65%, #5a1604 100%)",
        }}
      />

      {/* Hex grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='64' viewBox='0 0 56 64'><path d='M28 0L56 16v32L28 64 0 48V16z' fill='none' stroke='%23000' stroke-width='1'/></svg>\")",
          backgroundSize: "56px 64px",
        }}
      />

      {/* Diagonal speed stripes */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(115deg, transparent 0 22px, rgba(0,0,0,0.35) 22px 24px)",
        }}
      />

      {/* Bottom dark gradient + top vignette */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(120%_80%_at_50%_40%,transparent_55%,rgba(0,0,0,0.55)_100%)]" />

      {/* Animated scan-line sweep */}
      <motion.div
        className="absolute inset-x-0 h-40 pointer-events-none mix-blend-screen"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(255,220,180,0.25), transparent)",
          filter: "blur(6px)",
        }}
        animate={{ y: ["-20%", "120%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Light streaks */}
      <motion.div
        className="absolute -top-20 -left-20 w-[60%] h-[60%] pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,235,180,0.45), transparent 70%)",
          filter: "blur(40px)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 w-[65%] h-[65%] pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,140,50,0.55), transparent 70%)",
          filter: "blur(50px)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />

      {/* Particles */}
      <Particles />

      {/* HUD corner brackets */}
      <Brackets />

      {/* Center stage */}
      <div className="absolute inset-0 grid place-items-center px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-10 bg-white/60" />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-white/80">
              Desde el 2012
            </span>
            <span className="h-px w-10 bg-white/60" />
          </motion.div>

          <div className="flex items-center justify-center gap-5 md:gap-8">
            <motion.img
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              src={soulLogo}
              alt="The Soul Nation"
              className="w-[18vw] max-w-[200px] min-w-[110px] aspect-square object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
              draggable={false}
            />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.9 }}
              className="font-display font-black italic tracking-tight leading-[0.85] text-left"
            >
              <span className="block text-white text-[clamp(2.4rem,8vw,8.5rem)]">
                THE SOUL
              </span>
              <span className="block text-white text-[clamp(2.4rem,8vw,8.5rem)]">
                NATION
              </span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-7 flex items-center gap-4 text-[11px] md:text-xs uppercase tracking-[0.5em] text-white/75"
          >
            <span className="h-px w-12 bg-white/40" />
            AAA · Esports · Since 2012
            <span className="h-px w-12 bg-white/40" />
          </motion.div>
        </div>
      </div>

      {/* bottom blend into next section */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-background pointer-events-none" />
    </div>
  );
}

function Brackets() {
  const corner =
    "absolute w-16 h-16 md:w-24 md:h-24 border-white/70 pointer-events-none";
  return (
    <>
      <div className={`${corner} top-6 left-6 border-t-2 border-l-2`} />
      <div className={`${corner} top-6 right-6 border-t-2 border-r-2`} />
      <div className={`${corner} bottom-24 left-6 border-b-2 border-l-2`} />
      <div className={`${corner} bottom-24 right-6 border-b-2 border-r-2`} />
    </>
  );
}

function Particles() {
  const items = Array.from({ length: 32 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((_, i) => {
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const dur = 8 + ((i * 7) % 10);
        const delay = (i * 0.3) % 6;
        return (
          <span
            key={i}
            className="absolute block rounded-full bg-white"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: 2 + ((i * 3) % 3),
              height: 2 + ((i * 3) % 3),
              boxShadow: "0 0 10px rgba(255,235,200,0.9)",
              opacity: 0.6,
              animation: `hero-float ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
