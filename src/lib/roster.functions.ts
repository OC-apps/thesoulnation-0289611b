import { CURRENT_CREW, CURRENT_LEGENDS, CURRENT_WAVES, ROSTER_SYNC_MARKER } from "@/lib/roster-current";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Category = z.enum(["crew", "legends"]);

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
    const { data: existing, error: lookupError } = await supabaseAdmin.from("roster_members")
      .select("id").eq("nickname", data.nickname.trim())
      .in("category", data.category === "crew" ? ["crew", "killers"] : ["legends"])
      .limit(1).maybeSingle();
    if (lookupError) throw new Error(lookupError.message);
    if (existing) throw new Error("El integrante ya pertenece a esta división");
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
    const { data: member, error: readError } = await supabaseAdmin.from("roster_members").select("nickname, category").eq("id", data.id).single();
    if (readError) throw new Error(readError.message);
    let query = supabaseAdmin.from("roster_members").delete().eq("nickname", member.nickname);
    query = member.category === "legends" ? query.eq("category", "legends") : query.in("category", ["crew", "killers"]);
    const { error } = await query;
    if (error) throw new Error(error.message);
    return { ok: true };
  });


/** One-time owner-approved migration of the official 30-member roster.
 * Existing photos are preserved. Removed Waves are hidden instead of destroying their media.
 */
export const syncOfficialRoster = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    if (data.password !== process.env.ADMIN_LIVE_PASSWORD) throw new Error("Contraseña incorrecta");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: prior, error: priorError } = await supabaseAdmin.from("roster_members").select("id");
    if (priorError) throw new Error(priorError.message);
    const ids = (prior ?? []).map((row) => row.id);
    if (ids.length) {
      const { error } = await supabaseAdmin.from("roster_members").delete().in("id", ids);
      if (error) throw new Error(error.message);
    }
    const rows = [
      ...CURRENT_CREW.map((nickname, sort_order) => ({ nickname, category: "crew" as const, sort_order })),
      ...CURRENT_LEGENDS.map((nickname, sort_order) => ({ nickname, category: "legends" as const, sort_order })),
    ];
    const { error: rosterError } = await supabaseAdmin.from("roster_members").insert(rows);
    if (rosterError) throw new Error(rosterError.message);

    // Keep former Waves in the database for recovery, but exclude them publicly.
    const { data: existingWaves, error: wavesError } = await supabaseAdmin.from("waves_members").select("name");
    if (wavesError) throw new Error(wavesError.message);
    const allowed = new Set<string>(CURRENT_WAVES);
    const removed = new Set([
      "SOUL ENRI", "SOUL TEMPLA", "SOUL EMI X", "SOUL BELLATRIIX", "SOUL PXLMAA",
      ...(existingWaves ?? []).map((row) => String(row.name).trim().toUpperCase()).filter((name) => !allowed.has(name)),
    ]);
    const { data: hiddenRows, error: hiddenError } = await supabaseAdmin.from("waves_hidden").select("name");
    if (hiddenError) throw new Error(hiddenError.message);
    const hiddenNames = (hiddenRows ?? []).map((r) => String(r.name).toUpperCase());
    if (hiddenNames.length) {
      const { error } = await supabaseAdmin.from("waves_hidden").delete().in("name", hiddenNames);
      if (error) throw new Error(error.message);
    }
    if (removed.size) {
      const { error } = await supabaseAdmin.from("waves_hidden").insert([...removed].map((name) => ({ name })));
      if (error) throw new Error(error.message);
    }
    // Marker is added last: the public site switches to live DB only after roster sync completes.
    const { error: markerError } = await supabaseAdmin.from("roster_members").insert({
      nickname: ROSTER_SYNC_MARKER, category: "crew", sort_order: -1,
    });
    if (markerError) throw new Error(markerError.message);
    return { ok: true, crew: CURRENT_CREW.length, waves: CURRENT_WAVES.length, legends: CURRENT_LEGENDS.length };
  });
