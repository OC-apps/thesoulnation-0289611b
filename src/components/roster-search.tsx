import { useMemo, useState } from "react";

type Props = { waves: string[]; legends: string[]; crew: string[] };
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase();
const slug = (value: string) => value.trim().toLowerCase().replace(/\s+/g, "-");

export function RosterSearch({ waves, legends, crew }: Props) {
  const [query, setQuery] = useState("");
  const term = normalize(query).replace(/^soul(?:\s+|$)/, "");
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
  const results = term ? members.filter(member => normalize(member.gt).replace(/^soul\s+/, "").includes(term)) : [];
  return <div className="mx-auto mb-7 max-w-3xl rounded-2xl border border-white/15 bg-[#111329] p-4 sm:p-5">
    <label htmlFor="roster-search" className="mb-2 block text-sm font-medium text-white">Buscar gamertag en todo el roster</label>
    <div className="flex items-center gap-2">
      <div className="flex min-h-12 min-w-0 flex-1 items-center rounded-xl border border-white/15 bg-white/5 focus-within:border-[#F05E07]">
        <span aria-hidden="true" className="shrink-0 border-r border-white/15 px-4 text-sm font-semibold text-white/70">SOUL</span>
      <input id="roster-search" type="search" value={query} onChange={event => setQuery(event.target.value.replace(/^soul\s+/i, ""))} placeholder="Gamertag" autoComplete="off" aria-controls="roster-search-results" aria-describedby="roster-search-prefix" className="min-h-12 min-w-0 flex-1 rounded-r-xl bg-transparent px-3 text-base text-white" />
      </div>
      {query && <button type="button" onClick={() => setQuery("")} className="min-h-12 rounded-xl px-3 text-xs text-white/70 hover:bg-white/10">Limpiar</button>}
    </div>
    <span id="roster-search-prefix" className="sr-only">El prefijo SOUL ya está incluido. Escribe solo el resto del gamertag.</span>
    <p className="mt-2 text-xs text-white/55">Soul Waves · Soul Legends · Soul Crew</p>
    <div role="status" aria-live="polite" className="mt-2 text-xs text-white/65">{term ? results.length ? `${results.length} ${results.length === 1 ? "coincidencia" : "coincidencias"}` : "No se encontraron integrantes." : ""}</div>
    <ul id="roster-search-results" className={term && results.length ? "mt-4 grid gap-2 sm:grid-cols-2" : ""}>
      {results.map(member => <li key={`${member.division}:${member.gt}`}><a href={`/?${member.division === "waves" ? "wave" : "member"}=${encodeURIComponent(slug(member.gt))}#${member.division}`} className="flex min-h-16 flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[.035] px-4 py-3 transition-colors hover:border-[#F05E07]" aria-label={`Ver perfil de ${member.gt} en ${member.area}`}>
        <span className="min-w-0 break-words text-sm font-semibold text-white">{member.gt}</span>
        <span className="max-w-full break-words rounded-full bg-[#01039E] px-3 py-1 text-[11px] font-medium text-white">{member.area}</span>
      </a></li>)}
    </ul>
  </div>;
}
