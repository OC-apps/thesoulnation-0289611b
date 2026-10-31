import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const password = z.string().min(1).max(200);
const statuses = z.enum(["pending","reviewing","accepted","rejected"]);

function validate(passwordInput: string) {
  if (!process.env.ADMIN_LIVE_PASSWORD || passwordInput !== process.env.ADMIN_LIVE_PASSWORD) {
    throw new Error("Contraseña incorrecta");
  }
}

export const getSoulRecruitment = createServerFn({method:"POST"})
  .inputValidator(raw=>z.object({password}).parse(raw))
  .handler(async ({data})=>{
    validate(data.password);
    const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
    const {data:rows,error}=await supabaseAdmin.from("recruitment_submissions")
      .select("*").order("created_at",{ascending:false}).limit(250);
    if(error) throw new Error("No fue posible consultar las postulaciones");
    return {ok:true,applications:rows??[]};
  });

export const updateSoulRecruitment = createServerFn({method:"POST"})
  .inputValidator(raw=>z.object({
    password, id:z.string().uuid(), status:statuses,
    adminNotes:z.string().max(3000),
  }).parse(raw))
  .handler(async ({data})=>{
    validate(data.password);
    const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
    const {data:row,error}=await supabaseAdmin.from("recruitment_submissions")
      .update({status:data.status,admin_notes:data.adminNotes,updated_at:new Date().toISOString()})
      .eq("id",data.id).select("id,status").single();
    if(error||!row) throw new Error("No se pudo actualizar la postulación");
    return {ok:true};
  });
