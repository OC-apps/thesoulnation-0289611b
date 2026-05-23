import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Category = z.enum(["crew", "legends", "killers"]);

const AddInput = z.object({
  password: z.string().min(1).max(200),
  nickname: z.string().min(1).max(50).regex(/^[A-Z0-9 ]+$/, "Solo mayúsculas, números y espacios"),
  category: Category,
});

const RemoveInput = z.object({
  password: z.string().min(1).max(200),
  id: z.string().uuid(),
});

export const addRosterMember = createServerFn({ method: "POST" })
  .inputValidator((d) => AddInput.parse(d))
  .handler(async ({ data }) => {
    if (data.password !== process.env.ADMIN_LIVE_PASSWORD) {
      throw new Error("Contraseña incorrecta");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: maxRow } = await supabaseAdmin
      .from("roster_members")
      .select("sort_order")
      .eq("category", data.category)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = (maxRow?.sort_order ?? 0) + 1;
    const { error } = await supabaseAdmin
      .from("roster_members")
      .insert({ nickname: data.nickname.trim(), category: data.category, sort_order: nextOrder });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeRosterMember = createServerFn({ method: "POST" })
  .inputValidator((d) => RemoveInput.parse(d))
  .handler(async ({ data }) => {
    if (data.password !== process.env.ADMIN_LIVE_PASSWORD) {
      throw new Error("Contraseña incorrecta");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("roster_members").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
