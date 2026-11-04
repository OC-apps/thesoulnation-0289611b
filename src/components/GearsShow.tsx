import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GearsEpisode, GearsMedia } from "@/lib/gears";
import { GearsPlayer } from "./GearsPlayer";

type LinkedArticle = { id: string; title: string; body: string };
type EpisodeArticle = { episode_id: string; article: LinkedArticle | null };

export function GearsShow() {
  const [episodes,setEpisodes]=useState<GearsEpisode[]>([]);
  const [media,setMedia]=useState<GearsMedia[]>([]);
  const [selected,setSelected]=useState("");
  const [articles,setArticles]=useState<EpisodeArticle[]>([]);
  const [error,setError]=useState("");
  useEffect(()=>{
    let active=true;
    const db=supabase as SupabaseClient;
    void Promise.all([
      db.from("gears_media").select("*"),
      db.from("gears_episodes").select("*").eq("status","published").lte("published_at",new Date().toISOString()).order("published_at",{ascending:false}),
      db.from("gears_episode_articles").select("episode_id,article:soul_news_articles!inner(id,title,body)").eq("article.status","published").lte("article.published_at",new Date().toISOString()).order("article_id")
    ]).then(([m,e,a])=>{
      if(!active)return;
      if(m.error||e.error){setError("No se pudieron cargar los episodios.");return;}
      if(a.error)setError("No se pudieron cargar los artículos vinculados. Recarga la página para volver a intentarlo.");
      setArticles((a.data??[]) as unknown as EpisodeArticle[]);
      setMedia(m.data??[]);
      setEpisodes(e.data??[]);
      setSelected(e.data?.[0]?.id??"");
    });
    return()=>{active=false;};
  },[]);
  const episode=episodes.find(e=>e.id===selected);
  const linkedArticles=articles.filter(a=>a.episode_id===selected&&a.article?.body?.trim()).map(a=>a.article!);
  const reading=linkedArticles.length?linkedArticles:[{id:selected,title:"",body:episode?.editorial_body?.trim()||"La edición editorial de este episodio está en preparación."}];
  const hasVideo=!!episode?.audio_path&&(["intro","background","outro"] as const).every(id=>media.some(m=>m.id===id));
  return <section className="border-b border-white/15 py-10" aria-label="Gears al Carbón">
    <header className="mb-7">
      <p className="text-xs font-bold uppercase tracking-[.24em] text-[#F05E07]">Videopodcast · Con Dizzy</p>
      <h2 className="mt-3 font-display text-3xl font-black uppercase italic tracking-tight sm:text-5xl">GEARS AL CARBÓN<span className="text-[#F05E07]">.</span></h2>
      <p className="mt-2 text-sm text-white/60">Noticias, análisis y humor norteño. Lee la edición o escucha a Dizzy.</p>
    </header>
    {error&&<p role="alert" className="mb-6 text-red-300">{error}</p>}
    {episodes.length>1&&<nav aria-label="Ediciones de Gears al Carbón" className="mb-6 flex gap-2 overflow-x-auto pb-2">{episodes.map(e=><button key={e.id} aria-pressed={selected===e.id} onClick={()=>{setSelected(e.id);}} className={`max-w-[235px] shrink-0 rounded-lg border px-4 py-3 text-left text-xs ${selected===e.id?"border-[#F05E07] bg-[#F05E07]/15":"border-white/15 bg-white/5"}`}><span className="block text-white/45">{new Date(e.published_at).toLocaleDateString("es-MX")}</span><strong className="mt-1 block text-white">{e.title}</strong></button>)}</nav>}
    {episode?<div className={`grid gap-6 rounded-2xl border border-white/15 bg-[#101224]/90 p-4 sm:p-6 ${hasVideo?"lg:grid-cols-[minmax(0,1fr)_minmax(260px,370px)]":"grid-cols-1"}`}>
      <article className="relative min-w-0" aria-labelledby="gears-editorial-title">
        <div className={`flex min-h-0 flex-col ${hasVideo?"lg:absolute lg:inset-0":""}`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><span className="text-[11px] font-bold uppercase tracking-[.16em] text-[#F05E07]">Edición editorial · {new Date((episode.edition_date||episode.published_at).slice(0,10)+"T12:00:00").toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"})}</span><span className="text-[11px] text-white/45">Soul News</span></div>
        <h3 id="gears-editorial-title" className="font-display text-xl font-black uppercase italic leading-tight tracking-tight text-white sm:text-2xl">{episode.editorial_title||episode.title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/65">{episode.description}</p>
        <div key={episode.id} role="region" tabIndex={0} aria-label="Artículo editorial, usa el desplazamiento para continuar" className={`mt-5 h-[min(55svh,440px)] min-h-0 overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-[#080A19]/80 p-4 text-sm leading-7 text-white/80 [overflow-wrap:anywhere] [scrollbar-gutter:stable] focus-visible:outline-2 focus-visible:outline-[#F05E07] sm:p-5 ${hasVideo?"lg:h-auto lg:flex-1":""}`}>
          {reading.map(article=><section key={article.id} className="mb-8 last:mb-0">
            {reading.length>1&&<h4 className="mb-4 text-base font-bold text-white">{article.title}</h4>}
            {article.body.split(/\n\s*\n/).filter(Boolean).map((part,i)=>/^#{1,6}\s/.test(part.trim())?<h4 key={i} className="mb-4 mt-6 font-bold text-white first:mt-0">{part.trim().replace(/^#{1,6}\s+/,"")}</h4>:<p key={i} className="mb-4 whitespace-pre-line last:mb-0">{part}</p>)}
          </section>)}
        </div>
        </div>
      </article>
      {hasVideo&&<div className="min-w-0"><GearsPlayer key={episode.id} episode={episode} media={media}/></div>}
    </div>:<div className="rounded-xl border border-white/15 bg-[#101224] p-8 text-white/60">La próxima edición de Gears al Carbón está en preparación. Las noticias de Soul News se mostrarán aquí cuando estén publicadas.</div>}
  </section>;
}
