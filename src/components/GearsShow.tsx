import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GearsEpisode, GearsMedia } from "@/lib/gears";
import { GearsPlayer } from "./GearsPlayer";

export function GearsShow() {
  const [articleExpanded, setArticleExpanded] = useState(false);
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
      <article className="mt-9 rounded-2xl border border-white/15 bg-[#101224]/90 p-5 sm:p-7" aria-labelledby="gears-first-editorial">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[.2em] text-[#F05E07]">Edición editorial · 2 de noviembre de 2026</span>
          <span className="text-xs text-white/45">Episodio inaugural</span>
        </div>
        <h3 id="gears-first-editorial" className="max-w-4xl text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">E-Day bajo la lupa: presupuesto millonario, 20 años de Gears y nuevas correcciones</h3>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65">En esta edición, Dizzy repasa tres temas que mantienen activa a la comunidad: las cifras que rodean a The Coalition, el aniversario de la franquicia y las últimas mejoras del juego.</p>
        <div tabIndex={0} aria-label="Artículo editorial; desplázate para seguir leyendo" className={`mt-6 space-y-5 overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-[#080A19]/80 p-4 text-sm leading-7 text-white/75 sm:p-6 ${articleExpanded ? "max-h-none" : "max-h-[300px]"}`}>
          <section className="space-y-2">
            <h4 className="text-lg font-bold text-white">¿Realmente costó 500 millones de dólares desarrollar E-Day?</h4>
            <p>Durante los últimos días circularon reportes que relacionan a Gears of War: E-Day con un presupuesto de 500 millones de dólares. Sin embargo, la cifra debe interpretarse con cautela. Un reporte de Windows Central, atribuido al periodista Jez Corden, indicó que podría incluir gastos de The Coalition durante varios años y no únicamente los costos de producción de E-Day.</p>
            <p>El estudio también ha trabajado en tecnología de Unreal Engine y ha brindado apoyo a otros proyectos de Xbox. Por lo tanto, no es correcto presentar los 500 millones como el presupuesto confirmado de un solo videojuego. La distribución exacta de esos recursos no ha sido detallada públicamente en una contabilidad oficial.</p>
          </section>
          <section className="space-y-2">
            <h4 className="text-lg font-bold text-white">Gears of War se acerca a sus 20 años</h4>
            <p>El primer Gears of War llegó a Xbox 360 el 7 de noviembre de 2006. En noviembre de 2026, la franquicia celebra dos décadas de historia: campañas cooperativas, multijugador competitivo y una comunidad que ha acompañado a la saga a través de distintas generaciones.</p>
            <p>Alrededor del aniversario se han anunciado actividades y contenidos especiales. Las fechas concretas de los eventos deben consultarse en los canales oficiales de Gears of War, ya que el aniversario del lanzamiento original corresponde al 7 de noviembre.</p>
          </section>
          <section className="space-y-2">
            <h4 className="text-lg font-bold text-white">Correcciones técnicas y próximos cambios al multijugador</h4>
            <p>The Coalition ha comunicado correcciones relacionadas con la estabilidad, el progreso en campaña y el registro de determinados logros. También se mencionaron errores visuales que afectaban la presentación de algunos personajes.</p>
            <p>Además, se esperan detalles sobre ajustes al equilibrio de armas. Hasta contar con las notas oficiales de cada actualización, no sería adecuado afirmar qué armas cambiarán ni cómo afectarán al competitivo.</p>
          </section>
          <p className="border-t border-white/10 pt-4 text-xs text-white/50">Esta nota amplía los temas comentados en Gears al Carbón. Las cifras no confirmadas se presentan como reportes, no como hechos verificados.</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button type="button" aria-expanded={articleExpanded} onClick={() => setArticleExpanded(v => !v)} className="rounded-full border border-[#F05E07]/70 px-4 py-2 text-sm font-semibold text-[#F05E07] transition hover:bg-[#F05E07]/10">{articleExpanded ? "Contraer artículo" : "Leer artículo completo"}</button>
          <a href="https://www.windowscentral.com/gaming/xbox/gears-of-war-e-days-usd500-million-budget-story-over-simplifies" target="_blank" rel="noopener noreferrer" className="text-xs text-white/55 underline decoration-white/25 underline-offset-4 hover:text-white">Fuente sobre el presupuesto: Windows Central</a>
        </div>
      </article>
    </section>
  );
}
