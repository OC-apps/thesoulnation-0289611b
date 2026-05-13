import { createFileRoute } from "@tanstack/react-router";
import heroFlame from "@/assets/hero-flame.jpg";
import soulLogo from "@/assets/soul-logo.png";
import soulCrewLogo from "@/assets/soul-crew.png";
import soulLegendsLogo from "@/assets/soul-legends.png";
import soulKillersLogo from "@/assets/soul-killers.png";

const KILLERS = ["YAZ", "MORTAAL", "GALLARD", "RAPID", "SANTHY"];
const LEGENDS = ["SOUL YARBIZ", "SOUL MORTAL", "SOUL CREED", "SOUL EXTRURS"];
const CREW = [
  "SOUL VELFI", "SOUL VOLCANO", "SOUL XANS", "SOUL PEYERZ", "SOUL PAKAL",
  "SOUL BOUNSS", "SOUL GHOOST", "SOUL NEXUS Z", "SOUL XCENFE",
  "SOUL CASTERIZE", "SOUL ADVERSL", "SOUL SLADE X", "SOUL ZAINT",
];

const WAVES: { name: string; redes: string; bio: string }[] = [
  { name: "SOUL MAVERICK", redes: "Facebook · TikTok · YouTube · X", bio: "Líder y fundador de The Soul Nation. Creador de contenido en YouTube desde 2012. Su fuerte no es el nivel de juego, es la creatividad, el humor y la forma directa de decir las cosas. Destaca por su carisma y liderazgo, cualidades con las que ha construido y sostenido a The Soul Nation, llevándolo a ganarse un lugar real y respetado en el corazón de la comunidad de Gears of War." },
  { name: "SOUL ARID", redes: "Twitch · TikTok · Instagram · X", bio: "Streamer creativa y con mucha energía. Cree en el juego limpio, el respeto y en crecer sin pisar a nadie. Tiene claro que nadie avanza solo: cuando el equipo se apoya, todos mejoran. Su forma de ser, cercana y positiva, genera confianza y hace que la gente se sienta parte. No busca protagonismo vacío; trabaja para sumar, motivar y ayudar a que la comunidad crezca de verdad." },
  { name: "SOUL ALEMAN", redes: "Facebook · TikTok · YouTube · X", bio: "Uno de los integrantes más recientes de Soul, Mendoza la Crew y dio el salto a The Waves con ganas reales de aprender y crecer. Se caracteriza por su rápida conexión con los viewers, sus chistes rancios y su carisma natural. No es el mejor jugador, pero juega con el corazón, especialmente Gears of War, un juego que lo marcó desde sus inicios gracias a su hermano mayor." },
  { name: "SOUL GIZZMO", redes: "TikTok · Twitch · X", bio: "Creador de contenido mexicano que transmite su pasión por los videojuegos en Twitch y TikTok, crea videos y memes para YouTube, y conecta con su comunidad a través del humor y una energía intensa. Cada stream es más que juego: es un show donde se vive el momento y la gente se siente parte de la experiencia." },
  { name: "SOUL CASTERIZE", redes: "TikTok · YouTube · X", bio: "Streamer risueño y con buena vibra. Le gusta cotorrear con el chat, leer lo que escriben los viewers y reírse con ellos. Cree fielmente en que puede lograrse una comunidad sana donde todos se sientan bienvenidos. Trabaja constantemente en formar un equipo con su comunidad, motivar y ayudar a la gente que lo necesite. Si buscas un buen amigo y streamer, él estará para ti." },
  { name: "SOUL PXLMAA", redes: "Facebook · TikTok · YouTube · X", bio: "Palma es gamer de corazón y clavado con la música urbana. Le gusta prender stream, echar la reta, cotorrear sin filtro con la banda y reírse un rato mientras juega. También le entra al básquet y le late todo lo que sea competir en equipo. Cuida su flow al vestir y siempre anda con ganas de convivir y pasarla bien con la comunidad." },
  { name: "SOUL SYSTEM", redes: "Twitch · TikTok · YouTube", bio: "Ex pro player de Gears of War. Ganador de torneos en GOW 3 y jugador profesional en GOW 4. Veterano de la época dorada, sobreviviente de LANs, rankeds infinitos y noches injustas. Hoy juego por diversión, nostalgia y risas con la comunidad. No prometo tryhard, pero sí buenos momentos y uno que otro escopetazo legendario… o fallido." },
  { name: "SOUL TEMPLA", redes: "TikTok · YouTube · X", bio: "No nació casualmente en Gears of War, se forjó en él. Desde los 12 años descubrió el campo de batalla que moldeó su carácter. Durante la época de Gears of War 3 se unió como combatiente competitivo, se forjó en equipos y entendió que en gears no gana el que dispara, sino quien juega bien con IQ. Ahora es creador de contenido, busca transmitir el juego por amor, orgullo, nostalgia y respeto." },
  { name: "SOUL ENRI", redes: "TikTok · YouTube · X", bio: "Carismático streamer al que le gusta disfrutar de diversos juegos como Halo, Fortnite, Roblox, pero ama hacer múltiples kills, nemesis y remontar partidas en Gears of War. Soul Enri está presente en casi todos los títulos de la franquicia con su clásico alternativo y su arma favorita… ¡La Gnasher!" },
  { name: "SOUL EMI X", redes: "TikTok", bio: "Creador de contenido y editor de video enfocado en montajes, gameplays y contenido para redes sociales. Disfruta todo el proceso: idea, ritmo, música y detalles que hacen que el video conecte. Le gusta experimentar con estilos y narrativas. Fan de Gears of War, lo toma como inspiración para crear montajes intensos, competitivos y con identidad propia." },
];

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
            <a href="#roster" className="hover:text-foreground transition">Roster</a>
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

      {/* ROSTER */}
      <section id="roster" className="relative py-32 md:py-48 border-t border-border overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-flame opacity-10 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">04</div>
            <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95]">
              Nuestro <span className="italic text-flame">Roster</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
              Cuatro divisiones, una sola familia. Conoce a quienes representan a Soul dentro y fuera del juego.
            </p>
          </div>

          {/* KILLERS + LEGENDS — text-logo cards 3D */}
          <div className="perspective grid md:grid-cols-2 gap-8 mb-12">
            {[
              { logo: soulKillersLogo, title: "THE SOUL KILLERS", subtitle: "Equipo enfocado en grindear el modo Guardian de Gears 5", members: KILLERS },
              { logo: soulLegendsLogo, title: "THE SOUL LEGENDS", subtitle: "Jugadores habilidosos y creadores de clips para montajes editados", members: LEGENDS },
            ].map((sq) => (
              <div key={sq.title} className="tilt-card roster-card rounded-3xl p-10 group">
                <div className="relative z-10">
                  <img src={sq.logo} alt={sq.title} className="layer-up h-20 md:h-28 w-auto object-contain drop-shadow-[0_10px_30px_var(--flame-glow)]" />
                  <p className="mt-6 text-sm uppercase tracking-widest text-flame">{sq.subtitle}</p>
                  <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 font-display text-lg font-bold">
                    {sq.members.map((m) => (
                      <li key={m} className="flex items-center gap-2 text-foreground/90">
                        <span className="w-1.5 h-1.5 rounded-full bg-flame" />{m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* CREW — banner + grid de nombres */}
          <div className="perspective mb-20">
            <div className="tilt-card roster-card rounded-3xl p-10 md:p-14">
              <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
                <div className="md:col-span-5">
                  <img src={soulCrewLogo} alt="THE SOUL CREW" className="layer-up h-24 md:h-36 w-auto object-contain drop-shadow-[0_10px_30px_var(--flame-glow)]" />
                  <p className="mt-6 text-sm uppercase tracking-widest text-flame">Apoyo y familia oficial</p>
                  <p className="mt-3 text-muted-foreground">Grupo de apoyo y seguidores fieles que forman parte oficial de la familia The Soul Nation.</p>
                </div>
                <div className="md:col-span-7">
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-display font-bold">
                    {CREW.map((m) => (
                      <li key={m} className="px-3 py-2 rounded-lg border border-border bg-background/40 backdrop-blur text-sm tracking-wide hover:border-flame hover:text-flame transition-colors">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* WAVES — creators */}
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">The Soul Waves</div>
            <h3 className="mt-4 font-display text-4xl md:text-6xl font-bold text-3d">CREADORES DE CONTENIDO</h3>
            <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
              Cada uno aporta su estilo, personalidad y forma de vivir el gaming. No se trata solo de clips o transmisiones: es constancia, identidad y conexión real con la comunidad.
            </p>
          </div>

          <div className="perspective grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WAVES.map((c, i) => (
              <article key={c.name} className="tilt-card roster-card rounded-2xl overflow-hidden flex flex-col">
                <div className="relative aspect-[4/5] bg-gradient-to-br from-deep to-background flex items-center justify-center overflow-hidden">
                  {/* photo placeholder — listo para que suban una foto */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--flame-glow)_0%,transparent_60%)] opacity-40" />
                  <img src={soulLogo} alt="" className="w-1/2 opacity-30 tilt-idle" />
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-flame bg-background/60 backdrop-blur px-2 py-1 rounded-full border border-border">
                    Wave · 0{i + 1}
                  </span>
                  <span className="absolute bottom-4 right-4 text-[10px] uppercase tracking-widest text-muted-foreground bg-background/60 backdrop-blur px-2 py-1 rounded-full border border-border">
                    Foto próximamente
                  </span>
                </div>
                <div className="p-6 flex flex-col gap-3 relative z-10">
                  <h4 className="layer-up font-display font-bold text-2xl text-flame">{c.name}</h4>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{c.redes}</p>
                  <p className="text-sm text-foreground/85 leading-relaxed">{c.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REDES */}
      <section id="redes" className="relative py-32 md:py-48 overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-hero opacity-80" />
        <img src={soulLogo} alt="" width={500} height={500} loading="lazy" className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[40vw] max-w-[500px] opacity-20 animate-float" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-flame">05</div>
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
