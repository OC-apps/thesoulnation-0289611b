import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  password: z.string().min(1).max(200),
  name: z.string().min(1).max(120),
  hidden: z.boolean(),
});

export const setWaveHidden = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    if (data.password !== process.env.ADMIN_LIVE_PASSWORD) {
      throw new Error("Contraseña incorrecta");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const name = data.name.trim().toUpperCase();
    if (data.hidden) {
      const { error } = await supabaseAdmin.from("waves_hidden").upsert({ name });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("waves_hidden").delete().eq("name", name);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
