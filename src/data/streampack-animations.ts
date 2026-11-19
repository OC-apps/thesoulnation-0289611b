type AnimationGroup = {
  category: string;
  folder: string;
  dimensions: string;
  items: readonly [id: string, title: string, file: string, duration: string, loop?: boolean][];
};

const groups: AnimationGroup[] = [
  {category:"Alertas",folder:"01_Alertas",dimensions:"1200×360",items:[
    ["bits","Bits","Alerta_Bits","6 s"],
    ["donacion","Donación","Alerta_Donacion","6 s"],
    ["suscripcion","Nueva suscripción","Alerta_Nueva_Suscripcion","6 s"],
    ["miembro","Nuevo miembro","Alerta_Nuevo_Miembro","6 s"],
    ["seguidor","Nuevo seguidor","Alerta_Nuevo_Seguidor","6 s"],
    ["raid","Raid","Alerta_Raid","6 s"],
    ["regalo","Regalo","Alerta_Regalo","6 s"],
  ]},
  {category:"Marcos de webcam",folder:"02_Marco_Webcam",dimensions:"1672×942",items:[
    ["webcam-entrada","Marco webcam · Entrada","Marco_Webcam_Entrada","2.6 s"],
    ["webcam-loop","Marco webcam · Loop","Marco_Webcam_Loop","8 s",true],
  ]},
  {category:"Redes sociales",folder:"03_Barra_Redes",dimensions:"1000×140",items:[
    ["barra-redes","Barra de redes animada","Barra_Redes_Loop","18.2 s",true],
  ]},
  {category:"Logo animado",folder:"04_Logo_Esquina",dimensions:"300×300",items:[
    ["logo-esquina","Logo Soul · Esquina","Logo_Esquina_Loop","12 s",true],
  ]},
  {category:"Reacciones",folder:"05_Reacciones",dimensions:"1080×1080",items:[
    ["buena-partida","Buena partida","01_Buena_Partida","3.4 s"],
    ["the-soul-nation","The Soul Nation","02_The_Soul_Nation","3.6 s"],
    ["ganamos","¡Ganamos!","03_Ganamos","3.4 s"],
    ["mmta","MMTA","04_MMTA","3.2 s"],
    ["increible","¡Increíble!","05_Increible","3.4 s"],
    ["gracias-mexico","Gracias, México","06_Gracias_Mexico","3.6 s"],
    ["gracias-apoyo","Gracias por su apoyo · Sarcástico","07_Gracias_Por_Su_Apoyo_Sarcastico","4 s"],
    ["excelente-equipo","Excelente equipo · Sarcástico","08_Excelente_Equipo_Sarcastico","4 s"],
    ["sean-serios","Sean serios","09_Sean_Serios","3.4 s"],
    ["no-juego","No juego con Soul, pa","10_No_Juego_Con_Soul_Pa","3.6 s"],
    ["busco-traba","Busco traba","11_Busco_Traba","3.6 s"],
    ["vieron-eso","¿Vieron eso?","12_Vieron_Eso","3.4 s"],
    ["por-poco","Uff, por poco","13_Uff_Por_Poco","3.4 s"],
    ["que-diga","Que diga","14_Que_Diga","3.6 s"],
    ["que-rico","Qué rico, ¿no?","15_Que_Rico_No","3.6 s"],
  ]},
  {category:"MVP",folder:"06_MVP",dimensions:"1080×1080",items:[
    ["mvp","Trofeo 3D · MVP","MVP_Trofeo_3D","5 s"],
  ]},
];

export const ANIMATED_MEDIA = groups.flatMap(({category,folder,dimensions,items}) =>
  items.map(([id,name,file,duration,loop])=>({
    id:`anim-${id}`,name,category,filename:`${file}.webm`,
    assetPath:`/streampack/media/animaciones/${folder}/${file}.webm`,
    zipFolder:`Recursos/Animaciones/${folder}`,orientation:dimensions,
    fileType:"WebM" as const,loop:Boolean(loop),
    description:`${duration} · transparente · ${loop?"En bucle":"Una reproducción"} · Sin audio`,
  }))
);

export type MediaAsset = { id:string; name:string; filename:string; assetPath:string; orientation:string; fileType:"MP4"|"WebM"; description:string; category?:string; zipFolder?:string; loop?:boolean };
export const MEDIA_ASSETS: MediaAsset[] = [
  {id:"intro-horizontal",name:"Intro oficial · Horizontal",filename:"TSN-Intro-Oficial-4K.mp4",assetPath:"/streampack/media/TSN-Intro-Oficial-4K.mp4",orientation:"Horizontal",fileType:"MP4",description:"Intro 16:9 para transmisiones y escenas principales."},
  {id:"intro-vertical",name:"Intro oficial · Vertical",filename:"TSN-Intro-Oficial-Vertical-4K.mp4",assetPath:"/streampack/media/TSN-Intro-Oficial-Vertical-4K.mp4",orientation:"Vertical",fileType:"MP4",description:"Intro 9:16 para Shorts, TikTok y transmisiones verticales."},
  {id:"obs-stinger",name:"Stinger de transición · OBS",filename:"TSN-Stinger-OBS.webm",assetPath:"/streampack/media/TSN-Stinger-OBS.webm",orientation:"Stinger",fileType:"WebM",description:"Transición para cambiar de escena en OBS."},
  ...ANIMATED_MEDIA
];
export const MEDIA_CATEGORIES = [...new Set(MEDIA_ASSETS.map(item=>item.category || "Intros y transiciones"))];
export type MediaStatus = "visible" | "hidden" | "deleted";
