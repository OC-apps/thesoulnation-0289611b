import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getGearsAdmin,
  prepareGearsUpload,
  saveGearsUpload,
  updateGearsEpisode,
} from "@/lib/gears-admin.functions";
import { GEARS_BUCKET } from "@/lib/gears";
import type { GearsEpisode, GearsMedia } from "@/lib/gears";
import { GearsPlayer } from "./GearsPlayer";

export function GearsAdmin({ password }: { password: string }) {
  const [episodes, setEpisodes] = useState<GearsEpisode[]>([]),
    [media, setMedia] = useState<GearsMedia[]>([]),
    [edit, setEdit] = useState<GearsEpisode | null>(null);
  const [title, setTitle] = useState(""),
    [description, setDescription] = useState(""),
    [file, setFile] = useState<File | null>(null),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const input = "block w-full rounded-lg border border-white/20 bg-[#151521] p-3 text-sm";
  const load = useCallback(async () => {
    try {
      const data = await getGearsAdmin({ data: { password } });
      setMedia(data.media);
      setEpisodes(data.episodes);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error de carga");
    }
  }, [password]);
  useEffect(() => {
    void load();
  }, [load]);
  async function upload(slot: "intro" | "background" | "outro" | "episode", asset: File) {
    setBusy(true);
    setMessage("Subiendo archivo directamente al almacenamiento…");
    try {
      if (!asset.name.toLowerCase().endsWith(slot === "episode" ? ".mp3" : ".mp4"))
        throw Error(slot === "episode" ? "Selecciona un MP3" : "Selecciona un MP4");
      if (asset.size > 50 * 1024 * 1024) throw Error("El archivo supera el límite de 50 MiB");
      const ticket = await prepareGearsUpload({ data: { password, slot, bytes: asset.size } });
      const { error } = await supabase.storage
        .from(GEARS_BUCKET)
        .uploadToSignedUrl(ticket.path, ticket.token, asset, {
          contentType: slot === "episode" ? "audio/mpeg" : "video/mp4",
          cacheControl: "31536000",
        });
      if (error) throw Error("No se pudo subir el archivo. Intenta de nuevo.");
      await saveGearsUpload({
        data: {
          password,
          slot,
          path: ticket.path,
          bytes: asset.size,
          title: slot === "episode" ? title : undefined,
          description,
        },
      });
      if (slot === "episode") {
        setTitle("");
        setDescription("");
        setFile(null);
      }
      setMessage("Archivo guardado. Los episodios nuevos quedan en borrador.");
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (!edit) return;
    setBusy(true);
    try {
      await updateGearsEpisode({
        data: {
          password,
          id: edit.id,
          title: edit.title,
          description: edit.description,
          status: edit.status,
          published_at: edit.published_at,
        },
      });
      setMessage("Episodio actualizado");
      setEdit(null);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Gears al Carbón</h2>
      <p className="text-sm text-white/60">
        Los tres videos se comparten entre todos los episodios. Para cada entrega, sube solo el MP3.
        Sin renderizado ni subtítulos.
      </p>
      <fieldset disabled={busy} className="rounded-xl border border-white/15 p-5">
        <legend>Videos base · cargar una sola vez</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          {(["intro", "background", "outro"] as const).map((slot) => (
            <label key={slot} className="text-sm">
              {slot === "intro"
                ? "Intro con jingle"
                : slot === "background"
                  ? "Fondo en bucle"
                  : "Outro"}
              <p className="my-2 text-xs text-white/50">
                {media.find((m) => m.id === slot)
                  ? "✓ Configurado · Solo reemplazar si cambia"
                  : "Pendiente"}
              </p>
              <input
                aria-label={`Cargar ${slot}`}
                type="file"
                accept="video/mp4,.mp4"
                className={input}
                onChange={(e) => {
                  const asset = e.target.files?.[0];
                  if (asset) void upload(slot, asset);
                  e.target.value = "";
                }}
              />
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/50">
          MP4 · máximo 50 MiB. Música del fondo al 8 % del volumen general.
        </p>
      </fieldset>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (file) void upload("episode", file);
        }}
        className="space-y-4 rounded-xl border border-white/15 p-5"
      >
        <h3 className="font-bold">Nuevo episodio</h3>
        <label className="block">
          Título
          <input
            required
            minLength={3}
            maxLength={250}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={input}
          />
        </label>
        <label className="block">
          Descripción
          <textarea
            maxLength={3000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={input}
          />
        </label>
        <label className="block">
          Narración MP3
          <input
            key={file?.name ?? "empty"}
            required
            type="file"
            accept="audio/mpeg,.mp3"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className={input}
          />
        </label>
        <button
          disabled={busy || !file}
          className="rounded-lg bg-[#F05E07] px-5 py-3 disabled:opacity-50"
        >
          Subir MP3 y crear borrador
        </button>
      </form>
      <p role="status" className="text-sm text-orange-200">
        {message}
      </p>
      {edit ? (
        <div className="space-y-4">
          <button onClick={() => setEdit(null)}>← Volver</button>
          <label className="block">
            Título
            <input
              className={input}
              value={edit.title}
              maxLength={250}
              onChange={(e) => setEdit({ ...edit, title: e.target.value })}
            />
          </label>
          <label className="block">
            Descripción
            <textarea
              className={input}
              maxLength={3000}
              value={edit.description}
              onChange={(e) => setEdit({ ...edit, description: e.target.value })}
            />
          </label>
          <label className="block">
            Fecha de publicación
            <input
              type="datetime-local"
              className={input}
              value={new Date(
                new Date(edit.published_at).getTime() -
                  new Date(edit.published_at).getTimezoneOffset() * 60000,
              )
                .toISOString()
                .slice(0, 16)}
              onChange={(e) => {
                if (e.target.value)
                  setEdit({ ...edit, published_at: new Date(e.target.value).toISOString() });
              }}
            />
          </label>
          <label className="block">
            Estado
            <select
              className={input}
              value={edit.status}
              onChange={(e) =>
                setEdit({ ...edit, status: e.target.value as GearsEpisode["status"] })
              }
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
          </label>
          <button disabled={busy} onClick={save} className="rounded-lg bg-[#F05E07] px-5 py-3">
            Guardar episodio
          </button>
          <GearsPlayer key={edit.id} episode={edit} media={media} />
        </div>
      ) : (
        <div className="divide-y divide-white/15">
          {episodes.map((e) => (
            <button
              key={e.id}
              onClick={() => setEdit({ ...e })}
              className="block w-full py-5 text-left"
            >
              <strong>{e.title}</strong>
              <span className="ml-3 text-sm text-white/50">
                {e.status} · {(e.audio_bytes / 1000000).toFixed(2)} MB · Editar / Previsualizar →
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
