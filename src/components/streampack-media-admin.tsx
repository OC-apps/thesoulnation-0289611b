import { useEffect, useState } from "react";
import { MEDIA_ASSETS, MEDIA_CATEGORIES, type MediaStatus } from "@/data/streampack-animations";
import { getStreamPackMediaAdmin, setStreamPackMediaStatus } from "@/lib/streampack-media.functions";

export function StreamPackMediaAdmin({password}:{password:string}) {
  const [statuses,setStatuses]=useState<Record<string,MediaStatus>>({});
  const [ready,setReady]=useState(false);
  const [busy,setBusy]=useState<string|null>(null);
  const [message,setMessage]=useState("");
  useEffect(()=>{
    let cancelled=false;
    setReady(false);
    getStreamPackMediaAdmin({data:{password}}).then((result:Record<string,MediaStatus>)=>{if(!cancelled){setStatuses(result);setReady(true);}}).catch(()=>{if(!cancelled)setMessage("No se pudo cargar el catálogo. Intenta nuevamente.");});
    return ()=>{cancelled=true;};
  },[password]);
  async function change(id:string,status:MediaStatus) {
    if(status==="deleted"&&!window.confirm("¿Retirar este recurso de la biblioteca? No aparecerá en el sitio ni en los paquetes ZIP. El archivo original se conservará."))return;
    setBusy(id);setMessage("");
    try {
      await setStreamPackMediaStatus({data:{password,id,status}});
      setStatuses(current=>({...current,[id]:status}));
      setMessage("Cambio guardado.");
    } catch(error) {setMessage(error instanceof Error?error.message:"No se pudo guardar el cambio.");}
    finally {setBusy(null);}
  }
  const labels={visible:"Visible",hidden:"Oculto",deleted:"Retirado"};
  return <section className="space-y-4 rounded-xl border border-flame/25 p-4">
    <h2 className="text-lg font-bold">Biblioteca de StreamPack</h2>
    <p className="text-sm text-white/70">Controla qué videos pueden ver y descargar los visitantes. Ocultar es reversible; retirar quita el recurso del catálogo y conserva el archivo como respaldo.</p>
    <p role="status" className="text-sm text-amber-200">{message||(!ready?"Cargando biblioteca…":"")}</p>
    {ready&&MEDIA_CATEGORIES.map(category=><details key={category} open={category==="Intros y transiciones"} className="rounded-lg border border-white/10 p-3">
      <summary className="cursor-pointer font-semibold">{category}</summary>
      <div className="mt-3 space-y-2">{MEDIA_ASSETS.filter(item=>(item.category||"Intros y transiciones")===category).map(item=>{
        const status=statuses[item.id]||"visible";
        return <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-white/10 p-2">
          <div><div className="text-sm font-semibold">{item.name}</div><div className="text-xs text-white/60">{item.fileType} · {labels[status]}</div></div>
          <div className="flex flex-wrap gap-2 text-xs">
            {status!=="deleted"&&<button disabled={busy!==null} className="rounded border border-white/25 px-3 py-2 disabled:opacity-50" onClick={()=>void change(item.id,status==="visible"?"hidden":"visible")}>{status==="visible"?"Ocultar":"Mostrar"}</button>}
            {status==="deleted"?<button disabled={busy!==null} className="rounded border border-white/25 px-3 py-2" onClick={()=>void change(item.id,"visible")}>Restaurar</button>:<button disabled={busy!==null} className="rounded border border-red-400/60 px-3 py-2 text-red-300 disabled:opacity-50" onClick={()=>void change(item.id,"deleted")}>Borrar de biblioteca</button>}
          </div>
        </div>;
      })}</div>
    </details>)}
  </section>;
}
