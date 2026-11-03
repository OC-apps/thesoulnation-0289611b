import { useEffect, useRef, useState } from "react";
import { gearsUrl } from "@/lib/gears";
import type { GearsEpisode, GearsMedia, GearsSegment } from "@/lib/gears";

const dimensions={width:1080,height:1920};
const preferredTypes=[
  'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
  'video/mp4;codecs="avc1.640028,mp4a.40.2"',
  "video/mp4"
];

type MediaNode=HTMLAudioElement|HTMLVideoElement;

export function GearsExport({episode,media}:{episode:GearsEpisode;media:GearsMedia[]}){
  const [busy,setBusy]=useState(false);
  const [progress,setProgress]=useState(0);
  const [message,setMessage]=useState("");
  const cancel=useRef(false);
  const mime=typeof window!=="undefined"&&typeof MediaRecorder!=="undefined"
    ?preferredTypes.find(t=>MediaRecorder.isTypeSupported(t)) :undefined;
  useEffect(()=>()=>{cancel.current=true;},[]);

  async function exportVideo(){
    if(!mime)return setMessage("Este navegador no permite grabar MP4 H.264/AAC. Prueba Chrome o Edge de escritorio.");
    if(busy)return;
    if((["intro","background","outro"] as const).some(id=>!media.some(m=>m.id===id)))
      return setMessage("Faltan los tres videos base.");
    cancel.current=false;setBusy(true);setProgress(0);setMessage("Preparando medios para exportar en tiempo real…");
    const nodes:MediaNode[]=[];let raf=0;
    let rec:MediaRecorder|null=null;
    let ac:AudioContext|null=null;
    let trackStream:MediaStream|null=null;
    try{
      const create=(src:string,video:boolean)=>{
        const element=video?document.createElement("video"):document.createElement("audio");
        element.crossOrigin="anonymous";
        element.preload="auto";
        element.src=gearsUrl(src);
        if(video)(element as HTMLVideoElement).playsInline=true;
        nodes.push(element);
        return element;
      };
      const videos={} as Record<GearsSegment,HTMLVideoElement>;
      for(const id of ["intro","background","outro"] as const)
        videos[id]=create(media.find(m=>m.id===id)!.path,true) as HTMLVideoElement;
      const voice=create(episode.audio_path,false) as HTMLAudioElement;
      await Promise.all(nodes.map(el=>new Promise<void>((resolve,reject)=>{
        if(el.readyState>=1)return resolve();
        const timer=window.setTimeout(()=>reject(new Error("El archivo no respondió a tiempo.")),25000);
        el.addEventListener("loadedmetadata",()=>{clearTimeout(timer);resolve();},{once:true});
        el.addEventListener("error",()=>{clearTimeout(timer);reject(new Error("No se pudo cargar uno de los medios."));},{once:true});
        el.load();
      })));
      if(cancel.current)throw new Error("Cancelado");
      ac=new AudioContext();
      await ac.resume();
      const dest=ac.createMediaStreamDestination();
      const gains=nodes.map(node=>{
        const source=ac!.createMediaElementSource(node);
        const gain=ac!.createGain();
        gain.gain.value=node===videos.background?0.08:1;
        source.connect(gain).connect(dest);
        return gain;
      });
      const canvas=document.createElement("canvas");
      canvas.width=dimensions.width;canvas.height=dimensions.height;
      const ctx=canvas.getContext("2d",{alpha:false});
      if(!ctx)throw new Error("No se pudo iniciar el lienzo de exportación");
      const drawCover=(v:HTMLVideoElement)=>{
        ctx.fillStyle="#080913";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        const w=v.videoWidth||1080,h=v.videoHeight||1920;
        const factor=Math.min(canvas.width/w,canvas.height/h);
        const dw=w*factor,dh=h*factor;
        ctx.drawImage(v,(canvas.width-dw)/2,(canvas.height-dh)/2,dw,dh);
      };
      let active:GearsSegment="intro";
      let elapsed=0;
      let segmentStart=performance.now();
      const draw=()=>{
        if(cancel.current)return;
        try{
          drawCover(videos[active]);
          const t=(performance.now()-segmentStart)/1000;
          if(t<0.75&&active!=="intro"){
            const x=(t/0.75)*canvas.width*1.8-canvas.width*0.4;
            const gradient=ctx.createLinearGradient(x-260,0,x+170,0);
            gradient.addColorStop(0,"rgba(240,94,7,0)");
            gradient.addColorStop(.5,"rgba(240,94,7,.85)");
            gradient.addColorStop(1,"rgba(6,7,24,0)");
            ctx.fillStyle=gradient;ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle=`rgba(5,7,22,${Math.max(0,.55-t*.75)})`;
            ctx.fillRect(0,0,canvas.width,canvas.height);
          }
        }catch{ /* Video frames may take a moment to decode. */ }
        raf=requestAnimationFrame(draw);
      };
      draw();
      trackStream=new MediaStream([...canvas.captureStream(30).getVideoTracks(),...dest.stream.getAudioTracks()]);
      rec=new MediaRecorder(trackStream,{mimeType:mime,videoBitsPerSecond:6500000,audioBitsPerSecond:192000});
      const chunks:BlobPart[]=[];
      const recorder=rec;
      const stopped=new Promise<Blob>((resolve,reject)=>{
        recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
        recorder.onerror=()=>reject(new Error("No se pudo codificar el MP4"));
        recorder.onstop=()=>resolve(new Blob(chunks,{type:"video/mp4"}));
      });
      recorder.start(1000);
      const total=videos.intro.duration+voice.duration+videos.outro.duration;
      const playUntilEnd=async(el:MediaNode,slot:GearsSegment,offset:number)=>{
        if(cancel.current)throw new Error("Cancelado");
        active=slot;
        segmentStart=performance.now();
        el.currentTime=0;
        await el.play();
        await new Promise<void>((resolve,reject)=>{
          const tick=window.setInterval(()=>{
            setProgress(Math.min(99,Math.round((offset+el.currentTime)/total*100)));
            if(cancel.current){clearInterval(tick);el.pause();reject(new Error("Cancelado"));}
          },300);
          const done=()=>{clearInterval(tick);resolve();};
          const failed=()=>{clearInterval(tick);reject(new Error("La reproducción se interrumpió"))};
          el.addEventListener("ended",done,{once:true});
          el.addEventListener("error",failed,{once:true});
        });
      };
      await playUntilEnd(videos.intro,"intro",0);
      if(cancel.current)throw new Error("Cancelado");
      active="background";segmentStart=performance.now();
      videos.background.currentTime=0;
      videos.background.loop=true;
      await Promise.all([videos.background.play(),voice.play()]);
      await new Promise<void>((resolve,reject)=>{
        const interval=window.setInterval(()=>{
          setProgress(Math.min(99,Math.round((videos.intro.duration+voice.currentTime)/total*100)));
          if(cancel.current){clearInterval(interval);reject(new Error("Cancelado"));}
        },300);
        voice.addEventListener("ended",()=>{clearInterval(interval);resolve();},{once:true});
        voice.addEventListener("error",()=>{clearInterval(interval);reject(new Error("El MP3 se interrumpió"));},{once:true});
      });
      videos.background.pause();
      await playUntilEnd(videos.outro,"outro",videos.intro.duration+voice.duration);
      recorder.stop();
      const file=await stopped;
      if(!file.size)throw new Error("Se creó un archivo vacío.");
      const url=URL.createObjectURL(file);
      const link=document.createElement("a");
      link.href=url;
      link.download=`Gears_al_Carbon_${(episode.edition_date||"episodio").replace(/[^0-9a-z-]/gi,"_")}.mp4`;
      link.click();
      window.setTimeout(()=>URL.revokeObjectURL(url),60000);
      setProgress(100);
      setMessage("MP4 generado. Revisa imagen y audio antes de publicarlo en redes.");
      gains.forEach(g=>g.disconnect());
    }catch(e){
      if(rec&&rec.state!=="inactive")rec.stop();
      setMessage(e instanceof Error?e.message:"No se pudo generar el video");
    }finally{
      cancel.current=true;
      cancelAnimationFrame(raf);
      nodes.forEach(n=>{n.pause();n.removeAttribute("src");n.load();});
      trackStream?.getTracks().forEach(t=>t.stop());
      if(ac)void ac.close();
      setBusy(false);
    }
  }

  return <section className="mt-6 rounded-xl border border-[#F05E07]/30 bg-[#101224] p-5">
    <h3 className="text-lg font-bold">Exportación privada · Gears al Carbón</h3>
    <p className="mt-2 text-sm leading-6 text-white/60">Genera un MP4 vertical (1080 × 1920) con intro, transición, narración y outro. Se procesa en tu navegador en tiempo real y no se guarda en el servidor. Mantén esta pestaña abierta durante la exportación.</p>
    {!mime&&<p className="mt-2 text-sm text-amber-200">Tu navegador no ofrece codificación MP4 compatible. Esta opción requiere un navegador de escritorio con soporte H.264/AAC.</p>}
    <div className="mt-4 flex items-center gap-3">
      <button type="button" disabled={busy||!mime} onClick={()=>void exportVideo()} className="rounded-lg bg-[#F05E07] px-5 py-3 text-sm font-bold disabled:opacity-40">{busy?"Generando video…":"Generar MP4 para redes"}</button>
      {busy&&<button type="button" onClick={()=>{cancel.current=true}} className="rounded-lg border border-white/30 px-4 py-3 text-sm">Cancelar</button>}
      <span className="text-sm text-white/60">{progress}%</span>
    </div>
    <p role="status" className="mt-3 text-xs text-white/65">{message}</p>
  </section>;
}
