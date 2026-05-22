import { useEffect, useRef, useState } from "react";
import xplicitLogo from "@/assets/xplicit-cup-header.jpeg";
import xplicitTrophy from "@/assets/xplicit-cup-trophy.png";

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

type PanelKey = "historia" | "timeline" | "broadcast" | "legacy" | "hall" | "legado";

const panels: { key: PanelKey; label: string; sub: string; icon: string }[] = [
  { key: "historia", label: "Historia", sub: "El origen", icon: "📜" },
  { key: "broadcast", label: "Broadcast", sub: "La voz del torneo", icon: "🎙" },
  { key: "legacy", label: "Pro Legacy", sub: "Xplicit Legends", icon: "★" },
  { key: "hall", label: "Hall of Fame", sub: "Campeones", icon: "🏆" },
  { key: "legado", label: "Legado", sub: "Lo que dejó", icon: "✦" },
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
      className="relative py-6 md:py-8 overflow-hidden scroll-mt-24"
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        {/* HERO */}
        <div
          ref={heroRef}
          className="flex flex-col items-center text-center"
          style={{
            opacity: heroSeen ? 1 : 0,
            transform: heroSeen ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.9s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Mobile: imagen arriba (mismo aspect que desktop) + texto debajo */}
          <div className="sm:hidden w-screen left-1/2 -translate-x-1/2 relative">
            <div className="w-full aspect-[16/7] overflow-hidden">
              <img src={xplicitLogo} alt="Xplicit Cup" className="w-full h-full object-cover object-top" style={{ filter: "saturate(1.6) contrast(1.15) brightness(1.05)" }} />
            </div>
            <div className="px-5 pt-5">
              <h1 className="font-display font-black text-left text-[1.75rem] leading-[1.1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
                El primer torneo de <span className="italic text-flame">Gears of War</span> transmitido <span className="text-flame">en vivo</span> por YouTube
              </h1>
            </div>
          </div>

          {/* Desktop / tablet: overlay sobre la imagen */}
          <div className="hidden sm:block relative w-screen left-1/2 -translate-x-1/2 overflow-hidden h-[340px] md:h-[440px] lg:h-[500px]">
            <img src={xplicitLogo} alt="Xplicit Cup" className="w-full h-full object-cover object-top" style={{ filter: "saturate(1.6) contrast(1.15) brightness(1.05)" }} />
            
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto max-w-7xl w-full px-10 md:px-14 lg:px-20">
                <h1 className="font-display font-black text-left text-4xl md:text-5xl lg:text-6xl leading-[1.05] max-w-xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
                  El primer torneo de <span className="italic text-flame">Gears of War</span> transmitido <span className="text-flame">en vivo</span> por YouTube
                </h1>
              </div>
            </div>
          </div>




        </div>

        {/* STATS compactos */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.k} className="rounded-xl border border-flame/20 bg-background/60 backdrop-blur p-3 md:p-4">
              <div className="font-display text-2xl md:text-3xl font-black text-flame" style={{ textShadow: "0 0 20px var(--flame-glow)" }}>{s.k}</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-foreground/60 font-mono">{s.v}</div>
            </div>
          ))}
        </div>

        {/* TODOS LOS CAPÍTULOS — abiertos, sin botones */}
        <div className="mt-8 space-y-6">
          {panels.map((p, i) => (
            <article
              key={p.key}
              id={p.key}
              className="relative rounded-2xl border border-flame/30 bg-background/40 backdrop-blur p-5 md:p-7 overflow-hidden scroll-mt-24"
            >
              <span className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-flame/70" />
              <span className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-flame/70" />
              <span className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-flame/70" />
              <span className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-flame/70" />
              <div className="relative mb-4 flex items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-flame/80">CH · 0{i + 1}</span>
                <span className="h-px flex-1 bg-gradient-to-r from-flame/50 to-transparent" />
                <span className="text-xl opacity-80">{p.icon}</span>
              </div>
              <div className="relative">
                <PanelContent which={p.key} />
              </div>
            </article>
          ))}
        </div>
      </div>


      <style>{`
        @keyframes xc-wave { 0%,100% { transform: scaleY(0.4);} 50% { transform: scaleY(1);} }
        .trophy-3d {
          position: relative;
          width: 48px;
          height: 48px;
          transform-style: preserve-3d;
          animation: trophy-spin 5s linear infinite, trophy-float 3s ease-in-out infinite;
        }
        .trophy-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
        }
        .trophy-back { transform: rotateY(180deg); }
        .trophy-shine {
          position: absolute;
          inset: -20%;
          border-radius: 50%;
          background: radial-gradient(circle, oklch(0.95 0.18 80 / 0.45), transparent 65%);
          filter: blur(8px);
          pointer-events: none;
          animation: trophy-pulse 2.4s ease-in-out infinite;
        }
        @keyframes trophy-spin { from { transform: rotateY(0deg);} to { transform: rotateY(360deg);} }
        @keyframes trophy-float { 0%,100% { translate: 0 0;} 50% { translate: 0 -4px;} }
        @keyframes trophy-pulse { 0%,100% { opacity: 0.4;} 50% { opacity: 0.9;} }
        .group:hover .trophy-3d { animation-duration: 1.6s, 3s; }
        .trophy-hero { animation: trophy-hero-float 4s ease-in-out infinite; transform-origin: center; }
        @keyframes trophy-hero-float {
          0%, 100% { transform: translateY(0) rotate(-1deg); filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 30px oklch(0.75 0.20 70 / 0.4)); }
          50% { transform: translateY(-12px) rotate(1deg); filter: drop-shadow(0 30px 50px rgba(0,0,0,0.6)) drop-shadow(0 0 50px oklch(0.75 0.20 70 / 0.7)); }
        }

      `}</style>
    </section>
  );
}


function PanelContent({ which }: { which: PanelKey }) {
  if (which === "historia") {
    return (
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-flame font-mono mb-2">◢ Historia</div>
        <h3 className="font-display text-3xl md:text-5xl font-black leading-tight">
          Xplicit Cup: el torneo que <span className="italic text-flame">marcó historia</span>
        </h3>
        <div className="mt-6 space-y-4 text-foreground/85 leading-relaxed">
          <p>
            El <span className="text-flame font-bold">10 de febrero de 2013</span>, The Soul Nation hizo historia dentro de la comunidad competitiva de Gears of War de habla hispana con la creación de <span className="text-foreground font-bold">Xplicit Cup</span>, uno de los primeros torneos transmitidos completamente <span className="text-flame">en vivo por YouTube</span> para la escena latina.
          </p>
          <p>
            La primera edición reunió a algunos de los equipos más fuertes y respetados de la comunidad competitiva mexicana de Gears of War, incluyendo nombres como <span className="font-bold">Essence, Logic, Guns, HzE, Da Best, Resurrection K</span>, entre otros. La relevancia del torneo no solo estuvo en la competencia, sino en el nivel de los jugadores, la intensidad de los enfrentamientos y la participación de equipos que representaban lo más alto del panorama competitivo de aquella época.
          </p>
          <p>
            En esa primera edición, <span className="text-flame font-bold">The Soul Nation se coronó campeón</span>, dejando una marca importante en la historia del clan y consolidando su presencia como una organización capaz de competir, producir y liderar dentro de la comunidad.
          </p>
        </div>
      </div>
    );
  }

  if (which === "timeline") {
    const items = [
      { d: "10·02·2013", t: "Debut Xplicit Cup", s: "Primera transmisión en vivo por YouTube." },
      { d: "Final 1", t: "Soul Nation Campeón", s: "Primer título oficial de la organización." },
      { d: "Legacy", t: "Próxima generación", s: "Pro players nacidos del torneo." },
      { d: "Hoy", t: "Referente latino", s: "Producción, comunidad y competencia." },
    ];
    return (
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-flame font-mono mb-2">◤ Timeline</div>
        <h3 className="font-display text-3xl md:text-5xl font-black mb-6">Línea de tiempo</h3>
        <ol className="relative border-l border-flame/40 space-y-6 ml-2">
          {items.map((m, i) => (
            <li key={i} className="ml-4 relative">
              <span className="absolute -left-[1.42rem] top-1 w-3 h-3 rounded-full bg-flame shadow-[0_0_18px_var(--flame-glow)]" />
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-flame/80">{m.d}</div>
              <div className="font-display font-bold mt-0.5 text-lg">{m.t}</div>
              <div className="text-sm text-foreground/65 mt-0.5">{m.s}</div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (which === "broadcast") {
    return (
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-flame font-mono mb-2">◢ Broadcast</div>
        <h3 className="font-display text-3xl md:text-5xl font-black mb-4">La voz del torneo</h3>
        <p className="text-foreground/85 leading-relaxed mb-5">
          La transmisión contó con <span className="text-flame font-bold">Soul Maverick</span> como host principal, acompañado por invitados al casteo como <span className="font-bold">Betrucci, EMK Krauser, xCJVx Howard</span>, entre otros. Esto convirtió a Xplicit Cup en una experiencia diferente para la época: no era solo un torneo, era un <span className="text-foreground font-bold">evento competitivo con identidad, narrativa, producción y comunidad</span>.
        </p>
        <div className="relative rounded-2xl border border-flame/30 bg-background/60 p-5 overflow-hidden mb-5">
          <span className="absolute top-3 left-3 inline-flex items-center gap-2 px-2 py-1 rounded bg-red-500/20 border border-red-500/50 text-red-400 text-[9px] font-mono uppercase tracking-[0.3em]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
          </span>
          <div className="flex items-end gap-0.5 h-10 mt-6 justify-end">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="w-0.5 bg-flame rounded-full"
                style={{ height: `${20 + Math.sin(i * 0.7) * 50 + 30}%`, animation: `xc-wave 1.2s ease-in-out ${i * 60}ms infinite` }} />
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {casters.map((c) => (
            <div key={c.name} className="rounded-xl border border-border bg-background/70 p-4 hover:border-flame transition">
              <div className="text-flame text-[10px] uppercase tracking-[0.25em] font-mono">{c.role}</div>
              <div className="mt-1 font-display font-bold text-lg">{c.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (which === "legacy") {
    return (
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-flame font-mono mb-2">◢ Legacy</div>
        <h3 className="font-display text-3xl md:text-5xl font-black mb-2">Xplicit <span className="italic text-flame">Legends</span></h3>
        <p className="text-foreground/80 mb-6 leading-relaxed">
          Por sus torneos pasaron jugadores que con el tiempo se consolidaron como figuras importantes de la escena, incluyendo nombres como <span className="text-foreground font-bold">Identives, Sleafer, Cristalize, Crack y Summuns</span>. Además, equipos como <span className="text-foreground font-bold">The Soul Nation, Resurrection K, Guns, Fireball y Logic</span> formaron parte de la historia de campeones de la Xplicit Cup.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {proPlayers.map((p) => (
            <div key={p} className="group relative rounded-xl border border-flame/30 bg-background/70 p-4 overflow-hidden hover:scale-[1.03] transition-transform">
              <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 100%, var(--flame-glow), transparent 70%)" }} />
              <div className="relative text-[9px] uppercase tracking-[0.3em] text-flame font-mono font-bold">★ Pro Player</div>
              <div className="relative mt-2 font-display font-black text-lg md:text-xl">{p}</div>
              <div className="relative mt-0.5 text-[10px] uppercase tracking-[0.25em] text-foreground/50 font-mono">Xplicit Legends</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (which === "hall") {
    return (
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-flame font-mono mb-2">◢ Hall of Fame</div>
        <h3 className="font-display text-3xl md:text-5xl font-black mb-6">Equipos campeones</h3>

        <div className="grid md:grid-cols-[1fr_1.1fr] gap-6 md:gap-10 items-center">
          {/* Trofeo hero */}
          <div className="relative flex justify-center md:justify-end">
            <img
              src={xplicitTrophy}
              alt="Trofeo Xplicit Cup"
              className="relative w-56 md:w-[22rem] h-auto object-contain"
            />
          </div>

          {/* Lista de campeones */}
          <ol className="relative space-y-2">
            {champions.map((c, i) => {
              const isFirst = i === 0;
              return (
                <li
                  key={c}
                  className={`group relative flex items-center gap-4 rounded-xl border px-4 py-3 backdrop-blur transition-all hover:translate-x-1 ${
                    isFirst
                      ? "border-yellow-400/60 bg-gradient-to-r from-yellow-500/15 via-yellow-500/5 to-transparent"
                      : "border-flame/20 bg-background/40 hover:border-flame/60"
                  }`}
                >
                  <div className={`font-display font-black text-2xl md:text-3xl tabular-nums w-10 text-center ${isFirst ? "text-yellow-300" : "text-flame/50"}`} style={isFirst ? { textShadow: "0 0 18px oklch(0.85 0.18 80 / 0.6)" } : undefined}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="h-10 w-px bg-gradient-to-b from-transparent via-flame/40 to-transparent" />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-flame/70">
                      {isFirst ? "★ Campeón inaugural · 2013" : `Edición ${String(i + 1).padStart(2, "0")}`}
                    </div>
                    <div className="font-display font-bold text-base md:text-lg truncate">{c}</div>
                  </div>
                  {isFirst && (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full border border-yellow-400/50 bg-yellow-500/10 text-yellow-300 text-[9px] font-mono uppercase tracking-[0.25em]">
                      🏆 #1
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    );
  }

  // legado
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.3em] text-flame font-mono mb-2">◢ Legado</div>
      <h3 className="font-display text-3xl md:text-5xl font-black mb-4"><span className="block">Xplicit Cup no fue solo un torneo.</span><span className="block">Fue un <span className="italic text-flame">inicio</span>.</span></h3>
      <div className="space-y-4 text-foreground/85 leading-relaxed">
        <p>
          Más allá de los resultados, <span className="text-foreground font-bold">Xplicit Cup</span> se convirtió en un referente por su organización, calidad gráfica, transmisión en vivo y nivel competitivo. Fue una muestra temprana de lo que The Soul Nation siempre ha buscado construir: <span className="text-flame">comunidad, espectáculo, competencia y una identidad visual fuerte</span> alrededor de Gears of War.
        </p>
        <p>
          Xplicit Cup fue el inicio de una etapa donde la comunidad competitiva latina comenzó a verse como una escena con <span className="text-foreground font-bold">voz, nivel y producción propia</span>.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="/#about" className="inline-flex items-center gap-2 bg-flame text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_0_60px_-10px_var(--flame-glow)] hover:scale-105 transition">
          Ver historia de The Soul Nation
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  );
}
