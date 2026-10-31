import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Share2, X } from "lucide-react";

interface Props {
  id?: string;
  logo: string;
  title: string;
  subtitle: string;
  desc: string;
  members: string[];
  legendsPhotos?: Record<string,string>;
  accentSeed?: number;
}

/** Editorial division roster; the original copy and live member data are preserved. */
export function HoloSquadCard({ id, logo, title, subtitle, desc, members, legendsPhotos = {} }: Props) {
  const visibleMembers = members.filter((member) => typeof member === "string" && member.trim().length > 0);
  const isCrew = id === "crew";
  const isLegends = id === "legends";
  const sortedMembers = [...visibleMembers].sort((a,b) => a.localeCompare(b, "es"));
  const [selectedMember,setSelectedMember] = useState<string|null>(null);
  const [linkCopied,setLinkCopied] = useState(false);
  const [profileDirection,setProfileDirection] = useState(1);
  const slug = (name:string) => name.toLowerCase().trim().replace(/\s+/g,"-");
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.hash !== "#" + id) return;
    const member = url.searchParams.get("member");
    if (!member) return;
    const found = sortedMembers.find(m => slug(m) === member);
    if (found) setSelectedMember(found);
  }, [id, sortedMembers.join("|")]);
  const closeProfile = () => {
    setSelectedMember(null);setLinkCopied(false);
    const url=new URL(window.location.href);
    if(url.searchParams.has("member")){
      url.searchParams.delete("member");
      window.history.replaceState(window.history.state,"",url.pathname+url.search+url.hash);
    }
  };
  const openProfile = (member:string) => {
    setSelectedMember(member);setLinkCopied(false);
  };
  const navigateProfile = (direction: -1 | 1) => {
    if (!selectedMember || sortedMembers.length < 2) return;
    const current = sortedMembers.indexOf(selectedMember);
    setProfileDirection(direction);
    setSelectedMember(sortedMembers[(current + direction + sortedMembers.length) % sortedMembers.length]);
    setLinkCopied(false);
  };
  const shareProfile = async () => {
    if(!selectedMember)return;
    const url=new URL(window.location.href);
    url.searchParams.delete("wave");
    url.searchParams.set("member",slug(selectedMember));
    url.hash=id||"roster";
    const link=url.toString();
    if(navigator.share){
      try{await navigator.share({title:selectedMember+" | The Soul Nation",url:link});return;}
      catch{/* canceled by the visitor */}
    }
    try{await navigator.clipboard.writeText(link);setLinkCopied(true);}
    catch{window.prompt("Copia el enlace de perfil:",link);}
  };
  return (
    <article id={id} className="soul-division scroll-mt-28 overflow-hidden rounded-[28px] border border-white/15 bg-[#111329] sm:rounded-[36px]">
      <div className="soul-division-intro">
        <p>{desc}</p>
      </div>
      <div className="p-6 sm:p-10 lg:px-12 lg:py-9">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Roster · {visibleMembers.length.toString().padStart(2, "0")}</span>
          <span className="flex items-center gap-2 text-[10px] font-medium tracking-[0.06em] text-white/55"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#F05E07]" />STATUS · ACTIVE</span>
        </div>
        <ul className={isLegends ? "soul-legends-lineup" : isCrew ? "soul-crew-lineup" : "grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3"}>
          {sortedMembers.map((member, index) => (
            <li key={member + index} className={isLegends ? "soul-legends-slot relative" : isCrew ? "soul-crew-slot relative" : "relative group/member flex min-h-[68px] min-w-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 transition-colors hover:border-[#F05E07]/60 hover:bg-[#01039E]/30"}>
              {isCrew && <span aria-hidden="true" className="soul-crew-index">{String(index + 1).padStart(2, "0")}</span>}
              {isLegends ? <>{legendsPhotos[member.trim().toUpperCase()] && <img src={legendsPhotos[member.trim().toUpperCase()]} alt={member} className="soul-legends-photo" loading="lazy" />}<img src={logo} alt="" aria-hidden="true" className={legendsPhotos[member.trim().toUpperCase()] ? "soul-legends-emblem soul-legends-emblem-with-photo" : "soul-legends-emblem"} /></> : isCrew ? <span aria-hidden="true" className="soul-crew-accent" /> : <span aria-hidden="true" className="h-5 w-0.5 shrink-0 rounded-full bg-[#F05E07]/70 transition-colors group-hover/member:bg-[#F05E07]" />}
              {isLegends ? (
                <span className="soul-legends-name font-display">
                  {member.trim().toUpperCase().startsWith("SOUL ") ? (
                    <>
                      <span className="soul-legends-prefix">SOUL</span>
                      <span className="soul-legends-nickname">{member.trim().slice(5)}</span>
                    </>
                  ) : <span className="soul-legends-nickname">{member}</span>}
                </span>
              ) : isCrew ? (
                <span className="soul-crew-name font-display">
                  {member.trim().toUpperCase().startsWith("SOUL ") ? (
                    <>
                      <span className="soul-crew-prefix">SOUL</span>
                      <span className="soul-crew-nickname">{member.trim().slice(5)}</span>
                    </>
                  ) : <span className="soul-crew-nickname">{member}</span>}
                </span>
              ) : <span className="min-w-0 break-words text-sm font-medium leading-relaxed text-white">{member}</span>}
              <button type="button" onClick={()=>openProfile(member)} className="absolute inset-0 z-10 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F05E07] focus-visible:outline-offset-1"
                aria-label={"Ver perfil de "+member} title={"Ver perfil de "+member} />
            </li>
          ))}
        </ul>
      </div>
      <Dialog open={selectedMember !== null} onOpenChange={open=>!open&&closeProfile()}>
        <DialogContent className="soul-member-profile max-w-[min(92vw,720px)] overflow-hidden rounded-[24px] border border-white/15 bg-[#0b0e24] p-0 text-white">
          {selectedMember&&<div key={selectedMember} className={`soul-member-profile-content ${profileDirection > 0 ? "is-forward" : "is-backward"} relative`}>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="text-[10px] font-semibold tracking-[.22em] text-[#F05E07]">THE SOUL NATION / PERFIL</span>
              <button type="button" onClick={closeProfile} aria-label="Cerrar perfil" className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"><X size={18}/></button>
            </div>
            <div className="grid items-center gap-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
              <div className="relative flex min-h-[240px] items-center justify-center bg-[#01039E]">
                <img src={(isLegends && legendsPhotos[selectedMember.trim().toUpperCase()])||logo} alt={isLegends&&legendsPhotos[selectedMember.trim().toUpperCase()]?selectedMember:"Emblema oficial de la división"}
                  className={isLegends&&legendsPhotos[selectedMember.trim().toUpperCase()]?"h-full w-full object-cover absolute inset-0":"h-28 w-28 object-contain"} />
              </div>
              <div className="flex min-w-0 flex-col items-start gap-4 p-6 sm:p-8">
                <span className="text-[11px] font-bold tracking-[.16em] text-[#F05E07]">{title}</span>
                <DialogTitle className="font-display text-3xl leading-tight break-words text-white">{selectedMember}</DialogTitle>
                <p className="text-sm leading-relaxed text-white/70">{isLegends?"Integrante de Soul Legends. Montajes y clips de exhibición.":"Integrante de Soul Crew, la familia oficial de The Soul Nation."}</p>
                <button type="button" onClick={()=>void shareProfile()} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#F05E07]/50 px-5 py-2 text-sm font-semibold text-white hover:bg-[#F05E07]/15">
                  <Share2 size={16} className="text-[#F05E07]"/>{linkCopied?"Enlace copiado":"Compartir perfil"}
                </button>
                <nav className="soul-member-profile-navigation" aria-label="Otros integrantes de la división">
                  <button type="button" onClick={()=>navigateProfile(-1)} disabled={sortedMembers.length<2} aria-label="Ver integrante anterior">← Anterior</button>
                  <span>{Math.max(1,sortedMembers.indexOf(selectedMember)+1)} / {sortedMembers.length}</span>
                  <button type="button" onClick={()=>navigateProfile(1)} disabled={sortedMembers.length<2} aria-label="Ver integrante siguiente">Siguiente →</button>
                </nav>
              </div>
            </div>
          </div>}
        </DialogContent>
      </Dialog>
    </article>
  );
}
