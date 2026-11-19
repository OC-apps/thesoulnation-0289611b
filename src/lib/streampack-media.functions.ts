import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { MEDIA_ASSETS, type MediaStatus } from "@/data/streampack-animations";

const ids = new Set(MEDIA_ASSETS.map(item=>item.id));
const password = z.string().min(1).max(200);
function check(value:string) {
  if(!process.env.ADMIN_LIVE_PASSWORD || value!==process.env.ADMIN_LIVE_PASSWORD)throw Error("Contraseña incorrecta");
}
async function table() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return (supabaseAdmin as SupabaseClient).from("streampack_media_status");
}
async function readStatuses():Promise<Record<string,MediaStatus>> {
  const db=await table();
  const {data,error}=await db.select("asset_id,status");
  if(error)throw Error("No se pudo consultar la gestión de StreamPack.");
  return Object.fromEntries((data||[]).map(row=>[row.asset_id,row.status]));
}
export const getStreamPackMediaVisibility = createServerFn({method:"GET"}).handler(async()=>{
  const statuses=await readStatuses();
  return MEDIA_ASSETS.filter(item=>!statuses[item.id]||statuses[item.id]==="visible").map(item=>item.id);
});
export const getStreamPackMediaAdmin=createServerFn({method:"POST"})
  .inputValidator(raw=>z.object({password}).parse(raw))
  .handler(async({data})=>{check(data.password);return readStatuses();});
export const setStreamPackMediaStatus=createServerFn({method:"POST"})
  .inputValidator(raw=>z.object({password,id:z.string().refine(id=>ids.has(id)),status:z.enum(["visible","hidden","deleted"])}).parse(raw))
  .handler(async({data})=>{
    check(data.password);
    const db=await table();
    const {error}=await db.upsert({asset_id:data.id,status:data.status,updated_at:new Date().toISOString()},{onConflict:"asset_id"});
    if(error)throw Error("No se pudo guardar el estado del recurso.");
    return {ok:true};
  });
