import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const passwordField = z.string().min(1).max(200);
const post = z.object({
  id: z.string().uuid().optional(),
  kind: z.enum(["news","event","video"]),
  title: z.string().trim().min(3).max(150),
  summary: z.string().max(1500),
  linkUrl: z.union([z.string().url().max(500).refine(v=>v.startsWith("https://")),z.literal("")]),
  eventAt: z.string().nullable(),
  published: z.boolean(),
});

const checkPassword = (password: string) => {
  if (!process.env.ADMIN_LIVE_PASSWORD || password !== process.env.ADMIN_LIVE_PASSWORD) {
    throw new Error("Contraseña incorrecta");
  }
};

export const getSoulPostsAdmin = createServerFn({ method:"POST" })
 .inputValidator((raw)=>z.object({password:passwordField}).parse(raw))
 .handler(async ({data})=>{
   checkPassword(data.password);
   const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
   const {data:posts,error}=await supabaseAdmin.from("soul_posts").select("*").order("created_at",{ascending:false}).limit(100);
   if(error) throw new Error("No se pudieron cargar las publicaciones");
   return {ok:true,posts:posts??[]};
 });

export const saveSoulPost = createServerFn({ method:"POST" })
 .inputValidator((raw)=>z.object({password:passwordField,post}).parse(raw))
 .handler(async ({data})=>{
   checkPassword(data.password);
   const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
   const parsedDate=data.post.eventAt ? new Date(data.post.eventAt) : null;
   if (parsedDate && isNaN(parsedDate.getTime())) throw new Error("Fecha de evento inválida");
   const row={
     ...(data.post.id ? {id:data.post.id}:{}),
     kind:data.post.kind,
     title:data.post.title,
     summary:data.post.summary,
     link_url:data.post.linkUrl || null,
     event_at:parsedDate ? parsedDate.toISOString():null,
     published:data.post.published,
     updated_at:new Date().toISOString(),
   };
   const {data:postSaved,error}=await supabaseAdmin.from("soul_posts").upsert(row).select("*").single();
   if(error||!postSaved) throw new Error("No se pudo guardar la publicación");
   return {ok:true,post:postSaved};
 });

export const deleteSoulPost = createServerFn({ method:"POST" })
 .inputValidator((raw)=>z.object({password:passwordField,id:z.string().uuid()}).parse(raw))
 .handler(async ({data})=>{
   checkPassword(data.password);
   const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
   const {error}=await supabaseAdmin.from("soul_posts").delete().eq("id",data.id);
   if(error) throw new Error("No se pudo eliminar la publicación");
   return {ok:true};
 });
