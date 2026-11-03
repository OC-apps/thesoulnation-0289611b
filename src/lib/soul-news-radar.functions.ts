import { createServerFn } from "@tanstack/react-start";

export type RadarItem = { id:string; title:string; source_name:string; source_url:string; published_at:string; category:string };

export const getSoulNewsRadar = createServerFn({ method:"GET" }).handler(async():Promise<RadarItem[]> => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const since=new Date(Date.now()-1000*60*60*72).toISOString();
  const {data,error}=await supabaseAdmin.from("soul_news_articles")
    .select("id,title,source_name,source_url,published_at,category")
    .eq("status","draft").gte("published_at",since)
    .order("published_at",{ascending:false}).limit(12);
  if(error)return [];
  return (data||[]).filter(a=>typeof a.source_url==="string"&&/^https:\/\//.test(a.source_url)).slice(0,8);
});
