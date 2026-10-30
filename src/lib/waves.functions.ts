import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LinkInput = z.object({ label: z.string().min(1).max(40), href: z.string().url().max(500) });

const AddInput = z.object({
  links: z.array(LinkInput).max(12).optional().default([]),
  password: z.string().min(1).max(200),
  name: z.string().min(1).max(80),
  redes: z.string().max(200).optional().default(""),
  bio: z.string().max(4000).optional().default(""),
  socialLabel: z.string().max(40).optional().default(""),
  socialHref: z.string().url().max(500).optional().or(z.literal("")),
  photoBase64: z.string().min(1), // data URL or base64
  photoMime: z.string().regex(/^image\/(png|jpe?g|webp|gif)$/),
});

const RemoveInput = z.object({
  password: z.string().min(1).max(200),
  id: z.string().uuid(),
});

export const addWavesMember = createServerFn({ method: "POST" })
  .inputValidator((d) => AddInput.parse(d))
  .handler(async ({ data }) => {
    if (data.password !== process.env.ADMIN_LIVE_PASSWORD) {
      throw new Error("Contraseña incorrecta");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // decode base64 (strip data URL prefix if present)
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

    const { data: maxRow } = await supabaseAdmin
      .from("waves_members")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = (maxRow?.sort_order ?? 0) + 1;

    const { error } = await supabaseAdmin.from("waves_members").insert({
      name: data.name.trim().toUpperCase(),
      redes: data.redes.trim(),
      bio: data.bio.trim(),
      photo_url: pub.publicUrl,
      social_label: data.socialLabel.trim() || null,
      social_href: data.socialHref?.trim() || null,
      sort_order: nextOrder,
    });
    if (error) throw new Error(error.message);
    if (data.links.length) {
      const { error: linksError } = await supabaseAdmin.from("waves_socials").upsert({
        name: data.name.trim().toUpperCase(),
        extra_links: data.links,
      } as any, { onConflict: "name" });
      if (linksError) throw new Error(linksError.message);
    }
    return { ok: true };
  });

export const removeWavesMember = createServerFn({ method: "POST" })
  .inputValidator((d) => RemoveInput.parse(d))
  .handler(async ({ data }) => {
    if (data.password !== process.env.ADMIN_LIVE_PASSWORD) {
      throw new Error("Contraseña incorrecta");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // try to delete the photo too
    const { data: row } = await supabaseAdmin
      .from("waves_members")
      .select("photo_url")
      .eq("id", data.id)
      .maybeSingle();
    if (row?.photo_url) {
      const m = row.photo_url.match(/\/wave-photos\/(.+)$/);
      if (m) await supabaseAdmin.storage.from("wave-photos").remove([m[1]]);
    }
    const { error } = await supabaseAdmin.from("waves_members").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
