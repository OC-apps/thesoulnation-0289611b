import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, ImagePlus, Type, ShieldCheck, MoveHorizontal, ArrowLeft, Package } from "lucide-react";
import { buildZip } from "@/lib/streampack-zip";

export const Route = createFileRoute("/streampack")({
  head: () => ({ meta: [
    { title: "StreamPack Studio | The Soul Nation" },
    { name: "description", content: "Personaliza gráficos para tus transmisiones con nicknames ajustados automáticamente." },
  ] }),
  component: StreamPackStudio,
});

type Area = { x: number; y: number; width: number; height: number; maxFont: number; minFont: number; color: string; align: "center" | "left" | "right" };
type Template = { id: string; name: string; width: number; height: number; area: Area; category: string; membersOnly: boolean };
const START: Template[] = [
  { id:"webcam", name:"Webcam horizontal", width:1920, height:1080, category:"Webcam", membersOnly:false,
    area:{x:480,y:914,width:960,height:104,maxFont:105,minFont:14,color:"#FFFFFF",align:"center"} },
  { id:"vertical", name:"Transmisión vertical", width:1080, height:1920, category:"TikTok", membersOnly:false,
    area:{x:120,y:1650,width:840,height:135,maxFont:135,minFont:14,color:"#FFFFFF",align:"center"} },
];
const safeName = (name:string) => (name.trim().replace(/[^a-z0-9-_]+/gi,"_").slice(0,64) || "Streamer");
const loadImage = (src:string):Promise<HTMLImageElement> => new Promise((resolve,reject) => {
  const image=new Image(); image.onload=()=>resolve(image); image.onerror=reject; image.src=src;
});
async function render(template:Template, nickname:string, asset:string|undefined, fontFamily:string, showGuides:boolean) {
  const canvas=document.createElement("canvas"); canvas.width=template.width; canvas.height=template.height;
  const context=canvas.getContext("2d"); if(!context) throw Error("Canvas no disponible");
  if (asset) { const image=await loadImage(asset); context.drawImage(image,0,0,canvas.width,canvas.height); }
  const a=template.area; const displayName=nickname.trim().toUpperCase() || "NICKNAME";
  let low=4, high=Math.max(5,a.maxFont);
  const permittedWidth=Math.max(1,a.width-16); const permittedHeight=Math.max(1,a.height-12);
  for(let i=0;i<24;i++) {
    const mid=(low+high)/2;
    context.font=`900 italic ${mid}px "${fontFamily}", Arial, sans-serif`;
    const measure=context.measureText(displayName);
    const height=(measure.actualBoundingBoxAscent || mid*.85)+(measure.actualBoundingBoxDescent || mid*.25);
    if(measure.width<=permittedWidth && height<=permittedHeight)low=mid; else high=mid;
  }
  context.font=`900 italic ${low}px "${fontFamily}", Arial, sans-serif`;
  context.textAlign=a.align; context.textBaseline="middle"; context.fillStyle=a.color;
  const x=a.align==="left"?a.x+8:a.align==="right"?a.x+a.width-8:a.x+a.width/2;
  context.fillText(displayName,x,a.y+a.height/2);
  if(showGuides){context.strokeStyle="#F05E07";context.lineWidth=Math.max(2,canvas.width/480);context.setLineDash([14,10]);context.strokeRect(a.x,a.y,a.width,a.height);}
  return canvas;
}
function StreamPackStudio(){
  const [nickname,setNickname]=useState("Soul Maverick z");
  const [templates,setTemplates]=useState<Template[]>(START);
  const [selected,setSelected]=useState("webcam");
  const [assets,setAssets]=useState<Record<string,string>>({});
  const [fontFamily,setFontFamily]=useState("Arial");
  const [preview,setPreview]=useState("");
  const [guides,setGuides]=useState(false);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  const [editor,setEditor]=useState(false);
  const [packBusy,setPackBusy]=useState(false);
  const t=templates.find(item=>item.id===selected) || templates[0];
  const update=(patch:Partial<Template>)=>setTemplates(current=>current.map(x=>x.id===t.id?{...x,...patch}:x));
  const updateArea=(patch:Partial<Area>)=>update({area:{...t.area,...patch}});
  useEffect(()=>{let active=true;render(t,nickname,assets[t.id],fontFamily,guides).then(c=>{if(active)setPreview(c.toDataURL("image/png"));}).catch(()=>{if(active)setMessage("No se pudo generar la vista previa.");});return()=>{active=false};},[t,nickname,assets,fontFamily,guides]);
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
      const c=await render(t,nickname,assets[t.id],fontFamily,false);
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
        const canvas=await render(item,nickname,assets[item.id],fontFamily,false);
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
          <div><h2 className="mb-3 text-sm font-semibold">Selecciona tu gráfico</h2><div className="space-y-2">{templates.filter(x=>!x.membersOnly).map(item=><button type="button" key={item.id} onClick={()=>setSelected(item.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${t.id===item.id?"border-[#F05E07] bg-[#F05E07]/10":"border-white/10 bg-white/5 hover:bg-white/10"}`}><span>{item.name}</span><span className="text-xs text-slate-400">{item.width}×{item.height}</span></button>)}</div></div>
          <button onClick={()=>setEditor(p=>!p)} className="w-full rounded-xl border border-blue-400/40 px-4 py-3 text-sm font-semibold hover:bg-blue-500/10">{editor?"Cerrar editor local":"Abrir editor de plantilla"}</button>
          <button onClick={download} disabled={busy || !nickname.trim() || !assets[t.id]} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F05E07] px-4 py-3 font-bold text-[#080b20] disabled:opacity-50"><Download size={18}/> {busy?"Generando…":"Descargar PNG"}</button>
          <button onClick={downloadPack} disabled={packBusy || !nickname.trim() || !templates.some(item=>!item.membersOnly && Boolean(assets[item.id]))} className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/50 bg-blue-600/20 px-4 py-3 font-bold text-white disabled:opacity-40"><Package size={18}/> {packBusy?"Preparando ZIP…":"Descargar paquete ZIP"}</button>
          <p className="text-xs text-slate-400">El ZIP incluye solo los gráficos públicos a los que hayas subido una imagen en esta sesión.</p>
        </section>
        <section className="min-w-0 space-y-4">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#030717] p-4 md:p-6"><div className="mb-4 flex items-center justify-between text-xs text-slate-300"><span>Vista previa</span><span>{t.width} × {t.height} px</span></div>
            <div className="flex min-h-[270px] items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(45deg,#171c2a_25%,transparent_25%,transparent_75%,#171c2a_75%),linear-gradient(45deg,#171c2a_25%,#0c1221_25%,#0c1221_75%,#171c2a_75%)] bg-[length:24px_24px] bg-[position:0_0,12px_12px]">{preview?<img src={preview} alt="Vista previa del gráfico generado" className="max-h-[610px] w-full object-contain"/>:<span>Preparando vista previa…</span>}</div>
            <p className="mt-3 text-xs text-slate-400">La cuadrícula representa transparencia. Para obtener un marco real, carga una plantilla PNG transparente.</p>
          </div>
          {editor&&<div className="space-y-4 rounded-3xl border border-[#F05E07]/30 bg-white/[.045] p-5">
            <div className="flex flex-wrap justify-between gap-2"><h2 className="font-bold">Editor local de gráficos</h2><button onClick={createTemplate} className="text-sm text-[#F05E07]">+ Nueva plantilla</button></div>
            <p className="text-xs text-amber-200">Los archivos cargados aquí solo permanecen durante esta sesión. Esta herramienta todavía no publica diseños ni concede acceso a paquetes exclusivos.</p>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/25 p-3 text-sm"><ImagePlus size={18}/> Subir fondo PNG / JPG <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e=>upload(e.target.files?.[0])}/></label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/25 p-3 text-sm"><Type size={18}/> Cargar fuente TTF / OTF <input type="file" accept=".ttf,.otf,font/ttf,font/otf" className="hidden" onChange={e=>void fontUpload(e.target.files?.[0])}/></label>
            <label className="block text-sm">Nombre de plantilla<input className="mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-2" value={t.name} onChange={e=>update({name:e.target.value})}/></label>
            <div className="grid grid-cols-2 gap-3">{(["x","y","width","height","maxFont","minFont"] as const).map(key=><label key={key} className="text-xs uppercase text-slate-300">{({x:"Margen izquierdo",y:"Margen superior",width:"Ancho de texto",height:"Alto de texto",maxFont:"Tamaño máximo",minFont:"Tamaño mínimo"} as const)[key]}<input type="number" value={t.area[key]} onChange={e=>setNumber(key,Number(e.target.value))} className="mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-2 text-base text-white"/></label>)}</div>
            <div className="flex items-center justify-between gap-3"><label className="text-sm">Color <input type="color" value={t.area.color} onChange={e=>updateArea({color:e.target.value})}/></label><label className="text-sm">Alineación <select value={t.area.align} onChange={e=>updateArea({align:e.target.value as Area["align"]})} className="rounded-lg bg-[#07122c] p-2"><option value="left">Izquierda</option><option value="center">Centro</option><option value="right">Derecha</option></select></label></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={guides} onChange={e=>setGuides(e.target.checked)}/><MoveHorizontal size={16}/> Mostrar márgenes en la vista previa</label>
          </div>}
          <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4 text-sm text-slate-300"><ShieldCheck className="shrink-0 text-[#F05E07]"/><p><strong className="text-white">Paquetes exclusivos:</strong> la descarga protegida para miembros oficiales se habilitará tras conectar una verificación de identidad y permisos del servidor. El editor de esta versión no es un panel administrativo persistente.</p></div>
          {message&&<p role="status" className="text-sm text-amber-200">{message}</p>}
        </section>
      </div>
    </div>
  </main>;
}
