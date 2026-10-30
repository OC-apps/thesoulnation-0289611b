interface Props {
  id?: string;
  logo: string;
  title: string;
  subtitle: string;
  desc: string;
  members: string[];
  accentSeed?: number;
}

/** Clean editorial roster card. All text and supplied assets remain unchanged. */
export function HoloSquadCard({ id, logo, title, subtitle, desc, members }: Props) {
  const visibleMembers = members.filter((member) => typeof member === "string" && member.trim().length > 0);
  return (
    <article id={id} className="soul-squad group scroll-mt-28 overflow-hidden rounded-[28px] border border-white/15 bg-[#101252]">
      <div className="grid lg:grid-cols-[minmax(250px,0.8fr)_minmax(0,1.4fr)]">
        <div className="soul-squad-intro flex flex-col items-start justify-center border-b border-white/10 bg-[#01039E] p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
          <img src={logo} alt={title} className="mb-7 h-24 w-auto max-w-full object-contain sm:h-32" />
          <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h3>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#FFAB76]">{subtitle}</p>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">{desc}</p>
        </div>
        <div className="flex min-w-0 flex-col justify-center p-6 sm:p-9 lg:p-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-5">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/65">Roster · {visibleMembers.length.toString().padStart(2, "0")}</span>
            <span className="text-xs font-medium text-white/60">STATUS · ACTIVE</span>
          </div>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {visibleMembers.map((member, index) => (
              <li key={member + index} className="soul-member flex min-h-14 items-center rounded-xl border border-white/15 bg-white/[0.055] px-4 py-3 text-sm font-semibold leading-tight text-white transition-colors hover:border-[#F05E07] hover:bg-[#F05E07]/10">
                <span className="min-w-0 break-words">{member}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
