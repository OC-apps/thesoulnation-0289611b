import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { GEARS_BUCKET } from "./gears";
import type { GearsEpisode, GearsMedia } from "./gears";

const password = z.string().min(1).max(200);
function check(value: string) {
  if (!process.env.ADMIN_LIVE_PASSWORD || value !== process.env.ADMIN_LIVE_PASSWORD)
    throw Error("Contraseña incorrecta");
}
async function client() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as SupabaseClient;
}
const slot = z.enum(["intro", "background", "outro", "episode"]);
const path = z.string().regex(/^(intro|background|outro|episode)\/[0-9a-f-]+\.(mp4|mp3)$/);

export const getGearsAdmin = createServerFn({ method: "POST" })
  .inputValidator((raw) => z.object({ password }).parse(raw))
  .handler(async ({ data }) => {
    check(data.password);
    const db = await client();
    const [m, e] = await Promise.all([
      db.from("gears_media").select("*"),
      db.from("gears_episodes").select("*").order("published_at", { ascending: false }),
    ]);
    if (m.error || e.error) throw Error("No se pudieron cargar los episodios");
    return { media: m.data as GearsMedia[], episodes: e.data as GearsEpisode[] };
  });
export const prepareGearsUpload = createServerFn({ method: "POST" })
  .inputValidator((raw) =>
    z
      .object({
        password,
        slot,
        bytes: z
          .number()
          .int()
          .positive()
          .max(50 * 1024 * 1024),
      })
      .parse(raw),
  )
  .handler(async ({ data }) => {
    check(data.password);
    const db = await client();
    const ext = data.slot === "episode" ? "mp3" : "mp4";
    const uploadPath = `${data.slot}/${crypto.randomUUID()}.${ext}`;
    const { data: upload, error } = await db.storage
      .from(GEARS_BUCKET)
      .createSignedUploadUrl(uploadPath);
    if (error || !upload) throw Error("No se pudo autorizar la carga");
    return { path: uploadPath, token: upload.token };
  });
export const saveGearsUpload = createServerFn({ method: "POST" })
  .inputValidator((raw) =>
    z
      .object({
        password,
        slot,
        path,
        bytes: z.number().int().positive(),
        title: z.string().trim().min(3).max(250).optional(),
        description: z.string().max(3000).default(""),
      })
      .parse(raw),
  )
  .handler(async ({ data }) => {
    check(data.password);
    if (
      !data.path.startsWith(data.slot + "/") ||
      !data.path.endsWith(data.slot === "episode" ? ".mp3" : ".mp4")
    )
      throw Error("Archivo incompatible");
    const db = await client();
    const { data: info, error: infoError } = await db.storage.from(GEARS_BUCKET).info(data.path);
    if (infoError || !info || Number(info.size) !== data.bytes)
      throw Error("La carga no está completa");
    if (data.slot === "episode") {
      if (!data.title) throw Error("Falta el título");
      const { error } = await db.from("gears_episodes").insert({
        title: data.title,
        description: data.description,
        audio_path: data.path,
        audio_bytes: data.bytes,
        status: "draft",
      });
      if (error) throw Error("No se pudo guardar el episodio");
    } else {
      const { error } = await db.from("gears_media").upsert({
        id: data.slot,
        path: data.path,
        bytes: data.bytes,
        updated_at: new Date().toISOString(),
      });
      if (error) throw Error("No se pudo guardar el video");
    }
    return { ok: true };
  });
export const updateGearsEpisode = createServerFn({ method: "POST" })
  .inputValidator((raw) =>
    z
      .object({
        password,
        id: z.string().uuid(),
        title: z.string().trim().min(3).max(250),
        description: z.string().max(3000),
        status: z.enum(["draft", "published", "archived"]),
        published_at: z.string().datetime(),
      })
      .parse(raw),
  )
  .handler(async ({ data }) => {
    check(data.password);
    const db = await client();
    if (data.status === "published") {
      const { count, error } = await db
        .from("gears_media")
        .select("id", { count: "exact", head: true });
      if (error || count !== 3) throw Error("Carga primero los tres videos base");
    }
    const { password: _, id, ...values } = data;
    const { data: updated, error } = await db
      .from("gears_episodes")
      .update(values)
      .eq("id", id)
      .select("id")
      .single();
    if (error || !updated) throw Error("No se pudo actualizar el episodio");
    return { ok: true };
  });
