import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
const password=z.string().min(1).max(200);
const check=(p:string)=>{if(!process.env.ADMIN_LIVE_PASSWORD||p!==process.env.ADMIN_LIVE_PASSWORD)throw new Error("Contraseña incorrecta")};
const article=z.object({id:z.string().uuid(),title:z.string().trim().min(3).max(250),excerpt:z.string().max(2000),body:z.string().max(30000),category:z.string().max(80),kind:z.enum(["news","opinion"]),status:z.enum(["draft","published","archived"])});
const source=z.object({name:z.string().trim().min(2).max(120),platform:z.enum(["x","youtube","rss","website","twitch"]),source_url:z.string().url().refine(v=>v.startsWith("https://"))});
export const getSoulNewsAdmin=createServerFn({method:"POST"}).inputValidator(raw=>z.object({password}).parse(raw)).handler(async({data})=>{check(data.password);const {supabaseAdmin}=await import("@/integrations/supabase/client.server");const [a,s]=await Promise.all([supabaseAdmin.from("soul_news_articles").select("*").order("published_at",{ascending:false}).limit(200),supabaseAdmin.from("soul_news_sources").select("*").order("name")]);if(a.error||s.error)throw Error("No se pudieron cargar los datos");return {articles:a.data||[],sources:s.data||[]};});
export const saveSoulNewsArticle=createServerFn({method:"POST"}).inputValidator(raw=>z.object({password,article}).parse(raw)).handler(async({data})=>{check(data.password);const {supabaseAdmin}=await import("@/integrations/supabase/client.server");const {id,...values}=data.article;if(values.status==="published"){const body=values.body.replace(/<[^>]+>/g,"").trim();if(body.length<500||values.excerpt.trim().length<80)throw Error("Para publicar, desarrolla la noticia con contexto y detalles concretos (mínimo 500 caracteres de contenido y una entradilla informativa).");const {data:original,error:sourceError}=await supabaseAdmin.from("soul_news_articles").select("source_url").eq("id",id).single();if(sourceError||!original||!/^https:\/\//.test(original.source_url||""))throw Error("Se requiere una fuente original verificable para publicar.");}const {error}=await supabaseAdmin.from("soul_news_articles").update(values).eq("id",id);if(error)throw Error("No se pudo guardar el artículo");return {ok:true};});
export const toggleSoulNewsSource=createServerFn({method:"POST"}).inputValidator(raw=>z.object({password,id:z.string().uuid(),active:z.boolean()}).parse(raw)).handler(async({data})=>{check(data.password);const {supabaseAdmin}=await import("@/integrations/supabase/client.server");const {error}=await supabaseAdmin.from("soul_news_sources").update({active:data.active}).eq("id",data.id);if(error)throw Error("No se pudo actualizar la fuente");return {ok:true};});
export const addSoulNewsSource=createServerFn({method:"POST"}).inputValidator(raw=>z.object({password,source}).parse(raw)).handler(async({data})=>{check(data.password);const {supabaseAdmin}=await import("@/integrations/supabase/client.server");const {error}=await supabaseAdmin.from("soul_news_sources").insert({...data.source,category:"creator",active:true});if(error)throw Error("No se pudo agregar la fuente");return {ok:true};});

const coverBucket="soul-news-images";
const coverPath=z.string().regex(/^articles\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(webp|jpg|png)$/);
const coverExtension=z.enum(["webp","jpg","png"]);

export const prepareSoulNewsCover=createServerFn({method:"POST"})
  .inputValidator(raw=>z.object({password,id:z.string().uuid(),extension:coverExtension,bytes:z.number().int().positive().max(5*1024*1024)}).parse(raw))
  .handler(async({data})=>{
    check(data.password);
    const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
    const {data:existing,error:lookupError}=await supabaseAdmin.from("soul_news_articles").select("id").eq("id",data.id).single();
    if(lookupError||!existing)throw Error("Artículo no encontrado");
    const filename=`articles/${data.id}/${crypto.randomUUID()}.${data.extension}`;
    const {data:ticket,error}=await supabaseAdmin.storage.from(coverBucket).createSignedUploadUrl(filename);
    if(error||!ticket)throw Error("No se pudo autorizar la subida de portada");
    return {path:filename,token:ticket.token};
  });

export const saveSoulNewsCover=createServerFn({method:"POST"})
  .inputValidator(raw=>z.object({password,id:z.string().uuid(),path:coverPath,bytes:z.number().int().positive().max(5*1024*1024)}).parse(raw))
  .handler(async({data})=>{
    check(data.password);
    if(!data.path.startsWith(`articles/${data.id}/`))throw Error("La portada no corresponde a este artículo");
    const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
    const {data:info,error:infoError}=await supabaseAdmin.storage.from(coverBucket).info(data.path);
    if(infoError||!info||Number(info.size)!==data.bytes)throw Error("La imagen no se subió correctamente");
    const url=supabaseAdmin.storage.from(coverBucket).getPublicUrl(data.path).data.publicUrl;
    const {data:updated,error}=await supabaseAdmin.from("soul_news_articles")
      .update({image_url:url}).eq("id",data.id).select("id").single();
    if(error||!updated)throw Error("No se pudo asignar la portada");
    return {ok:true,url};
  });
