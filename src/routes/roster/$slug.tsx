import { WAVES } from "@/lib/waves-defaults";
import { RosterMediaGallery } from "@/components/roster-media-gallery";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import soulLogo from "@/assets/soul-logo-official.png";

type Profile={id:string;nickname:string;category:string;photo:string|null;bio:string|null;links:{label:string;url:string}[]};
const slugify=(value:string)=>value.toLowerCase().trim().replace(/^soul\s+/i,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const safe=(value:unknown)=>typeof value==="string"&&/^https:\/\//i.test(value)?value:null;
export const Route=createFileRoute("/roster/$slug")({component:MemberProfile});
function MemberProfile(){
 const {slug}=Route.useParams();
 const [profile,setProfile]=useState<Profile|null>(null);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{
  let active=true;
  const load=async()=>{
   setLoading(true);
   const [roster,waves,photos,socials,fixed]=await Promise.all([
    supabase.from("roster_members").select("id,nickname,category"),
    supabase.from("waves_members").select("id,name,bio,photo_url,social_label,social_href"),
    supabase.from("legends_photos" as "roster_members").select("nickname,photo_url"),
    supabase.from("waves_socials").select("name,tiktok_url,twitch_url,youtube_url,x_url,facebook_url,photo_url,bio,extra_links"),
    supabase.from("roster_wave_profiles" as "roster_members").select("id,name,bio,photo_url")
   ]);
   const people=(roster.data||[]) as {id:string;nickname:string;category:string}[];
   const wavePeople=(waves.data||[]) as unknown as {id:string;name:string;bio:string|null;photo_url:string|null;social_label:string|null;social_href:string|null}[];
   const photoRows=(photos.data||[]) as unknown as {nickname:string;photo_url:string}[];
   const socialRows=(socials.data||[]) as unknown as Record<string,unknown>[];
   const member=people.find(p=>p.id===slug||slugify(p.nickname)===slug);
   const wave=wavePeople.find(p=>p.id===slug||slugify(p.name)===slug);
   const fixedPeople=(fixed.data||[]) as unknown as {id:string;name:string;bio:string|null;photo_url:string|null}[];
   const fixedWave=fixedPeople.find(p=>p.id===slug||slugify(p.name)===slug);
   const defaultWave=WAVES.find(p=>p.name===fixedWave?.name);
   const nickname=member?.nickname||wave?.name||fixedWave?.name;
   if(!nickname){if(active){setProfile(null);setLoading(false)}return;}
   const social=socialRows.find(p=>String(p.name).toUpperCase()===nickname.toUpperCase());
   const links:{label:string;url:string}[]=[];
   const defaultLinks=WAVES.find(p=>p.name===nickname)?.socials||[];
   for(const item of defaultLinks)if(safe(item.href))links.push({label:item.label,url:item.href});
   for(const [field,label] of [["tiktok_url","TikTok"],["twitch_url","Twitch"],["youtube_url","YouTube"],["x_url","X"],["facebook_url","Facebook"]] as const){const url=safe(social?.[field]);if(url)links.push({label,url});}
   const extra=social?.extra_links;
   if(Array.isArray(extra))for(const item of extra){if(item&&typeof item==="object"){const row=item as Record<string,unknown>;const url=safe(row.href);if(url)links.push({label:String(row.label||"Enlace"),url});}}
   if(wave?.social_href&&safe(wave.social_href))links.push({label:wave.social_label||"Red social",url:wave.social_href});
   const photo=photoRows.find(p=>p.nickname.toUpperCase()===nickname.toUpperCase())?.photo_url;
   const result:Profile={id:member?.id||wave?.id||fixedWave!.id,nickname,category:member?.category||"waves",photo:safe(social?.photo_url)||safe(wave?.photo_url)||safe(fixedWave?.photo_url)||defaultWave?.photo||safe(photo),bio:String(social?.bio||wave?.bio||fixedWave?.bio||defaultWave?.bio||"")||null,links};
   if(active){setProfile(result);setLoading(false)}
  };
  void load();
  return()=>{active=false};
 },[slug]);
 return <main className="min-h-screen bg-[#070b20] px-5 py-12 text-white sm:px-10">
  <div className="mx-auto max-w-5xl">
   <Link to="/" hash="roster" className="text-sm text-white/65 hover:text-white">← Volver al roster</Link>
   {loading?<p className="mt-16">Cargando perfil…</p>:!profile?<div className="mt-16"><h1 className="text-3xl font-bold">Perfil no encontrado</h1><p className="mt-3 text-white/60">Este integrante no está disponible en el roster actual.</p></div>:
   <article className="mt-10 overflow-hidden rounded-3xl border border-white/15 bg-[#0d1438]">
    <div className="grid md:grid-cols-2">
     <div className="relative flex min-h-[340px] items-center justify-center bg-[#01039E]/30">
      <img src={profile.photo||soulLogo} alt={profile.nickname} className={profile.photo?"h-full max-h-[650px] w-full object-cover":"h-36 w-36 object-contain opacity-60"}/>
     </div>
     <div className="flex flex-col justify-center p-7 sm:p-12">
      <p className="text-xs font-bold uppercase tracking-[.3em] text-[#F05E07]">THE SOUL NATION / {profile.category==="legends"?"SOUL LEGENDS":profile.category==="waves"?"SOUL WAVES":"SOUL CREW"}</p>
      <h1 className="mt-5 break-words text-4xl font-black uppercase tracking-tight sm:text-6xl">{profile.nickname}</h1>
      <div className="mt-8 border-t border-white/15 pt-7">
       <h2 className="text-xs font-semibold uppercase tracking-widest text-[#F05E07]">Sobre el integrante</h2>
       <p className="mt-3 whitespace-pre-line leading-relaxed text-white/75">{profile.bio||"Integrante de The Soul Nation."}</p>
      </div>
      {profile.links.length>0&&<div className="mt-8"><h2 className="text-xs font-semibold uppercase tracking-widest text-[#F05E07]">Redes sociales</h2><div className="mt-3 flex flex-wrap gap-2">{profile.links.map(link=><a key={link.label+link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/25 px-4 py-2 text-sm hover:border-[#F05E07]">{link.label} ↗</a>)}</div></div>}
      <a href="/streampack" className="mt-9 inline-flex w-fit rounded-xl bg-[#F05E07] px-5 py-3 font-bold text-[#090b1d]">Crear StreamPack ↗</a>
     </div>
    </div>
   </article>}
   {profile&&<RosterMediaGallery memberId={profile.id} category={profile.category}/>}
  </div>
 </main>;
}
