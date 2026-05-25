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
      tiktok_url: data.tiktok?.trim() || null,
      twitch_url: data.twitch?.trim() || null,
      youtube_url: data.youtube?.trim() || null,
      x_url: data.x?.trim() || null,
      facebook_url: data.facebook?.trim() || null,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
