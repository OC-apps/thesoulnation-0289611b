import { createFileRoute } from "@tanstack/react-router";
import heroFlame from "@/assets/hero-flame.jpg";
import flameMark from "@/assets/flame-mark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Soul Nation — Comunidad gamer desde 2012" },
      { name: "description", content: "The Soul Nation: la comunidad gamer hispana que arde desde 2012. Torneos, contenido, hermandad." },
      { property: "og:title", content: "The Soul Nation — Desde 2012" },
      { property: "og:description", content: "Una nación encendida. Comunidad, competición y cultura gamer." },
    ],
  }),
  component: Index,
});

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-border pl-6">
      <div className="font-display text-5xl md:text-6xl font-bold text-flame">{value}</div>
      <div className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/40 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-display font-bold tracking-tight">
            <img src={flameMark} alt="" width={28} height={28} className="drop-shadow-[0_0_12px_var(--flame-glow)]" />
            <span>SOUL <span className="text-flame">NATION</span></span>
          </a>
          <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition">Nosotros</a>
            <a href="#manifest" className="hover:text-foreground transition">Manifiesto</a>
            <a href="#crew" className="hover:text-foreground transition">Crew</a>
            <a href="#join" className="hover:text-foreground transition">Únete</a>
          </nav>
          <a href="#join" className="hidden md:inline-flex items-center gap-2 bg-flame text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:scale-105 transition shadow-[0_0_30px_-5px_var(--flame-glow)]">
            Entrar
          </a>
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
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-border bg-background/30 backdrop-blur text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-flame animate-pulse" />
              Desde el 2012
            </div>
            <h1 className="mt-8 font-display font-bold text-[clamp(3rem,9vw,8rem)] leading-[0.9]">
              <span className="text-gradient block">UNA NACIÓN</span>
              <span className="text-flame block italic">ENCENDIDA.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              Más que una comunidad gamer. Una hermandad que lleva más de una década compitiendo, creando y ardiendo junta.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <a href="#join" className="group inline-flex items-center gap-3 bg-flame text-primary-foreground px-8 py-4 rounded-full font-semibold shadow-[0_0_60px_-10px_var(--flame-glow)] hover:scale-105 transition">
                Únete a la Nación
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a href="#about" className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold border border-border hover:bg-accent transition">
                Conócenos
              </a>
            </div>
          </div>

          {/* stats */}
          <div className="mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl">
            <Stat value="13+" label="Años activos" />
            <Stat value="5K" label="Miembros" />
            <Stat value="200" label="Torneos" />
            <Stat value="∞" label="Llama viva" />
          </div>
        </div>

        {/* marquee */}
        <div className="absolute bottom-0 inset-x-0 border-y border-border bg-background/40 backdrop-blur py-4 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-marquee font-display text-2xl md:text-3xl font-bold tracking-tight">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-12 items-center shrink-0">
                {["SOUL NATION", "★", "DESDE 2012", "★", "COMUNIDAD GAMER", "★", "ARDE CON NOSOTROS", "★", "HERMANDAD", "★"].map((t, j) => (
                  <span key={j} className={j % 2 === 0 ? "text-flame" : "text-foreground/70"}>{t}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-16">
          <div className="md:col-span-5">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">01 — Identidad</div>
            <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95]">
              ¿Quiénes <span className="italic text-flame">somos?</span>
            </h2>
          </div>
          <div className="md:col-span-7 space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p className="text-2xl text-foreground font-light">
              Somos <span className="text-flame font-semibold">The Soul Nation</span> — una comunidad nacida en el 2012 que convirtió la pasión por el videojuego en una forma de vida.
            </p>
            <p>
              No vendemos hype. Vendemos pertenencia. Cada miembro es una chispa, y juntos somos el incendio que no se apaga.
            </p>
            <p>
              Compartimos torneos, partidas, risas, victorias y derrotas. Lo que empezó como un grupo de amigos hoy es una nación con identidad propia.
            </p>
          </div>
        </div>
      </section>

      {/* MANIFIESTO */}
      <section id="manifest" className="relative py-32 md:py-48 border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs uppercase tracking-[0.3em] text-flame">02 — Manifiesto</div>
          <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold max-w-3xl">
            Cuatro reglas. <span className="text-flame italic">Una llama.</span>
          </h2>
          <div className="mt-20 grid md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden">
            {[
              { n: "I.", t: "Hermandad primero", d: "Antes que el rank, antes que la skin. Cuidamos al que va a tu lado." },
              { n: "II.", t: "Arde, no te quemes", d: "Competimos con intensidad pero sin perder la cabeza. Respeto al rival." },
              { n: "III.", t: "Crea o muere", d: "Streaming, clips, arte, eventos. Cada miembro aporta su chispa." },
              { n: "IV.", t: "Soul para siempre", d: "Una vez nación, siempre nación. La llama no se apaga con el tiempo." },
            ].map((p) => (
              <div key={p.n} className="bg-background p-10 md:p-14 hover:bg-card transition group">
                <div className="font-display text-flame text-3xl">{p.n}</div>
                <h3 className="mt-4 font-display text-3xl md:text-4xl font-bold group-hover:translate-x-1 transition">{p.t}</h3>
                <p className="mt-4 text-muted-foreground text-lg">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREW */}
      <section id="crew" className="relative py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-flame">03 — Crew</div>
              <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold">
                Nuestros <span className="italic text-flame">frentes.</span>
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground">Donde la nación opera. Encuentra tu pelotón y enciende la llama.</p>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-6">
            {[
              { tag: "Competitivo", title: "Esports Squad", desc: "Equipos para torneos en CS2, Valorant, LoL y FIFA. Coaching y bootcamps.", k: "12 equipos activos" },
              { tag: "Casual", title: "Party Hub", desc: "Noches de Smash, Fall Guys y Among Us. Aquí se viene a reírse.", k: "Eventos semanales" },
              { tag: "Creators", title: "Soul Studio", desc: "Streamers, editores y artistas que producen el contenido de la nación.", k: "30 creadores" },
            ].map((c, i) => (
              <article key={i} className="group relative p-8 rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/50 transition">
                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-flame opacity-0 blur-3xl group-hover:opacity-30 transition" />
                <div className="relative">
                  <div className="text-xs uppercase tracking-[0.25em] text-flame">{c.tag}</div>
                  <h3 className="mt-4 font-display text-3xl font-bold">{c.title}</h3>
                  <p className="mt-4 text-muted-foreground">{c.desc}</p>
                  <div className="mt-10 pt-6 border-t border-border flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{c.k}</span>
                    <span className="text-flame group-hover:translate-x-1 transition">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN */}
      <section id="join" className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-80" />
        <img src={flameMark} alt="" width={512} height={512} loading="lazy" className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[40vw] max-w-[500px] opacity-30 animate-float" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-flame">04 — Únete</div>
          <h2 className="mt-6 font-display text-6xl md:text-8xl font-bold leading-[0.9]">
            Lleva tu chispa <br /><span className="text-flame italic">al fuego.</span>
          </h2>
          <p className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            Discord abierto. Sin pruebas absurdas, sin elitismo. Solo gente que ama jugar.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a href="#" className="inline-flex items-center gap-3 bg-flame text-primary-foreground px-10 py-5 rounded-full font-bold text-lg shadow-[0_0_80px_-10px_var(--flame-glow)] hover:scale-105 transition">
              Entrar al Discord →
            </a>
            <a href="#" className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg border border-border hover:bg-accent transition">
              Síguenos en X
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-16">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-12 items-start">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-xl">
              <img src={flameMark} alt="" width={28} height={28} loading="lazy" />
              SOUL <span className="text-flame">NATION</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">Comunidad gamer hispana ardiendo desde 2012.</p>
          </div>
          <div className="text-sm uppercase tracking-widest space-y-3 text-muted-foreground">
            <a href="#about" className="block hover:text-foreground">Nosotros</a>
            <a href="#manifest" className="block hover:text-foreground">Manifiesto</a>
            <a href="#crew" className="block hover:text-foreground">Crew</a>
          </div>
          <div className="text-sm uppercase tracking-widest space-y-3 text-muted-foreground">
            <a href="#" className="block hover:text-foreground">Discord</a>
            <a href="#" className="block hover:text-foreground">X / Twitter</a>
            <a href="#" className="block hover:text-foreground">Twitch</a>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 mt-12 pt-8 border-t border-border flex flex-wrap justify-between gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} The Soul Nation. Todos los derechos reservados.</span>
          <span>Hecho con llama 🔥</span>
        </div>
      </footer>
    </div>
  );
}
