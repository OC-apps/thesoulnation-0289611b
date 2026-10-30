import { useState } from "react";
import { Pause, Play, Menu, X, Share2 } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { SOCIALS } from "@/lib/socials";
const sections = [
  {id:"top",label:"Inicio"},{id:"about",label:"Nosotros"},{id:"roster",label:"Roster"},
  {id:"videos",label:"Videos"},{id:"wallpapers",label:"Wallpapers"},
  {id:"jersey",label:"Jersey"},{id:"music",label:"Música"},
  {id:"reclutamiento",label:"Únete"},{id:"redes",label:"Redes"}
];
export function BottomBar() {
  const {playing,toggle} = useAudio();
  const [open,setOpen] = useState(false);
  const [social,setSocial] = useState(false);
  const navigate = (id:string) => { if (window.location.pathname === "/") { window.location.hash = id; } else { window.location.href = `/#${id}`; } setOpen(false); };
  return <div className="fixed bottom-4 left-1/2 z-[90] w-[min(420px,calc(100vw-24px))] -translate-x-1/2">
    {(open || social) && <div className="mb-3 rounded-2xl border border-white/15 bg-[#080943]/95 p-4 shadow-xl backdrop-blur-xl">
      {open ? <nav className="grid grid-cols-3 gap-2">{sections.map(s=><button key={s.id} onClick={()=>navigate(s.id)} className="rounded-xl px-2 py-3 text-xs font-medium text-white hover:bg-white/10">{s.label}</button>)}</nav> :
      <div className="grid grid-cols-2 gap-2">{Object.entries(SOCIALS).map(([key,url])=><a key={key} href={url} target="_blank" rel="noopener noreferrer" className="rounded-xl px-3 py-3 text-sm capitalize text-white hover:bg-white/10">{key}</a>)}</div>}
    </div>}
    <div className="flex items-center justify-between gap-2 rounded-full border border-white/20 bg-[#080943]/95 p-2 shadow-xl backdrop-blur-xl">
      <button onClick={()=>{setOpen(!open);setSocial(false)}} aria-label="Menú de secciones" aria-expanded={open} className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white">{open?<X size={18}/>:<Menu size={18}/>} Menú</button>
      <button onClick={toggle} aria-label={playing?"Pausar música":"Reproducir música"} className="rounded-full bg-[#F05E07] p-3 text-white">{playing?<Pause size={18}/>:<Play size={18}/>}</button>
      <button onClick={()=>{setSocial(!social);setOpen(false)}} aria-label="Redes sociales" aria-expanded={social} className="rounded-full px-4 py-2.5 text-white"><Share2 size={18}/></button>
    </div>
  </div>;
}
