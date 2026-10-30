
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
  return (
    <article id={id} className="soul-division scroll-mt-28 overflow-hidden rounded-[28px] border border-white/15 bg-[#111329] sm:rounded-[36px]">
      <div className={`relative overflow-hidden p-6 sm:p-10 lg:p-12 ${isCrew ? "bg-[#01039E] text-white" : "bg-[#FFFFFF] text-[#01039E]"}`}>
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[#F05E07]" />
        <div className="relative grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
          <div className="min-w-0">
            <p className={`mb-5 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.12em] ${isCrew ? "text-white/75" : "text-[#01039E]/65"}`}>{subtitle}</p>
            <h3 className="font-display max-w-full break-words pr-[0.15em] text-[clamp(1.7rem,4.5vw,3.8rem)] leading-[1.12]">{title}</h3>
          </div>
          <p className={`max-w-lg text-sm leading-7 ${isCrew ? "text-white/80" : "text-[#292B48]"}`}>{desc}</p>
        </div>
      </div>
      <div className="p-6 sm:p-10 lg:px-12 lg:py-9">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Roster · {visibleMembers.length.toString().padStart(2, "0")}</span>
          <span className="flex items-center gap-2 text-[10px] font-medium tracking-[0.06em] text-white/55"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#F05E07]" />STATUS · ACTIVE</span>
        </div>
        <ul className={isLegends ? "soul-legends-lineup" : isCrew ? "soul-crew-lineup" : "grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3"}>
          {sortedMembers.map((member, index) => (
            <li key={member + index} className={isLegends ? "soul-legends-slot" : isCrew ? "soul-crew-slot" : "group/member flex min-h-[68px] min-w-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 transition-colors hover:border-[#F05E07]/60 hover:bg-[#01039E]/30"}>
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
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
