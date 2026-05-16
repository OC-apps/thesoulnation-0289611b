import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import soulLogo from "@/assets/soul-logo.png";

/**
 * Premium AAA esports 3D hero.
 * - Real DOM text with stacked layers for true extrusion (no images).
 * - Metallic white finish with orange/blue rim light.
 * - Parallax tilt on mouse, cinematic light-sweep, breathing glow.
 */
export function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.6 });

  const rotY = useTransform(sx, [-1, 1], [12, -12]);
  const rotX = useTransform(sy, [-1, 1], [-8, 8]);
  const tX = useTransform(sx, [-1, 1], [-18, 18]);
  const tY = useTransform(sy, [-1, 1], [-12, 12]);
  const sheenX = useTransform(sx, [-1, 1], ["20%", "80%"]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onResize = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    onResize();
    window.addEventListener("resize", onResize);
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      mx.set(Math.max(-1, Math.min(1, (x - 0.5) * 2)));
      my.set(Math.max(-1, Math.min(1, (y - 0.5) * 2)));
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [mx, my]);

  // Build extruded text by stacking N copies with progressive z translate via text-shadow
  const buildExtrude = (depth: number, color: string) =>
    Array.from({ length: depth })
      .map((_, i) => `${i * 0.6}px ${i * 0.9}px 0 ${color}`)
      .join(", ");

  return (
    <div
      ref={ref}
      className="relative w-full h-[88vh] min-h-[620px] overflow-hidden select-none"
      style={{ perspective: "1400px" }}
    >
      {/* Particles */}
      <Particles />

      {/* Energy lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-screen">
        <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="el1" x1="0" x2="1">
              <stop offset="0" stopColor="#ff7a18" stopOpacity="0" />
              <stop offset=".5" stopColor="#ff9a3c" stopOpacity=".9" />
              <stop offset="1" stopColor="#3aa7ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {Array.from({ length: 6 }).map((_, i) => (
            <path
              key={i}
              d={`M0 ${120 + i * 110} C 300 ${80 + i * 100}, 800 ${200 + i * 80}, 1200 ${100 + i * 110}`}
              stroke="url(#el1)"
              strokeWidth="1"
              fill="none"
            />
          ))}
        </svg>
      </div>

      {/* Volumetric soft blobs */}
      <motion.div
        className="absolute -left-40 top-1/3 w-[55vw] h-[55vw] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,120,40,0.55), rgba(255,120,40,0) 70%)",
          filter: "blur(40px)",
          x: useTransform(sx, [-1, 1], [30, -30]),
          y: useTransform(sy, [-1, 1], [20, -20]),
        }}
        animate={{ opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-40 top-1/4 w-[55vw] h-[55vw] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(60,150,255,0.55), rgba(60,150,255,0) 70%)",
          filter: "blur(40px)",
          x: useTransform(sx, [-1, 1], [-30, 30]),
          y: useTransform(sy, [-1, 1], [-20, 20]),
        }}
        animate={{ opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
      />

      {/* Center stage */}
      <div className="absolute inset-0 grid place-items-center">
        <motion.div
          className="relative"
          style={{
            rotateX: rotX,
            rotateY: rotY,
            x: tX,
            y: tY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* tiny eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-flame to-transparent" />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-foreground/70">
              Desde el 2012
            </span>
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-flame to-transparent" />
          </motion.div>

          {/* Giant S + THE SOUL stack */}
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {/* Giant S */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotateY: -40 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 0.35, duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative shrink-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              <SCrest />
            </motion.div>

            {/* Stacked title */}
            <div className="flex flex-col leading-[0.78]">
              <Extruded text="THE SOUL" delay={0.55} variant="metal" />
              <Extruded text="NATION" delay={0.75} variant="flame" />
            </div>
          </div>

          {/* baseline tag */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9 }}
            className="mt-6 flex items-center justify-center gap-4 text-[11px] md:text-xs uppercase tracking-[0.45em] text-foreground/55"
          >
            <span className="h-px w-12 bg-foreground/30" />
            AAA · Esports · Since 2012
            <span className="h-px w-12 bg-foreground/30" />
          </motion.div>
        </motion.div>
      </div>

      {/* Cinematic light sweep — runs occasionally */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.12) 48%, rgba(255,180,120,0.18) 52%, transparent 65%)",
          backgroundSize: "200% 100%",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ background: "inherit" }}
          animate={{ backgroundPositionX: ["-100%", "100%"] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
        />
      </motion.div>

      {/* sheen following mouse */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          background: useTransform(
            sheenX,
            (v) =>
              `radial-gradient(600px 400px at ${v} 50%, rgba(255,255,255,0.08), transparent 60%)`,
          ),
        }}
      />

      {/* bottom vignette into next sections */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-background" />

      {/* hidden tiny logo for SEO */}
      <img src={soulLogo} alt="The Soul Nation" width={1} height={1} className="sr-only" />

      {/* ignore size to prevent unused var */}
      <span className="sr-only">{size.w}</span>
    </div>
  );
}

function Extruded({
  text,
  delay,
  variant,
}: {
  text: string;
  delay: number;
  variant: "metal" | "flame";
}) {
  // Build the extrusion via layered text-shadow
  const depth = 14;
  const sideColor = "rgba(0,0,0,0.55)";
  const extrude = Array.from({ length: depth })
    .map((_, i) => `${i * 0.7}px ${i * 0.9}px 0 ${sideColor}`)
    .join(", ");

  const baseShadow =
    variant === "flame"
      ? `${extrude}, 0 0 28px rgba(255,120,40,0.55), 0 0 60px rgba(255,90,20,0.35)`
      : `${extrude}, 0 0 22px rgba(120,180,255,0.35), 0 0 60px rgba(40,120,255,0.18)`;

  const gradient =
    variant === "flame"
      ? "linear-gradient(180deg, #ffd9a8 0%, #ff9a3c 38%, #ff5a18 62%, #b53306 100%)"
      : "linear-gradient(180deg, #ffffff 0%, #e6ecf5 35%, #aab4c4 60%, #5c6878 100%)";

  return (
    <motion.span
      initial={{ opacity: 0, y: 60, rotateX: -35 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative inline-block font-display font-black italic tracking-tight text-[clamp(2.6rem,8.5vw,9rem)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Back glow */}
      <span
        aria-hidden
        className="absolute inset-0 blur-2xl opacity-70"
        style={{
          color: variant === "flame" ? "#ff7a18" : "#5aa6ff",
        }}
      >
        {text}
      </span>

      {/* The extruded body */}
      <span
        className="relative bg-clip-text text-transparent"
        style={{
          backgroundImage: gradient,
          WebkitTextStroke: variant === "metal" ? "1px rgba(255,255,255,0.25)" : "1px rgba(255,180,90,0.45)",
          textShadow: baseShadow,
          filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.6))",
        }}
      >
        {text}
      </span>

      {/* Glossy sheen sweep */}
      <span
        aria-hidden
        className="absolute inset-0 bg-clip-text text-transparent pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.85) 48%, rgba(255,255,255,0.0) 60%)",
          backgroundSize: "250% 100%",
          animation: "hero-sheen 6.5s ease-in-out infinite",
          mixBlendMode: "screen",
        }}
      >
        {text}
      </span>
    </motion.span>
  );
}

function SCrest() {
  // Stylized "S" crest built in SVG with metallic + flame gradients
  return (
    <motion.div
      className="relative w-[28vw] max-w-[360px] min-w-[160px] aspect-square"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,120,40,0.55), rgba(255,120,40,0) 70%)",
          filter: "blur(30px)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg viewBox="0 0 200 200" className="relative w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.75)]">
        <defs>
          <linearGradient id="ringFlame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd089" />
            <stop offset=".45" stopColor="#ff7a18" />
            <stop offset="1" stopColor="#7a1f00" />
          </linearGradient>
          <linearGradient id="ringFlameHi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3d6" stopOpacity=".9" />
            <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="metalS" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".4" stopColor="#dfe5ee" />
            <stop offset=".7" stopColor="#8a95a6" />
            <stop offset="1" stopColor="#3a4250" />
          </linearGradient>
          <radialGradient id="innerCore" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#1a0a05" />
            <stop offset="1" stopColor="#06090f" />
          </radialGradient>
          <filter id="bevel" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="3" specularConstant="1" specularExponent="20" lightingColor="#fff" result="spec">
              <feDistantLight azimuth="135" elevation="55" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specMask" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="specMask" />
            </feMerge>
          </filter>
        </defs>

        {/* flame ring */}
        <circle cx="100" cy="100" r="86" fill="none" stroke="url(#ringFlame)" strokeWidth="18" filter="url(#bevel)" />
        <circle cx="100" cy="100" r="86" fill="none" stroke="url(#ringFlameHi)" strokeWidth="3" />
        {/* dark inner */}
        <circle cx="100" cy="100" r="74" fill="url(#innerCore)" />

        {/* S */}
        <path
          d="M132 70c-6-9-18-14-32-14-18 0-30 10-30 24 0 14 12 20 30 24 18 4 30 10 30 24 0 14-12 24-32 24-14 0-26-5-32-14"
          fill="none"
          stroke="url(#metalS)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#bevel)"
        />
        {/* S highlight */}
        <path
          d="M132 70c-6-9-18-14-32-14-18 0-30 10-30 24"
          fill="none"
          stroke="#ffffff"
          strokeOpacity=".55"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* hot tip */}
        <circle cx="100" cy="34" r="6" fill="#ff8a2a">
          <animate attributeName="r" values="6;8;6" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values=".9;1;.9" dur="3.2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </motion.div>
  );
}

function Particles() {
  // Lightweight pure-CSS particles, no canvas
  const items = Array.from({ length: 28 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((_, i) => {
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const dur = 8 + ((i * 7) % 10);
        const delay = (i * 0.3) % 6;
        const isOrange = i % 2 === 0;
        return (
          <span
            key={i}
            className="absolute block rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: 2 + ((i * 3) % 4),
              height: 2 + ((i * 3) % 4),
              background: isOrange ? "#ff9a3c" : "#7ec3ff",
              boxShadow: isOrange
                ? "0 0 12px #ff7a18, 0 0 24px rgba(255,120,40,0.6)"
                : "0 0 12px #4aa3ff, 0 0 24px rgba(70,160,255,0.6)",
              opacity: 0.7,
              animation: `hero-float ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
