import { useMemo, useState } from "react";

type Props = { waves: string[]; legends: string[]; crew: string[] };
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase();

export function RosterSearch({ waves, legends, crew }: Props) {
  const [query, setQuery] = useState("");
  const term = normalize(query);
  const members = useMemo(() => {
    const seen = new Set<string>();
    return [
      ...waves.map(gt => ({ gt, area: "Soul Waves", division: "waves" })),
      ...legends.map(gt => ({ gt, area: "Soul Legends", division: "legends" })),
      ...crew.map(gt => ({ gt, area: "Soul Crew", division: "crew" })),
    ].filter(member => {
      const key = `${member.division}:${normalize(member.gt)}`;
      if (!normalize(member.gt) || seen.has(key)) return false;
      seen.add(key); return true;
    }).sort((a,b) => a.gt.localeCompare(b.gt, "es") || a.area.localeCompare(b.area));
  }, [waves, legends, crew]);
  const results = term ? members.filter(member => normalize(member.gt).includes(term)) : [];
  return <div className="mx-auto mb-7 max-w-3xl rounded-2xl border border-white/15 bg-[#111329] p-4 sm:p-5">
    <label htmlFor="roster-search" className="mb-2 block text-sm font-medium text-white">Buscar gamertag en todo el roster</label>
    <div className="flex items-center gap-2">
      <input id="roster-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Escribe un gamertag" autoComplete="off" aria-controls="roster-search-results" className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white" />
      {query && <button type="button" onClick={() => setQuery("")} className="min-h-12 rounded-xl px-3 text-xs text-white/70 hover:bg-white/10">Limpiar</button>}
    </div>
    <p className="mt-2 text-xs text-white/55">Soul Waves · Soul Legends · Soul Crew</p>
    <div role="status" aria-live="polite" className="mt-2 text-xs text-white/65">{term ? results.length ? `${results.length} ${results.length === 1 ? "coincidencia" : "coincidencias"}` : "No se encontraron integrantes." : ""}</div>
    <ul id="roster-search-results" className={term && results.length ? "mt-4 grid gap-2 sm:grid-cols-2" : ""}>
      {results.map(member => <li key={`${member.division}:${member.gt}`}><a href={`#${member.division}`} className="flex min-h-16 items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[.035] px-4 py-3 transition-colors hover:border-[#F05E07]">
        <span className="min-w-0 break-words text-sm font-semibold text-white">{member.gt}</span>
        <span className="shrink-0 rounded-full bg-[#01039E] px-3 py-1 text-[11px] font-medium text-white">{member.area}</span>
      </a></li>)}
    </ul>
  </div>;
}
