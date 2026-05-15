import { useState, useRef, type FormEvent, type MouseEvent } from "react";

const AREAS = [
  { value: "The Soul Legends (Montager)", label: "Legends", hint: "Montagers", icon: "🎯" },
  { value: "The Soul Waves (Streamer y CC)", label: "Waves", hint: "Streamers · CC", icon: "🌊" },
  { value: "The Soul Media (GFX y/o VFX)", label: "Media", hint: "GFX · VFX", icon: "🎨" },
  { value: "The Soul Killers (Top 100 Guardian)", label: "Killers", hint: "Top 100 Guardian", icon: "💀" },
];

export function RecruitmentForm() {
  const [area, setArea] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  const cardRef = useRef<HTMLFormElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - y) * 4, ry: (x - 0.5) * 5, mx: x * 100, my: y * 100 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!area) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/soulteamhq@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error("error");
      setStatus("ok");
      form.reset();
      setArea("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Selector de área 3D */}
      <div className="perspective grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        {AREAS.map((a) => {
          const active = area === a.value;
          return (
            <button
              key={a.value}
              type="button"
              onClick={() => setArea(a.value)}
              className={`area-chip group relative rounded-2xl border p-4 md:p-5 text-left transition-all ${
                active
                  ? "border-flame bg-flame/15 shadow-[0_20px_60px_-20px_var(--flame-glow)]"
                  : "border-border bg-card/40 hover:border-flame/60"
              }`}
            >
              <div className="text-2xl md:text-3xl mb-2 transition-transform group-hover:scale-110 group-hover:-translate-y-0.5">
                {a.icon}
              </div>
              <div className="font-display font-bold text-sm md:text-base">{a.label}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                {a.hint}
              </div>
              {active && (
                <span className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-flame text-primary-foreground text-[11px] font-bold">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Formulario 3D */}
      <div className="perspective">
        <form
          ref={cardRef}
          onSubmit={onSubmit}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{
            transform: `perspective(1400px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
          }}
          className="relative rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-6 md:p-10 shadow-[0_30px_80px_-20px_var(--flame-glow)] overflow-hidden"
        >
          {/* Glare cursor */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-60 mix-blend-overlay"
            style={{
              background: `radial-gradient(420px circle at ${tilt.mx}% ${tilt.my}%, oklch(1 0 0 / 0.18), transparent 55%)`,
            }}
          />
          {/* Conic border glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-40 blur-[14px]"
            style={{
              background: "conic-gradient(from 180deg at 50% 50%, var(--flame), var(--blue), var(--flame))",
              zIndex: -1,
            }}
          />

          <input type="hidden" name="_subject" value="RECLUTAMIENTO THE SOUL NATION" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="Area" value={area} />
          <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

          <p className="text-xs uppercase tracking-widest text-flame mb-2">* Indica un campo obligatorio</p>
          <p className="text-sm text-muted-foreground mb-8">Rellena todos los campos.</p>

          <div className="grid gap-6 relative z-10">
            <FloatField label="Nombre real y Nickname *" name="Nombre y Nickname" required placeholder="Ej: Juan Pérez · SOUL JUANP" />

            <div>
              <span className="text-sm font-bold uppercase tracking-wider">Área seleccionada *</span>
              <div
                className={`mt-2 w-full rounded-xl px-4 py-3 border transition ${
                  area
                    ? "border-flame bg-flame/10 text-foreground"
                    : "border-dashed border-border bg-background/40 text-muted-foreground"
                }`}
              >
                {area || "Selecciona un área arriba ↑"}
              </div>
            </div>

            <div>
              <FloatField
                label="Link de tu RC *"
                name="Link RC"
                type="url"
                required
                placeholder="https://youtube.com/..."
              />
              <span className="block text-xs text-muted-foreground mt-1">
                Para The Soul Legends: video con tus mejores clips de Gears of War subido a YouTube con el título "The Soul Nation RC".
              </span>
            </div>

            <FloatField
              label="Cuéntanos sobre ti y deja tus redes sociales *"
              name="Sobre ti y redes"
              required
              textarea
              placeholder="Edad, experiencia, juegos, plataformas, redes sociales, gamertag, etc."
            />

            <FloatField label="Correo de contacto" name="email" type="email" placeholder="tucorreo@ejemplo.com" />
          </div>

          <button
            type="submit"
            disabled={status === "sending" || !area}
            className="mt-10 w-full md:w-auto inline-flex items-center justify-center gap-3 bg-flame text-primary-foreground px-10 py-5 rounded-full font-bold text-lg shadow-[0_0_80px_-10px_var(--flame-glow)] hover:scale-[1.02] active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending" ? (
              <>
                <span className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Enviando…
              </>
            ) : (
              <>
                Enviar postulación
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>

          {status === "error" && (
            <p className="mt-4 text-sm text-destructive">No pudimos enviar tu postulación. Intenta de nuevo.</p>
          )}
        </form>
      </div>

      {/* Modal éxito */}
      {status === "ok" && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-up"
          onClick={() => setStatus("idle")}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full rounded-3xl border border-flame bg-card p-8 md:p-10 text-center shadow-[0_40px_120px_-20px_var(--flame-glow)]"
            style={{ animation: "fade-up 0.6s cubic-bezier(0.22,1,0.36,1)" }}
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-flame/20 flex items-center justify-center mb-6 animate-pulse-glow">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-flame">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-3xl font-bold leading-tight">
              ¡Postulación <span className="italic text-flame">enviada</span>!
            </h3>
            <p className="mt-4 text-sm md:text-base text-foreground/85 leading-relaxed">
              Recibimos tu RC correctamente. Si eres seleccionado, recibirás un mensaje
              en alguna de las <span className="text-flame font-bold">redes sociales</span> que nos
              proporcionaste.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-8 inline-flex items-center justify-center gap-2 bg-flame text-primary-foreground px-8 py-3 rounded-full font-bold shadow-[0_0_60px_-10px_var(--flame-glow)] hover:scale-105 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function FloatField({
  label,
  name,
  type = "text",
  required,
  placeholder,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
}) {
  const base =
    "mt-2 w-full bg-background/60 border border-border rounded-xl px-4 py-3 outline-none focus:border-flame focus:shadow-[0_0_0_4px_var(--flame-glow)] transition";
  return (
    <label className="block">
      <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
      {textarea ? (
        <textarea required={required} name={name} rows={6} placeholder={placeholder} className={`${base} resize-y`} />
      ) : (
        <input required={required} type={type} name={name} placeholder={placeholder} className={base} />
      )}
    </label>
  );
}
