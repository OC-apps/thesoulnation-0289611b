import { createFileRoute, Link } from "@tanstack/react-router";
import { EasterEgg } from "@/components/easter-egg";
import { useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Share2, Youtube, Facebook } from "lucide-react";
import soulMascot from "@/assets/soul-mascot.svg";
import soulLogo from "@/assets/soul-logo.png";
import soulNationTeam from "@/assets/soul-nation-team.png";
import somosCover from "@/assets/somos-soul-nation-cover.png";
import soulBellatriix from "@/assets/soul-bellatriix.jpeg";
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
import soulWavesLogo from "@/assets/soul-waves.png";
import { RecruitmentForm } from "@/components/recruitment-form";
import { HoloSquadCard } from "@/components/holo-squad-card";
import { useRoster } from "@/hooks/use-roster";


import { Hero3D } from "@/components/hero-3d";
import { AudioProvider, useAudio } from "@/hooks/use-audio";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Zap, Radio, Trophy, Crown } from "lucide-react";
import { useLiveStatus } from "@/hooks/use-live-status";

const formatTime = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

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

const KILLERS = ["SOUL MORTAAL", "SOUL GALLARD", "SOUL RAPID", "SOUL SANTHY", "SOUL SLADE X", "SOUL DIABOLI"];
const LEGENDS = ["SOUL YARBIZ", "SOUL MORTAL", "SOUL CREED", "SOUL EXTRURS"];
const CREW = [
  "SOUL VELFI", "SOUL VOLCANO", "SOUL XANS", "SOUL PEYERZ", "SOUL PAKAL",
  "SOUL BOUNSS", "SOUL GHOOST", "SOUL NEXUS Z", "SOUL XCENFE",
  "SOUL CASTERIZE", "SOUL ADVERSL", "SOUL SLADE X", "SOUL ZAINT", "SOUL ARID",
  "SOUL RAVENANT", "SOUL NOIRR",
];

type Social = { label: string; href: string };
const WAVES: { name: string; redes: string; bio: string; photo: string; socials?: Social[] }[] = [
  {
    name: "SOUL MAVERICK Z",
    redes: "TikTok · Facebook · YouTube · X",
    photo: waveMaverick,
    bio: "Líder y fundador de The Soul Nation. Creador de contenido en YouTube desde 2012. Su fuerte no es el nivel de juego, es la creatividad, el humor y la forma directa de decir las cosas. Destaca por su carisma y liderazgo, cualidades con las que ha construido y sostenido a The Soul Nation, llevándolo a ganarse un lugar real y respetado en el corazón de la comunidad de Gears of War.",
    socials: [
      { label: "TikTok", href: "https://www.tiktok.com/@soulmaverickz" },
      { label: "Facebook", href: "https://www.facebook.com/Soulmaverickz" },
      { label: "YouTube", href: "https://www.youtube.com/@SoulMaverickZ" },
    ],
  },
  { name: "SOUL ALEMAN", redes: "Facebook · TikTok · YouTube · X", photo: waveAleman, bio: "Uno de los integrantes más recientes de Soul, Mendoza la Crew y dio el salto a The Waves con ganas reales de aprender y crecer. Se caracteriza por su rápida conexión con los viewers, sus chistes rancios y su carisma natural. No es el mejor jugador, pero juega con el corazón, especialmente Gears of War, un juego que lo marcó desde sus inicios gracias a su hermano mayor." },
  { name: "SOUL GIZZMO", redes: "TikTok · Twitch · X", photo: waveGizzmo, bio: "Creador de contenido mexicano que transmite su pasión por los videojuegos en Twitch y TikTok, crea videos y memes para YouTube, y conecta con su comunidad a través del humor y una energía intensa. Cada stream es más que juego: es un show donde se vive el momento y la gente se siente parte de la experiencia." },
  { name: "SOUL PXLMAA", redes: "Facebook · TikTok · YouTube · X", photo: wavePxlmaa, bio: "Palma es gamer de corazón y clavado con la música urbana. Le gusta prender stream, echar la reta, cotorrear sin filtro con la banda y reírse un rato mientras juega. También le entra al básquet y le late todo lo que sea competir en equipo. Cuida su flow al vestir y siempre anda con ganas de convivir y pasarla bien con la comunidad." },
  { name: "SOUL SYSTEEM", redes: "Twitch · TikTok · YouTube", photo: waveSystem, bio: "Ex pro player de Gears of War. Ganador de torneos en GOW 3 y jugador profesional en GOW 4. Veterano de la época dorada, sobreviviente de LANs, rankeds infinitos y noches injustas. Hoy juego por diversión, nostalgia y risas con la comunidad. No prometo tryhard, pero sí buenos momentos y uno que otro escopetazo legendario… o fallido." },
  { name: "SOUL TEMPLA", redes: "TikTok · YouTube · X", photo: waveTempla, bio: "No nació casualmente en Gears of War, se forjó en él. Desde los 12 años descubrió el campo de batalla que moldeó su carácter. Durante la época de Gears of War 3 se unió como combatiente competitivo, se forjó en equipos y entendió que en gears no gana el que dispara, sino quien juega bien con IQ. Ahora es creador de contenido, busca transmitir el juego por amor, orgullo, nostalgia y respeto." },
  { name: "SOUL ENRI", redes: "TikTok · YouTube · X", photo: waveEnri, bio: "Carismático streamer al que le gusta disfrutar de diversos juegos como Halo, Fortnite, Roblox, pero ama hacer múltiples kills, nemesis y remontar partidas en Gears of War. Soul Enri está presente en casi todos los títulos de la franquicia con su clásico alternativo y su arma favorita… ¡La Gnasher!" },
  { name: "SOUL EMI X", redes: "TikTok", photo: waveEmix, bio: "Creador de contenido y editor de video enfocado en montajes, gameplays y contenido para redes sociales. Disfruta todo el proceso: idea, ritmo, música y detalles que hacen que el video conecte. Le gusta experimentar con estilos y narrativas. Fan de Gears of War, lo toma como inspiración para crear montajes intensos, competitivos y con identidad propia." },
  { name: "SOUL BELLATRIIX", redes: "TikTok", photo: soulBellatriix, bio: "¿Combinar medicina y gaming? ¡Es posible! Soy Soul Bellatriix, médica de profesión y gamer de corazón. Mi objetivo principal al prender stream es distraerme, convivir con ustedes y pasar un buen rato. Me considero una persona sumamente social que valora cada interacción con su comunidad; estoy infinitamente agradecida con quienes me acompañan en este camino.\n\nSoy fan de Gears de toda la vida, y aunque la habilidad me falle a veces, el entusiasmo está al 100%. Me encanta recibir a gente nueva con los brazos abiertos y apoyarnos entre todos. Formar parte de Soul Nation es un honor y un gran paso para mi crecimiento como creadora de contenido. ¡Bienvenidos a mi lado del Xbox!" },
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

function renderWaveCard(
  c: (typeof WAVES)[number],
  i: number,
  leader: boolean,
  onClick: () => void,
  isLive: boolean,
) {
  const exploreId = `member:${c.name.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <button
      onClick={onClick}
      data-explore={exploreId}
      className={`group relative overflow-hidden rounded-xl border bg-blue-deep/60 backdrop-blur text-left transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-flame w-full ${
        leader
          ? "border-flame shadow-[0_25px_60px_-15px_var(--flame-glow)] hover:shadow-[0_30px_80px_-15px_var(--flame-glow)]"
          : "border-flame/20 hover:border-flame hover:shadow-[0_20px_50px_-20px_var(--flame-glow)]"
      }`}
    >
      <div className={`relative overflow-hidden ${leader ? "aspect-[16/7]" : "aspect-square"}`}>
        <img
          src={c.photo}
          alt={c.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-[center_25%] transition-transform duration-500 group-hover:scale-110"
        />
        <span className="pointer-events-none absolute inset-x-0 -top-1 h-[2px] bg-gradient-to-r from-transparent via-flame to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_1.4s_ease-in-out_infinite] shadow-[0_0_12px_var(--flame-glow)]" />
        <div className="absolute inset-0 bg-flame/0 group-hover:bg-flame/10 transition-colors" />
        <span className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-flame transition-all group-hover:w-5 group-hover:h-5" />
        <span className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-flame transition-all group-hover:w-5 group-hover:h-5" />
        <span className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-flame transition-all group-hover:w-5 group-hover:h-5" />
        <span className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-flame transition-all group-hover:w-5 group-hover:h-5" />
        <span className="absolute top-1.5 right-1.5 text-[8px] font-mono tracking-[0.3em] text-flame bg-background/70 px-1.5 py-0.5 rounded-sm">
          W·0{i + 1}
        </span>
        <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[7px] font-mono tracking-[0.3em] text-background bg-flame px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
          ► OPEN
        </span>
        {leader && (
          <span className="absolute top-2 left-2 z-10 flex items-center gap-1.5 text-[11px] sm:text-xs font-display font-black uppercase tracking-[0.3em] text-background bg-gradient-to-r from-amber-400 via-flame to-amber-500 px-3 py-1.5 rounded-md shadow-[0_0_24px_var(--flame-glow)] ring-2 ring-amber-300/70 animate-pulse-glow">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-[0_0_6px_rgba(255,200,80,0.9)]" /> LEADER
          </span>
        )}
        {isLive && (
          <span className="absolute z-20 bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[9px] font-mono tracking-[0.25em] text-white bg-red-600 px-2 py-0.5 rounded-sm shadow-[0_0_14px_rgba(220,38,38,0.9)] animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE
          </span>
        )}
      </div>
      <div className="px-2 py-2 sm:py-3 border-t border-flame/20">
        <h4 className={`font-display font-bold leading-tight truncate text-flame ${leader ? "text-sm sm:text-base" : "text-[11px] sm:text-sm"}`}>
          {c.name}
        </h4>
        <div className="mt-1 flex items-center gap-1 text-[8px] uppercase tracking-[0.25em] text-muted-foreground">
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLive ? "bg-red-500" : "bg-emerald-400"}`} />
          {isLive ? "en vivo · tiktok" : "online"}
        </div>
      </div>
    </button>
  );
}

function WavesHUD() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? WAVES[openIdx] : null;
  const liveSet = useLiveStatus();
  const isLiveFor = (name: string) => liveSet.has(name.toLowerCase().replace(/\s+/g, "-"));

  return (
    <>
      <div className="mb-20 space-y-4">
        {(() => {
          const leaderIdx = WAVES.findIndex((c) => c.name === "SOUL MAVERICK Z");
          const ordered = [
            ...(leaderIdx >= 0 ? [{ c: WAVES[leaderIdx], i: leaderIdx, leader: true }] : []),
            ...WAVES.map((c, i) => ({ c, i, leader: false })).filter((x) => x.i !== leaderIdx),
          ];
          return (
            <>
              {/* Leader row - full width rectangle */}
              {ordered[0]?.leader && (
                <div className="w-full">
                  {renderWaveCard(ordered[0].c, ordered[0].i, true, () => setOpenIdx(ordered[0].i), isLiveFor(ordered[0].c.name))}
                </div>
              )}
              {/* Rest 4+4 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {ordered.slice(1).map(({ c, i }) => (
                  <div key={c.name}>{renderWaveCard(c, i, false, () => setOpenIdx(i), isLiveFor(c.name))}</div>
                ))}
              </div>
            </>
          );
        })()}
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && setOpenIdx(null)}>
        <DialogContent onClick={() => setOpenIdx(null)} className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:max-w-3xl max-h-[calc(100dvh-2rem)] overflow-y-auto border-flame/60 bg-blue-deep/70 backdrop-blur-xl p-0 cursor-pointer [&>button]:hidden shadow-[0_0_40px_var(--flame-glow),0_0_80px_var(--flame-glow),inset_0_0_20px_var(--flame-glow)] rounded-xl">
          {active && (
            <div className="relative">
              {/* scanlines */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-screen" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 3px)" }} />
              {/* HUD top bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-flame/30 bg-background/40 font-mono text-[10px] uppercase tracking-[0.3em] text-flame">
                <div className="flex items-center gap-2">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>SOUL · INTEL · PROFILE</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline">ID · 0{(openIdx ?? 0) + 1}/0{WAVES.length}</span>
                  <button onClick={() => setOpenIdx(null)} className="hover:text-foreground transition" aria-label="Cerrar">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <DialogTitle className="sr-only">{active.name}</DialogTitle>

              <div className="grid md:grid-cols-5 gap-0">
                {/* Photo panel */}
                <div className="relative md:col-span-2 aspect-square md:aspect-auto md:min-h-[420px] overflow-hidden bg-background group">
                  <img src={active.photo} alt={active.name} className="absolute inset-0 w-full h-full object-cover" />
                  {/* subtle edge fade only towards info side */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background/70 via-transparent to-transparent" />
                  {/* animated scan line */}
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-flame to-transparent shadow-[0_0_14px_var(--flame-glow)] animate-[scan_2.6s_ease-in-out_infinite]" />
                  {/* corners */}
                  <span className="absolute top-2 left-2 w-5 h-5 border-l-2 border-t-2 border-flame" />
                  <span className="absolute top-2 right-2 w-5 h-5 border-r-2 border-t-2 border-flame" />
                  <span className="absolute bottom-2 left-2 w-5 h-5 border-l-2 border-b-2 border-flame" />
                  <span className="absolute bottom-2 right-2 w-5 h-5 border-r-2 border-b-2 border-flame" />
                </div>

                {/* Info panel */}
                <div className="md:col-span-3 p-5 sm:p-7 flex flex-col gap-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground">Wave · 0{(openIdx ?? 0) + 1}</div>
                    <h3 className="mt-1 font-display font-bold text-3xl sm:text-4xl text-flame leading-none flex items-center gap-2 flex-wrap">
                      {active.name}
                      {active.name === "SOUL MAVERICK Z" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-[0.3em] text-background bg-flame px-2 py-1 rounded shadow-[0_0_16px_var(--flame-glow)]">
                          <Crown className="w-3 h-3" /> LEADER · FOUNDER
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-2 font-mono text-[10px] uppercase">
                    <div className="border border-flame/30 bg-background/40 px-2 py-2 rounded">
                      <div className="flex items-center gap-1 text-flame"><Zap className="w-3 h-3" /> Status</div>
                      <div className="mt-1 text-emerald-400">ACTIVE</div>
                    </div>
                    <div className="border border-flame/30 bg-background/40 px-2 py-2 rounded">
                      <div className="flex items-center gap-1 text-flame"><Trophy className="w-3 h-3" /> Role</div>
                      <div className="mt-1 text-foreground">{active.name === "SOUL MAVERICK Z" ? "Leader / Content Creator" : "Streamer"}</div>
                    </div>
                    <div className="border border-flame/30 bg-background/40 px-2 py-2 rounded">
                      <div className="flex items-center gap-1 text-flame"><Radio className="w-3 h-3" /> Squad</div>
                      <div className="mt-1 text-foreground">WAVES</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-flame mb-1">Networks</div>
                    {active.socials && active.socials.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {active.socials.map((s) => (
                          <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] border border-flame/40 hover:border-flame hover:bg-flame hover:text-background text-flame px-2 py-1 rounded transition"
                          >
                            ► {s.label}
                          </a>
                        ))}
                        {active.redes
                          .split("·")
                          .map((r) => r.trim())
                          .filter((r) => r && !active.socials!.some((s) => s.label.toLowerCase() === r.toLowerCase()))
                          .map((r) => (
                            <span key={r} className="inline-flex items-center text-[10px] uppercase tracking-[0.25em] border border-flame/20 text-muted-foreground px-2 py-1 rounded">
                              {r}
                            </span>
                          ))}
                      </div>
                    ) : (
                      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{active.redes}</div>
                    )}
                  </div>

                  <div className="relative">
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-flame mb-1">Bio · Intel</div>
                    <div className="max-h-56 overflow-y-auto pr-2 text-sm text-foreground/90 leading-relaxed whitespace-pre-line border-l-2 border-flame/40 pl-3">
                      {active.bio}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-flame/20 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenIdx((openIdx! - 1 + WAVES.length) % WAVES.length); }}
                      className="hover:text-flame transition"
                    >
                      ◄ prev
                    </button>
                    <span>Toca afuera para cerrar</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenIdx((openIdx! + 1) % WAVES.length); }}
                      className="hover:text-flame transition"
                    >
                      next ►
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Index() {
  return <IndexContent />;
}

function IndexContent() {
  const { playing, toggle: toggleAudio, stop: stopAudio, skip: skipAudio, currentTime, duration, seek } = useAudio();
  const [socialsOpen, setSocialsOpen] = useState(false);
  const [aboutTab, setAboutTab] = useState<"vision" | "objetivo">("vision");
  const [jerseySpecsOpen, setJerseySpecsOpen] = useState(false);
  const roster = useRoster();
  const killersList = roster.killers.length ? roster.killers : KILLERS;
  const legendsList = roster.legends.length ? roster.legends : LEGENDS;
  const crewList = roster.crew.length ? roster.crew : CREW;



  return (
    <div className="min-h-screen text-foreground relative">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/40 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-2 font-display font-bold tracking-tight shrink-0">
            <img src={soulLogo} alt="The Soul Nation" width={28} height={28} className="drop-shadow-[0_0_12px_var(--flame-glow)]" />
            <span className="hidden sm:inline">THE SOUL <span className="text-flame">NATION</span></span>
          </a>
          <nav className="hidden md:flex gap-3 lg:gap-6 text-[11px] lg:text-sm uppercase tracking-widest text-muted-foreground whitespace-nowrap">
            <a href="#about" className="hover:text-foreground transition whitespace-nowrap">¿Quiénes Somos?</a>
            <a href="#roster" className="hover:text-foreground transition whitespace-nowrap">Roster</a>
            <a href="#videos" className="hover:text-foreground transition whitespace-nowrap">Videos</a>
            <a href="#wallpapers" className="hover:text-foreground transition whitespace-nowrap">Wallpapers</a>
            <a href="#jersey" className="hover:text-foreground transition whitespace-nowrap">Jersey</a>
            <Link to="/xplicit-cup" data-explore="nav:xplicit-cup" className="hover:text-foreground transition whitespace-nowrap">Xplicit Cup</Link>
            <a href="#music" className="hover:text-foreground transition whitespace-nowrap">Music</a>
            <a href="#reclutamiento" className="hover:text-foreground transition whitespace-nowrap">Reclutamiento</a>
            <a href="#redes" className="hover:text-foreground transition whitespace-nowrap">Redes</a>
          </nav>

        </div>
      </header>

      {/* Floating controls moved into the unified BottomBar */}

      {/* HERO */}
      <section id="top" className="relative overflow-hidden grain">
        <Hero3D />
        <div className="pointer-events-none absolute bottom-4 right-4 z-20">
          <div className="pointer-events-auto">
            <EasterEgg id="soul-flame" label="Llama Soul oculta" size="sm" />
          </div>
        </div>
      </section>

      {/* ABOUT — integrado: foto + texto + tab animado (Visión / Objetivo) */}
      <section id="about" className="relative py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid sm:grid-cols-12 gap-5 md:gap-6 lg:gap-8 items-start">
            {/* Imagen del equipo */}
            <div className="mx-auto w-full max-w-[320px] sm:max-w-none sm:mx-0 sm:col-span-5 md:col-span-4 lg:col-span-5 group relative rounded-2xl overflow-hidden border border-flame/30 shadow-[0_20px_60px_-20px_var(--flame-glow)] aspect-[9/16] bg-background">
              <img
                src={soulNationTeam}
                alt="The Soul Nation — equipo oficial con chamarras azul y naranja"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute left-4 top-4 px-3 py-1 rounded-full border border-flame/50 bg-background/60 backdrop-blur text-[10px] font-mono uppercase tracking-[0.3em] text-flame">
                ★ Roster Oficial
              </div>
              <div className="absolute left-4 bottom-4 right-4 grid grid-cols-3 gap-2">
                {[
                  { v: "12+", k: "Años" },
                  { v: "35", k: "Miembros" },
                  { v: "4", k: "Divisiones" },
                ].map((s) => (
                  <div key={s.k} className="rounded-lg bg-background/70 backdrop-blur border border-flame/20 px-2 py-2 text-center">
                    <div className="font-display font-black text-lg sm:text-xl text-flame leading-none">{s.v}</div>
                    <div className="mt-0.5 text-[9px] font-mono uppercase tracking-[0.2em] text-foreground/70">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna derecha: título + texto + tab animado */}
            <div className="sm:col-span-7 md:col-span-8 lg:col-span-7 flex flex-col gap-5">
              <div>
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-flame">01</div>
                <h2 className="mt-2 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9]">
                  ¿Quiénes <span className="italic text-flame">Somos?</span>
                </h2>
              </div>
              <p className="text-sm sm:text-base text-foreground/85 font-light leading-relaxed">
                The Soul Nation es una comunidad de gaming que nació el <span className="text-flame font-semibold">10 de Noviembre del 2012</span>, inicialmente enfocada en clips de Gears of War. Con el tiempo nos convertimos en un equipo multifacético dedicado a crear contenido de exhibición de la más alta calidad, impulsando la escena de los esports en Latinoamérica como una familia unida.
              </p>


          {/* Tab animado Visión / Objetivo — full width */}
          <div id="vision" className="roster-card rounded-2xl p-5 sm:p-6 md:p-7 mt-6 md:mt-8 flex flex-col">
            <div className="flex items-center gap-2 border-b border-flame/20 pb-3">
              {([
                { id: "vision", n: "02", label: "Visión" },
                { id: "objetivo", n: "03", label: "Objetivo" },
              ] as const).map((tab) => {
                const active = aboutTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAboutTab(tab.id)}
                    className={`relative px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.25em] transition ${
                      active ? "text-background" : "text-foreground/60 hover:text-flame"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="aboutTabPill"
                        className="absolute inset-0 rounded-full bg-flame shadow-[0_0_20px_var(--flame-glow)]"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <span className="opacity-70">{tab.n}</span>
                      <span>{tab.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="relative mt-4 grid md:grid-cols-[auto,1fr] gap-3 md:gap-6 items-start">
              <AnimatePresence mode="wait">
                {aboutTab === "vision" ? (
                  <motion.div
                    key="vision"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="contents"
                  >
                    <h3 className="font-display text-2xl sm:text-3xl font-bold italic text-flame leading-tight md:min-w-[140px]">Visión</h3>
                    <p className="text-sm sm:text-[15px] text-foreground/85 leading-relaxed">
                      Ser el equipo Mexicano líder en la creación de contenido de exhibición y una referencia de calidad en la comunidad hispana por nuestra capacidad para generar contenido original, innovador y de calidad, que inspire y conecte con los gamers de la región.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="objetivo"
                    id="objetivo"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="contents"
                  >
                    <h3 className="font-display text-2xl sm:text-3xl font-bold italic text-flame leading-tight md:min-w-[140px]">Objetivo</h3>
                    <p className="text-sm sm:text-[15px] text-foreground/85 leading-relaxed">
                      Impulsar el potencial de cada miembro de The Soul Nation —jugador, creador o parte de nuestras divisiones Legends, Media, Waves y Crew—. Queremos expandir nuestra organización, fortalecer la comunidad gamer y colaborar con otras organizaciones de Latinoamérica para construir juntos el futuro de los esports en la región.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Botones a divisiones */}
            <div className="mt-5 pt-4 border-t border-flame/15 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: "Waves", href: "#waves" },
                { label: "Killers", href: "#killers" },
                { label: "Legends", href: "#legends" },
                { label: "Crew", href: "#crew" },
              ].map((d) => (
                <a
                  key={d.label}
                  href={d.href}
                  className="group/btn relative overflow-hidden rounded-xl bg-flame text-background px-3 py-3 text-center font-display font-bold uppercase tracking-[0.2em] text-xs sm:text-sm shadow-[0_8px_24px_-8px_var(--flame-glow)] hover:scale-[1.04] hover:shadow-[0_12px_36px_-6px_var(--flame-glow)] active:scale-95 transition"
                >
                  <span className="relative z-10">{d.label}</span>
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover/btn:translate-x-full transition-transform duration-700" />
                </a>
              ))}
            </div>
          </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-5 sm:px-6 mt-6 flex justify-end">
          <EasterEgg id="og-member" label="Marca OG oculta" size="sm" />
        </div>
      </section>



      {/* ROSTER */}
      <section id="roster" className="relative py-16 md:py-24 border-t border-border overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-flame opacity-10 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">04</div>
            <h2 className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.95]">
              Nuestro <span className="italic text-flame">Roster</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
              Cuatro divisiones, una sola familia. Conoce a quienes representan a Soul dentro y fuera del juego.
            </p>
          </div>

          {/* WAVES — creators */}
          <div id="waves" className="text-center mb-12 flex flex-col items-center scroll-mt-24">
            <img
              src={soulWavesLogo}
              alt="The Soul Waves"
              className="h-20 md:h-32 lg:h-40 w-auto object-contain drop-shadow-[0_10px_40px_var(--flame-glow)] animate-float"
            />
            <div className="mt-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">creadores de contenido</div>
            <p className="mt-6 text-muted-foreground max-w-3xl mx-auto">
              Cada uno aporta su estilo, personalidad y forma de vivir el gaming. No se trata solo de clips o transmisiones: es constancia, identidad y conexión real con la comunidad.
            </p>
          </div>

          <WavesHUD />


          {/* KILLERS + LEGENDS — holographic 3D squad cards */}
          <div className="mb-12 space-y-8">
            <HoloSquadCard
              id="killers"
              logo={soulKillersLogo}
              title="THE SOUL KILLERS"
              subtitle="Modo Guardian · Gears 5"
              desc="Equipo enfocado en grindear el modo Guardian de Gears 5."
              members={killersList}
              accentSeed={0}
            />
            <HoloSquadCard
              id="legends"
              logo={soulLegendsLogo}
              title="THE SOUL LEGENDS"
              subtitle="Montagers · Clips & Highlights"
              desc="Jugadores habilidosos y creadores de clips para montajes editados."
              members={legendsList}
              accentSeed={1.7}
            />
          </div>

          {/* CREW — holographic 3D card */}
          <HoloSquadCard
            id="crew"
            logo={soulCrewLogo}
            title="THE SOUL CREW"
            subtitle="Apoyo y familia oficial"
            desc="Grupo de apoyo y seguidores fieles que forman parte oficial de la familia The Soul Nation."
            members={crewList}
            accentSeed={3.4}
          />

          <div className="mt-8 flex justify-center">
            <EasterEgg id="maverick-signal" label="Señal Maverick oculta" size="sm" />
          </div>
        </div>
      </section>









      {/* VIDEOS */}
      <section id="videos" className="relative py-16 md:py-24 border-t border-border overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-flame opacity-[0.08] blur-[160px]" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-flame opacity-[0.06] blur-[140px]" />
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{backgroundImage:"radial-gradient(circle at 20% 30%, color-mix(in oklab, var(--flame) 8%, transparent), transparent 40%), radial-gradient(circle at 80% 70%, color-mix(in oklab, var(--flame) 6%, transparent), transparent 45%)"}} />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-flame">05 · Reel</div>
              <h2 className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.95]">
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
          <div className="md:hidden">
            <MobileCarousel>
              {VIDEOS.map((v, i) => (
                <div key={v.id} className="snap-center shrink-0 w-[85%]">
                  <VideoCard video={v} index={i} />
                </div>
              ))}
            </MobileCarousel>
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid lg:grid-cols-3 gap-6 perspective">
            {VIDEOS.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} featured={i === 0} />
            ))}
          </div>
          <div className="mt-10 flex justify-end">
            <EasterEgg id="hall-of-champions" label="Salón de Campeones oculto" size="sm" />
          </div>
        </div>
      </section>

      {/* WALLPAPERS */}
      <WallpapersSection />


      {/* JERSEY */}
      <section id="jersey" className="relative py-10 md:py-16 border-t border-border overflow-hidden">
        <div className="absolute top-3 right-3 z-30"><EasterEgg id="jersey-code" label="Código del jersey oculto" size="xs" /></div>

        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-flame opacity-10 blur-[160px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-flame" />

        {/* Marquee superior con specs */}
        <div className="relative overflow-hidden border-y border-border bg-background/40 backdrop-blur py-2 mb-8">
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

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 grid md:grid-cols-12 gap-6 md:gap-10 items-start">
          {/* Texto */}
          <div className="md:col-span-5 md:order-1 order-2">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">06</div>
            <h2 className="mt-3 font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95]">
              Jersey <span className="italic text-flame">Oficial</span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-foreground/85 leading-relaxed">
              Los colores de la nación. Diseño oficial de The Soul Nation, hecho para representar dentro y fuera del juego.
            </p>

            {/* Hint: toca la imagen */}
            <button
              type="button"
              onClick={() => setJerseySpecsOpen((v) => !v)}
              aria-expanded={jerseySpecsOpen}
              
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-flame/50 bg-flame/10 text-flame text-[10px] font-mono uppercase tracking-[0.25em] hover:bg-flame hover:text-background transition active:scale-95"
            >
              <span className={`transition-transform ${jerseySpecsOpen ? "rotate-180" : ""}`}>▾</span>
              {jerseySpecsOpen ? "Ocultar specs" : "Ver specs · toca la jersey"}
            </button>

            {/* Specs colapsables */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                jerseySpecsOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
              }`}
            >
              <div className="overflow-hidden">
                <ul className="space-y-2">
                  {[
                    { k: "Material", v: "Poliéster premium dry-fit" },
                    { k: "Diseño", v: "The Soul Nation Blue/Orange" },
                    { k: "Edición", v: "Drop oficial · cantidades limitadas" },
                    { k: "Para", v: "Player · Streamer · Soul Family" },
                  ].map((s) => (
                    <li key={s.k} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-border bg-card/40 backdrop-blur hover:border-flame hover:bg-card/60 transition group">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground group-hover:text-flame transition">{s.k}</span>
                      <span className="text-xs md:text-sm font-bold text-right">{s.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-card/40 backdrop-blur p-4">
              <p className="text-sm text-foreground/85 leading-relaxed">
                Puedes pedir tu Jersey enviando un <span className="font-bold text-flame">mensaje privado por TikTok</span>.
              </p>
              <a
                href="https://www.tiktok.com/@thesoulnation"
                target="_blank"
                rel="noopener noreferrer"
                
                className="mt-3 inline-flex items-center gap-2 bg-flame text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_0_60px_-10px_var(--flame-glow)] hover:scale-105 transition"
              >
                @thesoulnation en TikTok
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-flame animate-pulse" />
                  Stock limitado
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-flame/40 text-[9px] uppercase tracking-[0.25em] text-flame font-bold">
                  Drop 2026
                </span>
              </div>
            </div>
          </div>

          {/* Showcase interactivo */}
          <div className="md:col-span-7 md:order-2 order-1">
            <button
              type="button"
              onClick={() => setJerseySpecsOpen((v) => !v)}
              aria-label={jerseySpecsOpen ? "Ocultar specs de la jersey" : "Mostrar specs de la jersey"}
              
              className="block w-full text-left cursor-pointer group"
            >
              <JerseyShowcase front={jerseyFront} back={jerseyBack} />
            </button>
          </div>
        </div>
      </section>

      {/* XPLICIT CUP — CTA a página dedicada */}
      <section id="xplicit-cup" className="relative py-16 md:py-24 border-t border-border overflow-hidden scroll-mt-24">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] opacity-25" style={{ background: "oklch(0.55 0.24 255)" }} />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-[140px] opacity-25" style={{ background: "oklch(0.70 0.24 45)" }} />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-6">
          <Link
            to="/xplicit-cup"
            data-explore="nav:xplicit-cup"
            className="group relative block rounded-3xl border border-flame/40 bg-gradient-to-br from-background/90 via-background/70 to-background/40 backdrop-blur p-8 md:p-12 overflow-hidden shadow-[0_30px_80px_-30px_var(--flame-glow)] hover:border-flame transition"
          >
            <span className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-flame" />
            <span className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-flame" />
            <span className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-flame" />
            <span className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-flame" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[80px] opacity-30 pointer-events-none" style={{ background: "var(--flame-glow)" }} />
            <div className="relative flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-flame font-mono mb-4">
                  <span className="w-2 h-2 rounded-full bg-flame animate-pulse" />
                  Archivo histórico · 2013
                </div>
                <h2 className="font-display text-4xl md:text-6xl font-black leading-[0.95]">
                  Xplicit <span className="italic text-flame">Cup</span>
                </h2>
                <p className="mt-4 text-foreground/80 leading-relaxed max-w-xl">
                  El torneo que marcó historia en la escena competitiva latina de <span className="font-bold text-foreground">Gears of War</span>. Entra al archivo interactivo: historia, broadcast, leyendas y campeones.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 bg-flame text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_0_60px_-10px_var(--flame-glow)] group-hover:scale-105 transition">
                  Explorar Xplicit Cup
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 md:w-72 shrink-0">
                {[
                  { k: "2013", v: "Debut" },
                  { k: "LIVE", v: "YouTube" },
                  { k: "01", v: "Soul Nation" },
                  { k: "∞", v: "Legado" },
                ].map((s) => (
                  <div key={s.k} className="rounded-xl border border-flame/20 bg-background/60 p-3">
                    <div className="font-display text-2xl font-black text-flame" style={{ textShadow: "0 0 20px var(--flame-glow)" }}>{s.k}</div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-foreground/60 font-mono">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </section>



      {/* MUSIC — SPOTIFY */}
      <section id="music" className="relative py-16 md:py-24 border-t border-border overflow-hidden">
        <div className="absolute bottom-3 left-3 z-30"><EasterEgg id="soul-anthem" label="Himno Soul oculto" size="xs" /></div>
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-emerald-500 opacity-10 blur-[160px]" />
        <div className="absolute -bottom-40 left-0 w-[500px] h-[500px] rounded-full bg-flame opacity-10 blur-[160px]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">07</div>
            <h2 className="mt-6 font-display font-bold leading-[0.95]">
              <span className="block whitespace-nowrap text-[clamp(2rem,8vw,7rem)]">The Soul Nation</span>
              <span
                className="block mt-2 text-flame text-[clamp(3.5rem,14vw,11rem)] leading-none"
                style={{
                  fontFamily: "'Bungee Shade', 'Monoton', cursive",
                  textShadow:
                    "0 0 18px var(--flame-glow), 0 0 40px oklch(0.70 0.24 45 / 0.55), 4px 6px 0 oklch(0 0 0 / 0.45)",
                  transform: "rotate(-3deg)",
                  letterSpacing: "0.02em",
                }}
              >
                Music
              </span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
              El sonido oficial de The Soul Nation. Dale play y siente la nación.
            </p>
          </div>

          {/* MUSIC APP CHROME */}
          <div className="relative rounded-[28px] border border-[#2a5cff]/40 bg-gradient-to-br from-[#0a1a4a]/80 via-background/60 to-[#0a1a4a]/40 backdrop-blur-xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-white/10 bg-[#081245]/60">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-flame shadow-[0_0_12px_var(--flame-glow)]" />
                <span className="w-3 h-3 rounded-full bg-white/70" />
                <span className="w-3 h-3 rounded-full bg-[#2a5cff]" />
                <span className="ml-4 text-[11px] uppercase tracking-[0.3em] text-white/60 hidden sm:inline">soul.player · v2025</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-white/70">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-flame opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-flame"></span></span>
                streaming live
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-0">
              {/* LEFT: Album art + meta */}
              <div className="lg:col-span-4 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-b from-[#081245]/40 to-[#0a1a4a]/20">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(255,107,53,0.5)]">
                  <img
                    src={somosCover}
                    alt="Somos The Soul Nation - cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                  <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[#081245]/80 to-transparent" />
                </div>

                <div className="mt-6">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-flame">Now Playing</div>
                  <h3 className="mt-2 font-display text-2xl md:text-3xl font-bold leading-tight text-white">
                    Somos <span className="italic text-flame">The Soul Nation</span>
                  </h3>
                  <p className="text-sm text-white/60 mt-1">The Soul Nation · Official Artist</p>
                </div>

                {/* Equalizer visualizer */}
                <div className="mt-5 flex items-end gap-1 h-10">
                  {[0.4, 0.7, 0.5, 0.9, 0.6, 1, 0.55, 0.8, 0.45, 0.7, 0.5, 0.85, 0.6, 0.4, 0.75, 0.5, 0.9, 0.6, 0.7, 0.4].map((h, i) => (
                    <span
                      key={i}
                      className={`flex-1 rounded-sm origin-bottom ${playing ? "animate-pulse" : ""}`}
                      style={{
                        height: `${h * 100}%`,
                        background: i % 3 === 0 ? "linear-gradient(to top, var(--flame), rgba(255,107,53,0.3))" : "linear-gradient(to top, #2a5cff, rgba(42,92,255,0.3))",
                        animationDelay: `${i * 80}ms`,
                        animationDuration: `${800 + (i % 5) * 200}ms`,
                      }}
                    />
                  ))}
                </div>

                {/* TRANSPORT CONTROLS */}
                <div className="mt-5 rounded-2xl border border-white/10 bg-[#040a2a]/70 p-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => skipAudio(-10)}
                      aria-label="Retroceder 10s"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition active:scale-95"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11 6V2L5 8l6 6V10c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H3c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
                    </button>
                    <button
                      type="button"
                      onClick={toggleAudio}
                      aria-label={playing ? "Pausar" : "Reproducir"}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-flame text-primary-foreground shadow-[0_0_30px_-5px_var(--flame-glow)] hover:scale-105 transition active:scale-95"
                    >
                      {playing ? <Pause className="h-6 w-6" fill="currentColor" /> : <Play className="h-6 w-6 ml-0.5" fill="currentColor" />}
                    </button>
                    <button
                      type="button"
                      onClick={stopAudio}
                      aria-label="Detener"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition active:scale-95"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="1.5"/></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => skipAudio(10)}
                      aria-label="Adelantar 10s"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition active:scale-95"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 6V2l6 6-6 6v-4c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/></svg>
                    </button>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={Math.min(currentTime, duration || 0)}
                      onChange={(e) => seek(parseFloat(e.target.value))}
                      className="w-full h-1 accent-flame cursor-pointer"
                      aria-label="Progreso"
                    />
                    <div className="mt-1.5 flex justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border border-white/10 bg-[#081245]/60 p-3">
                    <div className="font-display text-xl font-bold text-flame">12</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-0.5">Tracks</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#081245]/60 p-3">
                    <div className="font-display text-xl font-bold text-white">HD</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-0.5">Quality</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#081245]/60 p-3">
                    <div className="font-display text-xl font-bold text-[#5a8aff]">∞</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-0.5">Vibes</div>
                  </div>
                </div>

                <a
                  href="https://open.spotify.com/intl-es/artist/56ieAbEEuRbD3pg8xtIRt7?si=1IirEmBPSKKvZSjk2_Q4JA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center gap-3 bg-flame text-primary-foreground px-6 py-3.5 rounded-full font-bold shadow-[0_0_60px_-10px_var(--flame-glow)] hover:scale-[1.02] transition"
                >
                  Abrir en Spotify
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M9 7h8v8"/>
                  </svg>
                </a>
              </div>

              {/* RIGHT: Spotify embed */}
              <div className="lg:col-span-8 p-4 md:p-6 bg-gradient-to-br from-[#081245]/30 to-[#0a1a4a]/40">
                <div className="flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-flame animate-pulse" />
                    Playlist · The Soul Nation Music
                  </div>
                  <div className="flex items-center gap-3 text-white/50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13M9 9l12-2"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:row-span-2 rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
                    <iframe
                      title="The Soul Nation · Álbum"
                      src="https://open.spotify.com/embed/album/0BA5VLFK2p44KzjuRqmlyF?utm_source=generator&theme=0"
                      width="100%"
                      height="560"
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      className="border-0 block"
                    />
                  </div>
                  {["1wmiGzheoOkSnVqeZ6TZ5f", "14RYTx4G2qVYMz56Og4pKC"].map((id, i) => (
                    <div key={id} className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
                      <iframe
                        title={`The Soul Nation · Single ${i + 1}`}
                        src={`https://open.spotify.com/embed/album/${id}?utm_source=generator&theme=0`}
                        width="100%"
                        height="152"
                        loading="lazy"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        className="border-0 block w-full h-[152px] md:h-[274px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom player bar */}
            <div className="flex items-center justify-between gap-4 px-5 md:px-7 py-4 border-t border-white/10 bg-[#081245]/80 backdrop-blur">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-flame to-[#2a5cff] flex items-center justify-center shrink-0">
                  <img src={soulLogo} alt="" className="w-6 h-6 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate text-white">The Soul Nation Music</div>
                  <div className="text-[11px] text-white/50 truncate">Somos The Soul Nation · 2025</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/60">
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="w-12 h-12 rounded-full bg-flame text-primary-foreground flex items-center justify-center shadow-[0_0_30px_-5px_var(--flame-glow)] hover:scale-110 transition active:scale-95"
                  aria-label={playing ? "Detener" : "Reproducir"}
                >
                  {playing ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
              </div>
              <div className="hidden md:flex items-center gap-2 text-white/50 min-w-[160px] justify-end">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/></svg>
                <div className="w-24 h-1 rounded-full bg-white/10 overflow-hidden"><div className={`h-full bg-gradient-to-r from-flame to-[#2a5cff] ${playing ? "w-3/4" : "w-0"} transition-all`} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECLUTAMIENTO */}
      <section id="reclutamiento" className="relative py-16 md:py-24 border-t border-border overflow-hidden">
        <div className="absolute top-3 left-3 z-30"><EasterEgg id="recruitment-key" label="Llave de reclutamiento oculta" size="xs" /></div>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-flame opacity-10 blur-[160px]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">08</div>
            <h2 className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.95]">
              Únete al <span className="italic text-flame">Equipo</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
              Aplica al área en la que destaques. Revisamos cada postulación y respondemos por las redes oficiales.
            </p>
          </div>

          {/* Áreas info */}
          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {[
              { t: "The Soul Legends (Montagers)", d: "Buscamos a los mejores jugadores de exhibición (no competitivos). Envía un video con 10 de tus mejores clips de Gears of War — partida normal (no OSOK, no evento), preferentemente DPE." },
              { t: "The Soul Waves (Streamers y CC)", d: "La calidad de tu contenido y la conexión con tu comunidad es lo que importa. Comparte tus redes y plataformas y cuéntanos tu estilo y enfoque como creador." },
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
          <RecruitmentForm />
        </div>
      </section>

      {/* REDES */}
      <section id="redes" className="relative py-16 md:py-24 overflow-hidden border-t border-border">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[720px] aspect-square">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--flame-glow)_0%,transparent_60%)] opacity-60 animate-pulse" />
          <div className="absolute inset-[15%] rounded-full bg-[radial-gradient(circle,var(--flame-glow)_0%,transparent_70%)] opacity-50 blur-2xl" />
          <img src={soulLogo} alt="" width={720} height={720} loading="lazy" className="relative w-full h-full opacity-40 drop-shadow-[0_0_60px_var(--flame-glow)] animate-[pulse_4s_ease-in-out_infinite]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-flame">07</div>
          <h2 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[0.95]">
            síguenos en nuestras <br /><span className="text-flame italic">redes sociales</span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-foreground/70 max-w-2xl mx-auto">
            Únete a la comunidad y vive el día a día de <span className="text-flame font-bold">The Soul Nation</span>.
          </p>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Social3DCard href={SOCIALS.discord} name="Discord" handle="ADPyNMFggc" icon="discord" />
            <Social3DCard href={SOCIALS.youtube} name="YouTube" handle="@TheSoulNationHD" icon="youtube" />
            <Social3DCard href={SOCIALS.tiktok} name="TikTok" handle="@thesoulnation" icon="tiktok" />
            <Social3DCard href={SOCIALS.facebook} name="Facebook" handle="TheSoulNationHD" icon="facebook" />
            <Social3DCard href={SOCIALS.x} name="X / Twitter" handle="@TheSoulNation" icon="x" />
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

function RosterName({ name }: { name: string }) {
  if (name.toUpperCase().startsWith("SOUL ")) {
    const rest = name.slice(5);
    return (
      <span className="inline-flex items-baseline gap-1 min-w-0">
        <span className="text-flame text-[0.7em] font-semibold tracking-wider">SOUL</span>
        <span className="truncate">{rest}</span>
      </span>
    );
  }
  return <span className="truncate">{name}</span>;
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
          className="relative w-full h-full rounded-[2rem] border-2 border-flame bg-blue-deep overflow-hidden"
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
              transform: `translateZ(80px) scale(${t.active ? 1.36 : 1.3}) rotateY(${side === "front" ? 0 : 180}deg)`,
            }}
          >
            <img
              src={front}
              alt="Jersey oficial The Soul Nation - frente"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain p-1"
              style={{ backfaceVisibility: "hidden", filter: "drop-shadow(0 25px 60px var(--flame-glow))" }}
            />
            <img
              src={back}
              alt="Jersey oficial The Soul Nation - espalda"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain p-1"
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
              data-explore={s === "front" ? "jersey:front" : "jersey:back"}
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
  return (
    <article
      className={`group relative tilt-card roster-card rounded-2xl overflow-hidden ${featured ? "lg:col-span-2 lg:row-span-2" : ""}`}
    >
      <div className={`relative ${featured ? "aspect-video lg:aspect-[16/10]" : "aspect-video"} bg-black overflow-hidden`}>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 w-full h-full group/play"
          aria-label={`Ver ${video.title} en YouTube`}
        >
          <img
            src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
            alt={video.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/play:scale-110"
          />
          <div className="absolute inset-0 bg-[color:var(--background)]/40" />
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
              <span className="w-1.5 h-1.5 rounded-full bg-flame" /> Ver en YouTube ↗
            </div>
          </div>
        </a>
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

function SocialIcon({ name }: { name: string }) {
  const cls = "w-6 h-6 fill-current";
  switch (name) {
    case "youtube":
      return <svg viewBox="0 0 24 24" className={cls}><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z"/></svg>;
    case "tiktok":
      return <svg viewBox="0 0 24 24" className={cls}><path d="M19.6 6.3a5.6 5.6 0 0 1-3.4-1.2 5.6 5.6 0 0 1-2.1-3.5h-3.5v13.2a3.1 3.1 0 1 1-2.2-3 3.1 3.1 0 0 1 .9.1V8.3a6.6 6.6 0 0 0-1-.1A6.6 6.6 0 1 0 14.1 15V8.7a9 9 0 0 0 5.5 1.9V7.1a5.6 5.6 0 0 1 0-.8z"/></svg>;
    case "facebook":
      return <svg viewBox="0 0 24 24" className={cls}><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>;
    case "x":
      return <svg viewBox="0 0 24 24" className={cls}><path d="M18.2 2H21l-6.5 7.4L22.5 22h-6.4l-5-6.6L5.3 22H2.5l7-8L1.5 2h6.6l4.5 6 5.6-6zm-1.1 18.2h1.6L7 3.7H5.3z"/></svg>;
    case "discord":
    default:
      return <svg viewBox="0 0 24 24" className={cls}><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.3.5a18.3 18.3 0 0 1 4.4 1.4 16 16 0 0 0-13 0A18.3 18.3 0 0 1 11 3.5L10.7 3a19.8 19.8 0 0 0-4.9 1.4A20.7 20.7 0 0 0 2.3 18a20 20 0 0 0 6 3l1.3-1.9a13 13 0 0 1-2-1l.5-.4a14.3 14.3 0 0 0 12 0l.5.4a13 13 0 0 1-2 1L19.7 21a20 20 0 0 0 6-3 20.7 20.7 0 0 0-5.4-13.6zM9 15.3a2.4 2.4 0 0 1-2.2-2.5A2.4 2.4 0 0 1 9 10.3a2.4 2.4 0 0 1 2.2 2.5A2.4 2.4 0 0 1 9 15.3zm6 0a2.4 2.4 0 0 1-2.2-2.5 2.4 2.4 0 0 1 4.4 0 2.4 2.4 0 0 1-2.2 2.5z"/></svg>;
  }
}

function Social3DCard({ href, name, handle, icon }: { href: string; name: string; handle: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-20 items-center gap-3 rounded-2xl border border-border bg-card/60 p-3 text-left backdrop-blur transition hover:-translate-y-1 hover:border-flame hover:bg-flame hover:text-primary-foreground hover:shadow-[0_18px_50px_-28px_var(--flame-glow)] active:scale-95 lg:min-h-36 lg:flex-col lg:items-start lg:justify-between"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#0a1e8f] bg-[#0a1e8f] text-white transition">
        <SocialIcon name={icon} />
      </span>
      <span className="min-w-0 flex-1 lg:w-full">
        <span className="block font-display text-base font-bold text-foreground transition group-hover:text-primary-foreground lg:text-lg">{name}</span>
        <span className="mt-1 block truncate text-xs text-muted-foreground transition group-hover:text-primary-foreground/80 lg:text-[11px]">{handle}</span>
      </span>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#0a1e8f] bg-[#0a1e8f] text-white transition group-hover:translate-x-1 lg:self-end">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M5 12h12.2l-4.6-4.6L14 6l7 6-7 6-1.4-1.4 4.6-4.6H5z"/></svg>
      </span>
    </a>
  );
}

function WallpapersSection() {
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const wp = WALLPAPERS[active];

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <section id="wallpapers" className="relative py-20 md:py-28 border-t border-border overflow-hidden">
      <div
        className="absolute -top-32 right-1/4 w-[600px] h-[600px] rounded-full blur-[160px] opacity-30 transition-all duration-1000"
        style={{ background: `radial-gradient(circle, var(--flame), transparent 70%)` }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-flame">06 · Wallpapers</div>
            <h2 className="mt-4 font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95]">
              Wallpapers para tu <span className="italic text-flame">pantalla</span>
            </h2>
          </div>
          <div className="font-display text-foreground/60 text-sm md:text-base max-w-sm">
            Pasá el mouse sobre cada serie. Hacé clic para descargar en Drive.
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
          {/* PREVIEW */}
          <div className="lg:col-span-8 perspective">
            <a
              href={wp.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseMove={onMove}
              onMouseLeave={() => setPos({ x: 50, y: 50 })}
              className="group relative block aspect-[4/5] sm:aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-deep"
              style={{
                transform: `perspective(1200px) rotateX(${(50 - pos.y) / 18}deg) rotateY(${(pos.x - 50) / 14}deg)`,
                transition: "transform 0.2s ease-out",
              }}
            >
              {WALLPAPERS.map((w, i) => (
                <img
                  key={w.title}
                  src={w.img}
                  alt={w.title}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: i === active
                      ? `scale(1.06) translate(${(50 - pos.x) / 8}px, ${(50 - pos.y) / 8}px)`
                      : "scale(1.15)",
                    filter: i === active ? "saturate(1.15) contrast(1.05)" : "blur(8px)",
                  }}
                />
              ))}

              {/* spotlight */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(400px circle at ${pos.x}% ${pos.y}%, oklch(1 0 0 / 0.18), transparent 50%)`,
                  mixBlendMode: "overlay",
                }}
              />

              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className={`absolute inset-0 bg-gradient-to-br ${wp.accent} opacity-40 mix-blend-overlay transition-all duration-700`} />

              {/* corner ticks */}
              {[
                "top-3 left-3 border-t-2 border-l-2",
                "top-3 right-3 border-t-2 border-r-2",
                "bottom-3 left-3 border-b-2 border-l-2",
                "bottom-3 right-3 border-b-2 border-r-2",
              ].map((c) => (
                <span key={c} className={`absolute w-5 h-5 sm:w-6 sm:h-6 border-flame ${c} transition-opacity duration-500 opacity-60 group-hover:opacity-100`} />
              ))}

              {/* badge */}
              <span className="absolute top-3 left-3 sm:top-5 sm:left-5 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-flame bg-background/70 backdrop-blur px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-flame/40 font-mono">
                Serie · 0{active + 1} / 0{WALLPAPERS.length}
              </span>

              {/* live counter */}
              <span className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-foreground/80 bg-background/70 backdrop-blur px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-border font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-flame" />
                </span>
                LIVE
              </span>

              {/* info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10">
                <div key={wp.title} className="animate-fade-up">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl md:text-5xl leading-[1] text-foreground text-3d">
                    {wp.title}
                  </h3>
                  <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-foreground/85 max-w-lg line-clamp-2">{wp.tagline}</p>
                  <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 sm:gap-3 bg-flame text-primary-foreground font-display font-bold px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-xs sm:text-sm uppercase tracking-wider transition-transform group-hover:translate-x-1">
                    <span>Descargar</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* THUMBS — horizontal scroll on mobile, vertical stack on desktop */}
          <div className="lg:col-span-4 -mx-6 px-6 lg:mx-0 lg:px-0 overflow-x-auto lg:overflow-visible">
            <div className="flex lg:flex-col gap-3 lg:gap-4 snap-x snap-mandatory lg:snap-none pb-2 lg:pb-0">
              {WALLPAPERS.map((w, i) => (
                <button
                  key={w.title}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => {
                    if (i === active) {
                      window.open(w.href, "_blank", "noopener,noreferrer");
                    } else {
                      setActive(i);
                    }
                  }}
                  className={`group relative overflow-hidden rounded-xl border text-left transition-all duration-500 shrink-0 w-[260px] lg:w-auto snap-start ${
                    i === active
                      ? "border-flame lg:scale-[1.02] shadow-[0_20px_60px_-20px_var(--flame-glow)]"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="relative flex items-center gap-3 p-2.5 lg:p-3">
                    <div className="relative h-16 w-20 lg:h-20 lg:w-32 shrink-0 overflow-hidden rounded-lg">
                      <img src={w.img} alt={w.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className={`absolute inset-0 bg-gradient-to-br ${w.accent} opacity-40 mix-blend-overlay`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[10px] tracking-[0.25em] text-flame">0{i + 1}</div>
                      <div className="font-display font-bold text-sm md:text-base leading-tight truncate">{w.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{w.tagline}</div>
                    </div>
                    <svg
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      className={`shrink-0 transition-all ${i === active ? "text-flame translate-x-0" : "text-muted-foreground -translate-x-2"}`}
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {i === active && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-flame/30">
                      <span className="block h-full bg-flame animate-[marquee_3s_linear]" style={{ width: "100%" }} />
                    </span>
                  )}
                </button>
              ))}
            </div>



            {/* stats */}
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              {[
                { k: "03", l: "Series" },
                { k: "4K", l: "Calidad" },
                { k: "∞", l: "Gratis" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg border border-border bg-card/40 backdrop-blur p-3">
                  <div className="font-display font-bold text-2xl text-flame">{s.k}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
