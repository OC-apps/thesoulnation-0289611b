import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  password: z.string().min(1).max(200),
  memberId: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  isLive: z.boolean(),
});

export const setLiveStatus = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    if (data.password !== process.env.ADMIN_LIVE_PASSWORD) {
      throw new Error("Contraseña incorrecta");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("live_status")
      .upsert({ member_id: data.memberId, is_live: data.isLive, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
