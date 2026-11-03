import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { GearsShow } from '@/components/GearsShow';
import { getSoulNewsRadar, type RadarItem } from "@/lib/soul-news-radar.functions";
import { ArrowLeft, ArrowUpRight, Flame, Newspaper, Search, ShieldCheck, Clock3 } from "lucide-react";

type Article = { id:string; slug:string; title:string; excerpt:string; body:string; category:string; source_name:string; source_url:string; image_url:string|null; published_at:string; kind:string; status:string; classification?:string; verification_note?:string|null; source_links?:string[]|null };
const API = "https://quscgfasziijdjyixsex.supabase.co/rest/v1/soul_news_articles";
const KEY = "sb_publishable_AT5FDfqPulWKJOHrDsag1Q_9hlAVrl6";
const categories = ["Todas", "Oficial", "E-Day", "Comunidad", "Competitivo", "Análisis"];
const date = (s:string) => new Intl.DateTimeFormat("es-MX",{day:"numeric",month:"long",year:"numeric"}).format(new Date(s));
const safeUrl = (s:string|null|undefined) => s && /^https:\/\//i.test(s) ? s : undefined;
const articleLabel = (a:Article)=>a.classification==="rumor"?"Rumor no confirmado":a.classification==="report"||a.classification==="unverified"?"Reportado por terceros":a.classification==="opinion"||a.kind==="opinion"?"Opinión":a.classification==="confirmed"?"Información confirmada":"Sin verificación editorial";

export const Route = createFileRoute("/soul-news")({
  head: () => ({ meta: [
    { title:"Soul News | The Soul Nation — Actualidad de Gears of War" },
    { name:"description",content:"Soul News: información verificada, análisis y comunidad de Gears of War en español. Una publicación de The Soul Nation." },
    { property:"og:title",content:"Soul News | The Soul Nation" },
    { property:"og:description",content:"Noticias, análisis y actualidad de Gears of War." },
    { property:"og:url",content:"https://thesoulnation.org/soul-news" },
  ], links:[{rel:"canonical",href:"https://thesoulnation.org/soul-news"}] }),
  component:SoulNewsRoute,
});

function SoulNewsRoute(){
 const pathname=useRouterState({select:state=>state.location.pathname});
 return pathname.startsWith('/soul-news/editorial')?<Outlet/>:<SoulNews/>;
}

function SoulNews(){
  const [articles,setArticles]=useState<Article[]>([]);
  const [radar,setRadar]=useState<RadarItem[]>([]);
  const [loading,setLoading]=useState(true);
  const [category,setCategory]=useState("Todas");
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState<Article|null>(null);
  useEffect(()=>{
    let active=true;
    if(!KEY){setLoading(false);return;}
    fetch(API+"?select=id,slug,title,excerpt,body,category,source_name,source_url,image_url,published_at,kind,status,classification,verification_note,source_links&status=eq.published&order=published_at.desc&limit=80",{
      headers:{apikey:KEY,Authorization:"Bearer "+KEY}
    }).then(r=>{if(!r.ok)throw Error("Unavailable");return r.json()}).then(data=>{if(active&&Array.isArray(data))setArticles(data)}).catch(()=>{}).finally(()=>{if(active)setLoading(false)});
    return()=>{active=false};
  },[]);
  useEffect(()=>{let active=true;getSoulNewsRadar().then(items=>{if(active)setRadar(items)}).catch(()=>{});return()=>{active=false};},[]);
  const filtered=useMemo(()=>articles.filter(a=>(category==="Todas"||a.category===category)&&(!search||[a.title,a.excerpt].join(" ").toLowerCase().includes(search.toLowerCase()))),[articles,category,search]);
  const main=filtered[0];
  const opinion=articles.find(a=>a.kind==="opinion"&&a.status==="published");
  return <main className="min-h-screen text-[#f7f7f9]" style={{background:"radial-gradient(ellipse at 85% 0%, #10145b 0%, transparent 45%), #090a11"}}>
    <div className="mx-auto max-w-[1320px] px-5 pb-32 pt-10 sm:px-10 sm:pt-16">
      <div className="mb-12 flex items-center justify-between border-b border-white/15 pb-5 text-[11px] font-semibold uppercase tracking-[.2em] text-white/55">
        <Link to="/" className="inline-flex items-center gap-2 hover:text-white"><ArrowLeft size={15}/> The Soul Nation</Link>
        <span>Publicación digital · México</span>
      </div>
      <header className="border-b-2 border-white/80 pb-8">
        <div className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.3em] text-[#F05E07]"><span className="h-2 w-2 rounded-full bg-[#F05E07]"/> Gaming · Cultura · Comunidad</div>
        <h1 className="font-black leading-[.85] tracking-[-.075em] text-[clamp(2rem,8vw,10rem)]">SOUL<span className="text-[#F05E07]">NEWS</span></h1>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[.16em] text-white/60">
          <p>La actualidad de Gears of War, sin ruido.</p><p>THE SOUL NATION / EDICIÓN DIGITAL</p>
        </div>
      </header>
      <div className="sticky top-0 z-20 -mx-5 flex flex-wrap items-center gap-2 border-b border-white/15 bg-[#090a11]/95 px-5 py-4 backdrop-blur-xl sm:-mx-10 sm:px-10">
        <nav aria-label="Categorías" className="flex flex-1 gap-1 overflow-x-auto">{categories.map(c=><button key={c} onClick={()=>{setCategory(c);setSelected(null)}} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${category===c?"bg-[#F05E07] text-white":"text-white/60 hover:bg-white/10 hover:text-white"}`}>{c}</button>)}</nav>
        <label className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-2"><Search size={15} className="text-white/50"/><input aria-label="Buscar noticias" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar" className="w-24 bg-transparent text-xs text-white outline-none placeholder:text-white/40 sm:w-36"/></label>
      </div>
      {selected ? <article className="mx-auto w-full max-w-[820px] py-9 sm:py-12">
        <button onClick={()=>setSelected(null)} className="mb-7 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#F05E07]"><ArrowLeft size={16}/> Volver a Soul News</button>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[.14em] text-[#F05E07]">{selected.category} · {articleLabel(selected)}</p>
        <h2 className="max-w-[780px] break-words text-[clamp(1.65rem,3.4vw,2.65rem)] font-bold leading-[1.16] tracking-[-.025em] [text-wrap:balance]">{selected.title}</h2>
        <p className="mt-4 max-w-[750px] text-base leading-[1.7] text-white/70 sm:text-[1.075rem]">{selected.excerpt}</p>
        <p className="my-6 border-y border-white/15 py-3 text-[11px] uppercase tracking-[.1em] text-white/50">{date(selected.published_at)} · {selected.source_name}</p>{selected.classification!=="confirmed"&&<p className="mb-6 rounded-lg border border-[#F05E07]/35 bg-[#F05E07]/5 p-4 text-sm leading-6 text-white/70">Nota de la redacción: este contenido procede de un medio o conversación pública; no es confirmación oficial de The Coalition. {selected.verification_note||""}</p>}
        {safeUrl(selected.image_url)&&<img src={safeUrl(selected.image_url)} alt="" className="mb-9 aspect-video w-full rounded-xl object-cover"/>}
        <div className="max-w-[740px] space-y-5 whitespace-pre-line text-[1rem] leading-[1.85] text-white/80 sm:text-[1.065rem]">{selected.body}</div>
        <div className="mt-9 flex flex-wrap gap-4">
        {safeUrl(selected.source_url)&&<a href={selected.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-b border-[#F05E07] pb-2 text-sm text-[#F05E07]">Ver entrevista o fuente original <ArrowUpRight size={16}/></a>}
        {(selected.source_links||[]).filter(url=>safeUrl(url)).map((url,i)=><a key={url} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-b border-white/35 pb-2 text-sm text-white/75">Fuente complementaria {i+1} <ArrowUpRight size={16}/></a>)}
        </div>
      </article> : <>
        <section className="grid grid-cols-1 gap-7 border-b border-white/15 py-10 lg:grid-cols-[1.75fr_1fr]">
          <div className="group min-h-[420px] overflow-hidden border border-white/10 bg-[#11131e]">
            {main ? <button className="flex h-full w-full flex-col text-left" onClick={()=>setSelected(main)}>
              <div className="relative aspect-[16/8] w-full overflow-hidden bg-gradient-to-br from-[#01039E] to-[#10111c]">{safeUrl(main.image_url)&&<img src={safeUrl(main.image_url)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"/>}</div>
              <div className="p-7 sm:p-9"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#F05E07]">{main.category} · {articleLabel(main)} · {date(main.published_at)}</p><h2 className="mt-3 max-w-[760px] text-[clamp(1.4rem,2.6vw,2.3rem)] font-bold leading-[1.18] tracking-[-.02em] [text-wrap:balance]">{main.title}</h2><p className="mt-4 max-w-2xl text-base leading-7 text-white/60">{main.excerpt}</p><span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F05E07]">Leer artículo <ArrowUpRight size={16}/></span></div>
            </button> : <div className="flex h-full flex-col justify-between p-8 sm:p-12"><Newspaper size={40} className="text-[#F05E07]"/><div><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#F05E07]">Edición inaugural</p><h2 className="max-w-xl text-4xl font-bold tracking-tight sm:text-6xl">Una nueva forma de contar Gears.</h2><p className="mt-6 max-w-lg leading-7 text-white/60">{loading?"Consultando las publicaciones…":"Todavía no hay artículos publicados. La redacción solo mostrará noticias verificadas, con fuentes y fechas reales."}</p></div><div className="mt-10 flex items-center gap-2 text-sm text-white/50"><ShieldCheck size={17}/> Sin titulares inventados</div></div>}
          </div>
          <aside className="flex flex-col justify-between border-t-4 border-[#F05E07] bg-[#151521] p-8">
            <div><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#F05E07]">La columna</p><Flame size={25} className="text-[#F05E07]"/></div><h2 className="mt-10 text-4xl sm:text-5xl font-black uppercase leading-[.95] tracking-tight">Gears<br/>al Carbón<span className="text-[#F05E07]">.</span></h2><p className="mt-7 leading-7 text-white/65">La opinión de la casa. Análisis, humor norteño y conversación con Dizzy, sin confundir carrilla con información.</p></div>
            {opinion?<button onClick={()=>setSelected(opinion)} className="mt-12 flex items-center justify-between border-t border-white/20 pt-5 text-left text-sm font-semibold">{opinion.title}<ArrowUpRight/></button>:<div className="mt-12 border-t border-white/20 pt-5 text-xs uppercase tracking-widest text-white/40">Próxima entrega · En revisión editorial</div>}
          </aside>
        </section>
        <GearsShow/>
        {radar.length>0&&<section className="border-b border-white/15 py-10" aria-label="Radar de fuentes">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#F05E07]">Actualización diaria · En seguimiento</p><h2 className="mt-2 text-2xl font-bold">Radar de fuentes de Gears</h2></div><span className="text-xs text-white/50">Titulares externos · No verificados editorialmente</span></div>
          <p className="mb-5 max-w-3xl text-sm leading-6 text-white/60">Estas referencias proceden del monitoreo automático de medios. No son noticias confirmadas por The Soul Nation; abre la fuente original antes de compartirlas como hechos.</p>
          <div className="grid gap-3 md:grid-cols-2">{radar.map(item=><a key={item.id} href={item.source_url} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-white/15 bg-[#111325] p-4 transition hover:border-[#F05E07]/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F05E07]">{item.category} · {item.source_name}</span>
            <h3 className="mt-2 text-base font-bold leading-snug text-white group-hover:underline">{item.title}</h3>
            <span className="mt-3 block text-xs text-white/50">{new Date(item.published_at).toLocaleDateString("es-MX")} · Consultar fuente ↗</span>
          </a>)}</div>
        </section>}
        <section className="py-12"><div className="mb-8 flex flex-wrap items-baseline justify-between gap-3 border-b border-white/20 pb-4"><h2 className="text-2xl font-bold uppercase tracking-tight">Últimas publicaciones</h2><span className="text-xs text-white/40">{filtered.length} artículos</span></div>
          {filtered.length>1?<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.slice(1).map(a=><button key={a.id} onClick={()=>setSelected(a)} className="group border-b border-white/15 pb-6 text-left"><div className="mb-5 aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#01039E] to-[#171727]">{safeUrl(a.image_url)&&<img src={safeUrl(a.image_url)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>}</div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#F05E07]">{a.category} · {articleLabel(a)} · {date(a.published_at)}</p><h3 className="mt-3 text-[1.1rem] font-bold leading-[1.35] tracking-[-.01em]">{a.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">{a.excerpt}</p></button>)}</div>:<p className="py-12 text-sm text-white/50">{search||category!=="Todas"?"No hay publicaciones que coincidan con esta búsqueda.":"Los próximos artículos aparecerán aquí cuando sean publicados."}</p>}
        </section>
      </>}
      <footer className="mt-12 flex flex-wrap items-center justify-between gap-5 border-t border-white/20 pt-8 text-xs text-white/45"><span>© The Soul Nation · Soul News</span><span className="inline-flex items-center gap-2"><Clock3 size={14}/> Actualidad con contexto y fuentes</span></footer>
    </div>
  </main>;
}
