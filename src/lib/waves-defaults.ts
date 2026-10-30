import soulBellatriix from "@/assets/soul-bellatriix.jpeg";
import waveMaverick from "@/assets/wave-maverick.png";
import waveAleman from "@/assets/wave-aleman.png";
import waveGizzmo from "@/assets/wave-gizzmo.png";
import waveTempla from "@/assets/wave-templa.png";
import waveSystem from "@/assets/wave-system.png";
import waveEmix from "@/assets/wave-emix.png";
import waveEnri from "@/assets/wave-enri.png";

type Social = { label: string; href: string };
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
  { name: "SOUL SYSTEEM", redes: "Twitch · TikTok · YouTube", photo: waveSystem, bio: "Ex pro player de Gears of War. Ganador de torneos en GOW 3 y jugador profesional en GOW 4. Veterano de la época dorada, sobreviviente de LANs, rankeds infinitos y noches injustas. Hoy juego por diversión, nostalgia y risas con la comunidad. No prometo tryhard, pero sí buenos momentos y uno que otro escopetazo legendario… o fallido." },
  { name: "SOUL TEMPLA", redes: "TikTok · YouTube · X", photo: waveTempla, bio: "No nació casualmente en Gears of War, se forjó en él. Desde los 12 años descubrió el campo de batalla que moldeó su carácter. Durante la época de Gears of War 3 se unió como combatiente competitivo, se forjó en equipos y entendió que en gears no gana el que dispara, sino quien juega bien con IQ. Ahora es creador de contenido, busca transmitir el juego por amor, orgullo, nostalgia y respeto." },
  { name: "SOUL ENRI", redes: "TikTok · YouTube · X", photo: waveEnri, bio: "Carismático streamer al que le gusta disfrutar de diversos juegos como Halo, Fortnite, Roblox, pero ama hacer múltiples kills, nemesis y remontar partidas en Gears of War. Soul Enri está presente en casi todos los títulos de la franquicia con su clásico alternativo y su arma favorita… ¡La Gnasher!" },
  { name: "SOUL EMI X", redes: "TikTok", photo: waveEmix, bio: "Creador de contenido y editor de video enfocado en montajes, gameplays y contenido para redes sociales. Disfruta todo el proceso: idea, ritmo, música y detalles que hacen que el video conecte. Le gusta experimentar con estilos y narrativas. Fan de Gears of War, lo toma como inspiración para crear montajes intensos, competitivos y con identidad propia." },
  { name: "SOUL BELLATRIIX", redes: "TikTok", photo: soulBellatriix, bio: "¿Combinar medicina y gaming? ¡Es posible! Soy Soul Bellatriix, médica de profesión y gamer de corazón. Mi objetivo principal al prender stream es distraerme, convivir con ustedes y pasar un buen rato. Me considero una persona sumamente social que valora cada interacción con su comunidad; estoy infinitamente agradecida con quienes me acompañan en este camino.\n\nSoy fan de Gears de toda la vida, y aunque la habilidad me falle a veces, el entusiasmo está al 100%. Me encanta recibir a gente nueva con los brazos abiertos y apoyarnos entre todos. Formar parte de Soul Nation es un honor y un gran paso para mi crecimiento como creadora de contenido. ¡Bienvenidos a mi lado del Xbox!" },
];
