import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({
  password: z.string().min(1).max(200),
  memberId: z.string().min(3).max(120).regex(/^[a-z0-9-]+$/),
  isLive: z.boolean(),
  platform: z.enum(["tiktok", "twitch", "youtube", "facebook", "instagram", "other"]).nullable(),
  streamUrl: z.union([z.string().url().max(500).refine(url => url.startsWith("https://")), z.literal("")]).nullable(),
});

export const updateSoulLive = createServerFn({ method: "POST" })
  .inputValidator((value) => input.parse(value))
  .handler(async ({ data }) => {
    if (!process.env.ADMIN_LIVE_PASSWORD || data.password !== process.env.ADMIN_LIVE_PASSWORD) {
      throw new Error("Contraseña incorrecta");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const row = {
      member_id: data.memberId,
      is_live: data.isLive,
      platform: data.isLive ? data.platform : null,
      stream_url: data.isLive ? (data.streamUrl || null) : null,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabaseAdmin.from("live_status").upsert(row as never, { onConflict: "member_id" });
    if (error) throw new Error("No se pudo actualizar el estado en vivo");
    return { ok: true };
  });
