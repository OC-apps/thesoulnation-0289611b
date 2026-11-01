import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, ImagePlus, Type, ShieldCheck, MoveHorizontal, ArrowLeft, Package } from "lucide-react";
import { buildZip } from "@/lib/streampack-zip";
import { StreamPackAreaEditor } from "@/components/streampack-area-editor";

export const Route = createFileRoute("/streampack")({
  head: () => ({ links:[{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:ital,wght@1,700;1,900&family=Bebas+Neue&family=Oswald:wght@700&family=Rajdhani:wght@700&family=Roboto+Condensed:ital,wght@1,900&display=swap"}], meta: [
    { title: "StreamPack Studio | The Soul Nation" },
    { name: "description", content: "Personaliza gráficos para tus transmisiones con nicknames ajustados automáticamente." },
  ] }),
  component: StreamPackStudio,
});

type Area = { x: number; y: number; width: number; height: number; maxFont: number; minFont: number; color: string; padding?: number; align: "center" | "left" | "right" };
type Zone = Area & { id:string; label:string; kind:"nickname"|"social"|"soul" }; 
type Template = { zones?:Zone[]; id: string; name: string; width: number; height: number; area: Area; category: string; membersOnly: boolean };
const START: Template[] = [
  {id:"avi",name:"AVI · Imagen de perfil",width:2048,height:2048,category:"AVI",membersOnly:false,area:{x:310,y:1570,width:1428,height:190,maxFont:190,minFont:12,color:"#FFFFFF",align:"center"},zones:[{id:"nickname",label:"Nickname",kind:"nickname",x:310,y:1570,width:1428,height:190,maxFont:190,minFont:12,color:"#FFFFFF",align:"center"}]},
  {id:"4cams",name:"4 webcams · Invitados",width:1920,height:1080,category:"Invitados",membersOnly:false,area:{x:1,y:1,width:100,height:30,maxFont:30,minFont:8,color:"#FFFFFF",align:"center"},zones:[]},
  { id:"webcam", name:"Webcam horizontal", width:1920, height:1080, category:"Webcam", membersOnly:false,
    area:{x:480,y:914,width:960,height:104,maxFont:105,minFont:14,color:"#FFFFFF",align:"center"} },
  { id:"vertical", name:"Transmisión vertical", width:1080, height:1920, category:"TikTok", membersOnly:false,
    area:{x:120,y:1650,width:840,height:135,maxFont:135,minFont:14,color:"#FFFFFF",align:"center"} },
];
const safeName = (name:string) => (name.trim().replace(/[^a-z0-9-_]+/gi,"_").slice(0,64) || "Streamer");
const loadImage = (src:string):Promise<HTMLImageElement> => new Promise((resolve,reject) => {
  const image=new Image(); image.onload=()=>resolve(image); image.onerror=reject; image.src=src;
});
async function render(template:Template, nickname:string, asset:string|undefined, fontFamily:string, showGuides:boolean, socials:Record<string,string>={}) {
  const canvas=document.createElement("canvas"); canvas.width=template.width; canvas.height=template.height;
  const context=canvas.getContext("2d"); if(!context) throw Error("Canvas no disponible");
  if (asset) { const image=await loadImage(asset); context.drawImage(image,0,0,canvas.width,canvas.height); }
  const a=template.area; const displayName=nickname.trim().toUpperCase().replace(/^SOUL\\s+/i,"") || "NICKNAME";
  await document.fonts.load(`900 italic 40px "${fontFamily}"`);
  const drawText=(a:Area,label:string,highlightFinal=false)=>{
  if(!label.trim())return;
  const inset=Math.min((a.padding??8),Math.max(0,Math.min(a.width,a.height)/2-1));
  let low=1, high=Math.max(2,a.maxFont);
  const permittedWidth=Math.max(1,a.width-2*inset); const permittedHeight=Math.max(1,a.height-2*inset);
  for(let i=0;i<24;i++) {
    const mid=(low+high)/2;
    context.font=`900 italic ${mid}px "${fontFamily}", Arial, sans-serif`;
    const measure=context.measureText(label);
    const height=(measure.actualBoundingBoxAscent || mid*.85)+(measure.actualBoundingBoxDescent || mid*.25);
    if(measure.width<=permittedWidth && height<=permittedHeight)low=mid; else high=mid;
  }
  context.font=`900 italic ${low}px "${fontFamily}", Arial, sans-serif`;
  context.textAlign=a.align; context.textBaseline="middle"; context.fillStyle=a.color;
  const x=a.align==="left"?a.x+inset:a.align==="right"?a.x+a.width-inset:a.x+a.width/2;
  const pieces=highlightFinal ? label.match(/^(.*\\S)\\s+([A-Z])$/i) : null;
  if(pieces){const left=pieces[1]+" ",right=pieces[2];const allWidth=context.measureText(label).width;const leftWidth=context.measureText(left).width;const start=a.align==="center"?x-allWidth/2:a.align==="right"?x-allWidth:x;context.textAlign="left";context.fillStyle="#FFFFFF";context.fillText(left,start,a.y+a.height/2);context.fillStyle="#F05E07";context.fillText(right,start+leftWidth,a.y+a.height/2);}
  else context.fillText(label,x,a.y+a.height/2);
  if(showGuides){context.strokeStyle="#F05E07";context.lineWidth=Math.max(2,canvas.width/480);context.setLineDash([14,10]);context.strokeRect(a.x,a.y,a.width,a.height);context.setLineDash([]);}
  };
  if(template.id==="4cams")return canvas;
  if(template.zones){for(const zone of template.zones){const value=zone.kind==="social" ? (socials[zone.label]||"") : zone.kind==="soul" ? "SOUL" : displayName;drawText(zone,value,zone.kind==="nickname");}}
  else drawText(a,displayName,true);
  return canvas;
}
function StreamPackStudio(){
  const [nickname,setNickname]=useState("Soul Maverick z");
  const [socials,setSocials]=useState<Record<string,string>>({Twitch:"",TikTok:"",YouTube:"",Instagram:""});
  const [zoneId,setZoneId]=useState("nickname");
  const [templates,setTemplates]=useState<Template[]>(START);
  const [selected,setSelected]=useState("avi");
  const [assets,setAssets]=useState<Record<string,string>>({});
  const [fontFamily,setFontFamily]=useState("Arial");
  const [advanced,setAdvanced]=useState(false);
  const [preview,setPreview]=useState("");
  const [guides,setGuides]=useState(false);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  const [editor,setEditor]=useState(false);
  const [packBusy,setPackBusy]=useState(false);
  const t=templates.find(item=>item.id===selected) || templates[0];
  const update=(patch:Partial<Template>)=>setTemplates(current=>current.map(x=>x.id===t.id?{...x,...patch}:x));
  const activeZone=t.zones?.find(z=>z.id===zoneId);
  const updateArea=(patch:Partial<Area>)=>activeZone ? update({zones:t.zones!.map(z=>z.id===zoneId?{...z,...patch}:z)}) : update({area:{...t.area,...patch}});
  const addZone=(kind:Zone["kind"],label:string)=>{const id=`zone-${Date.now()}`;update({zones:[...(t.zones||[{...t.area,id:"nickname",kind:"nickname" as const,label:"Nickname"}]),{...t.area,id,kind,label,x:Math.round(t.width*.12),y:Math.round(t.height*.35),width:Math.round(t.width*.35),height:Math.round(t.height*.07)}]});setZoneId(id);};
  const removeZone=()=>{if(!activeZone)return;update({zones:t.zones!.filter(z=>z.id!==zoneId)});setZoneId("nickname");};
  useEffect(()=>{let active=true;render(t,nickname,assets[t.id],fontFamily,guides,socials).then(c=>{if(active)setPreview(c.toDataURL("image/png"));}).catch(()=>{if(active)setMessage("No se pudo generar la vista previa.");});return()=>{active=false};},[t,nickname,assets,fontFamily,guides,socials]);
  const upload=(file?:File)=>{
    if(!file)return;
    if(!file.type.startsWith("image/")){setMessage("Selecciona una imagen PNG o JPG.");return;}
    const url=URL.createObjectURL(file);
    loadImage(url).then(image=>{
      const old=assets[t.id];setAssets(p=>({...p,[t.id]:url}));update({width:image.naturalWidth,height:image.naturalHeight,area:{...t.area,x:Math.round(image.naturalWidth*.2),y:Math.round(image.naturalHeight*.82),width:Math.round(image.naturalWidth*.6),height:Math.round(image.naturalHeight*.12),maxFont:Math.round(image.naturalHeight*.08)}});if(old)URL.revokeObjectURL(old);
      setMessage("Imagen cargada. Ajusta el rectángulo del nickname en el editor.");
    }).catch(()=>{URL.revokeObjectURL(url);setMessage("La imagen no es válida.");});
  };
  const fontUpload=async(file?:File)=>{
    if(!file)return;
    try {const family="SoulUploadedFont";const url=URL.createObjectURL(file);const face=new FontFace(family,`url("${url}")`);await face.load();document.fonts.add(face);URL.revokeObjectURL(url);setFontFamily(family);setMessage("Tipografía cargada para esta sesión.");}
    catch {setMessage("No se pudo cargar la fuente. Usa un archivo TTF u OTF válido.");}
  };
  const download=async()=>{
    setBusy(true);setMessage("");
    try{
      const c=await render(t,nickname,assets[t.id],fontFamily,false,socials);
      const blob=await new Promise<Blob|null>(resolve=>c.toBlob(resolve,"image/png"));
      if(!blob)throw Error("No se pudo crear el PNG");
      const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`Soul_${safeName(nickname)}_${t.id}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
    }catch(e){setMessage(e instanceof Error?e.message:"Error de exportación");}finally{setBusy(false);}
  };
  const downloadPack=async()=>{
    setPackBusy(true);setMessage("");
    try{
      const valid=templates.filter(item=>!item.membersOnly && Boolean(assets[item.id]));
      if(!valid.length)throw Error("Sube primero al menos un gráfico PNG en el editor para generar el paquete.");
      const files:{name:string;bytes:Uint8Array}[]=[];
      for(const item of valid){
        const canvas=await render(item,nickname,assets[item.id],fontFamily,false,socials);
        const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/png"));
        if(!blob)throw Error("No se pudo generar "+item.name);
        files.push({name:`${item.category}/${safeName(nickname)}_${item.id}.png`,bytes:new Uint8Array(await blob.arrayBuffer())});
      }
      const zip=buildZip(files);const url=URL.createObjectURL(zip);const a=document.createElement("a");
      a.href=url;a.download=`TheSoulNation_${safeName(nickname)}_StreamPack.zip`;a.click();
      setTimeout(()=>URL.revokeObjectURL(url),3000);
      setMessage(`Paquete generado: ${files.length} gráfico(s) con fondo cargado.`);
    }catch(e){setMessage(e instanceof Error?e.message:"No se pudo generar el paquete.");}
    finally{setPackBusy(false);}
  };
  const saveConfiguration=()=>{const json=JSON.stringify({version:1,templates},null,2);const url=URL.createObjectURL(new Blob([json],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="TSN_StreamPack_Plantillas.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);setMessage("Configuración exportada. Conserva también los PNG originales.");};
  const loadConfiguration=async(file?:File)=>{if(!file)return;try{const data=JSON.parse(await file.text());if(data.version!==1||!Array.isArray(data.templates)||data.templates.length>100)throw Error("Formato de configuración inválido");const clean:Template[]=data.templates.map((item:Template)=>{if(typeof item.id!=="string"||typeof item.name!=="string"||!Number.isInteger(item.width)||!Number.isInteger(item.height)||item.width<1||item.width>8192||item.height<1||item.height>8192||!Array.isArray(item.zones))throw Error("Plantilla inválida");return {...item,zones:item.zones.filter(z=>typeof z.id==="string"&&["nickname","soul","social"].includes(z.kind)&&Number.isFinite(z.x)&&Number.isFinite(z.y)&&Number.isFinite(z.width)&&Number.isFinite(z.height)).slice(0,32)};});setTemplates(clean);setSelected(clean[0]?.id||"webcam");setZoneId("nickname");setMessage("Configuración importada. Vuelve a cargar los PNG correspondientes.");}catch(e){setMessage(e instanceof Error?e.message:"No se pudo importar el JSON");}};
  const createTemplate=()=>{const id=`custom-${Date.now()}`;setTemplates(p=>[...p,{...START[0],id,name:"Nuevo gráfico",membersOnly:false}]);setSelected(id);setEditor(true);};
  const setNumber=(key:keyof Area,value:number)=>{
    if(!Number.isFinite(value))return;
    const max=key==="x"||key==="width"?t.width:key==="y"||key==="height"?t.height:400;
    updateArea({[key]:Math.max(0,Math.min(max,Math.round(value)))} as Partial<Area>);
  };
  return <main className="relative min-h-screen px-4 pb-28 pt-24 text-white md:px-8" style={{background:"radial-gradient(ellipse at 80% 0%,#071c64 0%,#060b22 55%,#050719 100%)"}}>
    <div className="mx-auto max-w-6xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft size={16}/> Regresar a The Soul Nation</Link>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.3em] text-[#F05E07]">The Soul Nation / Creators</p><h1 className="mt-2 text-3xl font-black uppercase italic tracking-tight md:text-5xl">StreamPack <span className="text-[#F05E07]">Studio</span></h1><p className="mt-3 max-w-xl text-sm text-slate-300">Genera tus gráficos con el nickname ajustado al área exacta de cada plantilla. Descarga PNG a resolución original.</p></div>
        <span className="rounded-full border border-blue-400/30 px-4 py-2 text-xs text-blue-200">Versión inicial</span>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/[.045] p-5">
          <label className="block text-sm font-semibold" htmlFor="soul-nickname">Nickname</label>
          <input id="soul-nickname" maxLength={65} value={nickname} onChange={e=>setNickname(e.target.value)} className="w-full rounded-xl border border-white/20 bg-[#07122c] px-4 py-3 text-base outline-none focus:border-[#F05E07]" placeholder="Soul Emi X"/>
          <div className="space-y-2"><h2 className="text-sm font-semibold">Redes sociales</h2>{["Twitch","TikTok","YouTube","Instagram"].map(network=><label key={network} className="block text-xs text-slate-300">{network}<input value={socials[network]||""} onChange={e=>setSocials(p=>({...p,[network]:e.target.value}))} className="mt-1 w-full rounded-lg border border-white/15 bg-[#07122c] p-2 text-base text-white" placeholder="@usuario"/></label>)}</div>
          <div><h2 className="mb-3 text-sm font-semibold">Selecciona tu gráfico</h2><div className="space-y-2">{templates.filter(x=>!x.membersOnly).map(item=><button type="button" key={item.id} onClick={()=>setSelected(item.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${t.id===item.id?"border-[#F05E07] bg-[#F05E07]/10":"border-white/10 bg-white/5 hover:bg-white/10"}`}><span>{item.name}</span><span className="text-xs text-slate-400">{item.width}×{item.height}</span></button>)}</div></div>
          <button onClick={()=>setEditor(p=>!p)} className="w-full rounded-xl border border-blue-400/40 px-4 py-3 text-sm font-semibold hover:bg-blue-500/10">{editor?"Cerrar editor local":"Abrir editor de plantilla"}</button>
          <button onClick={download} disabled={busy || !nickname.trim() || !assets[t.id]} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F05E07] px-4 py-3 font-bold text-[#080b20] disabled:opacity-50"><Download size={18}/> {busy?"Generando…":"Descargar PNG"}</button>
          <button onClick={downloadPack} disabled={packBusy || !nickname.trim() || !templates.some(item=>!item.membersOnly && Boolean(assets[item.id]))} className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/50 bg-blue-600/20 px-4 py-3 font-bold text-white disabled:opacity-40"><Package size={18}/> {packBusy?"Preparando ZIP…":"Descargar paquete ZIP"}</button>
          <p className="text-xs text-slate-400">El ZIP incluye solo los gráficos públicos a los que hayas subido una imagen en esta sesión.</p>
        </section>
        <section className="min-w-0 space-y-4">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#030717] p-4 md:p-6"><div className="mb-4 flex items-center justify-between text-xs text-slate-300"><span>Vista previa</span><span>{t.width} × {t.height} px</span></div>
            <div className="flex min-h-[270px] items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(45deg,#171c2a_25%,transparent_25%,transparent_75%,#171c2a_75%),linear-gradient(45deg,#171c2a_25%,#0c1221_25%,#0c1221_75%,#171c2a_75%)] bg-[length:24px_24px] bg-[position:0_0,12px_12px]">{editor ? <StreamPackAreaEditor background={preview || assets[t.id]} imageWidth={t.width} imageHeight={t.height} area={activeZone||t.area} onChange={rect=>updateArea(rect)} zones={t.zones} selectedId={zoneId} onSelect={setZoneId}/> : preview?<img src={preview} alt="Vista previa del gráfico generado" className="max-h-[610px] w-full object-contain"/>:<span>Preparando vista previa…</span>}</div>
            <p className="mt-3 text-xs text-slate-400">La cuadrícula representa transparencia. Para obtener un marco real, carga una plantilla PNG transparente.</p>
          </div>
          {editor&&<div className="space-y-4 rounded-3xl border border-[#F05E07]/30 bg-white/[.045] p-5">
            <div className="flex flex-wrap justify-between gap-2"><h2 className="font-bold">Editor local de gráficos</h2><button onClick={createTemplate} className="text-sm text-[#F05E07]">+ Nueva plantilla</button></div>
            <p className="text-xs text-amber-200">Edita las zonas directamente sobre la vista previa superior. Los PNG permanecen solo durante esta sesión. Exporta un JSON para conservar posiciones y márgenes; no incluye imágenes ni habilita descargas privadas.</p>
            <div className="flex flex-wrap gap-2"><button onClick={saveConfiguration} className="rounded-lg bg-blue-700 px-3 py-2 text-sm">Exportar configuración JSON</button><label className="cursor-pointer rounded-lg border border-blue-500/50 px-3 py-2 text-sm">Importar configuración<input type="file" accept=".json,application/json" className="hidden" onChange={e=>void loadConfiguration(e.target.files?.[0])}/></label></div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/25 p-3 text-sm"><ImagePlus size={18}/> Subir fondo PNG / JPG <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e=>upload(e.target.files?.[0])}/></label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/25 p-3 text-sm"><Type size={18}/> Cargar fuente TTF / OTF <input type="file" accept=".ttf,.otf,font/ttf,font/otf" className="hidden" onChange={e=>void fontUpload(e.target.files?.[0])}/></label>
            <label className="block text-sm">Nombre de plantilla<input className="mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-2" value={t.name} onChange={e=>update({name:e.target.value})}/></label>
            <div className="flex flex-wrap gap-2"><button onClick={()=>addZone("nickname","Nickname")} className="rounded-lg border border-white/20 px-3 py-2 text-xs">+ Nickname</button><button onClick={()=>addZone("soul","SOUL")} className="rounded-lg border border-white/20 px-3 py-2 text-xs">+ SOUL</button>{["Twitch","TikTok","YouTube","Instagram"].map(net=><button key={net} onClick={()=>addZone("social",net)} className="rounded-lg border border-white/20 px-3 py-2 text-xs">+ {net}</button>)}</div>
            <div className="flex flex-wrap gap-2">{t.zones?.map(z=><button key={z.id} onClick={()=>setZoneId(z.id)} className={`rounded-lg border px-3 py-2 text-xs ${zoneId===z.id?"border-orange-500 text-orange-400":"border-white/20"}`}>{z.label}</button>)}{activeZone&&<button onClick={removeZone} className="rounded-lg border border-red-400/30 px-3 py-2 text-xs text-red-300">Eliminar zona</button>}</div>
            
            <div className="space-y-3 rounded-xl border border-white/10 p-3">
              <label className="block text-xs font-semibold text-slate-200">Tipografía</label>
              <select value={fontFamily} onChange={e=>setFontFamily(e.target.value)} className="w-full rounded-lg border border-white/20 bg-[#07122c] p-3 text-sm text-white">
                {["Arial","SoulUploadedFont","Anton","Barlow Condensed","Bebas Neue","Oswald","Rajdhani","Roboto Condensed"].map(font=><option key={font} value={font}>{font==="SoulUploadedFont"?"The Soul Nation (fuente cargada)":font}</option>)}
              </select>
              <p className="text-xs text-slate-400">La fuente oficial aparece después de cargar su archivo TTF. Las Google Fonts requieren conexión.</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-lg border border-white/20 px-2 py-2 text-xs hover:bg-white/10" onClick={()=>updateArea({x:Math.round((t.width-(activeZone||t.area).width)/2),align:"center"})}>Centrar horizontal</button>
                <button className="rounded-lg border border-white/20 px-2 py-2 text-xs hover:bg-white/10" onClick={()=>updateArea({y:Math.round((t.height-(activeZone||t.area).height)/2)})}>Centrar vertical</button>
                <button className="rounded-lg border border-[#F05E07]/50 px-2 py-2 text-xs hover:bg-orange-500/10" onClick={()=>updateArea({x:Math.round((t.width-(activeZone||t.area).width)/2),y:Math.round((t.height-(activeZone||t.area).height)/2),align:"center"})}>Centrar al lienzo</button>
                <button className="rounded-lg border border-white/20 px-2 py-2 text-xs hover:bg-white/10" onClick={()=>updateArea({align:"center"})}>Centrar en la zona</button>
              </div>
              <p className="text-xs text-slate-400">Cambia el área arrastrando sus bordes directamente sobre la vista previa.</p>
              {([
                 {key:"minFont",label:"Tamaño mínimo",max:Math.max(20,(activeZone||t.area).maxFont)},
                 {key:"maxFont",label:"Tamaño máximo",max:Math.max(120,Math.round(t.height/3))},
                 {key:"padding",label:"Margen interior seguro",max:Math.max(8,Math.round(Math.min((activeZone||t.area).width,(activeZone||t.area).height)/2-1))}
              ] as const).map(control=><label key={control.key} className="block space-y-2 text-xs text-slate-300">
                <span>{control.label}</span>
                <input type="range" min={control.key==="padding"?0:1} max={control.max} value={control.key==="padding" ? ((activeZone||t.area).padding??8) : (activeZone||t.area)[control.key]} onChange={e=>updateArea({[control.key]:Number(e.target.value)} as Partial<Area>)} className="w-full accent-[#F05E07]"/>
              </label>)}
              <div className="flex gap-2">
                <button className="flex-1 rounded-lg border border-white/20 px-2 py-2 text-xs" onClick={()=>setNickname("Soul Emi X")}>Probar nombre corto</button>
                <button className="flex-1 rounded-lg border border-white/20 px-2 py-2 text-xs" onClick={()=>setNickname("Soul Maverick z")}>Probar nombre largo</button>
              </div>
              <button onClick={()=>setAdvanced(p=>!p)} className="text-xs text-slate-400 underline">{advanced?"Ocultar controles precisos":"Mostrar controles precisos (avanzado)"}</button>
              {advanced&&<div className="grid grid-cols-2 gap-3">{(["x","y","width","height","maxFont","minFont"] as const).map(key=><label key={key} className="text-xs text-slate-300">{key}<input type="number" value={(activeZone||t.area)[key]} onChange={e=>setNumber(key,Number(e.target.value))} className="mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-2 text-white"/></label>)}</div>}
            </div>
            <div className="flex items-center justify-between gap-3"><label className="text-sm">Color <input type="color" value={(activeZone||t.area).color} onChange={e=>updateArea({color:e.target.value})}/></label><label className="text-sm">Alineación <select value={(activeZone||t.area).align} onChange={e=>updateArea({align:e.target.value as Area["align"]})} className="rounded-lg bg-[#07122c] p-2"><option value="left">Izquierda</option><option value="center">Centro</option><option value="right">Derecha</option></select></label></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={guides} onChange={e=>setGuides(e.target.checked)}/><MoveHorizontal size={16}/> Mostrar márgenes en la vista previa</label>
          </div>}
          <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4 text-sm text-slate-300"><ShieldCheck className="shrink-0 text-[#F05E07]"/><p><strong className="text-white">Paquetes exclusivos:</strong> la descarga protegida para miembros oficiales se habilitará tras conectar una verificación de identidad y permisos del servidor. El editor de esta versión no es un panel administrativo persistente.</p></div>
          {message&&<p role="status" className="text-sm text-amber-200">{message}</p>}
        </section>
      </div>
    </div>
  </main>;
}
