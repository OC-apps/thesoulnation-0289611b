import { createFileRoute } from "@tanstack/react-router";
import soulMascot from "@/assets/soul-mascot.svg";
import soulLogo from "@/assets/soul-logo.png";
import soulCrewLogo from "@/assets/soul-crew.png";
import soulLegendsLogo from "@/assets/soul-legends.png";
import soulKillersLogo from "@/assets/soul-killers.png";
import waveMaverick from "@/assets/wave-maverick.png";
import waveAleman from "@/assets/wave-aleman.png";
import wavePxlmaa from "@/assets/wave-pxlmaa.png";
import waveGizzmo from "@/assets/wave-gizzmo.png";
import waveTempla from "@/assets/wave-templa.png";
import waveSystem from "@/assets/wave-system.png";
import waveEmix from "@/assets/wave-emix.png";
import waveEnri from "@/assets/wave-enri.png";
import soulJersey from "@/assets/soul-jersey.png";
import wpOlimpo from "@/assets/wallpaper-olimpo.jpg";
import wpComic from "@/assets/wallpaper-comic.jpg";
import wpCinematic from "@/assets/wallpaper-cinematic.jpg";

const WALLPAPERS = [
  {
    title: "OLIMPO SERIES",
    tagline: "Dioses, mármol y fuego sagrado",
    img: wpOlimpo,
    href: "https://drive.google.com/drive/u/1/folders/19khEVAVun8iSlS-GpWannb_AoK03cPNV",
    accent: "from-amber-500/40 via-orange-600/30 to-blue-500/40",
  },
  {
    title: "COMIC ESPORTS SERIES",
    tagline: "Estilo cómic, energía explosiva",
    img: wpComic,
    href: "https://drive.google.com/drive/u/1/folders/16YM8uh-zRjcJJb0DiWf2qY0IBs86oKT1",
    accent: "from-orange-500/50 via-red-500/30 to-blue-600/40",
  },
  {
    title: "CINEMATOGRAPHIC SERIES",
    tagline: "Atmósfera de película, cinemática pura",
    img: wpCinematic,
    href: "https://drive.google.com/drive/u/1/folders/1b_LO3nHQNPyjvtTqf-vLyq9GwrwCh5mU",
    accent: "from-blue-600/50 via-indigo-500/30 to-orange-500/40",
  },
];

const SOCIALS = {
  youtube: "https://www.youtube.com/@TheSoulNationHD",
  tiktok: "https://www.tiktok.com/@thesoulnation",
  facebook: "https://www.facebook.com/TheSoulNationHD",
  x: "https://x.com/TheSoulNation",
  discord: "https://discord.gg/ADPyNMFggc",
};

const VIDEOS = [
  { title: "¿Cómo unirte a The Soul Nation?", id: "MtgudmupERs" },
  { title: "Nuestro primer video como equipo", id: "Vnkmle9en6s" },
  { title: "Primer equipo mexicano en Clan Wars", id: "itqKDO_8GWs" },
  { title: "Nuestro torneo Xplicit Cup", id: "bq7tQexrbvI" },
  { title: "OSOKTAGE", id: "Ewxs6ufYpbc" },
];

const KILLERS = ["YAZ", "MORTAAL", "GALLARD", "RAPID", "SANTHY"];
const LEGENDS = ["SOUL YARBIZ", "SOUL MORTAL", "SOUL CREED", "SOUL EXTRURS"];
const CREW = [
  "SOUL VELFI", "SOUL VOLCANO", "SOUL XANS", "SOUL PEYERZ", "SOUL PAKAL",
  "SOUL BOUNSS", "SOUL GHOOST", "SOUL NEXUS Z", "SOUL XCENFE",
  "SOUL CASTERIZE", "SOUL ADVERSL", "SOUL SLADE X", "SOUL ZAINT",
];

const WAVES: { name: string; redes: string; bio: string; photo: string }[] = [
  { name: "SOUL MAVERICK", redes: "Facebook · TikTok · YouTube · X", photo: waveMaverick, bio: "Líder y fundador de The Soul Nation. Creador de contenido en YouTube desde 2012. Su fuerte no es el nivel de juego, es la creatividad, el humor y la forma directa de decir las cosas. Destaca por su carisma y liderazgo, cualidades con las que ha construido y sostenido a The Soul Nation, llevándolo a ganarse un lugar real y respetado en el corazón de la comunidad de Gears of War." },
  { name: "SOUL ALEMAN", redes: "Facebook · TikTok · YouTube · X", photo: waveAleman, bio: "Uno de los integrantes más recientes de Soul, Mendoza la Crew y dio el salto a The Waves con ganas reales de aprender y crecer. Se caracteriza por su rápida conexión con los viewers, sus chistes rancios y su carisma natural. No es el mejor jugador, pero juega con el corazón, especialmente Gears of War, un juego que lo marcó desde sus inicios gracias a su hermano mayor." },
  { name: "SOUL GIZZMO", redes: "TikTok · Twitch · X", photo: waveGizzmo, bio: "Creador de contenido mexicano que transmite su pasión por los videojuegos en Twitch y TikTok, crea videos y memes para YouTube, y conecta con su comunidad a través del humor y una energía intensa. Cada stream es más que juego: es un show donde se vive el momento y la gente se siente parte de la experiencia." },
  { name: "SOUL PXLMAA", redes: "Facebook · TikTok · YouTube · X", photo: wavePxlmaa, bio: "Palma es gamer de corazón y clavado con la música urbana. Le gusta prender stream, echar la reta, cotorrear sin filtro con la banda y reírse un rato mientras juega. También le entra al básquet y le late todo lo que sea competir en equipo. Cuida su flow al vestir y siempre anda con ganas de convivir y pasarla bien con la comunidad." },
  { name: "SOUL SYSTEM", redes: "Twitch · TikTok · YouTube", photo: waveSystem, bio: "Ex pro player de Gears of War. Ganador de torneos en GOW 3 y jugador profesional en GOW 4. Veterano de la época dorada, sobreviviente de LANs, rankeds infinitos y noches injustas. Hoy juego por diversión, nostalgia y risas con la comunidad. No prometo tryhard, pero sí buenos momentos y uno que otro escopetazo legendario… o fallido." },
  { name: "SOUL TEMPLA", redes: "TikTok · YouTube · X", photo: waveTempla, bio: "No nació casualmente en Gears of War, se forjó en él. Desde los 12 años descubrió el campo de batalla que moldeó su carácter. Durante la época de Gears of War 3 se unió como combatiente competitivo, se forjó en equipos y entendió que en gears no gana el que dispara, sino quien juega bien con IQ. Ahora es creador de contenido, busca transmitir el juego por amor, orgullo, nostalgia y respeto." },
  { name: "SOUL ENRI", redes: "TikTok · YouTube · X", photo: waveEnri, bio: "Carismático streamer al que le gusta disfrutar de diversos juegos como Halo, Fortnite, Roblox, pero ama hacer múltiples kills, nemesis y remontar partidas en Gears of War. Soul Enri está presente en casi todos los títulos de la franquicia con su clásico alternativo y su arma favorita… ¡La Gnasher!" },
  { name: "SOUL EMI X", redes: "TikTok", photo: waveEmix, bio: "Creador de contenido y editor de video enfocado en montajes, gameplays y contenido para redes sociales. Disfruta todo el proceso: idea, ritmo, música y detalles que hacen que el video conecte. Le gusta experimentar con estilos y narrativas. Fan de Gears of War, lo toma como inspiración para crear montajes intensos, competitivos y con identidad propia." },
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
    <div className="min-h-screen bg-background text-foreground relative">
      {/* AURORA — fondo ambiente premium */}
      <div className="aurora-field" aria-hidden="true">
        <div className="aurora-grid" />
        <div className="aurora-scan" />
      </div>
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/40 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-display font-bold tracking-tight">
            <img src={soulLogo} alt="The Soul Nation" width={28} height={28} className="drop-shadow-[0_0_12px_var(--flame-glow)]" />
            <span>THE SOUL <span className="text-flame">NATION</span></span>
          </a>
          <nav className="hidden md:flex gap-6 text-sm uppercase tracking-widest text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition">¿Quiénes Somos?</a>
            <a href="#vision" className="hover:text-foreground transition">Visión</a>
            <a href="#objetivo" className="hover:text-foreground transition">Objetivo</a>
            <a href="#roster" className="hover:text-foreground transition">Roster</a>
            <a href="#videos" className="hover:text-foreground transition">Videos</a>
            <a href="#wallpapers" className="hover:text-foreground transition">Wallpapers</a>
            <a href="#jersey" className="hover:text-foreground transition">Jersey</a>
            <a href="#redes" className="hover:text-foreground transition">Redes</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-screen overflow-hidden grain bg-hero">
        <img
          src={soulMascot}
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
                <div className="relative aspect-[4/5] bg-gradient-to-br from-deep to-background overflow-hidden">
                  <img src={c.photo} alt={c.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-flame bg-background/70 backdrop-blur px-2 py-1 rounded-full border border-border">
                    Wave · 0{i + 1}
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

      {/* VIDEOS */}
      <section id="videos" className="relative py-32 md:py-48 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">05</div>
            <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95]">
              Nuestros <span className="italic text-flame">Videos</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
              Una pequeña selección de momentos clave en la historia de The Soul Nation.
            </p>
          </div>
          <div className="perspective grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VIDEOS.map((v) => (
              <article key={v.id} className="tilt-card roster-card rounded-2xl overflow-hidden">
                <div className="aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
                <div className="p-5 relative z-10">
                  <h3 className="layer-up font-display font-bold text-lg text-foreground/95">{v.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JERSEY */}
      <section id="jersey" className="relative py-32 md:py-48 border-t border-border overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-flame opacity-10 blur-[160px]" />
        <div className="relative mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">06</div>
            <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95]">
              Jersey <span className="italic text-flame">Oficial</span>
            </h2>
            <p className="mt-6 text-lg text-foreground/85 leading-relaxed">
              Los colores de la nación. Diseño oficial de The Soul Nation, hecho para representar dentro y fuera del juego.
            </p>
          </div>
          <div className="md:col-span-7 perspective">
            <div className="tilt-card relative">
              <img
                src={soulJersey}
                alt="Jersey oficial The Soul Nation"
                loading="lazy"
                className="layer-up w-full h-auto drop-shadow-[0_30px_80px_var(--flame-glow)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* REDES */}
      <section id="redes" className="relative py-32 md:py-48 overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-hero opacity-80" />
        <img src={soulLogo} alt="" width={500} height={500} loading="lazy" className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[40vw] max-w-[500px] opacity-20 animate-float" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-flame">07</div>
          <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95]">
            síguenos en nuestras <br /><span className="text-flame italic">redes sociales</span>
          </h2>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a href={SOCIALS.discord} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-flame text-primary-foreground px-10 py-5 rounded-full font-bold text-lg shadow-[0_0_80px_-10px_var(--flame-glow)] hover:scale-105 transition">
              Discord
            </a>
            <a href={SOCIALS.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-5 rounded-full font-bold text-lg border border-border hover:bg-accent hover:border-flame transition">
              YouTube
            </a>
            <a href={SOCIALS.tiktok} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-5 rounded-full font-bold text-lg border border-border hover:bg-accent hover:border-flame transition">
              TikTok
            </a>
            <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-5 rounded-full font-bold text-lg border border-border hover:bg-accent hover:border-flame transition">
              Facebook
            </a>
            <a href={SOCIALS.x} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-5 rounded-full font-bold text-lg border border-border hover:bg-accent hover:border-flame transition">
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
