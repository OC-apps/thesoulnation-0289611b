import { useRef, useState, type PointerEvent } from "react";
export type TextRect = {x:number;y:number;width:number;height:number};
type Zone = TextRect & {id:string;label:string;locked?:boolean};
type Props = { background?:string; imageWidth:number; imageHeight:number; area:TextRect; onChange:(a:TextRect)=>void; zones?:Zone[]; selectedId?:string; onSelect?:(id:string)=>void; circleGuide?:boolean; };
const MIN=12;
export function StreamPackAreaEditor({background,imageWidth,imageHeight,area,onChange,zones,selectedId,onSelect,circleGuide=false}:Props){
 const surface=useRef<HTMLDivElement>(null);
 const interaction=useRef<{kind:"move"|"resize"|"draw";startX:number;startY:number;initial:TextRect}|null>(null);
 const [active,setActive]=useState(false);
 const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
 const coords=(e:PointerEvent<HTMLDivElement>)=>{
  const r=surface.current!.getBoundingClientRect();
  return {x:clamp((e.clientX-r.left)/r.width*imageWidth,0,imageWidth),y:clamp((e.clientY-r.top)/r.height*imageHeight,0,imageHeight)};
 };
 const begin=(e:PointerEvent<HTMLDivElement>,kind:"move"|"resize"|"draw")=>{
  if(zones?.find(z=>z.id===selectedId)?.locked)return;
  e.preventDefault();e.stopPropagation();
  const {x,y}=coords(e);
  interaction.current={kind,startX:x,startY:y,initial:area};
  setActive(true);e.currentTarget.setPointerCapture(e.pointerId);
  if(kind==="draw")onChange({x,y,width:MIN,height:MIN});
 };
 const move=(e:PointerEvent<HTMLDivElement>)=>{
  const op=interaction.current;if(!op)return;
  const {x,y}=coords(e);const dx=x-op.startX,dy=y-op.startY;const a=op.initial;
  if(op.kind==="move")onChange({...a,x:Math.round(clamp(a.x+dx,0,imageWidth-a.width)),y:Math.round(clamp(a.y+dy,0,imageHeight-a.height))});
  else if(op.kind==="resize")onChange({...a,width:Math.round(clamp(a.width+dx,MIN,imageWidth-a.x)),height:Math.round(clamp(a.height+dy,MIN,imageHeight-a.y))});
  else onChange({x:Math.round(Math.min(op.startX,x)),y:Math.round(Math.min(op.startY,y)),width:Math.round(Math.max(MIN,Math.abs(dx))),height:Math.round(Math.max(MIN,Math.abs(dy)))});
 };
 const end=()=>{interaction.current=null;setActive(false);};
 const left=area.x/imageWidth*100,top=area.y/imageHeight*100,w=area.width/imageWidth*100,h=area.height/imageHeight*100;
 return <div className="space-y-2">
  <p className="text-xs text-slate-300">Selecciona la zona que quieres editar. Arrástrala para moverla o usa la esquina naranja para cambiar su tamaño. Los clics fuera de las zonas no modifican nada.</p>
  <div ref={surface} className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-white/20 bg-[#0b1021] touch-none select-none" style={{aspectRatio:`${imageWidth}/${imageHeight}`}}
    onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
   {background?<img src={background} alt="Plantilla original" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-fill"/>:<div className="absolute inset-0 grid place-items-center text-xs text-white/40">Sube un PNG para editar sobre él</div>}
   {circleGuide&&<div aria-hidden="true" className="pointer-events-none absolute rounded-full border-2 border-dashed border-[#F05E07] shadow-[0_0_0_9999px_rgba(0,0,0,0.18)]" style={{width:"90%",height:"90%",top:"5%",left:"5%"}}/>}
   {zones?.filter(z=>z.id!==selectedId).map(z=><div key={z.id} role="button" tabIndex={0} aria-label={`Seleccionar ${z.label}`} onKeyDown={e=>{if(e.key==="Enter")onSelect?.(z.id)}} onPointerDown={e=>{e.stopPropagation();onSelect?.(z.id)}} className="absolute cursor-pointer border border-blue-300 bg-blue-400/15" style={{left:`${z.x/imageWidth*100}%`,top:`${z.y/imageHeight*100}%`,width:`${z.width/imageWidth*100}%`,height:`${z.height/imageHeight*100}%`}}><span className="absolute top-0 left-0 bg-blue-800 px-1 text-[10px]">{z.label}</span></div>)}
   <div role="group" aria-label="Zona editable de texto" className="absolute border-2 border-[#F05E07] bg-[#F05E07]/15" style={{left:`${left}%`,top:`${top}%`,width:`${w}%`,height:`${h}%`,cursor:zones?.find(z=>z.id===selectedId)?.locked?"not-allowed":"move"}}
     onPointerDown={e=>begin(e,"move")}>
     <span className="pointer-events-none absolute left-0 top-0 -translate-y-full rounded-t bg-[#F05E07] px-2 py-0.5 text-[10px] font-bold text-black">{zones?.find(z=>z.id===selectedId)?.label || "NICKNAME"}</span>
     <div className="absolute bottom-0 right-0 h-5 w-5 translate-x-1/3 translate-y-1/3 rounded-sm border-2 border-white bg-[#F05E07] shadow-lg" style={{cursor:"nwse-resize"}} onPointerDown={e=>begin(e,"resize")}/>
   </div>
  </div>
  <p aria-live="polite" className="text-xs text-slate-400">{active?"Ajustando zona…":"Zona seleccionada"} · X {Math.round(area.x)} · Y {Math.round(area.y)} · {Math.round(area.width)} × {Math.round(area.height)} px</p>
 </div>;
}
