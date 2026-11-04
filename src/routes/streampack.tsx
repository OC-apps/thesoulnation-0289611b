import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Type, ShieldCheck, MoveHorizontal, ArrowLeft, Package } from "lucide-react";
import { buildZip } from "@/lib/streampack-zip";
import soulOfficialLogo from "@/assets/soul-logo-official.png";
import { StreamPackCustomStudio } from "@/components/streampack-custom-studio";
import { StreamPackAreaEditor } from "@/components/streampack-area-editor";
import { useRoster } from "@/hooks/use-roster";
import { useWavesHidden } from "@/hooks/use-waves-hidden";
import { useWavesMembers } from "@/hooks/use-waves-members";
import { CURRENT_WAVES } from "@/lib/roster-current";
import { supabase } from "@/integrations/supabase/client";
import { verifyAdminPassword } from "@/lib/admin-auth.functions";

export const Route = createFileRoute("/streampack")({
  head: () => ({ links:[{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:ital,wght@1,700;1,900&family=Bebas+Neue&family=Oswald:wght@700&family=Rajdhani:wght@700&family=Roboto+Condensed:ital,wght@1,900&display=swap"}], meta: [
    { title: "StreamPack Studio | The Soul Nation" },
    { name: "description", content: "Personaliza gráficos para tus transmisiones con nicknames ajustados automáticamente." },
  ] }),
  component: StreamPackStudio,
});

type Area = { x: number; y: number; width: number; height: number; maxFont: number; minFont: number; color: string; padding?: number; tracking?:number; strokeWidth?:number; strokeColor?:string; shadowBlur?:number; shadowColor?:string; align: "center" | "left" | "right" };
type Zone = Area & { id:string; label:string; kind:"nickname"|"social"|"soul"|"custom"|"social-icon"|"soul-logo"; text?:string; hidden?:boolean; locked?:boolean; groupId?:string; anchorTo?:string; anchorGap?:number }; 
type Template = { socialAutoLayout?:boolean; assetPath?:string; zones?:Zone[]; id: string; name: string; width: number; height: number; area: Area; category: string; membersOnly: boolean };
const START: Template[] = [
{id:"avi",name:"AVI",width:2048,height:2048,category:"avi",membersOnly:false,assetPath:"/streampack/templates/TSN_AVI_1x1.png",area:{x:410,y:1679,width:1229,height:246,maxFont:164,minFont:8,color:"#FFFFFF",align:"center"},zones:[{id:"nickname",kind:"nickname" as const,label:"Nickname",x:410,y:1679,width:1229,height:246,maxFont:164,minFont:8,color:"#FFFFFF",align:"center" as const}]},
{id:"4cams",name:"Cuatro invitados",width:1920,height:1080,category:"4cams",membersOnly:false,assetPath:"/streampack/templates/TSN_Overlay_16x9_4Cams.png",area:{x:130,y:930,width:390,height:70,maxFont:60,minFont:8,color:"#FFFFFF",align:"left"},zones:[0,1,2,3].map(i=>({id:i===0?"nickname":`guest-${i}`,kind:i===0?"nickname" as const:"custom" as const,label:i===0?"Nickname":`Invitado ${i}`,text:i===0?undefined:`Invitado ${i}`,x:130+i*455,y:930,width:390,height:70,maxFont:60,minFont:8,padding:0,color:"#FFFFFF",align:"left" as const}))},
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
type SocialNetwork="YouTube"|"Twitch"|"Instagram"|"TikTok";
const ICON_PATHS:Record<SocialNetwork,string>={
  YouTube:"M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6Z",
  Twitch:"M2 0 0 4v16h6v4h4l4-4h5l5-5V0Zm20 14-4 4h-5l-4 4v-4H4V2h18ZM11 6h2v7h-2Zm6 0h2v7h-2Z",
  Instagram:"M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5Zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3Zm10.5 1.3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z",
  TikTok:"M16 1h-4v14.2a4.1 4.1 0 1 1-3.5-4.1V7a8.2 8.2 0 1 0 7.5 8.2V8.3a11 11 0 0 0 6 1.8V6a7 7 0 0 1-6-5Z"
};
const isSocialNetwork=(name:string):name is SocialNetwork=>Object.prototype.hasOwnProperty.call(ICON_PATHS,name);
function drawSocialIcon(context:CanvasRenderingContext2D,zone:Zone){
  const network=zone.label.replace(/^Icono /,"");
  if(!isSocialNetwork(network))return;
  const size=Math.max(1,Math.min(zone.width,zone.height));
  context.save();context.translate(zone.x,zone.y+zone.height-size);context.scale(size/24,size/24);
  context.fillStyle=zone.color;context.fill(new Path2D(ICON_PATHS[network]));
  context.restore();
}
async function render(template:Template, nickname:string, asset:string|undefined, fontFamily:string, showGuides:boolean, socials:Record<string,string>={}, guests:Record<string,string>={}) {
  const canvas=document.createElement("canvas"); canvas.width=template.width; canvas.height=template.height;
  const context=canvas.getContext("2d"); if(!context) throw Error("Canvas no disponible");
  if (asset) { const image=await loadImage(asset); context.drawImage(image,0,0,canvas.width,canvas.height); }
  const a=template.area; const displayName=nickname.trim().toUpperCase().replace(/^SOUL\s+/i,"") || "NICKNAME";
  await document.fonts.load(`900 italic 40px "${fontFamily}"`);
  const logoAsset=template.zones?.some(z=>z.kind==="soul-logo"&&!z.hidden)?await loadImage(soulOfficialLogo):null;
  const drawText=(a:Area,label:string,highlightFinal=false,fixedFont?:number)=>{
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
    (context as CanvasRenderingContext2D & {letterSpacing:string}).letterSpacing=`${a.tracking??0}px`;
    const measure=context.measureText(label);
    const height=(measure.actualBoundingBoxAscent || mid*.85)+(measure.actualBoundingBoxDescent || mid*.25);
    if(measure.width<=permittedWidth && height<=permittedHeight)low=mid; else high=mid;
  }
  context.font=`900 italic ${fixedFont??low}px "${fontFamily}", Arial, sans-serif`;
  (context as CanvasRenderingContext2D & {letterSpacing:string}).letterSpacing=`${a.tracking??0}px`;
  context.textAlign=template.id==="avi"?"center":a.align;
  // Align the visible glyph bottom, not the font em-box (which leaves a gap).
  context.textBaseline="alphabetic";
  const glyphMetrics=context.measureText(label);
  const textY=a.y+a.height-Math.max(0,glyphMetrics.actualBoundingBoxDescent);
  const visibleTop=textY-glyphMetrics.actualBoundingBoxAscent;
  const visibleLeft=a.align==="left"?a.x+inset:undefined;
  context.fillStyle=a.color;
  context.shadowColor=a.shadowColor??"#000000";context.shadowBlur=a.shadowBlur??0;
  context.lineWidth=a.strokeWidth??0;context.strokeStyle=a.strokeColor??"#000000";
  const x=template.id==="avi"?textCenterX:a.align==="left"?a.x+inset:a.align==="right"?a.x+a.width-inset:a.x+a.width/2;
  const pieces=highlightFinal ? label.match(/^(.*\S)\s+([A-Z])$/i) : null;
  if(pieces){const left=pieces[1]+" ",right=pieces[2];const allWidth=context.measureText(label).width;const leftWidth=context.measureText(left).width;const start=template.id==="avi"||a.align==="center"?x-allWidth/2:a.align==="right"?x-allWidth:x;context.textAlign="left";context.fillStyle="#FFFFFF";context.fillText(left,start,textY);context.fillStyle="#F05E07";context.fillText(right,start+leftWidth,textY);}
  else {if((a.strokeWidth??0)>0)context.strokeText(label,x,textY);context.fillText(label,x,textY);}
  context.shadowBlur=0;(context as CanvasRenderingContext2D & {letterSpacing:string}).letterSpacing="0px";
  if(showGuides){context.strokeStyle="#F05E07";context.lineWidth=Math.max(2,canvas.width/480);context.setLineDash([14,10]);context.strokeRect(a.x,a.y,a.width,a.height);context.setLineDash([]);}
  return {top:visibleTop,left:visibleLeft??a.x};
  };

  // Dynamic optical layout: compact visible icons and handles without reserving
  // widths for missing networks or the editable zones of old templates.
  const autoSocial=template.socialAutoLayout===true && !!template.zones?.some(z=>z.kind==="social-icon");
  if(autoSocial&&template.zones){
    const iconZones=template.zones.filter(z=>z.kind==="social-icon"&&!z.hidden);
    const textZones=template.zones.filter(z=>z.kind==="social"&&!z.hidden);
    const active=iconZones.map(z=>({zone:z,network:z.label.replace(/^Icono /,"")})).filter(e=>isSocialNetwork(e.network)&&(socials[e.network]||"").trim());
    const groups:{handle:string;icons:Zone[]}[]=[];
    for(const {zone,network} of active){
      const handle=(socials[network]||"").trim().replace(/^@+/,"");
      const previous=groups.find(g=>g.handle.toLocaleLowerCase()===handle.toLocaleLowerCase());
      if(previous)previous.icons.push(zone);else groups.push({handle,icons:[zone]});
    }
    if(groups.length){
      const sample=textZones[0];
      const size=Math.max(1,Math.min(...iconZones.map(z=>Math.min(z.width,z.height))));
      const fontSize=Math.max(8,Math.min(sample?.maxFont??size*.68,size*.72));
      const iconGap=Math.round(size*.16),handleGap=Math.round(size*.22),groupGap=Math.round(size*.56);
      context.font=`900 italic ${fontSize}px "${fontFamily}", Arial, sans-serif`;
      const measure=(value:string)=>context.measureText(value).width;
      const widths=groups.map(g=>g.icons.length*size+Math.max(0,g.icons.length-1)*iconGap+handleGap+measure("@"+g.handle));
      const naturalWidth=widths.reduce((a,b)=>a+b,0)+Math.max(0,groups.length-1)*groupGap;
      const left=Math.max(0,Math.min(...iconZones.map(z=>z.x),...textZones.map(z=>z.x)));
      const bottom=Math.min(template.height,Math.max(...iconZones.map(z=>z.y+z.height),...textZones.map(z=>z.y+z.height)));
      const availableWidth=Math.max(1,template.width-left-Math.max(8,Math.round(template.width*.035)));
      const scale=Math.min(1,availableWidth/Math.max(1,naturalWidth));
      context.save();
      context.translate(left,bottom);
      context.scale(scale,scale);
      let cursor=0;
      for(const group of groups){
        for(const iconZone of group.icons){
          drawSocialIcon(context,{...iconZone,x:cursor,y:-size,width:size,height:size});
          cursor+=size+iconGap;
        }
        cursor+=handleGap-iconGap;
        context.font=`900 italic ${fontSize}px "${fontFamily}", Arial, sans-serif`;
        context.textBaseline="alphabetic";context.textAlign="left";
        const handle="@"+group.handle;
        const metrics=context.measureText(handle);
        context.fillStyle=sample?.color??"#FFFFFF";
        context.fillText(handle,cursor,-Math.max(0,metrics.actualBoundingBoxDescent));
        cursor+=measure(handle)+groupGap;
      }
      context.restore();
    }
  }
  if(template.zones){
    const guestGroup=template.id==="4cams"?template.zones.filter(z=>z.id==="nickname"||/^guest-[123]$/.test(z.id)):[];
    const master=guestGroup.find(z=>z.id==="nickname");
    const guestText=(z:Zone)=>z.kind==="nickname"?displayName:(guests[z.id]??z.text??"");
    // All four boxes share a single font size, limited by the longest visible name.
    let groupFont: number|undefined;
    if(master){
      let low=1,high=Math.max(2,master.maxFont);
      for(let i=0;i<24;i++){
        const mid=(low+high)/2;
        context.font=`900 italic ${mid}px "${fontFamily}", Arial, sans-serif`;
        const fits=guestGroup.filter(z=>!z.hidden&&guestText(z).trim()).every(z=>{
          const inset=Math.min(master.padding??0,Math.max(0,Math.min(z.width,z.height)/2-1));
          const metrics=context.measureText(guestText(z));
          const h=(metrics.actualBoundingBoxAscent||mid*.85)+(metrics.actualBoundingBoxDescent||mid*.25);
          return metrics.width<=z.width-2*inset&&h<=z.height-2*inset;
        });
        if(fits)low=mid;else high=mid;
      }
      groupFont=low;
    }
    for(const zone of template.zones){
      if(zone.hidden)continue;
      const linked=master&&(zone.id==="nickname"||/^guest-[123]$/.test(zone.id));
      const paint=linked?{...zone,maxFont:master.maxFont,minFont:master.minFont,padding:master.padding,color:master.color,align:"left" as const}:zone;
      if(zone.kind==="soul-logo"){if(logoAsset){const fit=Math.min(zone.width/logoAsset.naturalWidth,zone.height/logoAsset.naturalHeight);const w=logoAsset.naturalWidth*fit,h=logoAsset.naturalHeight*fit;context.drawImage(logoAsset,zone.x+(zone.width-w)/2,zone.y+(zone.height-h)/2,w,h);}continue;}
      if(zone.kind==="social-icon"){if(!autoSocial&&(socials[zone.label.replace(/^Icono /,"")]||"").trim())drawSocialIcon(context,zone);continue;}
      if(zone.kind==="nickname"){
        const bounds=drawText(paint,displayName,true,linked?groupFont:undefined);
        // Anchor SOUL to the actual ink, not the top of the editable rectangle.
        const labels=template.zones.filter(z=>z.kind==="soul"&&z.anchorTo===zone.id&&!z.hidden);
        for(const soul of labels){
          if(!bounds)continue;
          const gap=soul.anchorGap??4;
          const positioned={...soul,x:Math.max(0,bounds.left),y:Math.max(0,bounds.top-gap-soul.height)};
          drawText(positioned,"SOUL");
        }
      }
      else if(zone.kind==="soul"){if(!zone.anchorTo)drawText(paint,"SOUL");}
      else if(zone.kind==="social"&&!autoSocial){const account=(socials[zone.label]||"").trim();if(account)drawText(paint,account.startsWith("@")?account:"@"+account);}
      else if(zone.kind==="custom")drawText(paint,template.id==="4cams"&&/^guest-[123]$/.test(zone.id)?(guests[zone.id]??zone.text??""):(zone.text||""),false,linked?groupFont:undefined);
    }
  }else drawText(a,displayName,true);
  return canvas;
}
function StreamPackStudio(){
  const roster=useRoster();
  const waves=useWavesMembers();
  const hiddenWaves=useWavesHidden();
  const rosterOptions=[...new Set([...CURRENT_WAVES.filter(n=>!hiddenWaves.has(n)),...waves.filter(m=>!hiddenWaves.has(m.name.toUpperCase())).map(m=>m.name.toUpperCase()),...roster.all.map(m=>m.nickname.toUpperCase())])].filter(name=>name.startsWith("SOUL ")&&name.length<70).sort((a,b)=>a.localeCompare(b));
  const [selectedMember,setSelectedMember]=useState("");
  const [memberSearch,setMemberSearch]=useState("");
  const selectedIsOfficial=rosterOptions.includes(selectedMember);
  const chosenName=selectedIsOfficial?selectedMember.replace(/^SOUL\s+/i,"").trim():"";
  const [socials,setSocials]=useState<Record<string,string>>({Twitch:"",TikTok:"",YouTube:"",Instagram:""});
  const [savedProfiles,setSavedProfiles]=useState<Record<string,Record<string,string>>>({});
  const [versions,setVersions]=useState<{date:string;templates:Template[]}[]>([]);
  useEffect(()=>{try{setSavedProfiles(JSON.parse(localStorage.getItem("tsn-member-social-profiles")||"{}"));setVersions(JSON.parse(localStorage.getItem("tsn-streampack-versions")||"[]"));}catch{}},[]);
  useEffect(()=>{
    let active=true;
    if(!selectedIsOfficial){setSocials({Twitch:"",TikTok:"",YouTube:"",Instagram:""});return;}
    // Prefer saved official profiles. Members can still edit inputs for their own download.
    const key=selectedMember.trim().toUpperCase();
    setSocials({Twitch:"",TikTok:"",YouTube:"",Instagram:""});
    supabase.from("stream_member_profiles").select("socials").eq("member_key",key).maybeSingle()
      .then(({data,error})=>{
        if(!active)return;
        if(!error&&data?.socials){
          const values=data.socials as Record<string,string>;
          const normalize=(value:string)=>{const v=(value||"").trim();if(!v)return "";if(v.startsWith("http")){try{return "@"+decodeURIComponent(new URL(v).pathname.split("/").filter(Boolean).pop()||"").replace(/^@/,"");}catch{return v;}}return v.startsWith("@")?v:"@"+v.replace(/^@/,"");};
          setSocials({Twitch:normalize(values.Twitch),TikTok:normalize(values.TikTok),YouTube:normalize(values.YouTube),Instagram:normalize(values.Instagram),Facebook:normalize(values.Facebook),X:normalize(values.X)});
        }
      });
    return()=>{active=false};
  },[selectedMember,selectedIsOfficial]);
  const saveProfile=()=>{if(!selectedIsOfficial)return;const next={...savedProfiles,[selectedMember]:{...socials}};setSavedProfiles(next);localStorage.setItem("tsn-member-social-profiles",JSON.stringify(next));setMessage("Redes guardadas para este gamertag en este navegador.");};
  const restoreProfile=()=>{if(!selectedIsOfficial)return;const entry=savedProfiles[selectedMember];if(entry)setSocials(entry);else setMessage("Este gamertag todavía no tiene redes guardadas en este navegador.");};
  const saveVersion=()=>{const entry={date:new Date().toLocaleString("es-MX"),templates:structuredClone(templates)};const next=[entry,...versions].slice(0,8);setVersions(next);localStorage.setItem("tsn-streampack-versions",JSON.stringify(next));setMessage("Versión de proyecto guardada en este dispositivo.");};
  const restoreVersion=(n:number)=>{const entry=versions[n];if(entry){setTemplates(structuredClone(entry.templates));setMessage("Versión restaurada.");}};
  const [guests,setGuests]=useState<Record<string,string>>({"guest-1":"","guest-2":"","guest-3":""});
  const [zoneId,setZoneId]=useState("nickname");
  const [groupSameSocials,setGroupSameSocials]=useState(true);
  const [simulator,setSimulator]=useState<"none"|"obs"|"tiktok">("none");
  const [multiSelected,setMultiSelected]=useState<string[]>([]);
  const [selectedExport,setSelectedExport]=useState<string[]>(START.map(x=>x.id));
  const clipboardRef=useRef<Zone|null>(null);
  const historyRef=useRef<Template[][]>([]);
  const redoRef=useRef<Template[][]>([]);
  const templatesRef=useRef<Template[]>([]);
  const nextIdRef=useRef(0);
  const [adminVerified,setAdminVerified]=useState(false);
  const [templates,setTemplates]=useState<Template[]>(START.map(t=>({...t,area:{...t.area},zones:t.zones?.map(z=>({...z}))})));
  const SOUL_STREAM_TEMPLATE: Template = {...START[0], id:"soul-stream-gameplay-cam-livechat", name:"Soul Stream · Gameplay, Cam y Livechat", width:1920, height:1081, category:"gameplay", membersOnly:false, assetPath:"/streampack/shared/soul-gameplay-cam-livechat-f123ad237770.png", area:{x:580,y:35,width:780,height:100,maxFont:80,minFont:8,color:"#FFFFFF",align:"center"}, zones:[]};
  const [selected,setSelected]=useState("avi");
  const [officialLoaded,setOfficialLoaded]=useState(false);
  useEffect(()=>{
    let cancelled=false;
    fetch("/streampack/configuracion-oficial.json",{cache:"no-store"})
      .then(response=>{if(!response.ok)throw Error("Configuración no disponible");return response.json();})
      .then(data=>{
        if(cancelled)return;
        if(data.version!==2||!Array.isArray(data.templates)||data.templates.length!==14)throw Error("Configuración oficial incompatible");
        const standard=new Map(START.map(item=>[item.id,item]));
        const official:Template[]=data.templates.map((item:Template)=>{
          const base=standard.get(item.id);
          if(!base||!Array.isArray(item.zones)||!item.zones.every(z=>typeof z.id==="string"&&Number.isFinite(z.x)&&Number.isFinite(z.y)&&Number.isFinite(z.width)&&Number.isFinite(z.height)))throw Error("Plantilla oficial inválida");
          return {...base,area:{...base.area,...item.area},zones:item.zones.map(z=>({...z})),socialAutoLayout:item.socialAutoLayout===true,assetPath:base.assetPath,membersOnly:false};
        });
        setTemplates([...official,SOUL_STREAM_TEMPLATE]);setOfficialLoaded(true);
      }).catch(()=>{if(!cancelled){setOfficialLoaded(false);setMessage("No se pudo cargar la configuración oficial. Comprueba la publicación antes de descargar.");}});
    return()=>{cancelled=true};
  },[]);
  useEffect(()=>{if(!officialLoaded||!adminVerified)return;try{localStorage.setItem("tsn-streampack-workspace-v3",JSON.stringify({templates,socials,savedAt:new Date().toISOString()}));}catch{}},[templates,socials,officialLoaded,adminVerified]);
  const [assets,setAssets]=useState<Record<string,string>>({});
  const [available,setAvailable]=useState<Record<string,boolean>>({});
  useEffect(()=>{let cancelled=false;Promise.all([...START,SOUL_STREAM_TEMPLATE].map(async item=>{try{const response=await fetch(item.assetPath||"",{method:"HEAD"});return [item.id,response.ok] as const;}catch{return [item.id,false] as const;}})).then(entries=>{if(!cancelled)setAvailable(Object.fromEntries(entries));});return()=>{cancelled=true;};},[]);
  const [fontFamily,setFontFamily]=useState("The Soul Nation");
  const [advanced,setAdvanced]=useState(false);
  const [copiedStyle,setCopiedStyle]=useState<Partial<Zone>|null>(null);

  const [preview,setPreview]=useState("");
  const [guides,setGuides]=useState(false);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  const [editor,setEditor]=useState(false);
  useEffect(()=>{let cancelled=false;const check=async()=>{const pass=sessionStorage.getItem("admin-live-pw");if(!pass)return;try{const result=await verifyAdminPassword({data:{password:pass}});if(!cancelled)setAdminVerified(result.ok);}catch{if(!cancelled)setAdminVerified(false);}};void check();return()=>{cancelled=true;};},[]);
  useEffect(()=>{if(!adminVerified)setEditor(false);},[adminVerified]);
  const [packBusy,setPackBusy]=useState(false);
  const t=templates.find(item=>item.id===selected) || templates[0];
  templatesRef.current=templates;
  const recordHistory=()=>{historyRef.current.push(structuredClone(templatesRef.current));if(historyRef.current.length>40)historyRef.current.shift();redoRef.current=[];};
  const undo=()=>{const previous=historyRef.current.pop();if(!previous)return;redoRef.current.push(structuredClone(templatesRef.current));setTemplates(previous);};
  const redo=()=>{const next=redoRef.current.pop();if(!next)return;historyRef.current.push(structuredClone(templatesRef.current));setTemplates(next);};
  const pasteElement=()=>{const source=clipboardRef.current;if(!source)return;recordHistory();const id=`pasted-${++nextIdRef.current}`;const zone={...source,id,label:source.label+" copia",x:Math.max(0,Math.min(t.width-source.width,source.x+25)),y:Math.max(0,Math.min(t.height-source.height,source.y+25))};update({zones:[...(t.zones||[]),zone]});setZoneId(id);};
  const duplicateElement=()=>{if(!activeZone||activeZone.locked)return;clipboardRef.current={...activeZone};pasteElement();};
  useEffect(()=>{
    if(!editor||!adminVerified)return;
    const onKey=(event:KeyboardEvent)=>{
      const element=event.target as HTMLElement|null;
      if(element?.closest('input, textarea, select, [contenteditable="true"]'))return;
      const modifier=event.ctrlKey||event.metaKey;
      const key=event.key.toLowerCase();
      if(modifier&&key==="g"&&multiSelected.length>1){event.preventDefault();const id="group-"+Date.now();recordHistory();update({zones:(t.zones||[]).map(z=>multiSelected.includes(z.id)?{...z,groupId:id}:z)});setMessage("Grupo creado. Puedes mover sus capas juntas.");return;}
      if(modifier&&key==="c"&&activeZone){event.preventDefault();clipboardRef.current={...activeZone};return;}
      if(modifier&&key==="v"&&clipboardRef.current){event.preventDefault();pasteElement();return;}
      if(modifier&&key==="d"&&activeZone){event.preventDefault();duplicateElement();return;}
      if(modifier&&key==="z"){event.preventDefault();if(event.shiftKey)redo();else undo();return;}
      if(modifier&&key==="y"){event.preventDefault();redo();return;}
      if(!modifier&&(event.key==="Delete"||event.key==="Backspace")&&activeZone&&!activeZone.locked){event.preventDefault();recordHistory();update({zones:t.zones!.filter(z=>z.id!==zoneId)});setZoneId("");return;}
      if(!modifier&&["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(event.key)&&activeZone&&!activeZone.locked){event.preventDefault();recordHistory();const step=event.shiftKey?10:1;const dx=event.key==="ArrowLeft"?-step:event.key==="ArrowRight"?step:0;const dy=event.key==="ArrowUp"?-step:event.key==="ArrowDown"?step:0;updateArea({x:Math.max(0,Math.min(t.width-activeZone.width,activeZone.x+dx)),y:Math.max(0,Math.min(t.height-activeZone.height,activeZone.y+dy))});}
    };
    window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);
  });
  const update=(patch:Partial<Template>)=>setTemplates(current=>current.map(x=>{
    if(x.id!==t.id)return x;
    if(x.id!=="4cams"||!patch.zones)return {...x,...patch};
    const master=patch.zones.find(z=>z.id==="nickname");
    if(!master)return {...x,...patch};
    const linked=patch.zones.map(z=>/^guest-[123]$/.test(z.id)?{...z,width:master.width,height:master.height,maxFont:master.maxFont,minFont:master.minFont,padding:master.padding,color:master.color,align:"left" as const}:{...z,align:z.id==="nickname"?"left" as const:z.align});
    return {...x,...patch,zones:linked};
  }));
  const activeZone=t.zones?.find(z=>z.id===zoneId);
  const updateZone=(patch:Partial<Zone>)=>{if(!activeZone)return;update({zones:t.zones!.map(z=>z.id===zoneId?{...z,...patch}:z)});};
  const updateArea=(patch:Partial<Area>)=>activeZone ? (activeZone.locked?undefined:update({zones:t.zones!.map(z=>{
    if(z.anchorTo===zoneId && (patch.x!==undefined||patch.y!==undefined||patch.width!==undefined||patch.height!==undefined)){
      const next={...activeZone,...patch};
      return {...z,x:Math.max(0,Math.min(t.width-z.width,next.x)),y:Math.max(0,Math.min(t.height-z.height,next.y-(z.anchorGap??4)-z.height))};
    }
    if(z.id!==zoneId)return z;
    if(t.id==="4cams"&&/^guest-[123]$/.test(z.id)){
      const {x,y}=patch;return {...z,...(x===undefined?{}:{x}),...(y===undefined?{}:{y})};
    }
    return {...z,...patch};
  })})) : update({area:{...t.area,...patch}});
  const addZone=(kind:Zone["kind"],label:string)=>{const id=`zone-${Date.now()}`;update({zones:[...(t.zones||[{...t.area,id:"nickname",kind:"nickname" as const,label:"Nickname"}]),{...t.area,id,kind,label,text:kind==="custom"?"Nuevo texto":undefined,x:Math.round(t.width*.12),y:Math.round(t.height*.35),width:Math.round(t.width*(kind==="soul-logo"?.18:.35)),height:Math.round(t.height*(kind==="soul-logo"?.18:.07))}]});setZoneId(id);};
  const organizeSocials=()=>{
    const networks=(["YouTube","Twitch","Instagram","TikTok"] as const).filter(n=>(socials[n]||"").trim());
    const cleaned=(t.zones||[]).filter(z=>!(z.kind==="social-icon"||z.kind==="social"));
    if(!networks.length){update({zones:cleaned});setMessage("Escribe al menos un usuario de redes sociales.");return;}
    const groups:{handle:string;networks:typeof networks}[]=[];
    for(const network of networks){
      const handle=(socials[network]||"").trim().replace(/^@+/,"");
      const match=groupSameSocials?groups.find(g=>g.handle.toLocaleLowerCase()===handle.toLocaleLowerCase()):undefined;
      if(match)match.networks.push(network);
      else groups.push({handle,networks:[network]});
    }
    const iconSize=Math.max(28,Math.min(72,Math.round(t.width*.033)));
    const gap=Math.round(iconSize*.18),groupGap=Math.round(iconSize*.55);
    const left=Math.round(t.width*.07),usableWidth=Math.round(t.width*.86);
    const totalIcons=networks.length;
    const minText=90;
    const equalTextWidth=Math.max(minText,Math.floor((usableWidth-totalIcons*iconSize-(totalIcons-groups.length)*gap-(groups.length-1)*groupGap-groups.length*gap)/groups.length));
    const totalWidth=totalIcons*iconSize+(totalIcons-groups.length)*gap+(groups.length-1)*groupGap+groups.length*(gap+equalTextWidth);
    const scale=Math.min(1,usableWidth/totalWidth);
    const icon=Math.round(iconSize*scale);
    const iconGap=Math.round(gap*scale),separation=Math.round(groupGap*scale),textWidth=Math.round(equalTextWidth*scale);
    const baseY=Math.min(t.height-icon-12,Math.round(t.height*.88));
    let x=left;
    const items:Zone[]=[];
    groups.forEach((group,groupIndex)=>{
      group.networks.forEach((network)=>{
        items.push({id:`socialicon-${network}`,kind:"social-icon",label:`Icono ${network}`,x,y:baseY,width:icon,height:icon,maxFont:icon,minFont:1,color:"#FFFFFF",align:"left"});
        x+=icon+iconGap;
      });
      const label=group.networks[0];
      items.push({id:`socialtext-${label}`,kind:"social",label,x,y:baseY,width:textWidth,height:icon,maxFont:Math.round(icon*.7),minFont:8,padding:0,color:"#FFFFFF",align:"left"});
      x+=textWidth+(groupIndex<groups.length-1?separation:0);
    });
    update({zones:[...cleaned,...items]});
    setZoneId(items[0].id);
    setMessage(groupSameSocials?`Se agruparon ${networks.length} redes en ${groups.length} grupo(s) según su @usuario.`:`Se organizaron ${networks.length} redes individualmente.`);
  };
  const equalizeSocialIcons=()=>{
    const icons=(t.zones||[]).filter(z=>z.kind==="social-icon");
    if(!icons.length)return;
    const size=Math.min(...icons.map(z=>Math.min(z.width,z.height)));
    const y=Math.round(icons[0].y);
    const ordered=[...icons].sort((a,b)=>a.x-b.x);
    const gap=Math.round(size*.25),start=ordered[0].x;
    update({zones:(t.zones||[]).map(z=>{const index=ordered.findIndex(icon=>icon.id===z.id);return index<0?z:{...z,x:Math.min(t.width-size,start+index*(size+gap)),y,width:size,height:size};})});
    setMessage("Los iconos quedaron del mismo tamaño, alineados horizontalmente.");
  };
  const alignSelected=(mode:"left"|"bottom"|"space")=>{
    const group=(t.zones||[]).filter(z=>multiSelected.includes(z.id)&&!z.locked);
    if(group.length<2)return;
    const ordered=[...group].sort((a,b)=>a.x-b.x);
    const left=Math.min(...group.map(z=>z.x)),bottom=Math.max(...group.map(z=>z.y+z.height));
    const first=ordered[0],last=ordered[ordered.length-1];
    const free=last.x+last.width-first.x-ordered.reduce((sum,z)=>sum+z.width,0);
    let cursor=first.x;
    const position=new Map<string,Partial<Zone>>();
    ordered.forEach(z=>{position.set(z.id,mode==="left"?{x:left}:mode==="bottom"?{y:bottom-z.height}:{x:Math.round(cursor)});if(mode==="space")cursor+=z.width+free/(ordered.length-1);});
    recordHistory();update({zones:(t.zones||[]).map(z=>position.has(z.id)?{...z,...position.get(z.id)}:z)});
  };
  const selectCanvasZones=(ids:string[])=>{setMultiSelected(ids);if(ids.length)setZoneId(ids[0]);};
  const moveCanvasSelection=(dx:number,dy:number)=>{
    if(!dx&&!dy)return;
    const selected=(t.zones||[]).filter(z=>multiSelected.includes(z.id)&&!z.locked);
    const groups=new Set(selected.map(z=>z.groupId).filter(Boolean));
    const targets=(t.zones||[]).filter(z=>!z.locked&&(multiSelected.includes(z.id)||(z.groupId&&groups.has(z.groupId))));
    if(!targets.length)return;
    const offsetX=Math.max(-Math.min(...targets.map(z=>z.x)),Math.min(dx,Math.min(...targets.map(z=>t.width-z.x-z.width))));
    const offsetY=Math.max(-Math.min(...targets.map(z=>z.y)),Math.min(dy,Math.min(...targets.map(z=>t.height-z.y-z.height))));
    update({zones:(t.zones||[]).map(z=>targets.some(item=>item.id===z.id)?{...z,x:z.x+offsetX,y:z.y+offsetY}:z)});
  };
  const groupSelected=()=>{
    if(multiSelected.length<2)return;
    const id="group-"+Date.now();recordHistory();
    update({zones:(t.zones||[]).map(z=>multiSelected.includes(z.id)?{...z,groupId:id}:z)});
    setMessage("Capas agrupadas para organización.");
  };
  const applyTSNComposition=()=>{
    if(!adminVerified)return;
    const main=t.zones?.find(z=>z.kind==="nickname");
    if(!main){setMessage("Agrega primero una capa Nickname.");return;}
    const existing=t.zones?.find(z=>z.kind==="soul"&&(z.anchorTo==="nickname"||z.label==="SOUL"));
    const height=Math.max(22,Math.round(main.height*.38));
    const width=Math.min(t.width,Math.max(100,Math.round(main.width*.35)));
    const gap=Math.max(0,Math.round(main.height*.04));
    const soul:Zone={...(existing||main),id:existing?.id||"soul-tsn",label:"SOUL",kind:"soul",anchorTo:"nickname",anchorGap:gap,x:main.x,y:Math.max(0,main.y-gap-height),width,height,maxFont:Math.round(main.maxFont*.4),minFont:8,padding:0,color:"#F05E07",align:"left"};
    recordHistory();
    update({zones:[...(t.zones||[]).filter(z=>z.id!==soul.id),soul]});
    setZoneId("nickname");
    setMessage("Composición TSN aplicada: SOUL arriba del nickname y vinculado a su posición.");
  };
  const copyStyle=()=>{if(!activeZone)return;const {width,height,maxFont,minFont,padding,align,color}=activeZone;setCopiedStyle({width,height,maxFont,minFont,padding,align,color});};
  const pasteStyle=()=>{if(!activeZone||!copiedStyle)return;updateZone({...copiedStyle,width:Math.min(copiedStyle.width??activeZone.width,t.width-activeZone.x),height:Math.min(copiedStyle.height??activeZone.height,t.height-activeZone.y)});};
  const duplicateZone=()=>{if(!activeZone)return;const id=`zone-${Date.now()}`;update({zones:[...t.zones!,{...activeZone,id,label:`${activeZone.label} copia`,x:Math.min(t.width-activeZone.width,activeZone.x+24),y:Math.min(t.height-activeZone.height,activeZone.y+24)}]});setZoneId(id);};
  const reorderZone=(direction:-1|1)=>{if(!activeZone||!t.zones)return;const current=t.zones.findIndex(z=>z.id===zoneId),target=current+direction;if(target<0||target>=t.zones.length)return;const next=[...t.zones];[next[current],next[target]]=[next[target],next[current]];update({zones:next});};
  const removeZone=()=>{if(!activeZone||activeZone.locked)return;recordHistory();update({zones:t.zones!.filter(z=>z.id!==zoneId)});setZoneId("nickname");};
  useEffect(()=>{let active=true;render(t,chosenName,(assets[t.id]||(available[t.id]?t.assetPath:undefined)),fontFamily,guides,socials,guests).then(c=>{if(active)setPreview(c.toDataURL("image/png"));}).catch(()=>{if(active)setMessage("No se pudo generar la vista previa.");});return()=>{active=false};},[t,chosenName,assets,available,fontFamily,guides,socials,guests]);
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
  const exportNames:Record<string,string>={"avi":"Imagen_de_Perfil","4cams":"Cuatro_Camaras_Invitados","tsn-3":"Iniciamos_Horizontal","tsn-4":"Iniciamos_Vertical","tsn-5":"Regresamos","tsn-6":"Finalizamos","tsn-7":"Gameplay_Horizontal_Con_Camara","tsn-8":"Gameplay_Horizontal_Sin_Camara","tsn-9":"Gameplay_Vertical_Con_Camara","tsn-10":"Gameplay_Vertical_Con_Camara_Version_2","tsn-11":"Gameplay_Vertical_Sin_Camara","tsn-12":"Gameplay_Vertical_Sin_Camara_Version_2","tsn-13":"Marco_Webcam","tsn-14":"Marco_Webcam_Barra"};
  const download=async()=>{
    setBusy(true);setMessage("");
    try{
      if(!officialLoaded)throw Error("No se cargó la configuración oficial.");
      if(!selectedIsOfficial)throw Error("Selecciona un integrante del roster oficial.");
      const c=await render(t,chosenName,(assets[t.id]||(available[t.id]?t.assetPath:undefined)),fontFamily,false,socials,guests);
      const blob=await new Promise<Blob|null>(resolve=>c.toBlob(resolve,"image/png"));
      if(!blob)throw Error("No se pudo crear el PNG");
      const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${safeName(chosenName)}_${exportNames[t.id]||safeName(t.name)}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
    }catch(e){setMessage(e instanceof Error?e.message:"Error de exportación");}finally{setBusy(false);}
  };
  const downloadPack=async()=>{
    setPackBusy(true);setMessage("");
    try{
      if(!selectedIsOfficial)throw Error("Selecciona un integrante del roster oficial.");
      const valid=templates.filter(item=>selectedExport.includes(item.id)&&!item.membersOnly && Boolean(assets[item.id]||available[item.id]));
      if(!valid.length)throw Error("Sube primero al menos un gráfico PNG en el editor para generar el paquete.");
      const files:{name:string;bytes:Uint8Array}[]=[];
      for(const item of valid){
        const canvas=await render(item,chosenName,(assets[item.id]||(available[item.id]?item.assetPath:undefined)),fontFamily,false,socials,guests);
        const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/png"));
        if(!blob)throw Error("No se pudo generar "+item.name);
        files.push({name:`${safeName(chosenName)}_${exportNames[item.id]||safeName(item.name)}.png`,bytes:new Uint8Array(await blob.arrayBuffer())});
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
  const loadConfiguration=async(file?:File)=>{if(!adminVerified)return;
    if(!file)return;
    try{
      if(file.size>2_000_000)throw Error("Archivo demasiado grande para una configuración.");
      const data=JSON.parse(await file.text());
      if(![1,2].includes(data.version)||!Array.isArray(data.templates)||!data.templates.length||data.templates.length>100)throw Error("Archivo de configuración incompatible.");
      const incoming:Template[]=data.templates.map((item:Template)=>{
        if(!item||typeof item.id!=="string"||!item.id||typeof item.name!=="string"||!Number.isInteger(item.width)||!Number.isInteger(item.height)||item.width<1||item.width>8192||item.height<1||item.height>8192||!Array.isArray(item.zones)||item.zones.length>100)throw Error("Una plantilla tiene datos inválidos.");
        const zones=item.zones.map(z=>{
          if(!z||typeof z.id!=="string"||typeof z.label!=="string"||!["nickname","soul","social","custom","social-icon","soul-logo"].includes(z.kind)||!["left","center","right"].includes(z.align)||!Number.isFinite(z.x)||!Number.isFinite(z.y)||!Number.isFinite(z.width)||!Number.isFinite(z.height)||z.width<=0||z.height<=0||!Number.isFinite(z.maxFont)||z.maxFont<=0||typeof z.color!=="string"||!/^#[0-9a-f]{6}$/i.test(z.color))throw Error("Una capa contiene datos inválidos.");
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
  const createTemplate=()=>{if(!adminVerified)return;const id=`custom-${Date.now()}`;setTemplates(p=>[...p,{...START[0],id,name:"Nuevo gráfico",membersOnly:false}]);setSelected(id);setEditor(true);};
  const setNumber=(key:keyof Area,value:number)=>{
    if(!Number.isFinite(value))return;
    const max=key==="x"||key==="width"?t.width:key==="y"||key==="height"?t.height:400;
    updateArea({[key]:Math.max(0,Math.min(max,Math.round(value)))} as Partial<Area>);
  };
  return <main className="relative min-h-screen px-4 pb-28 pt-24 text-white md:px-8" style={{background:"radial-gradient(ellipse at 80% 0%,#071c64 0%,#060b22 55%,#050719 100%)"}}>
    <div className="mx-auto max-w-[1800px]">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft size={16}/> Regresar a The Soul Nation</Link>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.3em] text-[#F05E07]">The Soul Nation / Creators</p><h1 className="mt-2 text-3xl font-black uppercase italic tracking-tight md:text-5xl">StreamPack <span className="text-[#F05E07]">Studio</span></h1><p className="mt-3 max-w-xl text-sm text-slate-300">Genera tus gráficos con el nickname ajustado al área exacta de cada plantilla. Descarga PNG a resolución original.</p></div>
        <span className="rounded-full border border-blue-400/30 px-4 py-2 text-xs text-blue-200">Versión inicial</span>
      </div>
      <StreamPackCustomStudio />
      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/[.045] p-5">
          <div className="space-y-2"><label htmlFor="soul-roster-search" className="block text-sm font-semibold">Selecciona tu gamertag del roster oficial</label>
            <input id="soul-roster-search" value={memberSearch} onChange={e=>setMemberSearch(e.target.value)} className="w-full rounded-xl border border-white/20 bg-[#07122c] px-4 py-3 text-base outline-none focus:border-[#F05E07]" placeholder="Buscar nickname…"/>
            <select aria-label="Gamertag oficial" value={selectedMember} onChange={e=>setSelectedMember(e.target.value)} className="w-full rounded-xl border border-white/20 bg-[#07122c] px-4 py-3 text-base text-white"><option value="">Elige un integrante…</option>{rosterOptions.filter(name=>name.toLowerCase().includes(memberSearch.trim().toLowerCase())).map(name=><option key={name} value={name}>{name.replace(/^SOUL\s+/i,"")}</option>)}{selectedMember&&!rosterOptions.some(name=>name===selectedMember&&name.toLowerCase().includes(memberSearch.trim().toLowerCase()))&&<option value={selectedMember}>{selectedMember.replace(/^SOUL\s+/i,"")}</option>}</select>
            <p className="text-xs text-slate-400">{selectedIsOfficial?`Seleccionado: ${chosenName}`:"Solo se pueden generar paquetes con nombres del roster oficial."}</p>
            <p className="text-xs text-amber-200">Esta selección no verifica tu identidad: cualquier visitante podría escoger el nombre de otro miembro. Para impedir suplantaciones se requiere un acceso verificado por integrante.</p></div>
          <div className="space-y-2"><h2 className="text-sm font-semibold">Redes sociales</h2><div className="flex flex-wrap gap-2"><button type="button" onClick={saveProfile} disabled={!selectedIsOfficial} className="rounded-lg border border-[#F05E07]/40 px-3 py-2 text-xs disabled:opacity-40">Guardar mis redes</button><button type="button" onClick={restoreProfile} disabled={!selectedIsOfficial} className="rounded-lg border border-white/25 px-3 py-2 text-xs disabled:opacity-40">Cargar redes guardadas</button></div>{["Twitch","TikTok","YouTube","Instagram"].map(network=><label key={network} className="block text-xs text-slate-300">{network}<input value={socials[network]||""} onChange={e=>setSocials(p=>({...p,[network]:e.target.value}))} className="mt-1 w-full rounded-lg border border-white/15 bg-[#07122c] p-2 text-base text-white" placeholder="@usuario"/></label>)}</div>
          <div className="rounded-xl border border-white/15 p-3 space-y-2"><p className="text-sm font-semibold">Exportación por piezas</p><div className="flex gap-3"><button className="text-xs underline" onClick={()=>setSelectedExport(templates.map(x=>x.id))}>Todas</button><button className="text-xs underline" onClick={()=>setSelectedExport([])}>Ninguna</button></div><div className="grid grid-cols-2 gap-2">{templates.map(item=><label key={item.id} className="flex gap-2 text-xs"><input type="checkbox" checked={selectedExport.includes(item.id)} onChange={e=>setSelectedExport(current=>e.target.checked?[...current,item.id]:current.filter(id=>id!==item.id))}/>{item.name}</label>)}</div></div>
          {selected==="4cams"&&<div className="rounded-xl border border-[#F05E07]/30 p-3 space-y-3"><h2 className="text-sm font-semibold">Nombres de tus invitados</h2><p className="text-xs text-slate-400">Tu nickname se toma del roster. Escribe los otros tres nombres; solo cambiarán en tu descarga.</p>{[1,2,3].map(n=><label key={n} className="block text-xs text-slate-300">Invitado {n}<input maxLength={50} value={guests[`guest-${n}`]??""} onChange={e=>setGuests(current=>({...current,[`guest-${n}`]:e.target.value}))} placeholder={`Nombre del invitado ${n}`} className="mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-3 text-base text-white"/></label>)}</div>}
          <div><h2 className="mb-3 text-sm font-semibold">Selecciona tu gráfico</h2><div className="space-y-2">{templates.filter(x=>!x.membersOnly).map(item=><button type="button" key={item.id} onClick={()=>setSelected(item.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${t.id===item.id?"border-[#F05E07] bg-[#F05E07]/10":"border-white/10 bg-white/5 hover:bg-white/10"}`}><span>{item.name}</span><span className="text-xs text-slate-400">{assets[item.id]||available[item.id]?"Lista":"Falta PNG"} · {item.width}×{item.height}</span></button>)}</div></div>
          {adminVerified?<button onClick={()=>setEditor(p=>!p)} className="w-full rounded-xl border border-blue-400/40 px-4 py-3 text-sm font-semibold hover:bg-blue-500/10">{editor?"Cerrar editor":"Abrir editor de plantilla"}</button>:<p className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400">Solo administración puede modificar las plantillas oficiales. Aquí puedes elegir tu nickname, agregar tus redes y descargar tu StreamPack.</p>}
          <button onClick={download} disabled={busy || !officialLoaded || !selectedIsOfficial || !(assets[t.id]||available[t.id])} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F05E07] px-4 py-3 font-bold text-[#080b20] disabled:opacity-50"><Download size={18}/> {busy?"Generando…":"Descargar PNG"}</button>
          <button onClick={downloadPack} disabled={packBusy || !selectedIsOfficial || !templates.some(item=>!item.membersOnly && Boolean(assets[item.id]||available[item.id]))} className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/50 bg-blue-600/20 px-4 py-3 font-bold text-white disabled:opacity-40"><Package size={18}/> {packBusy?"Preparando ZIP…":"Descargar paquete ZIP"}</button>
          <p className="text-xs text-slate-400">El ZIP incluye solo los gráficos públicos a los que hayas subido una imagen en esta sesión.</p>
        </section>
        <section className={editor&&adminVerified?"min-w-0 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-4":"min-w-0 space-y-4"}>
          <div className="lg:sticky lg:top-20 lg:z-10"><div className="overflow-hidden rounded-3xl border border-white/10 bg-[#030717] p-4 md:p-6"><div className="mb-4 flex items-center justify-between text-xs text-slate-300"><span>Vista previa</span><span>{t.width} × {t.height} px</span></div>
            <div className="flex min-h-[270px] items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(45deg,#171c2a_25%,transparent_25%,transparent_75%,#171c2a_75%),linear-gradient(45deg,#171c2a_25%,#0c1221_25%,#0c1221_75%,#171c2a_75%)] bg-[length:24px_24px] bg-[position:0_0,12px_12px]" style={simulator==="obs"?{background:"linear-gradient(125deg,#14243f 0%,#32485d 35%,#262b34 70%,#131824 100%)"}:simulator==="tiktok"?{background:"linear-gradient(160deg,#0e0c22 0%,#21183c 45%,#0c1020 100%)"}:{}}>{editor&&adminVerified ? <StreamPackAreaEditor background={preview || assets[t.id] || (available[t.id]?t.assetPath:undefined)} imageWidth={t.width} imageHeight={t.height} area={activeZone||t.area} onChange={rect=>updateArea(rect)} zones={t.zones?.filter(z=>!z.hidden)} selectedId={zoneId} onSelect={id=>{setZoneId(id);const zone=t.zones?.find(z=>z.id===id);setMultiSelected(zone?.groupId?t.zones!.filter(z=>z.groupId===zone.groupId).map(z=>z.id):[id]);}} selectedIds={multiSelected} onMultiSelect={selectCanvasZones} onMoveSelection={moveCanvasSelection} circleGuide={t.id==="avi"}/> : preview?<div className="relative w-full"><img src={preview} alt="Vista previa del gráfico generado" className="max-h-[610px] w-full object-contain"/>{simulator!=="none"&&<div className="pointer-events-none absolute bottom-3 right-3 rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-[10px] text-white/80">{simulator==="obs"?"Simulación OBS • escena de juego":"Simulación TikTok • cámara y chat"}</div>}</div>:<span>Preparando vista previa…</span>}</div>
            <div className="flex flex-wrap gap-2 pt-2"><button className="rounded-lg border border-white/20 px-3 py-2 text-xs" onClick={()=>setSimulator("none")}>Fondo transparente</button><button className="rounded-lg border border-white/20 px-3 py-2 text-xs" onClick={()=>setSimulator("obs")}>Simular OBS</button><button className="rounded-lg border border-white/20 px-3 py-2 text-xs" onClick={()=>setSimulator("tiktok")}>Simular TikTok</button></div>
            <p className="mt-3 text-xs text-slate-400">La cuadrícula representa transparencia. Para obtener un marco real, carga una plantilla PNG transparente.</p>
          </div></div>
          {editor&&adminVerified&&<div className="space-y-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto rounded-3xl border border-[#F05E07]/30 bg-white/[.045] p-5">
            <div className="flex flex-wrap justify-between gap-2"><h2 className="font-bold">Editor local de gráficos</h2><button type="button" onClick={applyTSNComposition} className="rounded-lg bg-[#F05E07] px-3 py-2 text-xs font-bold text-black">Aplicar composición TSN · SOUL + Nickname</button><button onClick={createTemplate} className="text-sm text-[#F05E07]">+ Nueva plantilla</button></div>
            <p className="text-xs text-amber-200">Edita las zonas directamente sobre la vista previa superior. Los PNG permanecen solo durante esta sesión. Exporta un JSON para conservar posiciones y márgenes; no incluye imágenes ni habilita descargas privadas.</p>
            <div className="rounded-xl border border-white/15 p-3 space-y-2"><div className="flex items-center justify-between"><p className="text-sm font-semibold">Versiones de mi proyecto</p><button type="button" onClick={saveVersion} className="rounded-lg bg-white/10 px-3 py-2 text-xs">Guardar versión</button></div><p className="text-xs text-slate-400">Se guardan hasta 8 versiones en este navegador; no contienen PNG.</p>{versions.map((v,i)=><button type="button" key={i} onClick={()=>restoreVersion(i)} className="block w-full rounded-lg border border-white/15 px-3 py-2 text-left text-xs">{v.date} · Restaurar</button>)}</div>
            <div className="flex flex-wrap gap-2"><button onClick={saveConfiguration} className="rounded-lg bg-blue-700 px-3 py-2 text-sm">Exportar todas las plantillas</button><label className="cursor-pointer rounded-lg border border-blue-500/50 px-3 py-2 text-sm">Importar todas las plantillas<input type="file" accept=".json,application/json" className="hidden" onChange={e=>void loadConfiguration(e.target.files?.[0])}/></label></div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/25 p-3 text-sm"><ImagePlus size={18}/> Subir fondo PNG / JPG <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e=>upload(e.target.files?.[0])}/></label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/25 p-3 text-sm"><Type size={18}/> Cargar fuente TTF / OTF <input type="file" accept=".ttf,.otf,font/ttf,font/otf" className="hidden" onChange={e=>void fontUpload(e.target.files?.[0])}/></label>
            <label className="block text-sm">Nombre de plantilla<input className="mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-2" value={t.name} onChange={e=>update({name:e.target.value})}/></label>
            <div className="flex flex-wrap gap-2"><button onClick={()=>addZone("custom","Texto libre")} className="rounded-lg bg-[#F05E07] px-3 py-2 text-xs font-semibold text-black">+ Nuevo texto</button><button onClick={()=>addZone("soul-logo","Logo oficial Soul")} className="rounded-lg border border-[#F05E07]/50 px-3 py-2 text-xs">+ Logo Soul</button><button onClick={()=>addZone("nickname","Nickname")} className="rounded-lg border border-white/20 px-3 py-2 text-xs">+ Nickname</button>{<button onClick={()=>addZone("soul","SOUL")} className="rounded-lg border border-white/20 px-3 py-2 text-xs">+ SOUL</button>}{["Twitch","TikTok","YouTube","Instagram"].map(net=><button key={net} onClick={()=>addZone("social",net)} className="rounded-lg border border-white/20 px-3 py-2 text-xs">+ {net}</button>)}</div>
            <div className="space-y-2"><p className="text-xs text-slate-300">Agregar logotipo de red social (capa independiente, ajustable y exportable)</p><div className="flex flex-wrap gap-2">{(["YouTube","Twitch","Instagram","TikTok"] as const).map(net=><button key={net} onClick={()=>{const id=`icon-${Date.now()}`;const size=Math.max(40,Math.round(t.width*.045));update({zones:[...(t.zones||[]),{id,kind:"social-icon",label:`Icono ${net}`,x:Math.round(t.width*.12),y:Math.round(t.height*.75),width:size,height:size,maxFont:size,minFont:1,color:"#FFFFFF",align:"left"}]});setZoneId(id);}} className="rounded-lg border border-[#F05E07]/40 px-3 py-2 text-xs">+ {net} icono</button>)}</div></div>
            <label className="flex items-center gap-2 text-sm text-slate-200"><input type="checkbox" checked={groupSameSocials} onChange={e=>setGroupSameSocials(e.target.checked)} className="accent-[#F05E07]"/>Agrupar iconos cuando comparten el mismo @usuario</label><div className="flex flex-wrap gap-2"><button onClick={organizeSocials} className="rounded-lg bg-[#F05E07] px-3 py-2 text-xs font-semibold text-black">Organizar mis redes: icono + @usuario</button><button onClick={equalizeSocialIcons} className="rounded-lg border border-white/30 px-3 py-2 text-xs">Igualar y alinear iconos</button></div>
            <p className="text-xs text-slate-400">Atajos del editor: Supr eliminar · Ctrl+C copiar · Ctrl+V pegar · Ctrl+D duplicar · Ctrl+Z deshacer · Ctrl+Y rehacer · flechas mover (Shift: 10 px). No afectan campos de texto.</p>
            <div className="space-y-2 rounded-xl border border-white/15 p-3"><p className="text-sm font-semibold">Capas y distribución</p><p className="text-xs text-slate-400">Marca varias capas para alinearlas o distribuirlas.</p><div className="flex flex-wrap gap-2">{(["left","bottom","space"] as const).map(mode=><button key={mode} disabled={multiSelected.length<2} className="rounded-lg border border-white/20 p-2 text-xs disabled:opacity-40" onClick={()=>alignSelected(mode)}>{mode==="left"?"Alinear izquierda":mode==="bottom"?"Alinear abajo":"Distribuir horizontal"}</button>)}<button disabled={multiSelected.length<2} onClick={groupSelected} className="rounded-lg border border-white/20 p-2 text-xs disabled:opacity-40">Agrupar</button></div>{t.zones?.map(z=><div key={z.id} className={`flex items-center gap-2 rounded-lg p-1 ${zoneId===z.id?"bg-[#F05E07]/15":"bg-white/5"}`}><input type="checkbox" aria-label={`Marcar ${z.label}`} checked={multiSelected.includes(z.id)} onChange={e=>setMultiSelected(v=>e.target.checked?[...v,z.id]:v.filter(id=>id!==z.id))}/><button onClick={()=>setZoneId(z.id)} className="min-w-0 flex-1 truncate px-2 py-2 text-left text-xs">{z.label}</button><button title={z.hidden?"Mostrar":"Ocultar"} onClick={()=>update({zones:t.zones!.map(a=>a.id===z.id?{...a,hidden:!a.hidden}:a)})} className="px-2 text-xs">{z.hidden?"Oculto":"Visible"}</button><button title={z.locked?"Desbloquear":"Bloquear"} onClick={()=>update({zones:t.zones!.map(a=>a.id===z.id?{...a,locked:!a.locked}:a)})} className="px-2 text-xs">{z.locked?"Bloqueado":"Libre"}</button></div>)}</div>
            {activeZone&&<div className="space-y-2">{activeZone.kind==="nickname"&&<label className="flex items-center gap-2 rounded-lg border border-[#F05E07]/30 p-3 text-sm"><input type="checkbox" checked={Boolean(t.zones?.some(z=>z.kind==="soul"&&z.anchorTo===activeZone.id))} onChange={e=>e.target.checked?applyTSNComposition():update({zones:(t.zones||[]).filter(z=>!(z.kind==="soul"&&z.anchorTo===activeZone.id))})} />Anclar SOUL pequeño arriba a la izquierda</label>}<label className="block text-xs text-slate-300">Nombre de capa<input value={activeZone.label} onChange={e=>updateZone({label:e.target.value})} className="mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-2"/></label>{activeZone.kind==="custom"&&<label className="block text-xs text-slate-300">Texto<input value={activeZone.text||""} onChange={e=>updateZone({text:e.target.value})} className="mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-2"/></label>}<div className="flex flex-wrap gap-2"><button onClick={copyStyle} className="rounded-lg border border-white/20 px-3 py-2 text-xs">Copiar formato</button><button disabled={!copiedStyle||activeZone.locked} onClick={pasteStyle} className="rounded-lg border border-white/20 px-3 py-2 text-xs disabled:opacity-40">Pegar formato</button><button onClick={duplicateZone} className="rounded-lg border border-white/20 px-3 py-2 text-xs">Duplicar</button><button onClick={()=>reorderZone(-1)} className="rounded-lg border border-white/20 px-3 py-2 text-xs">Atrás</button><button onClick={()=>reorderZone(1)} className="rounded-lg border border-white/20 px-3 py-2 text-xs">Adelante</button><button onClick={removeZone} className="rounded-lg border border-red-400/30 px-3 py-2 text-xs text-red-300">Eliminar</button></div></div>}
            
            <div className="space-y-3 rounded-xl border border-white/10 p-3">
              <label className="block text-xs font-semibold text-slate-200">Tipografía</label>
              <select value={fontFamily} onChange={e=>setFontFamily(e.target.value)} className="w-full rounded-lg border border-white/20 bg-[#07122c] p-3 text-sm text-white">
                {["The Soul Nation","Arial","SoulUploadedFont","Anton","Barlow Condensed","Bebas Neue","Oswald","Rajdhani","Roboto Condensed"].map(font=><option key={font} value={font}>{font==="SoulUploadedFont"?"The Soul Nation (fuente cargada)":font}</option>)}
              </select>
              <p className="text-xs text-slate-400">La fuente oficial está incluida y seleccionada por defecto. Las Google Fonts requieren conexión.</p>
              <div className="grid grid-cols-2 gap-2">
                {([{key:"tracking",label:"Espaciado (px)",max:20},{key:"strokeWidth",label:"Contorno (px)",max:12},{key:"shadowBlur",label:"Sombra (px)",max:40}] as const).map(setting=><label key={setting.key} className="text-xs text-slate-300">{setting.label}<input type="number" min={0} max={setting.max} value={(activeZone||t.area)[setting.key]??0} onChange={e=>updateArea({[setting.key]:Math.min(setting.max,Math.max(0,Number(e.target.value)))} as Partial<Area>)} className="mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-2"/></label>)}
                <label className="text-xs text-slate-300">Color contorno<input type="color" value={(activeZone||t.area).strokeColor??"#000000"} onChange={e=>updateArea({strokeColor:e.target.value})}/></label>
                <label className="text-xs text-slate-300">Color sombra<input type="color" value={(activeZone||t.area).shadowColor??"#000000"} onChange={e=>updateArea({shadowColor:e.target.value})}/></label>
              </div>
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
