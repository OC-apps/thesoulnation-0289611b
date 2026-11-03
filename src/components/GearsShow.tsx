import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GearsEpisode, GearsMedia } from "@/lib/gears";
import { GearsPlayer } from "./GearsPlayer";

export function GearsShow() {
  const [episodes, setEpisodes] = useState<GearsEpisode[]>([]),
    [media, setMedia] = useState<GearsMedia[]>([]),
    [selected, setSelected] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const db = supabase as SupabaseClient;
    void Promise.all([
      db.from("gears_media").select("*"),
      db
        .from("gears_episodes")
        .select("*")
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false }),
    ]).then(([m, e]) => {
      if (!active) return;
      if (m.error || e.error) {
        setError("No se pudieron cargar los episodios. Vuelve a intentarlo más tarde.");
        return;
      }
      setMedia(m.data ?? []);
      setEpisodes(e.data ?? []);
      setSelected(e.data?.[0]?.id ?? "");
    });
    return () => {
      active = false;
    };
  }, []);
  const episode = episodes.find((e) => e.id === selected);
  return (
    <section className="border-b border-white/15 py-12" aria-label="Gears al Carbón">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#F05E07]">
            Videopodcast · Con Dizzy
          </p>
          <h2 className="my-5 text-4xl font-black uppercase">Gears al Carbón.</h2>
          <p className="text-white/60">La opinión de la casa, en voz de Dizzy.</p>
          {error && (
            <p role="alert" className="mt-6">
              {error}
            </p>
          )}
          {!episode && !error && (
            <p className="mt-6 text-sm text-white/50">
              Los episodios aparecerán aquí al publicarse.
            </p>
          )}
          <div className="mt-8 space-y-3">
            {episodes.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e.id)}
                aria-pressed={selected === e.id}
                className={`block w-full rounded-xl border p-4 text-left ${selected === e.id ? "border-[#F05E07] bg-[#F05E07]/10" : "border-white/15"}`}
              >
                <span className="text-xs text-white/50">
                  {new Date(e.published_at).toLocaleDateString("es-MX", {
                    timeZone: "America/Tijuana",
                  })}
                </span>
                <h3 className="mt-2 font-bold">{e.title}</h3>
                <p className="mt-2 text-sm text-white/60">{e.description}</p>
              </button>
            ))}
          </div>
        </div>
        {episode && <GearsPlayer key={episode.id} episode={episode} media={media} />}
      </div>
    </section>
  );
}
