import { createFileRoute } from "@tanstack/react-router";
import heroFlame from "@/assets/hero-flame.jpg";
import soulLogo from "@/assets/soul-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Soul Nation — desde el 2012" },
      { name: "description", content: "The Soul Nation: comunidad de gaming desde el 10 de noviembre de 2012." },
      { property: "og:title", content: "The Soul Nation — desde el 2012" },
      { property: "og:description", content: "Comunidad de gaming desde 2012." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/40 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-display font-bold tracking-tight">
            <img src={soulLogo} alt="The Soul Nation" width={28} height={28} className="drop-shadow-[0_0_12px_var(--flame-glow)]" />
            <span>THE SOUL <span className="text-flame">NATION</span></span>
          </a>
          <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition">¿Quiénes Somos?</a>
            <a href="#vision" className="hover:text-foreground transition">Visión</a>
            <a href="#objetivo" className="hover:text-foreground transition">Objetivo</a>
            <a href="#redes" className="hover:text-foreground transition">Redes</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-screen overflow-hidden grain bg-hero">
        <img
          src={heroFlame}
          alt=""
          width={1536}
          height={1536}
          className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[80vw] max-w-[900px] opacity-90 mix-blend-screen pointer-events-none animate-float"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute -left-32 top-32 w-96 h-96 rounded-full bg-flame opacity-20 blur-[120px] animate-pulse-glow" />

        <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-32 md:pt-48 md:pb-48">
          <div className="max-w-3xl animate-fade-up flex flex-col items-start">
            <img src={soulLogo} alt="The Soul Nation" width={120} height={120} className="w-24 md:w-32 mb-8 drop-shadow-[0_0_40px_var(--flame-glow)]" />
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-border bg-background/30 backdrop-blur text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-flame animate-pulse" />
              desde el 2012
            </div>
            <h1 className="mt-8 font-display font-bold text-[clamp(3rem,9vw,8rem)] leading-[0.9]">
              <span className="text-gradient block">THE SOUL</span>
              <span className="text-flame block italic">NATION</span>
            </h1>
          </div>
        </div>

        {/* marquee */}
        <div className="absolute bottom-0 inset-x-0 border-y border-border bg-background/40 backdrop-blur py-4 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-marquee font-display text-2xl md:text-3xl font-bold tracking-tight">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-12 items-center shrink-0">
                {["THE SOUL NATION", "★", "DESDE EL 2012", "★", "THE SOUL LEGENDS", "★", "THE SOUL MEDIA", "★", "THE SOUL WAVES", "★", "THE SOUL CREW", "★"].map((t, j) => (
                  <span key={j} className={j % 2 === 0 ? "text-flame" : "text-foreground/70"}>{t}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-16 items-start">
          <div className="md:col-span-5 md:sticky md:top-32">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">01</div>
            <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95]">
              ¿Quiénes <span className="italic text-flame">Somos?</span>
            </h2>
            <img src={soulLogo} alt="" width={200} height={200} loading="lazy" className="mt-12 w-40 opacity-80 animate-float" />
          </div>
          <div className="md:col-span-7">
            <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed">
              The Soul Nation es una comunidad de gaming que nació el <span className="text-flame font-semibold">10 de Noviembre del 2012</span>, inicialmente enfocada en la creación de clips de Gears of War. Con el tiempo, expandimos nuestros horizontes y nos convertimos en un equipo multifacético dedicado a crear contenido de exhibición de la más alta calidad para una variedad de juegos competitivos. Nos caracteriza la pasión por el gaming y el compromiso de elevar la escena de los esports en Latinoamérica, trabajando como una familia unida, donde cada miembro puede crecer y destacar en lo que mejor sabe hacer.
            </p>
          </div>
        </div>
      </section>

      {/* VISIÓN */}
      <section id="vision" className="relative py-32 md:py-48 border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-16 items-start">
          <div className="md:col-span-5 md:sticky md:top-32">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">02</div>
            <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95] italic text-flame">
              Visión
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed">
              Ser el equipo Mexicano líder en la creación de contenido de exhibición y una referencia de la creación de contenido de calidad en la comunidad hispana por nuestra capacidad para generar contenido original, innovador y de calidad, que inspire y conecte con los gamers de la región.
            </p>
          </div>
        </div>
      </section>

      {/* OBJETIVO */}
      <section id="objetivo" className="relative py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-16 items-start">
          <div className="md:col-span-5 md:sticky md:top-32">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">03</div>
            <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95] italic text-flame">
              Objetivo
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed">
              Nuestro objetivo principal es impulsar el potencial de cada miembro de The Soul Nation, ya sea como jugador, creador de contenido, o parte de nuestras divisiones como <span className="text-flame">The Soul Legends</span>, <span className="text-flame">The Soul Media</span>, <span className="text-flame">The Soul Waves</span> y <span className="text-flame">The Soul Crew</span>. Queremos expandir nuestra organización, fortalecer la comunidad gamer y apoyar a otras organizaciones de calidad en Latinoamérica, sin necesidad de competir, sino colaborando para un crecimiento conjunto. Buscamos crear un ambiente en el que todos podamos avanzar, aprender y aportar para construir el futuro de los esports en la región.
            </p>
          </div>
        </div>
      </section>

      {/* REDES */}
      <section id="redes" className="relative py-32 md:py-48 overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-hero opacity-80" />
        <img src={soulLogo} alt="" width={500} height={500} loading="lazy" className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[40vw] max-w-[500px] opacity-20 animate-float" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-flame">04</div>
          <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95]">
            síguenos en nuestras <br /><span className="text-flame italic">redes sociales</span>
          </h2>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a href="#" className="inline-flex items-center gap-3 bg-flame text-primary-foreground px-10 py-5 rounded-full font-bold text-lg shadow-[0_0_80px_-10px_var(--flame-glow)] hover:scale-105 transition">
              Discord
            </a>
            <a href="#" className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg border border-border hover:bg-accent transition">
              X / Twitter
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3 font-display font-bold text-xl">
            <img src={soulLogo} alt="" width={32} height={32} loading="lazy" />
            THE SOUL <span className="text-flame">NATION</span>
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">desde el 2012</span>
        </div>
      </footer>
    </div>
  );
}
