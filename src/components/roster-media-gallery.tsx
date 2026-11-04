import {useEffect,useState} from "react";
import {supabase} from "@/integrations/supabase/client";
type Media={id:string;media_type:"image"|"youtube"|"tiktok";media_url:string;caption:string};
function embed(item:Media){
 try{
  const u=new URL(item.media_url);
  if(item.media_type==="youtube"){
   let id=u.hostname==="youtu.be"?u.pathname.slice(1):u.searchParams.get("v");
   if(!id){const m=u.pathname.match(/\/(?:shorts|embed|live)\/([A-Za-z0-9_-]{11})/);id=m?.[1]||null;}
   if(id&&/^[A-Za-z0-9_-]{11}$/.test(id))return "https://www.youtube-nocookie.com/embed/"+id;
  }
  if(item.media_type==="tiktok"&&/(^|\.)tiktok\.com$/.test(u.hostname)){
   const id=u.pathname.match(/\/video\/(\d+)/)?.[1];
   if(id)return "https://www.tiktok.com/player/v1/"+id;
  }
 }catch{/* Invalid URL */}
 return null;
}
export function RosterMediaGallery({memberId,category}:{memberId:string;category:string}){
 const [items,setItems]=useState<Media[]>([]);
 useEffect(()=>{let active=true;void supabase.from("roster_profile_media" as "roster_members").select("id,media_type,media_url,caption").eq("member_id",memberId).eq("member_category",category).order("sort_order").then(({data})=>{if(active)setItems((data||[]) as unknown as Media[])});return()=>{active=false};},[memberId,category]);
 if(!items.length)return null;
 return <section className="mt-10 border-t border-white/15 pt-10">
  <p className="text-xs font-bold uppercase tracking-[.25em] text-[#F05E07]">SOUL MEDIA</p>
  <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Galería y videos</h2>
  <div className="mt-6 grid gap-5 md:grid-cols-2">{items.map(item=>{
   const source=embed(item);
   return <figure key={item.id} className="overflow-hidden rounded-2xl border border-white/15 bg-[#0d1438]">
    {item.media_type==="image"?<img src={item.media_url} alt={item.caption||"Galería del integrante"} loading="lazy" className="aspect-video w-full object-cover"/>:source?<div className={item.media_type==="tiktok"?"mx-auto aspect-[9/16] max-h-[650px] max-w-[365px]":"aspect-video"}><iframe src={source} title={item.caption||"Video del integrante"} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="h-full w-full border-0"/></div>:<a href={item.media_url} target="_blank" rel="noopener noreferrer" className="block p-8 text-[#F05E07] underline">Ver video en {item.media_type==="tiktok"?"TikTok":"YouTube"} ↗</a>}
    {item.caption&&<figcaption className="px-5 py-4 text-sm text-white/70">{item.caption}</figcaption>}
   </figure>;
  })}</div>
 </section>;
}
