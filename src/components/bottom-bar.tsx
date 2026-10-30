import { useEffect, useState } from "react";
import { Pause, Play, Menu, X, Home, Users, LayoutGrid } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { useExploration } from "@/lib/exploration";
import { useEasterEggs } from "@/lib/easter-eggs";
import { SOCIALS } from "@/lib/socials";

export function BottomBar() {
  const { playing, toggle } = useAudio();
  const { setPanelOpen } = useExploration();
  const { togglePanel } = useEasterEggs();
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("top");
  useEffect(() => {
    const update = () => { setHash(window.location.hash.slice(1) || "top"); setOpen(false); };
    update(); window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const navigate = (id: string) => {
    if (window.location.pathname === "/") window.location.hash = id;
    else window.location.href = `/#${id}`;
    setOpen(false);
  };
  const active = ["waves", "legends", "crew", "roster"].includes(hash) ? "roster" : ["videos", "wallpapers", "music", "contenido"].includes(hash) ? "contenido" : hash;
  return <div className="soul-dock">
    {open && <div className="soul-dock-menu">
      <nav aria-label="Menú de secciones" className="grid grid-cols-2 gap-2">
        {[{id:"waves",label:"Soul Waves"},{id:"legends",label:"Soul Legends"},{id:"crew",label:"Soul Crew"},{id:"about",label:"La Nación"},{id:"reclutamiento",label:"Únete"},{id:"jersey",label:"Jersey Oficial"},{id:"redes",label:"Redes"}].map(s => <button key={s.id} onClick={() => navigate(s.id)}>{s.label}</button>)}
        <a href="/xplicit-cup">Xplicit Cup</a>
        <button onClick={() => { setPanelOpen(true); setOpen(false); }}>Explorar</button>
        <button onClick={() => { togglePanel(); setOpen(false); }}>Logros</button>
        <button onClick={toggle}>{playing ? <Pause size={16}/> : <Play size={16}/>} {playing ? "Pausar música" : "Reproducir música"}</button>
      </nav>
      <div className="mt-3 flex flex-wrap gap-3 border-t border-white/10 pt-3">{Object.entries(SOCIALS).map(([key,url]) => <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-xs capitalize text-white/65">{key}</a>)}</div>
    </div>}
    <nav className="soul-dock-bar" aria-label="Accesos principales">
      {[{id:"top",label:"Inicio",Icon:Home},{id:"roster",label:"Roster",Icon:Users},{id:"contenido",label:"Contenido",Icon:LayoutGrid}].map(({id,label,Icon}) => <button key={id} onClick={() => navigate(id)} aria-current={active === id ? "page" : undefined}><Icon size={18}/><span>{label}</span></button>)}
      <button onClick={() => setOpen(v => !v)} aria-label="Menú de secciones" aria-expanded={open}>{open ? <X size={18}/> : <Menu size={18}/>}<span>Menú</span></button>
    </nav>
  </div>;
}
