import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Networks = z.record(z.string(), z.string().max(180));
const Input = z.object({
  password:z.string().min(1).max(200),
  memberKey:z.string().min(2).max(100),
  nickname:z.string().min(3).max(80),
  category:z.enum(["waves","legends","crew"]),
  memberId:z.string().uuid().optional(),
  socials:Networks,
});
export const saveStreamMemberProfile=createServerFn({method:"POST"})
  .inputValidator(d=>Input.parse(d))
  .handler(async({data})=>{
    if(data.password!==process.env.ADMIN_LIVE_PASSWORD)throw Error("Contraseña incorrecta");
    const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
    const oldKey=data.memberKey.trim().toUpperCase(),name=data.nickname.trim().toUpperCase();
    if(!name.startsWith("SOUL "))throw Error("El nickname debe comenzar con SOUL ");
    const cleaned=Object.fromEntries(Object.entries(data.socials).map(([k,v])=>[k,v.trim()]));
    if(data.memberId&&data.category!=="waves"){
      const {error}=await supabaseAdmin.from("roster_members").update({nickname:name}).eq("id",data.memberId).eq("category",data.category);
      if(error)throw Error(error.message);
    }else if(data.memberId&&data.category==="waves"){
      const {error}=await supabaseAdmin.from("waves_members").update({name}).eq("id",data.memberId);
      if(error)throw Error(error.message);
    }else if(name!==oldKey){
      throw Error("Este integrante es parte del listado fijo de Waves. Su nickname debe actualizarse también en el roster oficial antes de cambiarlo.");
    }
    const {error:writeError}=await supabaseAdmin.from("stream_member_profiles").upsert({member_key:name,socials:cleaned,updated_at:new Date().toISOString()},{onConflict:"member_key"});
    if(writeError)throw Error(writeError.message);
    if(oldKey!==name){
      await supabaseAdmin.from("stream_member_profiles").delete().eq("member_key",oldKey);
    }
    return {ok:true,nickname:name};
  });
