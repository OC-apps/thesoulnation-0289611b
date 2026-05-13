import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type MouseEvent } from "react";
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
import jerseyFront from "@/assets/jersey-front.png";
import jerseyBack from "@/assets/jersey-back.png";
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

const KILLERS = ["YAZ", "MORTAAL", "GALLARD", "RAPID", "SANTHY", "SLADE X", "DIABOLI"];
const LEGENDS = ["SOUL YARBIZ", "SOUL MORTAL", "SOUL CREED", "SOUL EXTRURS"];
const CREW = [
  "SOUL VELFI", "SOUL VOLCANO", "SOUL XANS", "SOUL PEYERZ", "SOUL PAKAL",
  "SOUL BOUNSS", "SOUL GHOOST", "SOUL NEXUS Z", "SOUL XCENFE",
  "SOUL CASTERIZE", "SOUL ADVERSL", "SOUL SLADE X", "SOUL ZAINT", "SOUL ARID",
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
  { name: "SOUL BELLATRIIX", redes: "Próximamente", photo: soulLogo, bio: "Nueva incorporación a The Soul Waves. Pronto compartirá su estilo, contenido y energía con la comunidad. Stay tuned." },
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
            <a href="#music" className="hover:text-foreground transition">Music</a>
            <a href="#reclutamiento" className="hover:text-foreground transition">Reclutamiento</a>
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

      {/* VISIÓN + OBJETIVO — mobile carrusel */}
      <section id="vision" className="md:hidden relative py-20 border-y border-border bg-card/30">
        <div className="px-6 mb-6 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-flame">02 · 03</div>
            <h2 className="mt-2 font-display text-3xl font-bold italic text-flame">Visión & Objetivo</h2>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">desliza →</span>
        </div>
        <MobileCarousel>
          {[
            { n: "02", t: "Visión", body: "Ser el equipo Mexicano líder en la creación de contenido de exhibición y una referencia de la creación de contenido de calidad en la comunidad hispana por nuestra capacidad para generar contenido original, innovador y de calidad, que inspire y conecte con los gamers de la región." },
            { n: "03", t: "Objetivo", body: "Impulsar el potencial de cada miembro de The Soul Nation, ya sea como jugador, creador de contenido, o parte de nuestras divisiones (Legends, Media, Waves y Crew). Queremos expandir la organización, fortalecer la comunidad gamer y apoyar a otras organizaciones de calidad en Latinoamérica, colaborando para un crecimiento conjunto." },
          ].map((s) => (
            <article key={s.n} id={s.t === "Objetivo" ? "objetivo" : undefined} className="snap-center shrink-0 w-[85%] roster-card rounded-2xl p-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-flame">{s.n}</div>
              <h3 className="mt-2 font-display text-3xl font-bold italic text-flame">{s.t}</h3>
              <p className="mt-4 text-sm text-foreground/85 leading-relaxed">{s.body}</p>
            </article>
          ))}
        </MobileCarousel>
      </section>

      {/* VISIÓN — desktop */}
      <section className="hidden md:block relative py-32 md:py-48 border-y border-border bg-card/30">
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

      {/* OBJETIVO — desktop */}
      <section className="hidden md:block relative py-32 md:py-48">
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
            <h3 className="font-display text-5xl md:text-7xl font-bold text-3d leading-[0.95]">
              The <span className="italic text-flame">Soul Waves</span>
            </h3>
            <div className="mt-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">creadores de contenido</div>
            <p className="mt-6 text-muted-foreground max-w-3xl mx-auto">
              Cada uno aporta su estilo, personalidad y forma de vivir el gaming. No se trata solo de clips o transmisiones: es constancia, identidad y conexión real con la comunidad.
            </p>
          </div>

          {/* Mobile: carrusel */}
          <div className="sm:hidden">
            <MobileCarousel>
              {WAVES.map((c, i) => (
                <article key={c.name} className="snap-center shrink-0 w-[78%] roster-card rounded-2xl overflow-hidden flex flex-col">
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-deep to-background overflow-hidden">
                    <img src={c.photo} alt={c.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                    <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.3em] text-flame bg-background/70 backdrop-blur px-2 py-1 rounded-full border border-border">Wave · 0{i + 1}</span>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="font-display font-bold text-xl text-flame drop-shadow">{c.name}</h4>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{c.redes}</p>
                    </div>
                  </div>
                  <div className="p-4 relative z-10">
                    <p className="text-xs text-foreground/85 leading-relaxed line-clamp-5">{c.bio}</p>
                  </div>
                </article>
              ))}
            </MobileCarousel>
          </div>

          {/* Desktop/tablet: grid */}
          <div className="hidden sm:grid perspective sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section id="videos" className="relative py-32 md:py-48 border-t border-border overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-flame opacity-[0.08] blur-[160px]" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-flame opacity-[0.06] blur-[140px]" />
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{backgroundImage:"radial-gradient(circle at 20% 30%, color-mix(in oklab, var(--flame) 8%, transparent), transparent 40%), radial-gradient(circle at 80% 70%, color-mix(in oklab, var(--flame) 6%, transparent), transparent 45%)"}} />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-flame">05 · Reel</div>
              <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95]">
                Nuestros <span className="italic text-flame">Videos</span>
              </h2>
              <p className="mt-6 text-muted-foreground max-w-2xl">
                Una selección de momentos clave en la historia de The Soul Nation. Da clic en cualquiera para reproducir.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-flame animate-pulse" /> Live archive · {VIDEOS.length} clips
            </div>
          </div>

          {/* Mobile carrusel */}
          <div className="md:hidden -mx-6 px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {VIDEOS.map((v, i) => (
              <div key={v.id} className="snap-center shrink-0 w-[85%]">
                <VideoCard video={v} index={i} />
              </div>
            ))}
          </div>
          <div className="md:hidden mt-2 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">desliza →</div>

          {/* Desktop grid */}
          <div className="hidden md:grid lg:grid-cols-3 gap-6 perspective">
            {VIDEOS.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* WALLPAPERS */}
      <section id="wallpapers" className="relative py-32 md:py-48 border-t border-border overflow-hidden">
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full bg-flame opacity-10 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">06</div>
            <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95]">
              Wallpapers <span className="italic text-flame">Oficiales</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
              Tres series exclusivas para vestir tu pantalla con la identidad de The Soul Nation. Da clic, descarga y representa.
            </p>
          </div>
          <div className="perspective grid md:grid-cols-3 gap-8">
            {WALLPAPERS.map((wp, i) => (
              <a
                key={wp.title}
                href={wp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="wp-card group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-deep">
                  <img src={wp.img} alt={wp.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${wp.accent} mix-blend-overlay opacity-60`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <span className="wp-shine" />
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-flame bg-background/70 backdrop-blur px-2 py-1 rounded-full border border-border">
                    Serie · 0{i + 1}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display font-bold text-2xl md:text-3xl leading-tight text-foreground">
                      {wp.title}
                    </h3>
                    <p className="mt-1 text-sm text-foreground/80">{wp.tagline}</p>
                    <div className="wp-cta mt-4 inline-flex items-center gap-2 text-sm font-bold text-flame">
                      <span>Descargar en Drive</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* JERSEY */}
      <section id="jersey" className="relative py-32 md:py-48 border-t border-border overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-flame opacity-10 blur-[160px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame/60 to-transparent" />

        {/* Marquee superior con specs */}
        <div className="relative overflow-hidden border-y border-border bg-background/40 backdrop-blur py-3 mb-16">
          <div className="flex gap-10 whitespace-nowrap animate-marquee font-display text-sm md:text-base font-bold tracking-[0.25em] uppercase">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-10 items-center shrink-0">
                {["Edición Oficial", "★", "Tela Premium", "★", "Diseño 2025", "★", "Bordado Soul", "★", "Drop Limitado", "★", "The Soul Nation", "★"].map((t, j) => (
                  <span key={j} className={j % 2 === 0 ? "text-flame" : "text-foreground/60"}>{t}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-12 items-center">
          {/* Texto + specs */}
          <div className="md:col-span-5">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">06</div>
            <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95]">
              Jersey <span className="italic text-flame">Oficial</span>
            </h2>
            <p className="mt-6 text-lg text-foreground/85 leading-relaxed">
              Los colores de la nación. Diseño oficial de The Soul Nation, hecho para representar dentro y fuera del juego.
            </p>

            {/* Specs interactivas */}
            <ul className="mt-8 space-y-3">
              {[
                { k: "Material", v: "Poliéster premium dry-fit" },
                { k: "Diseño", v: "Naranja flama · negro abismo" },
                { k: "Edición", v: "Drop oficial · cantidades limitadas" },
                { k: "Para", v: "Player · Streamer · Soul Family" },
              ].map((s) => (
                <li key={s.k} className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-border bg-card/40 backdrop-blur hover:border-flame hover:bg-card/60 transition group">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground group-hover:text-flame transition">{s.k}</span>
                  <span className="text-sm font-bold text-right">{s.v}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-border bg-card/40 backdrop-blur p-5">
              <p className="text-sm text-foreground/85 leading-relaxed">
                Puedes pedir tu Jersey enviando un <span className="font-bold text-flame">mensaje privado por TikTok</span>.
              </p>
              <a
                href="https://www.tiktok.com/@thesoulnation"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-flame text-primary-foreground px-6 py-3 rounded-full font-bold shadow-[0_0_60px_-10px_var(--flame-glow)] hover:scale-105 transition"
              >
                @thesoulnation en TikTok
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-flame animate-pulse" />
                  Stock limitado
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-flame/40 text-[10px] uppercase tracking-[0.25em] text-flame font-bold">
                  Drop 2026
                </span>
              </div>
            </div>
          </div>

          {/* Showcase interactivo */}
          <div className="md:col-span-7">
            <JerseyShowcase front={jerseyFront} back={jerseyBack} />
          </div>
        </div>
      </section>

      {/* MUSIC — SPOTIFY */}
      <section id="music" className="relative py-32 md:py-48 border-t border-border overflow-hidden">
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-emerald-500 opacity-10 blur-[160px]" />
        <div className="absolute -bottom-40 left-0 w-[500px] h-[500px] rounded-full bg-flame opacity-10 blur-[160px]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">07</div>
            <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95]">
              The Soul Nation <span className="italic text-flame">Music</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
              El sonido oficial de The Soul Nation. Escucha nuestros tracks directamente desde Spotify.
            </p>
          </div>
          <div className="perspective grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 tilt-card roster-card rounded-3xl p-3 md:p-4 overflow-hidden">
              <iframe
                title="The Soul Nation en Spotify"
                src="https://open.spotify.com/embed/artist/56ieAbEEuRbD3pg8xtIRt7?utm_source=generator&theme=0"
                width="100%"
                height="520"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-2xl border-0 relative z-10"
              />
            </div>
            <div className="md:col-span-5 relative z-10">
              <div className="text-xs uppercase tracking-[0.3em] text-flame mb-4">Now Playing</div>
              <h3 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                Identidad <span className="italic text-flame">sonora</span> de la nación
              </h3>
              <p className="mt-5 text-foreground/85 leading-relaxed">
                Música hecha por y para la comunidad. Dale play, sigue al artista y haz que cada track suene en tus partidas, montajes y streams.
              </p>
              <a
                href="https://open.spotify.com/intl-es/artist/56ieAbEEuRbD3pg8xtIRt7?si=1IirEmBPSKKvZSjk2_Q4JA"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 bg-flame text-primary-foreground px-8 py-4 rounded-full font-bold shadow-[0_0_60px_-10px_var(--flame-glow)] hover:scale-105 transition"
              >
                Abrir en Spotify
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M9 7h8v8"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RECLUTAMIENTO */}
      <section id="reclutamiento" className="relative py-32 md:py-48 border-t border-border overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-flame opacity-10 blur-[160px]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">08</div>
            <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95]">
              Únete al <span className="italic text-flame">Equipo</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
              Aplica al área en la que destaques. Revisamos cada postulación y respondemos por las redes oficiales.
            </p>
          </div>

          {/* Áreas info */}
          <div className="grid md:grid-cols-2 gap-5 mb-14">
            {[
              { t: "The Soul Legends (Montagers)", d: "Buscamos a los mejores jugadores de exhibición (no competitivos). Envía un video con 10 de tus mejores clips de Gears of War — partida normal (no OSOK, no evento), preferentemente DPE." },
              { t: "The Soul Waves (Streamers y CC)", d: "La calidad de tu contenido y la conexión con tu comunidad es lo que importa. Comparte tus redes y plataformas y cuéntanos tu estilo y enfoque como creador." },
              { t: "The Soul Media (GFX y VFX)", d: "Diseñadores gráficos y editores con efectos visuales. Comparte tu portafolio (Behance, Carbonmade, etc.) o el link de tu mejor trabajo editado." },
              { t: "The Soul Killers (Guardian · Gears 5)", d: "Top 100 Guardian. Comunicación, lectura de partida y mentalidad de team. Si entras, una semana de prueba y cambio de GT clásico inmediato." },
            ].map((a) => (
              <div key={a.t} className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6 hover:border-flame transition">
                <h4 className="font-display font-bold text-lg text-flame">{a.t}</h4>
                <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{a.d}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mb-10">
            Para todo RC debes incluir la intro oficial de The Soul Nation.{" "}
            <a
              href="https://drive.google.com/file/d/1fBD9_mETYpvAAazyzAft7e2wcBEdrK-J/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-flame font-bold hover:underline"
            >
              Descárgala aquí
            </a>
            .
          </p>

          {/* FORM */}
          <form
            action="https://formsubmit.co/soulteamhq@gmail.com"
            method="POST"
            className="relative rounded-3xl border border-border bg-card/40 backdrop-blur p-8 md:p-12 shadow-[0_30px_80px_-20px_var(--flame-glow)]"
          >
            <input type="hidden" name="_subject" value="RECLUTAMIENTO THE SOUL NATION" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="true" />
            <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

            <p className="text-xs uppercase tracking-widest text-flame mb-2">* Indica un campo obligatorio</p>
            <p className="text-sm text-muted-foreground mb-8">Rellena todos los campos.</p>

            <div className="grid gap-6">
              <label className="block">
                <span className="text-sm font-bold uppercase tracking-wider">Nombre real y Nickname *</span>
                <input
                  required
                  type="text"
                  name="Nombre y Nickname"
                  className="mt-2 w-full bg-background/60 border border-border rounded-xl px-4 py-3 outline-none focus:border-flame transition"
                  placeholder="Ej: Juan Pérez · SOUL JUANP"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold uppercase tracking-wider">Área *</span>
                <select
                  required
                  name="Area"
                  defaultValue=""
                  className="mt-2 w-full bg-background/60 border border-border rounded-xl px-4 py-3 outline-none focus:border-flame transition"
                >
                  <option value="" disabled>Selecciona un área</option>
                  <option>The Soul Legends (Montager)</option>
                  <option>The Soul Waves (Streamer y CC)</option>
                  <option>The Soul Media (GFX y/o VFX)</option>
                  <option>The Soul Killers (Top 100 Guardian)</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold uppercase tracking-wider">Link de tu RC *</span>
                <span className="block text-xs text-muted-foreground mt-1">
                  Para The Soul Legends: video con tus mejores clips de Gears of War subido a YouTube con el título "The Soul Nation RC".
                </span>
                <input
                  required
                  type="url"
                  name="Link RC"
                  className="mt-2 w-full bg-background/60 border border-border rounded-xl px-4 py-3 outline-none focus:border-flame transition"
                  placeholder="https://youtube.com/..."
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold uppercase tracking-wider">Cuéntanos sobre ti y deja tus redes sociales *</span>
                <textarea
                  required
                  name="Sobre ti y redes"
                  rows={6}
                  className="mt-2 w-full bg-background/60 border border-border rounded-xl px-4 py-3 outline-none focus:border-flame transition resize-y"
                  placeholder="Edad, experiencia, juegos, plataformas, redes sociales, gamertag, etc."
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold uppercase tracking-wider">Correo de contacto</span>
                <input
                  type="email"
                  name="email"
                  className="mt-2 w-full bg-background/60 border border-border rounded-xl px-4 py-3 outline-none focus:border-flame transition"
                  placeholder="tucorreo@ejemplo.com"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-10 w-full md:w-auto inline-flex items-center justify-center gap-3 bg-flame text-primary-foreground px-10 py-5 rounded-full font-bold text-lg shadow-[0_0_80px_-10px_var(--flame-glow)] hover:scale-[1.02] active:scale-[0.99] transition"
            >
              Enviar postulación
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </button>
          </form>
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

function JerseyShowcase({ front, back }: { front: string; back: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 50, active: false });
  const [side, setSide] = useState<"front" | "back">("front");

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setT({ rx: (0.5 - y) * 18, ry: (x - 0.5) * 22, mx: x * 100, my: y * 100, active: true });
  };
  const onLeave = () => setT((s) => ({ ...s, rx: 0, ry: 0, active: false }));

  return (
    <div className="relative mx-auto w-full max-w-[640px] select-none">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative aspect-square"
        style={{ perspective: "1400px" }}
      >
        {/* Halo */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[2rem] transition-opacity duration-500"
          style={{
            opacity: t.active ? 1 : 0.55,
            background: `radial-gradient(circle at ${t.mx}% ${t.my}%, var(--flame-glow), transparent 55%)`,
            filter: "blur(50px)",
          }}
        />
        {/* Tarjeta 3D con flip */}
        <div
          className="relative w-full h-full rounded-[2rem] border border-border bg-gradient-to-br from-card/80 to-background/40 backdrop-blur-xl overflow-hidden"
          style={{
            transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
            transformStyle: "preserve-3d",
            boxShadow: "0 40px 80px -20px rgba(0,0,0,.6), 0 0 60px -10px var(--flame-glow)",
            transition: "transform 200ms ease-out",
          }}
        >
          {/* Grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          {/* Etiquetas */}
          <div className="absolute top-5 left-5 z-20 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] bg-background/70 backdrop-blur border border-border rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-flame animate-pulse" />
            Drop · 2026
          </div>
          <div className="absolute top-5 right-5 z-20 text-[10px] uppercase tracking-[0.3em] bg-flame text-primary-foreground rounded-full px-3 py-1.5 font-bold">
            {side === "front" ? "Frente" : "Espalda"}
          </div>

          {/* Flip container */}
          <div
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 700ms cubic-bezier(.2,.8,.2,1)",
              transform: `translateZ(80px) scale(${t.active ? 1.06 : 1}) rotateY(${side === "front" ? 0 : 180}deg)`,
            }}
          >
            <img
              src={front}
              alt="Jersey oficial The Soul Nation - frente"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain p-8"
              style={{ backfaceVisibility: "hidden", filter: "drop-shadow(0 25px 60px var(--flame-glow))" }}
            />
            <img
              src={back}
              alt="Jersey oficial The Soul Nation - espalda"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain p-8"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", filter: "drop-shadow(0 25px 60px var(--flame-glow))" }}
            />
          </div>

          {/* Shine */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300"
            style={{
              opacity: t.active ? 0.9 : 0,
              background: `radial-gradient(circle at ${t.mx}% ${t.my}%, rgba(255,255,255,0.35), transparent 35%)`,
            }}
          />
        </div>
      </div>

      {/* Toggle frente / espalda */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <div className="inline-flex p-1 rounded-full border border-border bg-card/60 backdrop-blur">
          {(["front", "back"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className={`px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold transition ${
                side === s ? "bg-flame text-primary-foreground shadow-[0_0_30px_-5px_var(--flame-glow)]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "front" ? "Frente" : "Espalda"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video, index, featured }: { video: { title: string; id: string }; index: number; featured?: boolean }) {
  const [playing, setPlaying] = useState(false);
  return (
    <article
      className={`group relative tilt-card roster-card rounded-2xl overflow-hidden ${featured ? "lg:col-span-2 lg:row-span-2" : ""}`}
    >
      <div className={`relative ${featured ? "aspect-video lg:aspect-[16/10]" : "aspect-video"} bg-black overflow-hidden`}>
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group/play"
            aria-label={`Reproducir ${video.title}`}
          >
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/play:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="relative flex items-center justify-center w-20 h-20 rounded-full bg-flame/90 text-primary-foreground shadow-[0_0_60px_-5px_var(--flame-glow)] transition-transform duration-300 group-hover/play:scale-110">
                <span className="absolute inset-0 rounded-full bg-flame/40 animate-ping" />
                <svg viewBox="0 0 24 24" className="relative w-8 h-8 ml-1 fill-current"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </div>
            <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-flame bg-background/70 backdrop-blur px-2 py-1 rounded-full border border-border">
              #{String(index + 1).padStart(2, "0")}
            </span>
            <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
              <h3 className="font-display font-bold text-lg md:text-xl text-foreground/95 drop-shadow">{video.title}</h3>
              <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-flame" /> YouTube · The Soul Nation
              </div>
            </div>
          </button>
        )}
      </div>
    </article>
  );
}

function MobileCarousel({ children, label }: { children: React.ReactNode; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  return (
    <div className="relative">
      <div
        ref={ref}
        className="-mx-6 px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
      >
        {children}
      </div>
      <button
        type="button"
        aria-label="Anterior"
        onClick={() => scroll(-1)}
        className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur border border-border flex items-center justify-center text-foreground/80 active:scale-95 transition shadow-lg"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        onClick={() => scroll(1)}
        className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur border border-border flex items-center justify-center text-foreground/80 active:scale-95 transition shadow-lg"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
      </button>
      {label && <div className="mt-1 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>}
    </div>
  );
}
