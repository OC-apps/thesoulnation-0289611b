import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GearsAdmin } from '@/components/GearsAdmin';
import { supabase } from "@/integrations/supabase/client";
import { verifyAdminPassword } from "@/lib/admin-auth.functions";
import { getSoulNewsAdmin, saveSoulNewsArticle, toggleSoulNewsSource, addSoulNewsSource, prepareSoulNewsCover, saveSoulNewsCover } from "@/lib/soul-news-admin.functions";
import { ArrowLeft, Check, LogOut, Save, Plus, RefreshCw, Copy, Image as ImageIcon } from "lucide-react";

type Article={id:string;title:string;excerpt:string;body:string;category:string;kind:string;status:string;source_name:string;source_url:string;published_at:string;image_url?:string|null;classification?:string|null};
type Source={id:string;name:string;platform:string;source_url:string|null;active:boolean};

function scriptFor(articles:Article[],mode:"marcus"|"radio"){
 const published=articles.filter(a=>a.status==="published");
 const candidates=(published.length?published:articles.filter(a=>a.status==="draft")).filter(a=>a.kind==="news"&&a.title&&a.source_url).slice(0,7);
 if(!candidates.length)return "No hay noticias disponibles para preparar un guion. Revisa primero las fuentes y los borradores.";
 const lead=mode==="marcus"?"Aquí Marcus Fenix. Vamos a revisar lo que se está hablando sobre Gears of War. Sin adornos y sin dar rumores por hechos.":"Bienvenidos a Soul News, el resumen informativo de The Soul Nation. Estas son las noticias y conversaciones destacadas de Gears of War.";
 const blocks=candidates.map((a,i)=>{
  const title=a.title.replace(/\\s+-\\s+[^-]+$/,"").trim();
  const intro=mode==="marcus"?["Primera noticia.","Seguimos.","Atención con esto.","Otra cosa que está dando de qué hablar."][Math.min(i,3)]:["Comenzamos con","En otras noticias,","En la comunidad,","También destaca"][Math.min(i,3)];
  const source=a.source_name||"una fuente externa";
  const detail=a.excerpt?.trim();
  const cautious=/rumou?r|reportedly|unconfirmed|apparently|supuest|rumor|según/i.test(a.title+" "+(detail||""));
  return [intro,title+".",cautious?"Se trata de información no confirmada; no debe tomarse como anuncio oficial.":"La información procede de "+source+".",detail&&detail!==a.title?detail:"Consulta el artículo original para conocer los detalles.",mode==="marcus"?"Habrá que esperar información verificable antes de sacar conclusiones.":"Seguiremos atentos a las actualizaciones confirmadas."].join(" ");
 });
 const outro=mode==="marcus"?"Eso es todo por hoy. Soy Marcus Fenix, y esto fue Soul News, de The Soul Nation. Manténganse alerta.":"Hasta aquí nuestro resumen de hoy. Sigue Soul News en The Soul Nation para más actualidad, fuentes y análisis de Gears of War.";
 return [lead,...blocks,outro].join("\\n\\n");
}

function visualPromptFor(article:Article) {
 const title=article.title.trim();
 const brief=article.excerpt.trim() || article.body.slice(0,500).trim();
 const lower=(title+" "+brief).toLowerCase();
 const characters=[
  ["Marcus Fenix",/marcus|fenix/],
  ["Dom Santiago",/\bdom\b|dominic|santiago/],
  ["Mags Carter",/\bmags\b|carter/],
  ["Lucas Reyes",/\blucas\b|reyes/],
 ].filter(([,expression])=>(expression as RegExp).test(lower)).map(([label])=>label as string);
 const elements=[
  ["Corpser",/corpser|corpster/],
  ["Vraahk",/vraahk/],
  ["Lancer prototipo",/lancer/],
  ["Gnasher",/gnasher|escopeta/],
  ["Kalona",/kalona/],
  ["emblemas de rango",/rango|rank|emblema|insignia/]
 ].filter(([,expression])=>(expression as RegExp).test(lower)).map(([label])=>label as string);
 const anchor=characters.length?characters.join(" y "):"el elemento visual directamente relacionado con esta noticia";
 const context=elements.length?elements.join(", "):"elementos de la época de E-Day que estén explícitamente respaldados por las referencias disponibles";
 const badge=article.classification==="rumor"?"Es un rumor no confirmado; la imagen no debe representar la afirmación como un hecho consumado.":article.classification==="opinion"||article.kind==="opinion"?"Es una columna de opinión: utiliza un tratamiento visual interpretativo, sin presentarlo como anuncio oficial.":"La escena debe ilustrar únicamente el contexto de la noticia, sin inventar acontecimientos confirmados.";
 return [
 "PROMPT MAESTRO — SOUL NEWS | CGI EDITORIAL 3D · GEARS OF WAR: E-DAY",
 "",
 "NOTICIA REAL A ILUSTRAR",
 "Titular: "+title,
 "Contexto: "+brief,
 "Enfoque editorial: "+badge,
 "Protagonistas o sujetos: "+anchor+".",
 "Elementos sugeridos por el tema: "+context+".",
 "",
 "DIRECCIÓN ARTÍSTICA",
 "Genera una portada editorial ORIGINAL que parezca un montaje cinematográfico AAA, compuesto en Adobe After Effects con Video Copilot Element 3D y modelos de videojuego renderizados con Unreal Engine 5. NO debe parecer una miniatura de YouTube ni una imagen plana de IA.",
 "Composición 3D multicapa: primer plano con un elemento sobredimensionado que sobresalga del encuadre; plano medio dominado por el sujeto de la noticia, rostro identificable, gesto y acción coherentes; fondo con el escenario del universo Gears of War: E-Day y profundidad atmosférica real.",
 "Usa cámara virtual en ángulo bajo, lente gran angular, perspectiva forzada y escorzos dramáticos. Objetos y personajes deben sentirse volumétricos y físicamente integrados, nunca pegados como un collage plano.",
 "Acabado de montage edit avanzado: Element 3D look, geometría 3D fotorrealista, Unreal Engine 5 Nanite/Lumen aesthetic, PBR, ray tracing, contact shadows, ambient occlusion, Z-depth compositing, multipass render, realistic light wraps, optical depth of field, directional motion blur y postproducción cinematográfica selectiva.",
 "Iluminación elaborada: key light fría azul acero, rim light naranja procedente de una fuente física, negros profundos con detalle, reflejos metálicos, luz volumétrica justificada, sombras dramáticas y CGI de partículas/escombros únicamente cuando la escena lo requiera.",
 "Color grading sofisticado. Máxima nitidez en sujetos clave, separación de planos, textura ultradetallada en piel, cabello, armaduras, armas y arquitectura; sensación de gran presupuesto sin saturación visual.",
 "",
 "FIDELIDAD ABSOLUTA A LAS REFERENCIAS ADJUNTAS",
 "Las imágenes que adjuntaré de Marcus, Dom, Mags, Lucas, Corpser, Vraahk, Lancer, Gnasher, soldados COG, emblemas y Kalona son la fuente visual obligatoria para los elementos que aparezcan.",
 "Mantener con precisión rostros, peinados, armaduras, anatomía, siluetas, mecanismos, proporciones y arquitectura. NO intercambiar Marcus y Dom, NO inventar armas, NO reinterpretar insignias, NO usar versiones de personajes posteriores a E-Day.",
 "Si un elemento no tiene referencia suficiente, omitirlo en lugar de inventar detalles de lore. No añadir criaturas ni personajes solo para decorar.",
 "",
 "NARRATIVA VISUAL",
 "La imagen debe contar específicamente la noticia descrita arriba. Elegir una única idea visual potente; no crear una ilustración bélica genérica. "+badge,
 "",
 "RESTRICCIONES ABSOLUTAS",
 "Sin texto, SIN títulos, SIN números, SIN logotipos (incluidos The Soul Nation y Gears of War), SIN marcas de agua, SIN sellos, SIN marcos, SIN HUD, SIN glitches ni interfaces. No introducir logos o inscripciones inventadas en primer plano.",
 "No estilo cartoon, cómic, cel shading, pintura digital, CGI plástico, rostros genéricos o escenas de pose estática. No presentar imágenes generadas como capturas auténticas del juego.",
 "",
 "SALIDA",
 "Imagen horizontal 16:9. Resolución objetivo 3840 × 2160, o máxima disponible. Acabado de portada editorial cinematográfica, sin tipografía; el titular de Soul News se superpondrá después desde HTML."
 ].join("\n");
}

const roles=["editor","admin"];
export const Route=createFileRoute("/soul-news/editorial")({
 head:()=>({meta:[{title:"Redacción | Soul News"},{name:"robots",content:"noindex, nofollow"}]}),
 component:Editorial,
});
function Editorial(){
 const [authed,setAuthed]=useState(false);
 const [password,setPassword]=useState("");
 const [error,setError]=useState("");const [busy,setBusy]=useState(false);
 const [articles,setArticles]=useState<Article[]>([]);const [sources,setSources]=useState<Source[]>([]);
 const [tab,setTab]=useState<"articles"|"sources"|"scripts"|"gears">("articles");
 const [scriptMode,setScriptMode]=useState<"marcus"|"radio">("radio");
 const [selected,setSelected]=useState<Article|null>(null);
 const [coverFile,setCoverFile]=useState<File|null>(null);
 const [coverMessage,setCoverMessage]=useState("");
 const [promptCopied,setPromptCopied]=useState(false);
 const [sourceName,setSourceName]=useState("");const [sourceUrl,setSourceUrl]=useState("");const [sourcePlatform,setSourcePlatform]=useState("x");
 const role="admin";
 const authorized=authed;
 async function load(p=password){try{const data=await getSoulNewsAdmin({data:{password:p}});setArticles(data.articles as Article[]);setSources(data.sources as Source[]);setError("");}catch(e){setError(e instanceof Error?e.message:"No se pudieron cargar los datos")}}
 useEffect(()=>{const saved=sessionStorage.getItem("admin-live-pw");if(!saved)return;verifyAdminPassword({data:{password:saved}}).then(r=>{if(r.ok){setPassword(saved);setAuthed(true);void load(saved)}}).catch(()=>{})},[]);
 async function signIn(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");try{const r=await verifyAdminPassword({data:{password}});if(!r.ok)throw Error("Contraseña incorrecta");sessionStorage.setItem("admin-live-pw",password);setAuthed(true);await load(password)}catch(e){setError(e instanceof Error?e.message:"Error de acceso")}finally{setBusy(false)}}
 async function saveArticle(){if(!selected)return;setBusy(true);try{const {id,title,excerpt,body,category,kind,status}=selected;await saveSoulNewsArticle({data:{password,article:{id,title,excerpt,body,category,kind:kind as "news"|"opinion",status:status as "draft"|"published"|"archived"}}});setSelected(null);await load()}catch(e){setError(e instanceof Error?e.message:"Error al guardar")}finally{setBusy(false)}}
 async function uploadCover(){
   if(!selected||!coverFile)return;
   setBusy(true);setCoverMessage("Subiendo portada…");
   try{
     const ext=coverFile.name.split(".").pop()?.toLowerCase();
     if(ext!=="png"&&ext!=="jpg"&&ext!=="jpeg"&&ext!=="webp")throw Error("Utiliza JPG, PNG o WebP");
     if(coverFile.size>5*1024*1024)throw Error("La imagen supera 5 MB");
     const extension=ext==="jpeg"?"jpg":ext;
     const ticket=await prepareSoulNewsCover({data:{password,id:selected.id,extension,bytes:coverFile.size}});
     const mime=extension==="jpg"?"image/jpeg":extension==="png"?"image/png":"image/webp";
     const {error:uploadError}=await supabase.storage.from("soul-news-images").uploadToSignedUrl(ticket.path,ticket.token,coverFile,{contentType:mime,cacheControl:"31536000"});
     if(uploadError)throw Error("No se pudo subir la imagen");
     const result=await saveSoulNewsCover({data:{password,id:selected.id,path:ticket.path,bytes:coverFile.size}});
     setSelected({...selected,image_url:result.url});
     setCoverFile(null);setCoverMessage("Portada publicada correctamente");
     await load();
   }catch(e){setCoverMessage(e instanceof Error?e.message:"Error al subir la portada")}
   finally{setBusy(false)}
 }
 async function updateSource(s:Source){setBusy(true);try{await toggleSoulNewsSource({data:{password,id:s.id,active:!s.active}});await load()}catch(e){setError(e instanceof Error?e.message:"Error al actualizar")}finally{setBusy(false)}}
 async function addSource(e:React.FormEvent){e.preventDefault();setBusy(true);try{await addSoulNewsSource({data:{password,source:{name:sourceName,source_url:sourceUrl,platform:sourcePlatform as "x"|"youtube"|"rss"|"website"|"twitch"}}});setSourceName("");setSourceUrl("");await load()}catch(e){setError(e instanceof Error?e.message:"Error al agregar")}finally{setBusy(false)}}
 const input="w-full rounded-lg border border-white/15 bg-white/5 p-3 text-sm text-white outline-none focus:border-[#F05E07]";
 return <main className="min-h-screen bg-[#090a12] px-5 py-12 text-white sm:px-10"><div className="mx-auto max-w-6xl">
  <Link to="/soul-news" className="mb-12 inline-flex items-center gap-2 text-sm text-white/60"><ArrowLeft size={16}/> Soul News</Link>
  <div className="mb-9 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-7"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-[#F05E07]">Acceso editorial</p><h1 className="text-4xl font-black uppercase tracking-tight sm:text-6xl">Redacción<span className="text-[#F05E07]">.</span></h1></div>{authed&&<button onClick={()=>{sessionStorage.removeItem("admin-live-pw");setAuthed(false);setPassword("")}} className="flex items-center gap-2 text-sm text-white/60"><LogOut size={16}/> Salir</button>}</div>
  {!authed?<form onSubmit={signIn} className="max-w-md space-y-4 rounded-xl border border-white/15 p-7"><h2 className="text-xl font-bold">Iniciar sesión</h2><p className="text-sm text-white/55">Utiliza la misma contraseña de /admin/live.</p><input className={input} type="password" placeholder="Contraseña" required value={password} onChange={e=>setPassword(e.target.value)}/><button disabled={busy} className="w-full rounded-lg bg-[#F05E07] p-3 font-bold">Entrar</button></form>
  :<><div className="mb-8 flex flex-wrap gap-3"><button onClick={()=>{setTab("articles");setSelected(null)}} className={`rounded-full px-5 py-2 text-sm ${tab==="articles"?"bg-[#F05E07]":"bg-white/10"}`}>Artículos ({articles.length})</button><button onClick={()=>{setTab("sources");setSelected(null)}} className={`rounded-full px-5 py-2 text-sm ${tab==="sources"?"bg-[#F05E07]":"bg-white/10"}`}>Fuentes ({sources.length})</button><button onClick={()=>{setTab("scripts");setSelected(null)}} className={`rounded-full px-5 py-2 text-sm ${tab==="scripts"?"bg-[#F05E07]":"bg-white/10"}`}>Guiones de podcast</button><button onClick={()=>setTab("gears")} className="rounded-full bg-white/10 px-5 py-2 text-sm">Gears al Carbón</button><button onClick={()=>void load()} className="ml-auto flex items-center gap-2 text-sm text-white/60"><RefreshCw size={15}/> Actualizar</button></div>
   {tab==="articles"&&(selected?<div className="max-w-3xl space-y-4"><button onClick={()=>setSelected(null)} className="text-sm text-[#F05E07]">← Volver</button><label className="block text-xs text-white/50">Titular<input className={input} value={selected.title} onChange={e=>setSelected({...selected,title:e.target.value})}/></label><section className="space-y-3 rounded-xl border border-white/15 bg-white/5 p-4">
   <h3 className="font-bold">Portada de la noticia</h3>
   <p className="text-xs text-white/60">Imagen horizontal 16:9. Sube una portada propia en WebP, JPG o PNG (máximo 5 MB). Aparecerá en el listado y al abrir la noticia.</p>
   {selected.image_url&&<img src={selected.image_url} alt="Portada actual del artículo" className="aspect-video w-full rounded-lg object-cover"/>}
   <div className="rounded-lg border border-[#F05E07]/25 bg-[#080914] p-4 space-y-3">
    <div className="flex items-center justify-between gap-3">
      <div><p className="flex items-center gap-2 text-sm font-bold text-white"><ImageIcon size={16} className="text-[#F05E07]"/> Prompt CGI para Google Flow</p>
      <p className="mt-1 text-xs text-white/55">Se adapta automáticamente al titular y al resumen de esta noticia. Adjunta en Flow las imágenes de referencia del personaje, arma y escenario que corresponda.</p></div>
      <button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(visualPromptFor(selected));setPromptCopied(true)}catch{setPromptCopied(false)}}} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#F05E07] px-3 py-2 text-xs font-semibold text-white"><Copy size={14}/>{promptCopied?"Copiado":"Copiar prompt"}</button>
    </div>
    <textarea aria-label="Prompt para generar portada con IA" readOnly rows={8} value={visualPromptFor(selected)} onFocus={e=>e.currentTarget.select()} className="w-full resize-y rounded-lg border border-white/15 bg-black/30 p-3 font-mono text-xs leading-5 text-white/75 focus:border-[#F05E07] focus:outline-none"/>
    <p className="text-xs text-white/45">Formato 16:9, sin texto ni logotipos. El titular se muestra por separado en la web.</p>
   </div>
   <input type="file" accept="image/webp,image/jpeg,image/png,.webp,.jpg,.jpeg,.png" className={input} onChange={e=>setCoverFile(e.target.files?.[0]||null)} />
   <button type="button" disabled={busy||!coverFile} onClick={()=>void uploadCover()} className="rounded-lg bg-[#F05E07] px-5 py-3 text-sm font-bold disabled:opacity-40">Subir y publicar portada</button>
   {coverMessage&&<p role="status" className="text-xs text-white/70">{coverMessage}</p>}
  </section><label className="block text-xs text-white/50">Resumen<textarea className={input} rows={3} value={selected.excerpt} onChange={e=>setSelected({...selected,excerpt:e.target.value})}/></label><label className="block text-xs text-white/50">Artículo<textarea className={input} rows={12} value={selected.body} onChange={e=>setSelected({...selected,body:e.target.value})}/></label><div className="grid gap-3 sm:grid-cols-3"><label className="text-xs text-white/50">Categoría<select className={input} value={selected.category} onChange={e=>setSelected({...selected,category:e.target.value})}>{["Oficial","E-Day","Comunidad","Competitivo","Análisis"].map(x=><option className="bg-[#10111a]" key={x}>{x}</option>)}</select></label><label className="text-xs text-white/50">Tipo<select className={input} value={selected.kind} onChange={e=>setSelected({...selected,kind:e.target.value})}><option className="bg-[#10111a]" value="news">Noticia</option><option className="bg-[#10111a]" value="opinion">Opinión</option></select></label><label className="text-xs text-white/50">Estado<select className={input} value={selected.status} onChange={e=>setSelected({...selected,status:e.target.value})}>{["draft","published","archived"].map(x=><option className="bg-[#10111a]" key={x} value={x}>{x==="draft"?"Borrador":x==="published"?"Publicado":"Archivado"}</option>)}</select></label></div><p className="text-xs text-white/45">Fuente: {selected.source_name} · {selected.source_url}</p><button disabled={busy} onClick={saveArticle} className="inline-flex items-center gap-2 rounded-lg bg-[#F05E07] px-6 py-3 font-bold"><Save size={16}/> Guardar cambios</button></div>
   :<div className="divide-y divide-white/10 border-t border-white/15">{articles.map(a=><button key={a.id} onClick={()=>{setSelected({...a});setCoverFile(null);setCoverMessage("");setPromptCopied(false);}} className="flex w-full items-center justify-between gap-5 py-5 text-left"><div><span className="text-[11px] uppercase tracking-widest text-[#F05E07]">{a.category} · {a.status==="published"?"Publicado":"Borrador"}</span><h3 className="mt-2 font-semibold">{a.title}</h3><p className="mt-2 text-xs text-white/45">{a.source_name}</p></div><span className="text-sm text-white/50">Editar →</span></button>)}</div>)}
   {tab==="gears"&&<GearsAdmin password={password}/>}
   {tab==="scripts"&&<div className="max-w-4xl space-y-5"><h2 className="text-2xl font-bold">Soul News en audio</h2><p className="text-sm text-white/60">Dos versiones para un solo locutor. Se elaboran a partir de titulares y extractos guardados; revisa los datos y edita el guion antes de generar la voz en FakeYou. Los borradores no están verificados.</p><div className="flex flex-wrap gap-2"><button onClick={()=>setScriptMode("radio")} className={`rounded-lg px-4 py-2 text-sm ${scriptMode==="radio"?"bg-[#F05E07]":"bg-white/10"}`}>Locutor profesional</button><button onClick={()=>setScriptMode("marcus")} className={`rounded-lg px-4 py-2 text-sm ${scriptMode==="marcus"?"bg-[#F05E07]":"bg-white/10"}`}>Estilo Marcus Fenix</button></div><textarea key={scriptMode+articles.length} defaultValue={scriptFor(articles,scriptMode)} className="min-h-[390px] w-full rounded-lg border border-white/15 bg-white/5 p-4 text-sm leading-relaxed text-white" id="soul-news-podcast-script"/><div className="flex flex-wrap gap-3"><button type="button" onClick={()=>{const el=document.getElementById("soul-news-podcast-script") as HTMLTextAreaElement|null;if(el)void navigator.clipboard.writeText(el.value)}} className="rounded-lg bg-[#F05E07] px-5 py-3 text-sm font-bold">Copiar guion editado</button><a href="https://fakeyou.com/tts/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/20 px-5 py-3 text-sm">Abrir FakeYou ↗</a></div></div>}
   {tab==="sources"&&<><div className="divide-y divide-white/10 border-t border-white/15">{sources.map(s=><div key={s.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-semibold">{s.name}</p><p className="break-all text-xs text-white/45">{s.platform} · {s.source_url||"Sin URL"}</p></div>{role==="admin"?<button disabled={busy} onClick={()=>updateSource(s)} className={`rounded-full px-4 py-2 text-xs font-semibold ${s.active?"bg-[#01039E]":"bg-white/10"}`}>{s.active?"Activa":"Inactiva"}</button>:<span className="text-xs text-white/45">{s.active?"Activa":"Inactiva"}</span>}</div>)}</div>{role==="admin"&&<form onSubmit={addSource} className="mt-10 grid gap-3 rounded-xl border border-white/15 p-6 sm:grid-cols-[1fr_1fr_auto]"><h3 className="sm:col-span-3 text-lg font-bold">Agregar fuente</h3><input className={input} placeholder="Nombre" required value={sourceName} onChange={e=>setSourceName(e.target.value)}/><input className={input} placeholder="https://..." required value={sourceUrl} onChange={e=>setSourceUrl(e.target.value)}/><select className={input} value={sourcePlatform} onChange={e=>setSourcePlatform(e.target.value)}>{["x","youtube","rss","website","twitch"].map(x=><option className="bg-[#10111a]" key={x}>{x}</option>)}</select><button disabled={busy} className="flex items-center justify-center gap-2 rounded-lg bg-[#F05E07] px-5 py-3 font-bold sm:col-span-3"><Plus size={16}/> Agregar</button></form>}</>}
  </>}
  {error&&<p role="alert" className="mt-6 rounded-lg border border-red-500/40 p-4 text-sm text-red-300">{error}</p>}
 </div></main>;
}
