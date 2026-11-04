import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
const pass=z.string().min(1).max(200);
const check=(password:string)=>{if(!process.env.ADMIN_LIVE_PASSWORD||password!==process.env.ADMIN_LIVE_PASSWORD)throw Error("Contraseña incorrecta");};
const member=z.object({memberId:z.string().uuid(),category:z.enum(["waves","legends","crew"])});
const url=z.string().url().max(1200).refine(v=>v.startsWith("https://"));
const provider=(value:string,type:"image"|"youtube"|"tiktok")=>{
 const u=new URL(value);
 if(type==="youtube")return ["youtube.com","www.youtube.com","m.youtube.com","youtu.be","www.youtube-nocookie.com"].includes(u.hostname);
 if(type==="tiktok")return ["tiktok.com","www.tiktok.com","vm.tiktok.com","vt.tiktok.com"].includes(u.hostname);
 return u.protocol==="https:";
};
const validateMember=async(admin:any,id:string,category:string)=>{
 const table=category==="waves"?"waves_members":"roster_members";
 const query=admin.from(table).select("id").eq("id",id);
 if(category!=="waves")query.eq("category",category);
 const {data,error}=await query.maybeSingle();
 if(error)throw Error(error.message);
 if(!data&&category==="waves"){const fallback=await admin.from("roster_wave_profiles").select("id").eq("id",id).maybeSingle();if(fallback.error||!fallback.data)throw Error("Integrante no encontrado");return;}
 if(!data)throw Error("Integrante no encontrado");
};
export const getRosterMediaAdmin=createServerFn({method:"POST"}).inputValidator(raw=>z.object({password:pass,...member.shape}).parse(raw)).handler(async({data})=>{
 check(data.password);const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
 await validateMember(supabaseAdmin,data.memberId,data.category);
 const {data:rows,error}=await supabaseAdmin.from("roster_profile_media" as "roster_members").select("*").eq("member_id",data.memberId).eq("member_category",data.category).order("sort_order");
 if(error)throw Error(error.message);return {items:rows||[]};
});
export const addRosterMedia=createServerFn({method:"POST"}).inputValidator(raw=>z.object({password:pass,...member.shape,type:z.enum(["image","youtube","tiktok"]),url,caption:z.string().max(200).default("")}).parse(raw)).handler(async({data})=>{
 check(data.password);if(!provider(data.url,data.type))throw Error("El enlace no corresponde a la plataforma seleccionada");
 const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
 await validateMember(supabaseAdmin,data.memberId,data.category);
 const {data:row,error}=await supabaseAdmin.from("roster_profile_media" as "roster_members").insert({member_id:data.memberId,member_category:data.category,media_type:data.type,media_url:data.url,caption:data.caption.trim(),sort_order:Math.floor(Date.now()/1000)} as never).select("id").single();
 if(error)throw Error(error.message);return {ok:true,id:row.id};
});
export const deleteRosterMedia=createServerFn({method:"POST"}).inputValidator(raw=>z.object({password:pass,id:z.string().uuid()}).parse(raw)).handler(async({data})=>{
 check(data.password);const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
 const {error}=await supabaseAdmin.from("roster_profile_media" as "roster_members").delete().eq("id",data.id);
 if(error)throw Error(error.message);return {ok:true};
});
export const prepareRosterImage=createServerFn({method:"POST"}).inputValidator(raw=>z.object({password:pass,...member.shape,extension:z.enum(["jpg","png","webp"])}).parse(raw)).handler(async({data})=>{
 check(data.password);const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
 await validateMember(supabaseAdmin,data.memberId,data.category);
 const path=`${data.category}/${data.memberId}/${crypto.randomUUID()}.${data.extension}`;
 const {data:ticket,error}=await supabaseAdmin.storage.from("roster-media").createSignedUploadUrl(path);
 if(error||!ticket)throw Error(error?.message||"No se pudo preparar la imagen");
 return {path,token:ticket.token};
});
export const saveRosterImage=createServerFn({method:"POST"}).inputValidator(raw=>z.object({password:pass,...member.shape,path:z.string().max(250),caption:z.string().max(200).default("")}).parse(raw)).handler(async({data})=>{
 check(data.password);if(!data.path.startsWith(`${data.category}/${data.memberId}/`)||!/\.(jpg|png|webp)$/.test(data.path))throw Error("Ruta inválida");
 const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
 await validateMember(supabaseAdmin,data.memberId,data.category);
 const {data:info,error:infoError}=await supabaseAdmin.storage.from("roster-media").info(data.path);
 if(infoError||!info||Number(info.size)>5242880)throw Error("No se pudo verificar la imagen");
 const mediaUrl=supabaseAdmin.storage.from("roster-media").getPublicUrl(data.path).data.publicUrl;
 const {error}=await supabaseAdmin.from("roster_profile_media" as "roster_members").insert({member_id:data.memberId,member_category:data.category,media_type:"image",media_url:mediaUrl,caption:data.caption,sort_order:Math.floor(Date.now()/1000)} as never);
 if(error)throw Error(error.message);return {ok:true,url:mediaUrl};
});
