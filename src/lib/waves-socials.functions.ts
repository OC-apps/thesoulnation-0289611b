import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const urlOrEmpty = z.union([z.string().url().max(500), z.literal("")]).optional().default("");

const Input = z.object({
  extraLinks: z.array(z.object({ label: z.string().min(1).max(40), href: z.string().url().max(500) })).max(12).optional(),
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
    const { error } = await supabaseAdmin.from("waves_socials").upsert({
      name: data.name.trim().toUpperCase(),
      extra_links: data.extraLinks ?? undefined,
      tiktok_url: data.tiktok?.trim() || null,
      twitch_url: data.twitch?.trim() || null,
      youtube_url: data.youtube?.trim() || null,
      x_url: data.x?.trim() || null,
      facebook_url: data.facebook?.trim() || null,
      bio: data.bio !== undefined ? (data.bio.trim() || null) : undefined,
      redes: data.redes !== undefined ? (data.redes.trim() || null) : undefined,
      updated_at: new Date().toISOString(),
    } as any, { onConflict: "name" });
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
    const { error } = await supabaseAdmin
      .from("waves_members")
      .update({
        bio: data.bio !== undefined ? data.bio.trim() : undefined,
        redes: data.redes !== undefined ? data.redes.trim() : undefined,
        social_label: data.socialLabel !== undefined ? (data.socialLabel.trim() || null) : undefined,
        social_href: data.socialHref !== undefined ? (data.socialHref?.trim() || null) : undefined,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

