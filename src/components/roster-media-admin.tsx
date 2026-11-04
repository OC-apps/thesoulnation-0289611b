import { useEffect,useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { addRosterMedia,deleteRosterMedia,getRosterMediaAdmin,prepareRosterImage,saveRosterImage } from "@/lib/roster-media.functions";
type Member={id:string;name:string;category:"waves"|"legends"};
type Item={id:string;media_type:string;media_url:string;caption:string};
export function RosterMediaAdmin({password}:{password:string}){
 const [members,setMembers]=useState<Member[]>([]);
 const [selected,setSelected]=useState("");
 const [items,setItems]=useState<Item[]>([]);
 const [type,setType]=useState<"youtube"|"tiktok">("youtube");
 const [url,setUrl]=useState("");const [caption,setCaption]=useState("");
 const [file,setFile]=useState<File|null>(null);
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
 const [previewVersion,setPreviewVersion]=useState(0);
 const [previewMode,setPreviewMode]=useState<"desktop"|"mobile">("desktop");
 useEffect(()=>{let active=true;void Promise.all([supabase.from("roster_members").select("id,nickname,category"),supabase.from("waves_members").select("id,name"),supabase.from("roster_wave_profiles" as "roster_members").select("id,name")]).then(([r,w,f])=>{
  if(!active)return;
  const a=((r.data||[]) as {id:string;nickname:string;category:string}[]).filter(p=>p.category==="legends").map(p=>({id:p.id,name:p.nickname,category:p.category as "legends"}));
  const b=((w.data||[]) as {id:string;name:string}[]).map(p=>({id:p.id,name:p.name,category:"waves" as const}));
  const fixed=((f.data||[]) as unknown as {id:string;name:string}[]).map(p=>({id:p.id,name:p.name,category:"waves" as const}));
  setMembers([...a,...b,...fixed].sort((x,y)=>x.name.localeCompare(y.name)));
 });return()=>{active=false};},[]);
 const member=members.find(m=>m.id===selected);
 const profileUrl=member?"/roster/"+member.id+"?name="+encodeURIComponent(member.name)+"&division="+member.category:"";
 const reload=async(m=member)=>{if(!m)return;const result=await getRosterMediaAdmin({data:{password,memberId:m.id,category:m.category}});setItems(result.items as unknown as Item[]);setPreviewVersion(v=>v+1);};
 useEffect(()=>{setItems([]);if(member)void reload(member).catch(e=>setMessage(String(e)));},[selected]);
 const save=async()=>{if(!member)return;setBusy(true);setMessage("");try{
  if(file){
   if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>5242880)throw Error("Solo JPG, PNG o WebP de hasta 5 MB");
   const extension=file.type==="image/jpeg"?"jpg":file.type.split("/")[1] as "png"|"webp";
   const ticket=await prepareRosterImage({data:{password,memberId:member.id,category:member.category,extension}});
   const {error}=await supabase.storage.from("roster-media").uploadToSignedUrl(ticket.path,ticket.token,file,{contentType:file.type});
   if(error)throw Error(error.message);
   await saveRosterImage({data:{password,memberId:member.id,category:member.category,path:ticket.path,caption}});
   setFile(null);
  }else{
   if(!url.trim())throw Error("Agrega un enlace o selecciona una fotografía");
   await addRosterMedia({data:{password,memberId:member.id,category:member.category,type,url:url.trim(),caption}});
  }
  setUrl("");setCaption("");await reload();setMessage("Contenido agregado al perfil.");
 }catch(e){setMessage(e instanceof Error?e.message:String(e));}finally{setBusy(false);}};
 const remove=async(id:string)=>{if(!window.confirm("¿Quitar este contenido del perfil?"))return;setBusy(true);try{await deleteRosterMedia({data:{password,id}});await reload();setMessage("Contenido retirado.");}catch(e){setMessage(String(e));}finally{setBusy(false);}};
 return <section className="space-y-5 rounded-2xl border border-white/15 bg-white/[.035] p-5 text-white">
  <div><h2 className="text-xl font-bold">Perfiles · Fotos y videos</h2><p className="mt-1 text-sm text-white/60">Publica galerías y videos integrados en las fichas de Waves y Legends.</p></div>
  <label className="block text-sm">Integrante<select value={selected} onChange={e=>setSelected(e.target.value)} className="mt-2 w-full rounded-lg border border-white/20 bg-[#101631] p-3"><option value="">Selecciona integrante</option>{members.map(m=><option key={m.id} value={m.id}>{m.name} · {m.category}</option>)}</select></label>
  {member&&<div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(350px,1.1fr)]"><div className="min-w-0 space-y-4">
   <a className="text-sm text-[#F05E07] underline" href={profileUrl} target="_blank" rel="noreferrer">Ver perfil público ↗</a>
   <div className="flex gap-3"><label className="text-sm">Plataforma<select value={type} onChange={e=>setType(e.target.value as "youtube"|"tiktok")} className="mt-2 block rounded-lg bg-[#101631] p-3"><option value="youtube">YouTube</option><option value="tiktok">TikTok</option></select></label><label className="min-w-0 flex-1 text-sm">Enlace del video<input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." className="mt-2 w-full rounded-lg border border-white/20 bg-[#101631] p-3"/></label></div>
   <p className="text-xs text-white/50">O sube una fotografía (JPG, PNG, WebP, máximo 5 MB).</p>
   <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setFile(e.target.files?.[0]||null)} className="block w-full text-sm"/>
   <label className="block text-sm">Descripción opcional<input value={caption} onChange={e=>setCaption(e.target.value)} maxLength={200} className="mt-2 w-full rounded-lg border border-white/20 bg-[#101631] p-3"/></label>
   <button disabled={busy||(!file&&!url.trim())} onClick={()=>void save()} className="rounded-xl bg-[#F05E07] px-5 py-3 font-bold text-[#080b1c] disabled:opacity-40">{busy?"Guardando…":"Agregar al perfil"}</button>
   <div className="space-y-2"><h3 className="font-semibold">Contenido publicado ({items.length})</h3>{items.map(item=><div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 p-3"><div className="min-w-0">{item.media_type==="image"?<img src={item.media_url} alt={item.caption} className="h-20 w-28 rounded object-cover"/>:<a href={item.media_url} target="_blank" rel="noopener noreferrer" className="break-all text-sm text-[#F05E07] underline">{item.media_type}: {item.media_url}</a>}<p className="mt-1 text-sm text-white/60">{item.caption}</p></div><button disabled={busy} onClick={()=>void remove(item.id)} className="shrink-0 rounded-lg border border-red-400/40 px-3 py-2 text-xs">Quitar</button></div>)}</div>
  </div>
  <aside className="min-w-0 space-y-3 rounded-xl border border-white/15 bg-[#080b20] p-3 sm:p-4 xl:sticky xl:top-4">
   <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-white">Vista previa del perfil</h3><p className="text-xs text-white/55">Es la página pública real. Se actualiza después de guardar o quitar contenido.</p></div><div className="flex gap-2"><button type="button" onClick={()=>setPreviewMode("desktop")} aria-pressed={previewMode==="desktop"} className={`rounded-lg px-3 py-2 text-xs ${previewMode==="desktop"?"bg-[#F05E07] text-[#080b20]":"border border-white/20"}`}>Escritorio</button><button type="button" onClick={()=>setPreviewMode("mobile")} aria-pressed={previewMode==="mobile"} className={`rounded-lg px-3 py-2 text-xs ${previewMode==="mobile"?"bg-[#F05E07] text-[#080b20]":"border border-white/20"}`}>Celular</button></div></div>
   <div className="overflow-hidden rounded-xl border border-white/15 bg-[#070b20]"><div className="mx-auto transition-[max-width] duration-200" style={{maxWidth:previewMode==="mobile"?390:"100%"}}><iframe key={`${member.id}-${previewVersion}-${previewMode}`} src={profileUrl} title={`Vista previa de ${member.name}`} loading="lazy" className="h-[680px] w-full border-0" /></div></div>
   <div className="flex flex-wrap gap-3"><button type="button" onClick={()=>setPreviewVersion(v=>v+1)} className="rounded-lg border border-white/20 px-4 py-2 text-xs">Actualizar vista previa</button><a href={profileUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[#F05E07]/60 px-4 py-2 text-xs text-[#F05E07]">Abrir perfil completo ↗</a></div>
  </aside></div>}
  {message&&<p role="status" className="text-sm text-white/80">{message}</p>}
 </section>;
}
