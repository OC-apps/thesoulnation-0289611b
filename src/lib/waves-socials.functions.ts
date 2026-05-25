import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const urlOrEmpty = z.union([z.string().url().max(500), z.literal("")]).optional().default("");

const Input = z.object({
  password: z.string().min(1).max(200),
  name: z.string().min(1).max(120),
  tiktok: urlOrEmpty,
  twitch: urlOrEmpty,
  youtube: urlOrEmpty,
  x: urlOrEmpty,
  facebook: urlOrEmpty,
  bio: z.string().max(4000).optional(),
  redes: z.string().max(200).optional(),
});

export const upsertWavesSocials = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    if (data.password !== process.env.ADMIN_LIVE_PASSWORD) {
      throw new Error("Contraseña incorrecta");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload: Record<string, unknown> = {
      name: data.name.trim().toUpperCase(),
      tiktok_url: data.tiktok?.trim() || null,
      twitch_url: data.twitch?.trim() || null,
      youtube_url: data.youtube?.trim() || null,
      x_url: data.x?.trim() || null,
      facebook_url: data.facebook?.trim() || null,
      updated_at: new Date().toISOString(),
    };
    if (data.bio !== undefined) payload.bio = data.bio.trim() || null;
    if (data.redes !== undefined) payload.redes = data.redes.trim() || null;
    const { error } = await supabaseAdmin.from("waves_socials").upsert(payload, { onConflict: "name" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const DynInput = z.object({
  password: z.string().min(1).max(200),
  id: z.string().uuid(),
  bio: z.string().max(4000).optional(),
  redes: z.string().max(200).optional(),
  socialLabel: z.string().max(40).optional(),
  socialHref: z.union([z.string().url().max(500), z.literal("")]).optional(),
});

export const updateWavesMemberContent = createServerFn({ method: "POST" })
  .inputValidator((d) => DynInput.parse(d))
  .handler(async ({ data }) => {
    if (data.password !== process.env.ADMIN_LIVE_PASSWORD) {
      throw new Error("Contraseña incorrecta");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: Record<string, unknown> = {};
    if (data.bio !== undefined) patch.bio = data.bio.trim();
    if (data.redes !== undefined) patch.redes = data.redes.trim();
    if (data.socialLabel !== undefined) patch.social_label = data.socialLabel.trim() || null;
    if (data.socialHref !== undefined) patch.social_href = data.socialHref?.trim() || null;
    if (Object.keys(patch).length === 0) return { ok: true };
    const { error } = await supabaseAdmin.from("waves_members").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
