import { useEffect, useMemo, useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { getSoulRecruitment, updateSoulRecruitment } from "@/lib/soul-recruitment.functions";

type Application = Database["public"]["Tables"]["recruitment_submissions"]["Row"];
type Status = "pending"|"reviewing"|"accepted"|"rejected";
type Draft = {status:Status;adminNotes:string};
const STATUSES: {key:Status;label:string}[]=[
  {key:"pending",label:"Pendiente"},
  {key:"reviewing",label:"En revisión"},
  {key:"accepted",label:"Aceptado"},
  {key:"rejected",label:"No seleccionado"}
];
const safeLink=(value:string|null)=>!!value && /^https:\/\//i.test(value);

export function RecruitmentAdminPanel({password}:{password:string}) {
  const [rows,setRows]=useState<Application[]>([]);
  const [edits,setEdits]=useState<Record<string,Draft>>({});
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState<string|null>(null);
  const [filter,setFilter]=useState<"all"|Status>("all");
  const [message,setMessage]=useState("");

  useEffect(()=>{
    let active=true;
    const load=async()=>{
      setLoading(true);
      try {
        const result=await getSoulRecruitment({data:{password}});
        if(!active)return;
        setRows(result.applications);
        const draft:Record<string,Draft>={};
        for(const a of result.applications)draft[a.id]={status:a.status as Status,adminNotes:a.admin_notes??""};
        setEdits(draft);setMessage("");
      }catch(e){if(active)setMessage(e instanceof Error?e.message:"Error al consultar postulaciones");}
      finally{if(active)setLoading(false);}
    };
    void load();
    return()=>{active=false;};
  },[password]);

  const visible=useMemo(()=>rows.filter(row=>filter==="all"||row.status===filter),[rows,filter]);
  const update=(id:string,patch:Partial<Draft>)=>{
    const row=rows.find(x=>x.id===id);
    setEdits(prev=>({...prev,[id]:{status:(prev[id]?.status??row?.status??"pending") as Status,adminNotes:prev[id]?.adminNotes??row?.admin_notes??"",...patch}}));
  };
  const save=async(id:string)=>{
    const row=rows.find(x=>x.id===id);if(!row)return;
    const edit=edits[id]??{status:row.status as Status,adminNotes:row.admin_notes??""};
    setSaving(id);setMessage("");
    try{
      await updateSoulRecruitment({data:{password,id,status:edit.status,adminNotes:edit.adminNotes}});
      setRows(prev=>prev.map(r=>r.id===id?{...r,status:edit.status,admin_notes:edit.adminNotes}:r));
      setMessage("Postulación actualizada correctamente.");
    }catch(e){setMessage(e instanceof Error?e.message:"No se pudo guardar");}
    finally{setSaving(null);}
  };

  return <section className="space-y-5">
    <header className="border-b border-flame/20 pb-4">
      <h2 className="font-display text-xl text-white">Solicitudes de ingreso</h2>
      <p className="mt-2 text-sm text-white/65">Revisa postulaciones, organiza su seguimiento y guarda notas privadas. Estos datos no son visibles públicamente.</p>
    </header>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <label className="text-xs text-white/75">Filtrar
        <select value={filter} onChange={e=>setFilter(e.target.value as "all"|Status)} className="ml-3 rounded-lg border border-white/20 bg-[#080b29] px-3 py-2 text-sm text-white">
          <option value="all">Todas ({rows.length})</option>
          {STATUSES.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </label>
      <span className="text-xs text-white/55">{visible.length} solicitudes</span>
    </div>
    {message&&<p role="status" className="rounded-lg border border-flame/25 bg-[#101331] p-3 text-xs text-white">{message}</p>}
    {loading?<p className="text-sm text-white/60">Cargando solicitudes…</p>:visible.length===0?<p className="rounded-xl border border-white/10 p-6 text-sm text-white/60">No hay postulaciones para este filtro.</p>:(
      <div className="space-y-4">
        {visible.map(app=>{
          const edit=edits[app.id]??{status:app.status as Status,adminNotes:app.admin_notes??""};
          return <article key={app.id} className="space-y-4 rounded-2xl border border-white/10 bg-[#101431] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg text-white">{app.nombre_nickname}</h3>
                <p className="mt-1 text-xs text-[#F05E07]">{app.area}</p>
              </div>
              <time dateTime={app.created_at} className="text-xs text-white/55">{new Date(app.created_at).toLocaleDateString("es-MX")}</time>
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-white/80">{app.sobre_ti}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
              {app.email&&<a href={"mailto:"+app.email} className="text-[#F05E07] hover:underline">{app.email}</a>}
              {([["RC",app.link_rc],["TikTok",app.red_tiktok],["YouTube",app.red_youtube],["Twitch",app.red_twitch],["Facebook",app.red_facebook],["Instagram",app.red_instagram]] as const).filter(([,v])=>safeLink(v)).map(([label,v])=>
                <a key={label} href={v!} rel="noopener noreferrer" target="_blank" className="text-[#F05E07] hover:underline">{label} ↗</a>)}
            </div>
            <div className="grid gap-3 sm:grid-cols-[190px_1fr_auto] sm:items-end">
              <label className="text-xs text-white/70">Estado
                <select value={edit.status} onChange={e=>update(app.id,{status:e.target.value as Status})} className="mt-1 w-full rounded-lg border border-white/20 bg-[#080b29] p-3 text-sm text-white">
                  {STATUSES.map(x=><option value={x.key} key={x.key}>{x.label}</option>)}
                </select>
              </label>
              <label className="text-xs text-white/70">Notas internas
                <textarea rows={2} maxLength={3000} value={edit.adminNotes} onChange={e=>update(app.id,{adminNotes:e.target.value})}
                  className="mt-1 w-full rounded-lg border border-white/20 bg-[#080b29] p-3 text-sm text-white" placeholder="Seguimiento del equipo…"/>
              </label>
              <button type="button" onClick={()=>void save(app.id)} disabled={saving===app.id} className="min-h-11 rounded-lg bg-[#F05E07] px-4 font-semibold text-white disabled:opacity-50">
                {saving===app.id?"Guardando…":"Guardar"}
              </button>
            </div>
          </article>;
        })}
      </div>
    )}
  </section>;
}
