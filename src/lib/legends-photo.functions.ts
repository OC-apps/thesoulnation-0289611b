import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const uploadLegendPhoto = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    password: z.string().min(1).max(200),
    nickname: z.string().min(1).max(80),
    photoBase64: z.string().min(1),
    photoMime: z.enum(["image/png", "image/jpeg", "image/webp"]),
  }).parse(data))
  .handler(async ({ data }) => {
    if (!process.env.ADMIN_LIVE_PASSWORD || data.password !== process.env.ADMIN_LIVE_PASSWORD) {
      throw new Error("Contraseña incorrecta");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const nickname = data.nickname.trim().toUpperCase();
    if (!/^SOUL [A-Z0-9 ]+$/.test(nickname)) throw new Error("Gamertag no válido");
    const b64 = data.photoBase64.includes(",") ? data.photoBase64.split(",").pop()! : data.photoBase64;
    if (b64.length > Math.ceil(5 * 1024 * 1024 * 4 / 3) + 256) throw new Error("Máximo 5 MB");
    const bytes = Buffer.from(b64, "base64");
    if (!bytes.length || bytes.length > 5 * 1024 * 1024) throw new Error("Máximo 5 MB");
    const ext = data.photoMime === "image/jpeg" ? "jpg" : data.photoMime.split("/")[1];
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabaseAdmin.storage.from("legends-photos").upload(path, bytes, { contentType: data.photoMime });
    if (uploadError) throw new Error(uploadError.message);
    const { data: urlData } = supabaseAdmin.storage.from("legends-photos").getPublicUrl(path);
    // Types from the original project predate the independent Legends table.
    const photos = supabaseAdmin.from("legends_photos" as "roster_members");
    const { error } = await photos.upsert({ nickname, photo_url: urlData.publicUrl, updated_at: new Date().toISOString() } as never, { onConflict: "nickname" });
    if (error) {
      await supabaseAdmin.storage.from("legends-photos").remove([path]);
      throw new Error(error.message);
    }
    return { ok: true, url: urlData.publicUrl };
  });
