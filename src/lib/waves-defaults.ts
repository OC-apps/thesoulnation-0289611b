import waveMaverick from "@/assets/wave-maverick.png";
import waveAleman from "@/assets/wave-aleman.png";
import waveGizzmo from "@/assets/wave-gizzmo.png";
import waveSystem from "@/assets/wave-system.png";
import waveEmix from "@/assets/wave-emix.png";
import soulLogo from "@/assets/soul-logo-official.png";

export type Social = { label: string; href: string };
export const WAVES: { name: string; redes: string; bio: string; photo: string; socials?: Social[] }[] = [
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
  { name: "SOUL SYSTEEM", redes: "Twitch · TikTok · YouTube", photo: waveSystem, bio: "Ex pro player de Gears of War. Ganador de torneos en GOW 3 y jugador profesional en GOW 4. Veterano de la época dorada, sobreviviente de LANs, rankeds infinitos y noches injustas. Hoy juego por diversión, nostalgia y risas con la comunidad. No prometo tryhard, pero sí buenos momentos y uno que otro escopetazo legendario… o fallido." },  { name: "SOUL EMI", redes: "TikTok", photo: waveEmix, bio: "Creador de contenido y editor de video enfocado en montajes, gameplays y contenido para redes sociales. Disfruta todo el proceso: idea, ritmo, música y detalles que hacen que el video conecte. Le gusta experimentar con estilos y narrativas. Fan de Gears of War, lo toma como inspiración para crear montajes intensos, competitivos y con identidad propia." },];
