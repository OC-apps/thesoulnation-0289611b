import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Flame, Newspaper, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/soul-news")({
  head: () => ({
    meta: [
      { title: "Soul News | Noticias de Gears of War | The Soul Nation" },
      { name: "description", content: "Soul News: actualidad de Gears of War, The Coalition, creadores y comunidad. Noticias verificadas y Gears al Carbón." },
      { property: "og:title", content: "Soul News | The Soul Nation" },
      { property: "og:description", content: "Noticias y análisis de Gears of War en español." },
      { property: "og:url", content: "https://thesoulnation.org/soul-news" },
    ],
    links: [{ rel: "canonical", href: "https://thesoulnation.org/soul-news" }],
  }),
  component: SoulNews,
});

const sources = [
  { name: "Gears of War — Oficial", href: "https://www.gearsofwar.com/" },
  { name: "The Coalition", href: "https://www.thecoalitionstudio.com/" },
  { name: "Xbox Wire", href: "https://news.xbox.com/" },
];

function SoulNews() {
  return (
    <main className="min-h-screen text-white" style={{ background: "linear-gradient(155deg, #08091b 0%, #01032e 55%, #100d19 100%)" }}>
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-12 sm:pt-20">
        <Link to="/" className="mb-14 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"><ArrowLeft size={16}/> The Soul Nation</Link>
        <header className="border-b border-white/15 pb-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[.3em] text-[#F05E07]">The Soul Nation · Editorial</p>
          <h1 className="text-5xl font-black uppercase tracking-tight sm:text-7xl">SOUL <span className="text-[#F05E07]">NEWS</span></h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">Noticias, análisis y actualidad de Gears of War. La voz de nuestra comunidad.</p>
        </header>
        <section className="grid gap-6 py-10 md:grid-cols-[1.6fr_1fr]">
          <article className="rounded-3xl border border-white/10 bg-white/[.045] p-7 sm:p-10">
            <Newspaper className="mb-8 text-[#F05E07]" size={32}/>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#F05E07]">Actualidad · Próximamente</p>
            <h2 className="mt-3 text-3xl font-bold">La información primero.</h2>
            <p className="mt-4 leading-7 text-white/65">Estamos preparando la publicación automatizada de noticias verificadas. Hasta conectar las fuentes y el sistema editorial, no mostraremos titulares inventados ni artículos de ejemplo como si fueran noticias reales.</p>
            <div className="mt-8 flex items-center gap-2 text-sm text-white/60"><ShieldCheck size={17}/> Noticias con fecha, fuente y contexto.</div>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/[.045] p-7 sm:p-9">
            <Flame className="mb-8 text-[#F05E07]" size={32}/>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#F05E07]">Opinión · Gears al Carbón</p>
            <h2 className="mt-3 text-3xl font-bold">La noticia también se comenta.</h2>
            <p className="mt-4 leading-7 text-white/65">Análisis, carrilla y conversación al estilo de Dizzy. Los guiones se revisarán antes de publicarse para distinguir hechos de opiniones.</p>
            <p className="mt-8 text-sm font-medium text-[#F05E07]">Primer episodio en preparación</p>
          </article>
        </section>
        <section className="border-t border-white/15 pt-8">
          <h2 className="text-xl font-bold">Fuentes oficiales</h2>
          <p className="mt-2 text-sm text-white/60">Consulta información directamente en las fuentes mientras se habilita el sistema de publicación.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">{sources.map(s => <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-white/15 bg-white/[.04] p-4 text-sm transition hover:border-[#F05E07]/60">{s.name}<ExternalLink size={15}/></a>)}</div>
        </section>
      </div>
    </main>
  );
}
