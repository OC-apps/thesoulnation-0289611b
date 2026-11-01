import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, ImagePlus, Type, ShieldCheck, MoveHorizontal, ArrowLeft, Package } from "lucide-react";
import { buildZip } from "@/lib/streampack-zip";
import { StreamPackAreaEditor } from "@/components/streampack-area-editor";
import { useRoster } from "@/hooks/use-roster";
import { useWavesMembers } from "@/hooks/use-waves-members";
import { CURRENT_WAVES } from "@/lib/roster-current";

export const Route = createFileRoute("/streampack")({
  head: () => ({ links:[{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:ital,wght@1,700;1,900&family=Bebas+Neue&family=Oswald:wght@700&family=Rajdhani:wght@700&family=Roboto+Condensed:ital,wght@1,900&display=swap"}], meta: [
    { title: "StreamPack Studio | The Soul Nation" },
    { name: "description", content: "Personaliza gráficos para tus transmisiones con nicknames ajustados automáticamente." },
  ] }),
  component: StreamPackStudio,
});

type Area = { x: number; y: number; width: number; height: number; maxFont: number; minFont: number; color: string; padding?: number; align: "center" | "left" | "right" };
type Zone = Area & { id:string; label:string; kind:"nickname"|"social"|"soul"|"custom"; text?:string; hidden?:boolean; locked?:boolean }; 
type Template = { assetPath?:string; zones?:Zone[]; id: string; name: string; width: number; height: number; area: Area; category: string; membersOnly: boolean };
const START: Template[] = [
{id:"avi",name:"AVI",width:2048,height:2048,category:"avi",membersOnly:false,assetPath:"/streampack/templates/TSN_AVI_1x1.png",area:{x:410,y:1679,width:1229,height:246,maxFont:164,minFont:8,color:"#FFFFFF",align:"center"},zones:[{id:"nickname",kind:"nickname" as const,label:"Nickname",x:410,y:1679,width:1229,height:246,maxFont:164,minFont:8,color:"#FFFFFF",align:"center" as const}]},
{id:"4cams",name:"Cuatro invitados",width:1920,height:1080,category:"4cams",membersOnly:false,assetPath:"/streampack/templates/TSN_Overlay_16x9_4Cams.png",area:{x:384,y:886,width:1152,height:130,maxFont:86,minFont:8,color:"#FFFFFF",align:"center"},zones:[0,1,2,3].map(i=>({id:`guest-${i+1}`,kind:"custom" as const,label:`Invitado ${i+1}`,text:`Invitado ${i+1}`,x:130+i*455,y:930,width:390,height:70,maxFont:60,minFont:8,color:"#FFFFFF",align:"center" as const}))},
{id:"tsn-3",name:"Iniciamos · Horizontal",width:1920,height:1080,category:"static",membersOnly:false,assetPath:"/streampack/templates/TSN_Iniciamos_16X9.png",area:{x:384,y:886,width:1152,height:130,maxFont:86,minFont:8,color:"#FFFFFF",align:"center"},zones:[]},
{id:"tsn-4",name:"Iniciamos · Vertical",width:941,height:1672,category:"static",membersOnly:false,assetPath:"/streampack/templates/TSN_Iniciamos_9x16.png",area:{x:188,y:1371,width:565,height:201,maxFont:134,minFont:8,color:"#FFFFFF",align:"center"},zones:[]},
{id:"tsn-5",name:"Regresamos",width:1920,height:1080,category:"static",membersOnly:false,assetPath:"/streampack/templates/TSN_Regresamos_16X9.png",area:{x:384,y:886,width:1152,height:130,maxFont:86,minFont:8,color:"#FFFFFF",align:"center"},zones:[]},
{id:"tsn-6",name:"Finalizamos",width:1920,height:1080,category:"static",membersOnly:false,assetPath:"/streampack/templates/TSN_Finalizada_16X9.png",area:{x:384,y:886,width:1152,height:130,maxFont:86,minFont:8,color:"#FFFFFF",align:"center"},zones:[]},
{id:"tsn-7",name:"Overlay horizontal · Cámara",width:1920,height:1080,category:"editable",membersOnly:false,assetPath:"/streampack/templates/TSN_Overlay_16x9_Cam.png",area:{x:384,y:886,width:1152,height:130,maxFont:86,minFont:8,color:"#FFFFFF",align:"center"},zones:[{id:"nickname",kind:"nickname" as const,label:"Nickname",x:384,y:886,width:1152,height:130,maxFont:86,minFont:8,color:"#FFFFFF",align:"center" as const}]},
{id:"tsn-8",name:"Overlay horizontal · Sin cámara",width:1920,height:1080,category:"editable",membersOnly:false,assetPath:"/streampack/templates/TSN_Overlay_16x9_NoCam.png",area:{x:384,y:886,width:1152,height:130,maxFont:86,minFont:8,color:"#FFFFFF",align:"center"},zones:[{id:"nickname",kind:"nickname" as const,label:"Nickname",x:384,y:886,width:1152,height:130,maxFont:86,minFont:8,color:"#FFFFFF",align:"center" as const}]},
{id:"tsn-9",name:"Overlay vertical · Cámara",width:941,height:1672,category:"editable",membersOnly:false,assetPath:"/streampack/templates/TSN_Overlay_9x16_Cam.png",area:{x:188,y:1371,width:565,height:201,maxFont:134,minFont:8,color:"#FFFFFF",align:"center"},zones:[{id:"nickname",kind:"nickname" as const,label:"Nickname",x:188,y:1371,width:565,height:201,maxFont:134,minFont:8,color:"#FFFFFF",align:"center" as const}]},
{id:"tsn-10",name:"Overlay vertical · Cámara 2",width:941,height:1672,category:"editable",membersOnly:false,assetPath:"/streampack/templates/TSN_Overlay_9x16_Cam_V02.png",area:{x:188,y:1371,width:565,height:201,maxFont:134,minFont:8,color:"#FFFFFF",align:"center"},zones:[{id:"nickname",kind:"nickname" as const,label:"Nickname",x:188,y:1371,width:565,height:201,maxFont:134,minFont:8,color:"#FFFFFF",align:"center" as const}]},
{id:"tsn-11",name:"Overlay vertical · Sin cámara",width:1080,height:1920,category:"editable",membersOnly:false,assetPath:"/streampack/templates/TSN_Overlay_9x16_NoCam.png",area:{x:216,y:1574,width:648,height:230,maxFont:154,minFont:8,color:"#FFFFFF",align:"center"},zones:[{id:"nickname",kind:"nickname" as const,label:"Nickname",x:216,y:1574,width:648,height:230,maxFont:154,minFont:8,color:"#FFFFFF",align:"center" as const}]},
{id:"tsn-12",name:"Overlay vertical · Sin cámara 2",width:1080,height:1920,category:"editable",membersOnly:false,assetPath:"/streampack/templates/TSN_Overlay_9x16_NoCam_V02.png",area:{x:216,y:1574,width:648,height:230,maxFont:154,minFont:8,color:"#FFFFFF",align:"center"},zones:[{id:"nickname",kind:"nickname" as const,label:"Nickname",x:216,y:1574,width:648,height:230,maxFont:154,minFont:8,color:"#FFFFFF",align:"center" as const}]},
{id:"tsn-13",name:"Webcam 16:9",width:1672,height:941,category:"editable",membersOnly:false,assetPath:"/streampack/templates/TSN_Webcam_16x9.png",area:{x:334,y:772,width:1003,height:113,maxFont:75,minFont:8,color:"#FFFFFF",align:"center"},zones:[{id:"nickname",kind:"nickname" as const,label:"Nickname",x:334,y:772,width:1003,height:113,maxFont:75,minFont:8,color:"#FFFFFF",align:"center" as const}]},
{id:"tsn-14",name:"Webcam · Barra",width:1920,height:600,category:"editable",membersOnly:false,assetPath:"/streampack/templates/TSN_Webcam_16x9 (2).png",area:{x:384,y:492,width:1152,height:72,maxFont:48,minFont:8,color:"#FFFFFF",align:"center"},zones:[{id:"nickname",kind:"nickname" as const,label:"Nickname",x:384,y:492,width:1152,height:72,maxFont:48,minFont:8,color:"#FFFFFF",align:"center" as const}]}
];
const safeName = (name:string) => (name.trim().replace(/[^a-z0-9-_]+/gi,"_").slice(0,64) || "Streamer");
const loadImage = (src:string):Promise<HTMLImageElement> => new Promise((resolve,reject) => {
  const image=new Image(); image.onload=()=>resolve(image); image.onerror=reject; image.src=src;
});
async function render(template:Template, nickname:string, asset:string|undefined, fontFamily:string, showGuides:boolean, socials:Record<string,string>={}) {
  const canvas=document.createElement("canvas"); canvas.width=template.width; canvas.height=template.height;
  const context=canvas.getContext("2d"); if(!context) throw Error("Canvas no disponible");
  if (asset) { const image=await loadImage(asset); context.drawImage(image,0,0,canvas.width,canvas.height); }
  const a=template.area; const displayName=nickname.trim().toUpperCase().replace(/^SOUL\s+/i,"") || "NICKNAME";
  await document.fonts.load(`900 italic 40px "${fontFamily}"`);
  const drawText=(a:Area,label:string,highlightFinal=false)=>{
  if(!label.trim())return;
  const inset=Math.min((a.padding??8),Math.max(0,Math.min(a.width,a.height)/2-1));
  let low=1, high=Math.max(2,a.maxFont);
  let permittedWidth=Math.max(1,a.width-2*inset); const permittedHeight=Math.max(1,a.height-2*inset);
  // Xbox displays the square AVI as a circle. The 5% inset is a non-exported safe margin.
  // Use the narrowest horizontal chord at the zone's top/bottom to avoid clipping.
  let textCenterX=a.x+a.width/2;
  if(template.id==="avi"){
    const cx=template.width/2,cy=template.height/2,r=Math.min(template.width,template.height)*0.45;
    const textY=a.y+a.height/2;
    const maxDy=Math.max(Math.abs(a.y+inset-cy),Math.abs(a.y+a.height-inset-cy));
    const chord=2*Math.sqrt(Math.max(0,r*r-maxDy*maxDy));
    const chordWidth=Math.max(1,chord-2*inset);
    const chordLeft=cx-chordWidth/2,chordRight=cx+chordWidth/2;
    const zoneLeft=Math.max(a.x+inset,chordLeft),zoneRight=Math.min(a.x+a.width-inset,chordRight);
    permittedWidth=Math.max(1,zoneRight-zoneLeft);
    textCenterX=(zoneLeft+zoneRight)/2;
    if(Math.abs(textY-cy)>=r || zoneRight<=zoneLeft)return;
  }
  for(let i=0;i<24;i++) {
    const mid=(low+high)/2;
    context.font=`900 italic ${mid}px "${fontFamily}", Arial, sans-serif`;
    const measure=context.measureText(label);
    const height=(measure.actualBoundingBoxAscent || mid*.85)+(measure.actualBoundingBoxDescent || mid*.25);
    if(measure.width<=permittedWidth && height<=permittedHeight)low=mid; else high=mid;
  }
  context.font=`900 italic ${low}px "${fontFamily}", Arial, sans-serif`;
  context.textAlign=template.id==="avi"?"center":a.align;
  context.textBaseline="bottom";
  const textY=a.y+a.height-inset;
  context.fillStyle=a.color;
  const x=template.id==="avi"?textCenterX:a.align==="left"?a.x+inset:a.align==="right"?a.x+a.width-inset:a.x+a.width/2;
  const pieces=highlightFinal ? label.match(/^(.*\S)\s+([A-Z])$/i) : null;
  if(pieces){const left=pieces[1]+" ",right=pieces[2];const allWidth=context.measureText(label).width;const leftWidth=context.measureText(left).width;const start=template.id==="avi"||a.align==="center"?x-allWidth/2:a.align==="right"?x-allWidth:x;context.textAlign="left";context.fillStyle="#FFFFFF";context.fillText(left,start,textY);context.fillStyle="#F05E07";context.fillText(right,start+leftWidth,textY);}
  else context.fillText(label,x,textY);
  if(showGuides){context.strokeStyle="#F05E07";context.lineWidth=Math.max(2,canvas.width/480);context.setLineDash([14,10]);context.strokeRect(a.x,a.y,a.width,a.height);context.setLineDash([]);}
  };

  if(template.zones){
    for(const zone of template.zones){
      if(zone.hidden)continue;
      if(zone.kind==="nickname")drawText(zone,displayName,true);
      else if(zone.kind==="soul")drawText(zone,"SOUL");
      else if(zone.kind==="social")drawText(zone,socials[zone.label]||"");
      else if(zone.kind==="custom")drawText(zone,zone.text||"");
    }
  }else drawText(a,displayName,true);
  return canvas;
}
function StreamPackStudio(){
  const roster=useRoster();
  const waves=useWavesMembers();
  const rosterOptions=[...new Set([...CURRENT_WAVES,...waves.map(m=>m.name.toUpperCase()),...roster.all.map(m=>m.nickname.toUpperCase())])].filter(name=>name.startsWith("SOUL ")&&name.length<70).sort((a,b)=>a.localeCompare(b));
  const [selectedMember,setSelectedMember]=useState("");
  const [memberSearch,setMemberSearch]=useState("");
  const selectedIsOfficial=rosterOptions.includes(selectedMember);
  const chosenName=selectedIsOfficial?selectedMember.replace(/^SOUL\s+/i,"").trim():"";
  const [socials,setSocials]=useState<Record<string,string>>({Twitch:"",TikTok:"",YouTube:"",Instagram:""});
  const [zoneId,setZoneId]=useState("nickname");
  const [templates,setTemplates]=useState<Template[]>(START.map(t=>({...t,area:{...t.area},zones:t.zones?.map(z=>({...z}))})));
  const [selected,setSelected]=useState("avi");
  const [assets,setAssets]=useState<Record<string,string>>({});
  const [available,setAvailable]=useState<Record<string,boolean>>({});
  useEffect(()=>{let cancelled=false;Promise.all(START.map(async item=>{try{const response=await fetch(item.assetPath||"",{method:"HEAD"});return [item.id,response.ok] as const;}catch{return [item.id,false] as const;}})).then(entries=>{if(!cancelled)setAvailable(Object.fromEntries(entries));});return()=>{cancelled=true;};},[]);
  const [fontFamily,setFontFamily]=useState("The Soul Nation");
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
  const updateZone=(patch:Partial<Zone>)=>{if(!activeZone)return;update({zones:t.zones!.map(z=>z.id===zoneId?{...z,...patch}:z)});};
  const updateArea=(patch:Partial<Area>)=>activeZone ? (activeZone.locked?undefined:update({zones:t.zones!.map(z=>z.id===zoneId?{...z,...patch}:z)})) : update({area:{...t.area,...patch}});
  const addZone=(kind:Zone["kind"],label:string)=>{const id=`zone-${Date.now()}`;update({zones:[...(t.zones||[{...t.area,id:"nickname",kind:"nickname" as const,label:"Nickname"}]),{...t.area,id,kind,label,text:kind==="custom"?"Nuevo texto":undefined,x:Math.round(t.width*.12),y:Math.round(t.height*.35),width:Math.round(t.width*.35),height:Math.round(t.height*.07)}]});setZoneId(id);};
  const duplicateZone=()=>{if(!activeZone)return;const id=`zone-${Date.now()}`;update({zones:[...t.zones!,{...activeZone,id,label:`${activeZone.label} copia`,x:Math.min(t.width-activeZone.width,activeZone.x+24),y:Math.min(t.height-activeZone.height,activeZone.y+24)}]});setZoneId(id);};
  const reorderZone=(direction:-1|1)=>{if(!activeZone||!t.zones)return;const current=t.zones.findIndex(z=>z.id===zoneId),target=current+direction;if(target<0||target>=t.zones.length)return;const next=[...t.zones];[next[current],next[target]]=[next[target],next[current]];update({zones:next});};
  const removeZone=()=>{if(!activeZone)return;update({zones:t.zones!.filter(z=>z.id!==zoneId)});setZoneId("nickname");};
  useEffect(()=>{let active=true;render(t,chosenName,(assets[t.id]||(available[t.id]?t.assetPath:undefined)),fontFamily,guides,socials).then(c=>{if(active)setPreview(c.toDataURL("image/png"));}).catch(()=>{if(active)setMessage("No se pudo generar la vista previa.");});return()=>{active=false};},[t,chosenName,assets,available,fontFamily,guides,socials]);
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
      if(!selectedIsOfficial)throw Error("Selecciona un integrante del roster oficial.");
      const c=await render(t,chosenName,(assets[t.id]||(available[t.id]?t.assetPath:undefined)),fontFamily,false,socials);
      const blob=await new Promise<Blob|null>(resolve=>c.toBlob(resolve,"image/png"));
      if(!blob)throw Error("No se pudo crear el PNG");
      const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${safeName(chosenName)}_${t.id}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
    }catch(e){setMessage(e instanceof Error?e.message:"Error de exportación");}finally{setBusy(false);}
  };
  const downloadPack=async()=>{
    setPackBusy(true);setMessage("");
    try{
      if(!selectedIsOfficial)throw Error("Selecciona un integrante del roster oficial.");
      const valid=templates.filter(item=>!item.membersOnly && Boolean(assets[item.id]||available[item.id]));
      if(!valid.length)throw Error("Sube primero al menos un gráfico PNG en el editor para generar el paquete.");
      const files:{name:string;bytes:Uint8Array}[]=[];
      for(const item of valid){
        const canvas=await render(item,chosenName,(assets[item.id]||(available[item.id]?item.assetPath:undefined)),fontFamily,false,socials);
        const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/png"));
        if(!blob)throw Error("No se pudo generar "+item.name);
        files.push({name:`${item.category}/${safeName(chosenName)}_${item.id}.png`,bytes:new Uint8Array(await blob.arrayBuffer())});
      }
      const zip=buildZip(files);const url=URL.createObjectURL(zip);const a=document.createElement("a");
      a.href=url;a.download=`TheSoulNation_${safeName(chosenName)}_StreamPack.zip`;a.click();
      setTimeout(()=>URL.revokeObjectURL(url),3000);
      setMessage(`Paquete generado: ${files.length} gráfico(s) con fondo cargado.`);
    }catch(e){setMessage(e instanceof Error?e.message:"No se pudo generar el paquete.");}
    finally{setPackBusy(false);}
  };
  const saveConfiguration=()=>{
    const json=JSON.stringify({version:2,scope:"all-templates",exportedAt:new Date().toISOString(),templates},null,2);
    const url=URL.createObjectURL(new Blob([json],{type:"application/json"}));
    const link=document.createElement("a");link.href=url;link.download="TSN_StreamPack_CONFIGURACION_COMPLETA.json";link.click();
    setTimeout(()=>URL.revokeObjectURL(url),2000);
    setMessage(`Se exportaron las ${templates.length} plantillas con todas sus capas. El JSON no contiene los archivos PNG ni las fuentes TTF.`);
  };
  const loadConfiguration=async(file?:File)=>{
    if(!file)return;
    try{
      if(file.size>2_000_000)throw Error("Archivo demasiado grande para una configuración.");
      const data=JSON.parse(await file.text());
      if(![1,2].includes(data.version)||!Array.isArray(data.templates)||!data.templates.length||data.templates.length>100)throw Error("Archivo de configuración incompatible.");
      const incoming:Template[]=data.templates.map((item:Template)=>{
        if(!item||typeof item.id!=="string"||!item.id||typeof item.name!=="string"||!Number.isInteger(item.width)||!Number.isInteger(item.height)||item.width<1||item.width>8192||item.height<1||item.height>8192||!Array.isArray(item.zones)||item.zones.length>100)throw Error("Una plantilla tiene datos inválidos.");
        const zones=item.zones.map(z=>{
          if(!z||typeof z.id!=="string"||typeof z.label!=="string"||!["nickname","soul","social","custom"].includes(z.kind)||!["left","center","right"].includes(z.align)||!Number.isFinite(z.x)||!Number.isFinite(z.y)||!Number.isFinite(z.width)||!Number.isFinite(z.height)||z.width<=0||z.height<=0||!Number.isFinite(z.maxFont)||z.maxFont<=0||typeof z.color!=="string"||!/^#[0-9a-f]{6}$/i.test(z.color))throw Error("Una capa contiene datos inválidos.");
          const {verticalAlign: _ignored,...cleanZone}=z as Zone & {verticalAlign?:string};return {...cleanZone,x:Math.max(0,Math.min(z.x,item.width-1)),y:Math.max(0,Math.min(z.y,item.height-1)),width:Math.min(z.width,item.width),height:Math.min(z.height,item.height)};
        });
        return {...item,area:{...item.area},zones,assetPath:typeof item.assetPath==="string"&&item.assetPath.startsWith("/streampack/templates/")?item.assetPath:undefined,membersOnly:false};
      });
      const ids=new Set(incoming.map(x=>x.id));if(ids.size!==incoming.length)throw Error("Hay identificadores de plantilla repetidos.");
      // Preserve official templates not present in an older backup.
      setTemplates(current=>[...current.map(t=>incoming.find(x=>x.id===t.id)||t),...incoming.filter(t=>!current.some(x=>x.id===t.id))]);
      setZoneId("nickname");
      setMessage(`Configuración global importada: ${incoming.length} plantillas restauradas. Las imágenes deben existir en el sitio o cargarse por separado.`);
    }catch(e){setMessage(e instanceof Error?e.message:"No se pudo importar el JSON.");}
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
          <div className="space-y-2"><label htmlFor="soul-roster-search" className="block text-sm font-semibold">Selecciona tu gamertag del roster oficial</label>
            <input id="soul-roster-search" value={memberSearch} onChange={e=>setMemberSearch(e.target.value)} className="w-full rounded-xl border border-white/20 bg-[#07122c] px-4 py-3 text-base outline-none focus:border-[#F05E07]" placeholder="Buscar nickname…"/>
            <select aria-label="Gamertag oficial" value={selectedMember} onChange={e=>setSelectedMember(e.target.value)} className="w-full rounded-xl border border-white/20 bg-[#07122c] px-4 py-3 text-base text-white"><option value="">Elige un integrante…</option>{rosterOptions.filter(name=>name.toLowerCase().includes(memberSearch.trim().toLowerCase())).map(name=><option key={name} value={name}>{name.replace(/^SOUL\s+/i,"")}</option>)}{selectedMember&&!rosterOptions.some(name=>name===selectedMember&&name.toLowerCase().includes(memberSearch.trim().toLowerCase()))&&<option value={selectedMember}>{selectedMember.replace(/^SOUL\s+/i,"")}</option>}</select>
            <p className="text-xs text-slate-400">{selectedIsOfficial?`Seleccionado: ${chosenName}`:"Solo se pueden generar paquetes con nombres del roster oficial."}</p>
            <p className="text-xs text-amber-200">Esta selección no verifica tu identidad: cualquier visitante podría escoger el nombre de otro miembro. Para impedir suplantaciones se requiere un acceso verificado por integrante.</p></div>
          <div className="space-y-2"><h2 className="text-sm font-semibold">Redes sociales</h2>{["Twitch","TikTok","YouTube","Instagram"].map(network=><label key={network} className="block text-xs text-slate-300">{network}<input value={socials[network]||""} onChange={e=>setSocials(p=>({...p,[network]:e.target.value}))} className="mt-1 w-full rounded-lg border border-white/15 bg-[#07122c] p-2 text-base text-white" placeholder="@usuario"/></label>)}</div>
          <div><h2 className="mb-3 text-sm font-semibold">Selecciona tu gráfico</h2><div className="space-y-2">{templates.filter(x=>!x.membersOnly).map(item=><button type="button" key={item.id} onClick={()=>setSelected(item.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${t.id===item.id?"border-[#F05E07] bg-[#F05E07]/10":"border-white/10 bg-white/5 hover:bg-white/10"}`}><span>{item.name}</span><span className="text-xs text-slate-400">{assets[item.id]||available[item.id]?"Lista":"Falta PNG"} · {item.width}×{item.height}</span></button>)}</div></div>
          <button onClick={()=>setEditor(p=>!p)} className="w-full rounded-xl border border-blue-400/40 px-4 py-3 text-sm font-semibold hover:bg-blue-500/10">{editor?"Cerrar editor local":"Abrir editor de plantilla"}</button>
          <button onClick={download} disabled={busy || !selectedIsOfficial || !(assets[t.id]||available[t.id])} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F05E07] px-4 py-3 font-bold text-[#080b20] disabled:opacity-50"><Download size={18}/> {busy?"Generando…":"Descargar PNG"}</button>
          <button onClick={downloadPack} disabled={packBusy || !selectedIsOfficial || !templates.some(item=>!item.membersOnly && Boolean(assets[item.id]||available[item.id]))} className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/50 bg-blue-600/20 px-4 py-3 font-bold text-white disabled:opacity-40"><Package size={18}/> {packBusy?"Preparando ZIP…":"Descargar paquete ZIP"}</button>
          <p className="text-xs text-slate-400">El ZIP incluye solo los gráficos públicos a los que hayas subido una imagen en esta sesión.</p>
        </section>
        <section className="min-w-0 space-y-4">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#030717] p-4 md:p-6"><div className="mb-4 flex items-center justify-between text-xs text-slate-300"><span>Vista previa</span><span>{t.width} × {t.height} px</span></div>
            <div className="flex min-h-[270px] items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(45deg,#171c2a_25%,transparent_25%,transparent_75%,#171c2a_75%),linear-gradient(45deg,#171c2a_25%,#0c1221_25%,#0c1221_75%,#171c2a_75%)] bg-[length:24px_24px] bg-[position:0_0,12px_12px]">{editor ? <StreamPackAreaEditor background={preview || assets[t.id] || (available[t.id]?t.assetPath:undefined)} imageWidth={t.width} imageHeight={t.height} area={activeZone||t.area} onChange={rect=>updateArea(rect)} zones={t.zones?.filter(z=>!z.hidden)} selectedId={zoneId} onSelect={setZoneId} circleGuide={t.id==="avi"}/> : preview?<img src={preview} alt="Vista previa del gráfico generado" className="max-h-[610px] w-full object-contain"/>:<span>Preparando vista previa…</span>}</div>
            <p className="mt-3 text-xs text-slate-400">La cuadrícula representa transparencia. Para obtener un marco real, carga una plantilla PNG transparente.</p>
          </div>
          {editor&&<div className="space-y-4 rounded-3xl border border-[#F05E07]/30 bg-white/[.045] p-5">
            <div className="flex flex-wrap justify-between gap-2"><h2 className="font-bold">Editor local de gráficos</h2><button onClick={createTemplate} className="text-sm text-[#F05E07]">+ Nueva plantilla</button></div>
            <p className="text-xs text-amber-200">Edita las zonas directamente sobre la vista previa superior. Los PNG permanecen solo durante esta sesión. Exporta un JSON para conservar posiciones y márgenes; no incluye imágenes ni habilita descargas privadas.</p>
            <div className="flex flex-wrap gap-2"><button onClick={saveConfiguration} className="rounded-lg bg-blue-700 px-3 py-2 text-sm">Exportar todas las plantillas</button><label className="cursor-pointer rounded-lg border border-blue-500/50 px-3 py-2 text-sm">Importar todas las plantillas<input type="file" accept=".json,application/json" className="hidden" onChange={e=>void loadConfiguration(e.target.files?.[0])}/></label></div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/25 p-3 text-sm"><ImagePlus size={18}/> Subir fondo PNG / JPG <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e=>upload(e.target.files?.[0])}/></label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/25 p-3 text-sm"><Type size={18}/> Cargar fuente TTF / OTF <input type="file" accept=".ttf,.otf,font/ttf,font/otf" className="hidden" onChange={e=>void fontUpload(e.target.files?.[0])}/></label>
            <label className="block text-sm">Nombre de plantilla<input className="mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-2" value={t.name} onChange={e=>update({name:e.target.value})}/></label>
            <div className="flex flex-wrap gap-2"><button onClick={()=>addZone("custom","Texto libre")} className="rounded-lg bg-[#F05E07] px-3 py-2 text-xs font-semibold text-black">+ Nuevo texto</button><button onClick={()=>addZone("nickname","Nickname")} className="rounded-lg border border-white/20 px-3 py-2 text-xs">+ Nickname</button>{<button onClick={()=>addZone("soul","SOUL")} className="rounded-lg border border-white/20 px-3 py-2 text-xs">+ SOUL</button>}{["Twitch","TikTok","YouTube","Instagram"].map(net=><button key={net} onClick={()=>addZone("social",net)} className="rounded-lg border border-white/20 px-3 py-2 text-xs">+ {net}</button>)}</div>
            <div className="space-y-2 rounded-xl border border-white/15 p-3"><p className="text-sm font-semibold">Capas de texto</p>{t.zones?.map(z=><div key={z.id} className={`flex items-center gap-2 rounded-lg p-1 ${zoneId===z.id?"bg-[#F05E07]/15":"bg-white/5"}`}><button onClick={()=>setZoneId(z.id)} className="min-w-0 flex-1 truncate px-2 py-2 text-left text-xs">{z.label}</button><button title={z.hidden?"Mostrar":"Ocultar"} onClick={()=>update({zones:t.zones!.map(a=>a.id===z.id?{...a,hidden:!a.hidden}:a)})} className="px-2 text-xs">{z.hidden?"Oculto":"Visible"}</button><button title={z.locked?"Desbloquear":"Bloquear"} onClick={()=>update({zones:t.zones!.map(a=>a.id===z.id?{...a,locked:!a.locked}:a)})} className="px-2 text-xs">{z.locked?"Bloqueado":"Libre"}</button></div>)}</div>
            {activeZone&&<div className="space-y-2"><label className="block text-xs text-slate-300">Nombre de capa<input value={activeZone.label} onChange={e=>updateZone({label:e.target.value})} className="mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-2"/></label>{activeZone.kind==="custom"&&<label className="block text-xs text-slate-300">Texto<input value={activeZone.text||""} onChange={e=>updateZone({text:e.target.value})} className="mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-2"/></label>}<div className="flex flex-wrap gap-2"><button onClick={duplicateZone} className="rounded-lg border border-white/20 px-3 py-2 text-xs">Duplicar</button><button onClick={()=>reorderZone(-1)} className="rounded-lg border border-white/20 px-3 py-2 text-xs">Atrás</button><button onClick={()=>reorderZone(1)} className="rounded-lg border border-white/20 px-3 py-2 text-xs">Adelante</button><button onClick={removeZone} className="rounded-lg border border-red-400/30 px-3 py-2 text-xs text-red-300">Eliminar</button></div></div>}
            
            <div className="space-y-3 rounded-xl border border-white/10 p-3">
              <label className="block text-xs font-semibold text-slate-200">Tipografía</label>
              <select value={fontFamily} onChange={e=>setFontFamily(e.target.value)} className="w-full rounded-lg border border-white/20 bg-[#07122c] p-3 text-sm text-white">
                {["The Soul Nation","Arial","SoulUploadedFont","Anton","Barlow Condensed","Bebas Neue","Oswald","Rajdhani","Roboto Condensed"].map(font=><option key={font} value={font}>{font==="SoulUploadedFont"?"The Soul Nation (fuente cargada)":font}</option>)}
              </select>
              <p className="text-xs text-slate-400">La fuente oficial está incluida y seleccionada por defecto. Las Google Fonts requieren conexión.</p>
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
                <button className="flex-1 rounded-lg border border-white/20 px-2 py-2 text-xs" onClick={()=>setSelectedMember("SOUL EMI")}>Probar nombre corto</button>
                <button className="flex-1 rounded-lg border border-white/20 px-2 py-2 text-xs" onClick={()=>setSelectedMember("SOUL MAVERICK Z")}>Probar nombre largo</button>
              </div>
              <button onClick={()=>setAdvanced(p=>!p)} className="text-xs text-slate-400 underline">{advanced?"Ocultar controles precisos":"Mostrar controles precisos (avanzado)"}</button>
              {advanced&&<div className="grid grid-cols-2 gap-3">{(["x","y","width","height","maxFont","minFont"] as const).map(key=><label key={key} className="text-xs text-slate-300">{key}<input type="number" value={(activeZone||t.area)[key]} onChange={e=>setNumber(key,Number(e.target.value))} className="mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-2 text-white"/></label>)}</div>}
            </div>
            <p className="text-xs text-slate-400">Todos los textos están anclados al margen inferior de su zona.</p>
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
