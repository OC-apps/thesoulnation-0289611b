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
    if(name!==oldKey){const {data:existing}=await supabaseAdmin.from("roster_members").select("id").eq("nickname",name).maybeSingle();if(existing)throw Error("Ese nickname ya está en uso.");}
    const {data:previousProfile}=await supabaseAdmin.from("stream_member_profiles").select("socials").eq("member_key",oldKey).maybeSingle();
    const cleaned={...((previousProfile?.socials as Record<string,string>|null)??{}),...Object.fromEntries(Object.entries(data.socials).map(([k,v])=>[k,v.trim()]))};
    if(data.memberId&&data.category!=="waves"){
      const {error}=await supabaseAdmin.from("roster_members").update({nickname:name}).eq("id",data.memberId).eq("category",data.category);
      if(error)throw Error(error.message);
    }else if(data.memberId&&data.category==="waves"){
      const {error}=await supabaseAdmin.from("waves_members").update({name}).eq("id",data.memberId);
      if(error)throw Error(error.message);
    }else if(name!==oldKey){
      // A fixed Wave has no database row. Copy its existing visual profile to a
      // dynamic row, then hide only its old static name.
      const {WAVES}=await import("@/lib/waves-defaults");
      const original=WAVES.find(m=>m.name.toUpperCase()===oldKey);
      if(!original)throw Error("No se encontró este Wave oficial.");
      const {data:previousWaveSocials}=await supabaseAdmin.from("waves_socials").select("photo_url").eq("name",oldKey).maybeSingle();
      const {data:duplicate}=await supabaseAdmin.from("waves_members").select("id").eq("name",name).maybeSingle();
      if(duplicate)throw Error("El nuevo nickname ya existe.");
      const {data:last}=await supabaseAdmin.from("waves_members").select("sort_order").order("sort_order",{ascending:false}).limit(1).maybeSingle();
      const {error:insertError}=await supabaseAdmin.from("waves_members").insert({
        name,redes:original.redes,bio:original.bio,photo_url:previousWaveSocials?.photo_url||original.photo,
        social_label:original.socials?.[0]?.label??null,social_href:original.socials?.[0]?.href??null,
        sort_order:(last?.sort_order??0)+1,
      });
      if(insertError)throw Error(insertError.message);
      const {error:hideError}=await supabaseAdmin.from("waves_hidden").upsert({name:oldKey},{onConflict:"name"});
      if(hideError)throw Error(hideError.message);
    }
    if(oldKey!==name&&data.category==="waves"){
      const {data:oldSocials,error:readSocialError}=await supabaseAdmin.from("waves_socials").select("*").eq("name",oldKey).maybeSingle();
      if(readSocialError)throw Error(readSocialError.message);
      if(oldSocials){
        const {name:_oldName,...socialFields}=oldSocials;
        const {error:moveError}=await supabaseAdmin.from("waves_socials").upsert({...socialFields,name},{onConflict:"name"});
        if(moveError)throw Error(moveError.message);
        await supabaseAdmin.from("waves_socials").delete().eq("name",oldKey);
      }
    }
    if(oldKey!==name&&data.category==="waves"){
      const slug=(value:string)=>value.toLowerCase().replace(/\\s+/g,"-");
      const oldId=slug(oldKey),newId=slug(name);
      const {data:oldLive,error:liveReadError}=await supabaseAdmin.from("live_status").select("member_id,is_live,platform,stream_url").eq("member_id",oldId).maybeSingle();
      if(liveReadError)throw Error(liveReadError.message);
      if(oldLive){
        const {data:newLive,error:newLiveError}=await supabaseAdmin.from("live_status").select("member_id").eq("member_id",newId).maybeSingle();
        if(newLiveError)throw Error(newLiveError.message);
        if(!newLive){
          const {error:liveWriteError}=await supabaseAdmin.from("live_status").insert({member_id:newId,is_live:oldLive.is_live,platform:oldLive.platform,stream_url:oldLive.stream_url});
          if(liveWriteError)throw Error(liveWriteError.message);
        }
        const {error:oldLiveDeleteError}=await supabaseAdmin.from("live_status").delete().eq("member_id",oldId);
        if(oldLiveDeleteError)throw Error(oldLiveDeleteError.message);
      }
    }
    const {error:writeError}=await supabaseAdmin.from("stream_member_profiles").upsert({member_key:name,socials:cleaned,updated_at:new Date().toISOString()},{onConflict:"member_key"});
    if(writeError)throw Error(writeError.message);
    if(oldKey!==name){
      await supabaseAdmin.from("stream_member_profiles").delete().eq("member_key",oldKey);
    }
    return {ok:true,nickname:name};
  });
