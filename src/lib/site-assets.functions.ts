import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const keys = ["home_banner","home_roster","home_videos","home_wallpapers","home_jersey","about_team"] as const;
export const updateSiteAsset = createServerFn({ method: "POST" })
  .inputValidator((raw) => z.object({
    password: z.string().min(1).max(200),
    key: z.enum(keys),
    photoBase64: z.string().min(1),
    photoMime: z.enum(["image/png","image/jpeg","image/webp"]),
  }).parse(raw))
  .handler(async ({ data }) => {
    if (!process.env.ADMIN_LIVE_PASSWORD || data.password !== process.env.ADMIN_LIVE_PASSWORD) throw new Error("Contraseña incorrecta");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const encoded = data.photoBase64.includes(",") ? data.photoBase64.slice(data.photoBase64.indexOf(",")+1) : data.photoBase64;
    if (encoded.length > 11_200_000) throw new Error("La imagen supera 8 MB");
    const binary = Buffer.from(encoded,"base64");
    if (!binary.length || binary.length > 8*1024*1024) throw new Error("La imagen debe pesar máximo 8 MB");
    const ext = data.photoMime === "image/jpeg" ? "jpg" : data.photoMime.split("/")[1];
    const path = `${data.key}/${crypto.randomUUID()}.${ext}`;
    const { error: storageError } = await supabaseAdmin.storage.from("site-assets").upload(path,binary,{contentType:data.photoMime,upsert:false});
    if (storageError) throw new Error(storageError.message);
    const { data: asset } = supabaseAdmin.storage.from("site-assets").getPublicUrl(path);
    const { error } = await supabaseAdmin.from("site_assets" as "roster_members").upsert({
      asset_key:data.key, image_url:asset.publicUrl,updated_at:new Date().toISOString(),
    } as never,{onConflict:"asset_key"});
    if (error) {
      await supabaseAdmin.storage.from("site-assets").remove([path]);
      throw new Error(error.message);
    }
    return {ok:true,url:asset.publicUrl};
  });
