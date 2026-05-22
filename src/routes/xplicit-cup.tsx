import { createFileRoute, Link } from "@tanstack/react-router";
import { XplicitCup } from "@/components/xplicit-cup";
import soulLogo from "@/assets/soul-logo.png";

export const Route = createFileRoute("/xplicit-cup")({
  head: () => ({
    meta: [
      { title: "Xplicit Cup — The Soul Nation" },
      {
        name: "description",
        content:
          "Archivo interactivo del torneo Xplicit Cup: el primer torneo en vivo de Gears of War transmitido por YouTube en la escena latina (10·02·2013).",
      },
      { property: "og:title", content: "Xplicit Cup — The Soul Nation" },
      {
        property: "og:description",
        content:
          "El torneo que marcó historia en la escena competitiva latina de Gears of War. Historia, broadcast, leyendas y campeones.",
      },
    ],
  }),
  component: XplicitCupPage,
});

function XplicitCupPage() {
  return (
    <div className="relative min-h-screen text-foreground overflow-hidden">
      {/* Fondo azul vivo tipo home */}
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 25% 10%, oklch(0.42 0.22 268 / 0.95), transparent 65%), radial-gradient(ellipse 70% 60% at 80% 90%, oklch(0.32 0.24 285 / 0.85), transparent 65%), linear-gradient(180deg, oklch(0.28 0.20 265), oklch(0.18 0.18 262) 55%, oklch(0.10 0.14 260))",
        }}
      />
      <div aria-hidden className="fixed -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[160px] opacity-30 z-0 pointer-events-none" style={{ background: "oklch(0.70 0.24 45)" }} />
      <div aria-hidden className="fixed -bottom-40 -left-40 w-[700px] h-[700px] rounded-full blur-[180px] opacity-50 z-0 pointer-events-none" style={{ background: "oklch(0.50 0.26 270)" }} />


      <header className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold tracking-tight">
            <img
              src={soulLogo}
              alt="The Soul Nation"
              width={26}
              height={26}
              className="drop-shadow-[0_0_12px_var(--flame-glow)]"
            />
            <span className="text-sm">
              THE SOUL <span className="text-flame">NATION</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-mono text-foreground/70 hover:text-flame transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
        </div>
      </header>

      <main>
        <XplicitCup />
      </main>
    </div>

  );
}
