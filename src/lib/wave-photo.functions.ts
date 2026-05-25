import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  password: z.string().min(1).max(200),
  kind: z.enum(["fixed", "dynamic"]),
  // For dynamic waves: row id in waves_members. For fixed: uppercase name key.
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(80).optional(),
  photoBase64: z.string().min(1),
  photoMime: z.string().regex(/^image\/(png|jpe?g|webp|gif)$/),
});

export const updateWavePhoto = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    if (data.password !== process.env.ADMIN_LIVE_PASSWORD) {
      throw new Error("Contraseña incorrecta");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const b64 = data.photoBase64.includes(",")
      ? data.photoBase64.split(",")[1]
      : data.photoBase64;
    const bytes = Buffer.from(b64, "base64");
    if (bytes.byteLength > 5 * 1024 * 1024) throw new Error("La foto debe pesar menos de 5MB");

    const ext = data.photoMime.split("/")[1].replace("jpeg", "jpg");
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("wave-photos")
      .upload(path, bytes, { contentType: data.photoMime, upsert: false });
    if (upErr) throw new Error(upErr.message);

    const { data: pub } = supabaseAdmin.storage.from("wave-photos").getPublicUrl(path);
    const newUrl = pub.publicUrl;

    if (data.kind === "dynamic") {
      if (!data.id) throw new Error("id requerido");
      const { data: row } = await supabaseAdmin
        .from("waves_members")
        .select("photo_url")
        .eq("id", data.id)
        .maybeSingle();
      const { error } = await supabaseAdmin
        .from("waves_members")
        .update({ photo_url: newUrl })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      if (row?.photo_url) {
        const m = row.photo_url.match(/\/wave-photos\/(.+)$/);
        if (m) await supabaseAdmin.storage.from("wave-photos").remove([m[1]]).catch(() => {});
      }
    } else {
      if (!data.name) throw new Error("name requerido");
      const key = data.name.trim().toUpperCase();
      const { data: existing } = await supabaseAdmin
        .from("waves_socials")
        .select("name, photo_url")
        .eq("name", key)
        .maybeSingle();
      const oldUrl = existing?.photo_url as string | null | undefined;
      const { error } = await supabaseAdmin
        .from("waves_socials")
        .upsert({ name: key, photo_url: newUrl }, { onConflict: "name" });
      if (error) throw new Error(error.message);
      if (oldUrl) {
        const m = oldUrl.match(/\/wave-photos\/(.+)$/);
        if (m) await supabaseAdmin.storage.from("wave-photos").remove([m[1]]).catch(() => {});
      }
    }

    return { ok: true, url: newUrl };
  });
