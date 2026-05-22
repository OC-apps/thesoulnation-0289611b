import { useEffect, useRef, useState } from "react";
import xplicitLogo from "@/assets/xplicit-cup-logo.png";

const teams = ["Essence", "Logic", "Guns", "HzE", "Da Best", "Resurrection K", "The Soul Nation", "Otros invitados"];
const casters = [
  { name: "Soul Maverick", role: "Host principal" },
  { name: "Betrucci", role: "Caster invitado" },
  { name: "EMK Krauser", role: "Caster invitado" },
  { name: "xCJVx Howard", role: "Caster invitado" },
];
const proPlayers = ["Identives", "Summuns", "Sleafer", "Crack", "Cristalize", "Xploidz", "Involving"];
const champions = ["The Soul Nation", "Resurrection K", "Guns", "Fireball", "Logic"];
const stats = [
  { k: "2013", v: "Año del debut" },
  { k: "LIVE", v: "Transmisión YouTube" },
  { k: "01", v: "Campeón: Soul Nation" },
  { k: "∞", v: "Legado competitivo" },
];

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => e.forEach((x) => x.isIntersecting && (setSeen(true), io.disconnect())),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}

export function XplicitCup() {
  const { ref: heroRef, seen: heroSeen } = useReveal<HTMLDivElement>();

  return (
    <section
      id="xplicit-cup"
      className="relative py-20 md:py-28 border-t border-border overflow-hidden scroll-mt-24"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.18 0.18 258 / 0.35), transparent 70%), linear-gradient(180deg, #03060d 0%, #050810 100%)",
      }}
    >
      {/* Grid técnico */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.70 0.24 45) 1px, transparent 1px), linear-gradient(90deg, oklch(0.70 0.24 45) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      {/* Diagonal esports */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-flame to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-flame to-transparent" />
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] opacity-30"
        style={{ background: "oklch(0.55 0.24 255)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-[140px] opacity-25"
        style={{ background: "oklch(0.70 0.24 45)" }}
      />

      {/* LIVE BROADCAST marquee */}
      <div className="relative overflow-hidden border-y border-flame/30 bg-background/60 backdrop-blur py-2 mb-12">
        <div className="flex gap-10 whitespace-nowrap animate-marquee font-display text-sm md:text-base font-bold tracking-[0.25em] uppercase">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-10 items-center shrink-0">
              {["● LIVE BROADCAST", "Xplicit Cup", "10·02·2013", "Gears of War", "Soul Nation Champion", "★"].map((t, j) => (
                <span key={j} className={j % 2 === 0 ? "text-flame" : "text-foreground/70"}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        {/* HERO */}
        <div
          ref={heroRef}
          className="grid md:grid-cols-12 gap-8 md:gap-10 items-center"
          style={{
            opacity: heroSeen ? 1 : 0,
            transform: heroSeen ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.9s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div className="md:col-span-5 flex flex-col items-center md:items-start">
            <div className="relative">
              <div
                className="absolute inset-0 -m-8 rounded-full blur-[60px] opacity-60"
                style={{ background: "radial-gradient(circle, var(--flame-glow), transparent 70%)" }}
              />
              <img
                src={xplicitLogo}
                alt="Xplicit Cup"
                className="relative w-56 sm:w-64 md:w-80 h-auto object-contain drop-shadow-[0_0_40px_var(--flame-glow)]"
                style={{
                  animation: heroSeen ? "xc-float 6s ease-in-out infinite" : "none",
                }}
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-flame font-mono mb-3">
              <span className="w-2 h-2 rounded-full bg-flame animate-pulse" />
              Archivo histórico · 2013
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
              Xplicit <span className="italic text-flame" style={{ textShadow: "0 0 40px var(--flame-glow)" }}>Cup</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-foreground/80 leading-relaxed max-w-2xl">
              El torneo que marcó historia en la escena competitiva latina de <span className="text-foreground font-bold">Gears of War</span>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-flame/50 bg-flame/10 text-flame text-xs font-mono uppercase tracking-[0.25em] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-flame animate-pulse" />
                10 · Febrero · 2013
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/50 bg-red-500/10 text-red-400 text-xs font-mono uppercase tracking-[0.25em] font-bold">
                ● Transmitido en vivo · YouTube
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/50 bg-yellow-500/10 text-yellow-300 text-xs font-mono uppercase tracking-[0.25em] font-bold">
                🏆 Soul Nation · Campeón
              </span>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map((s, i) => (
            <div
              key={s.k}
              className="relative rounded-xl border border-flame/20 bg-background/60 backdrop-blur p-4 md:p-5 overflow-hidden group hover:border-flame/60 transition"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 0%, oklch(0.70 0.24 45 / 0.25), transparent 70%)" }} />
              <div className="relative font-display text-3xl md:text-4xl font-black text-flame" style={{ textShadow: "0 0 20px var(--flame-glow)" }}>
                {s.k}
              </div>
              <div className="relative mt-1 text-[10px] uppercase tracking-[0.25em] text-foreground/60 font-mono">{s.v}</div>
            </div>
          ))}
        </div>

        {/* HISTORIA */}
        <div className="mt-16 grid md:grid-cols-12 gap-6">
          <div className="md:col-span-12">
            <div className="text-xs uppercase tracking-[0.3em] text-flame font-mono mb-2">◢ Historia</div>
            <h3 className="font-display text-3xl md:text-5xl font-bold leading-tight">
              El torneo que <span className="italic text-flame">marcó historia</span>
            </h3>
          </div>
          <article className="md:col-span-7 relative rounded-2xl border border-border bg-card/40 backdrop-blur p-6 md:p-8 overflow-hidden">
            <span className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-flame" />
            <span className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-flame" />
            <p className="text-foreground/85 leading-relaxed">
              El <span className="text-flame font-bold">10 de febrero de 2013</span>, The Soul Nation hizo historia dentro de la comunidad competitiva de Gears of War de habla hispana con la creación de <span className="text-foreground font-bold">Xplicit Cup</span>, uno de los primeros torneos transmitidos completamente <span className="text-flame">en vivo por YouTube</span> para la escena latina.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              La primera edición reunió a algunos de los equipos más fuertes y respetados de la comunidad competitiva mexicana, incluyendo nombres como <span className="font-bold">{teams.join(", ")}</span>.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              En esa primera edición, <span className="text-flame font-bold">The Soul Nation se coronó campeón</span>, consolidando su presencia como una organización capaz de competir, producir y liderar dentro de la comunidad.
            </p>
          </article>
          {/* Timeline */}
          <aside className="md:col-span-5 relative rounded-2xl border border-flame/30 bg-background/50 backdrop-blur p-6 md:p-8">
            <div className="text-[10px] uppercase tracking-[0.3em] text-flame font-mono mb-4">◤ Timeline</div>
            <ol className="relative border-l border-flame/40 space-y-5 ml-2">
              {[
                { d: "10·02·2013", t: "Debut Xplicit Cup", s: "Primera transmisión en vivo por YouTube." },
                { d: "Final 1", t: "Soul Nation Campeón", s: "Primer título oficial de la organización." },
                { d: "Legacy", t: "Próxima generación", s: "Pro players nacidos del torneo." },
                { d: "Hoy", t: "Referente latino", s: "Producción, comunidad y competencia." },
              ].map((m, i) => (
                <li key={i} className="ml-4 relative">
                  <span className="absolute -left-[1.42rem] top-1 w-3 h-3 rounded-full bg-flame shadow-[0_0_18px_var(--flame-glow)]" />
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-flame/80">{m.d}</div>
                  <div className="font-display font-bold mt-0.5">{m.t}</div>
                  <div className="text-xs text-foreground/65 mt-0.5">{m.s}</div>
                </li>
              ))}
            </ol>
          </aside>
        </div>




        {/* CASTERS */}
        <div className="mt-20">
          <div className="text-xs uppercase tracking-[0.3em] text-flame font-mono mb-2">◢ Broadcast</div>
          <h3 className="font-display text-3xl md:text-5xl font-bold mb-6">La voz del torneo</h3>
          <div className="relative rounded-2xl border border-flame/30 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur p-6 md:p-8 overflow-hidden">
            <span className="absolute top-3 left-3 inline-flex items-center gap-2 px-2 py-1 rounded bg-red-500/20 border border-red-500/50 text-red-400 text-[9px] font-mono uppercase tracking-[0.3em]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
            </span>
            {/* waves */}
            <div className="absolute bottom-3 right-4 flex items-end gap-0.5 h-6 opacity-50">
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className="w-0.5 bg-flame rounded-full"
                  style={{
                    height: `${20 + Math.sin(i * 0.7) * 50 + 30}%`,
                    animation: `xc-wave 1.2s ease-in-out ${i * 60}ms infinite`,
                  }}
                />
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-8">
              {casters.map((c) => (
                <div key={c.name} className="group relative rounded-xl border border-border bg-background/70 p-4 hover:border-flame transition">
                  <div className="flex items-center gap-2 text-flame text-[10px] uppercase tracking-[0.25em] font-mono">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3"/></svg>
                    {c.role}
                  </div>
                  <div className="mt-2 font-display font-bold text-lg">{c.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRO PLAYERS */}
        <div className="mt-20">
          <div className="text-xs uppercase tracking-[0.3em] text-flame font-mono mb-2">◢ Legacy</div>
          <h3 className="font-display text-3xl md:text-5xl font-bold mb-2">Del torneo a la escena <span className="italic text-flame">Pro</span></h3>
          <p className="text-foreground/70 mb-6 max-w-2xl">Algunos jugadores que participaron y luego se consolidaron como figuras importantes de la escena competitiva.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {proPlayers.map((p) => (
              <div key={p} className="group relative rounded-xl border border-flame/30 bg-background/70 backdrop-blur p-5 overflow-hidden hover:scale-[1.03] transition-transform">
                <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition pointer-events-none"
                  style={{ background: "radial-gradient(circle at 50% 100%, var(--flame-glow), transparent 70%)" }} />
                <div className="relative text-[9px] uppercase tracking-[0.3em] text-flame font-mono font-bold">★ Pro Player Legacy</div>
                <div className="relative mt-3 font-display font-black text-xl md:text-2xl">{p}</div>
                <div className="relative mt-1 text-[10px] uppercase tracking-[0.25em] text-foreground/50 font-mono">Xplicit Legends</div>
              </div>
            ))}
          </div>
        </div>

        {/* CAMPEONES */}
        <div className="mt-20">
          <div className="text-xs uppercase tracking-[0.3em] text-flame font-mono mb-2">◢ Hall of Fame</div>
          <h3 className="font-display text-3xl md:text-5xl font-bold mb-6">Equipos campeones</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {champions.map((c, i) => (
              <div key={c} className="relative rounded-2xl border border-yellow-500/20 bg-gradient-to-b from-yellow-500/5 to-background/60 backdrop-blur p-5 overflow-hidden group hover:border-flame transition">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-[40px] opacity-30 group-hover:opacity-60 transition"
                  style={{ background: "var(--flame-glow)" }} />
                <div className="relative flex flex-col items-center text-center">
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-flame drop-shadow-[0_0_12px_var(--flame-glow)]">
                    <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z"/>
                    <path d="M17 4h3v2a3 3 0 0 1-3 3M7 4H4v2a3 3 0 0 0 3 3"/>
                  </svg>
                  <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-flame/80">Edición {String(i + 1).padStart(2, "0")}</div>
                  <div className="mt-1 font-display font-bold text-base md:text-lg">{c}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LEGADO */}
        <div className="mt-20 relative rounded-2xl border border-flame/30 bg-background/60 backdrop-blur p-6 md:p-10 overflow-hidden">
          <div className="absolute inset-0 opacity-40 pointer-events-none"
            style={{ background: "radial-gradient(circle at 0% 100%, oklch(0.55 0.24 255 / 0.25), transparent 60%), radial-gradient(circle at 100% 0%, oklch(0.70 0.24 45 / 0.2), transparent 60%)" }} />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.3em] text-flame font-mono mb-3">◢ Legado</div>
            <h3 className="font-display text-3xl md:text-5xl font-bold mb-4">No fue solo un torneo. Fue un <span className="italic text-flame">inicio</span>.</h3>
            <p className="text-foreground/85 leading-relaxed max-w-3xl">
              Más allá de los resultados, <span className="text-foreground font-bold">Xplicit Cup</span> se convirtió en un referente por su organización, calidad gráfica, transmisión en vivo y nivel competitivo. Fue una muestra temprana de lo que The Soul Nation siempre ha buscado construir: <span className="text-flame">comunidad, espectáculo, competencia e identidad visual</span> fuerte alrededor de Gears of War.
            </p>
            <p className="mt-4 text-foreground/75 leading-relaxed max-w-3xl">
              Xplicit Cup fue el inicio de una etapa donde la comunidad competitiva latina comenzó a verse como una escena con <span className="text-foreground font-bold">voz, nivel y producción propia</span>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#about" className="inline-flex items-center gap-2 bg-flame text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_0_60px_-10px_var(--flame-glow)] hover:scale-105 transition">
                Ver historia de The Soul Nation
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              <button className="inline-flex items-center gap-2 border border-flame/50 text-flame px-5 py-2.5 rounded-full font-bold text-sm hover:bg-flame/10 transition" type="button">
                Próximos torneos · Próximamente
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes xc-float { 0%,100% { transform: translateY(0) rotate(-1deg);} 50% { transform: translateY(-12px) rotate(1deg);} }
        @keyframes xc-wave { 0%,100% { transform: scaleY(0.4);} 50% { transform: scaleY(1);} }
      `}</style>
    </section>
  );
}
