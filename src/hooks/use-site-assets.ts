import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteAssetKey = "home_banner"|"home_roster"|"home_videos"|"home_wallpapers"|"home_jersey"|"about_team";
export const HOME_ASSET_KEYS: {key:SiteAssetKey;label:string;hint:string}[] = [
 {key:"home_banner",label:"Banner principal",hint:"Imagen horizontal recomendada: 1920 × 600"},
 {key:"home_roster",label:"Tarjeta Roster",hint:"Imagen cuadrada recomendada"},
 {key:"home_videos",label:"Tarjeta Nuestros Videos",hint:"Imagen cuadrada recomendada"},
 {key:"home_wallpapers",label:"Tarjeta Wallpapers",hint:"Imagen cuadrada recomendada"},
 {key:"home_jersey",label:"Tarjeta Jersey Oficial",hint:"Imagen cuadrada recomendada"},
 {key:"about_team",label:"Foto de ¿Quiénes somos?",hint:"Fotografía horizontal o de grupo"},
];
export function useSiteAssets(){
 const [assets,setAssets]=useState<Partial<Record<SiteAssetKey,string>>>({});
 useEffect(()=>{
  let mounted=true;
  const load=async()=>{
   const {data,error}=await supabase.from("site_assets" as "roster_members").select("asset_key,image_url");
   if(!mounted||error||!data)return;
   const next:Partial<Record<SiteAssetKey,string>>={};
   for(const item of data as unknown as {asset_key:SiteAssetKey;image_url:string}[]){
    if(item.image_url)next[item.asset_key]=item.image_url;
   }
   setAssets(next);
  };
  void load();
  const onFocus=()=>void load();
  window.addEventListener("focus",onFocus);
  window.addEventListener("soul:site-assets-updated",onFocus);
  const channel=supabase.channel("site_assets_changes").on("postgres_changes",{event:"*",schema:"public",table:"site_assets"},onFocus).subscribe();
  return ()=>{
   mounted=false;
   window.removeEventListener("focus",onFocus);
   window.removeEventListener("soul:site-assets-updated",onFocus);
   void supabase.removeChannel(channel);
  };
 },[]);
 return assets;
}
