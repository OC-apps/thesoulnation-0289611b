import { useEffect, useRef, useState } from "react";
import { StreamPackAreaEditor } from "@/components/streampack-area-editor";
import {
  customImage,
  newCustomTemplate,
  renderCustom,
  templateStorage,
  type CustomLayer,
  type CustomTemplate,
} from "@/lib/streampack-custom";
import officialLogo from "@/assets/soul-logo-official.png";

const SERVER_OVERLAY = {
  name: "Soul Stream · Gameplay, Cam y Livechat",
  src: "/streampack/shared/soul-gameplay-cam-livechat-f123ad237770.png",
  width: 1920,
  height: 1081,
};

const button =
  "rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#F05E07] disabled:opacity-40";
const input = "mt-1 w-full rounded-lg border border-white/20 bg-[#07122c] p-2 text-base text-white";
export function StreamPackCustomStudio() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<CustomTemplate[]>([]);
  const [draft, setDraft] = useState<CustomTemplate | null>(null);
  const [dirty, setDirty] = useState(false);
  const [selected, setSelected] = useState("");
  const [name, setName] = useState("Mi plantilla");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState("");
  const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const previewRevision = useRef(0);
  const picker = useRef<HTMLInputElement>(null);
  useEffect(() => {
    templateStorage("list")
      .then(setSaved)
      .catch((e) => setStatus(e.message));
  }, []);
  useEffect(() => {
    const revision = ++previewRevision.current;
    if (!draft) {
      setPreview("");
      return;
    }
    const timer = window.setTimeout(() => {
      const canvas = document.createElement("canvas");
      renderCustom(draft, canvas)
        .then(() => {
          if (revision === previewRevision.current) setPreview(canvas.toDataURL("image/png"));
        })
        .catch((e) => {
          if (revision === previewRevision.current) setStatus(e.message);
        });
    }, 80);
    return () => {
      clearTimeout(timer);
      previewRevision.current++;
    };
  }, [draft]);
  useEffect(() => {
    if (!dirty) return;
    const prevent = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);
  const guard = (action: () => void) => {
    if (dirty) setConfirmAction(() => action);
    else action();
  };
  const change = (patch: Partial<CustomTemplate>) => {
    setDraft((d) => (d ? { ...d, ...patch } : null));
    setDirty(true);
    setStatus("");
  };
  const active = draft?.layers.find((l) => l.id === selected);
  const patchLayer = (patch: Partial<CustomLayer>) => {
    if (draft && active)
      change({ layers: draft.layers.map((l) => (l.id === selected ? { ...l, ...patch } : l)) });
  };
  const create = () => {
    try {
      const next = newCustomTemplate(name, width, height);
      setDraft(next);
      setSelected("");
      setDirty(true);
      setStatus("");
    } catch (e) {
      setStatus((e as Error).message);
    }
  };
  const add = (
    kind: CustomLayer["kind"],
    src?: string,
    size?: { width: number; height: number },
  ) => {
    if (!draft) return;
    const w = Math.min(
      draft.width,
      size?.width || Math.round(draft.width * (kind === "gameplay" ? 0.7 : 0.25)),
    );
    const h = Math.min(
      draft.height,
      size?.height ||
        Math.round(
          kind === "text"
            ? draft.height * 0.12
            : kind === "chat"
              ? draft.height * 0.65
              : (w * 9) / 16,
        ),
    );
    const label = {
      text: "Texto",
      image: "Imagen PNG",
      shape: "Rectángulo",
      gameplay: "Gameplay",
      webcam: "Webcam",
      chat: "Chat",
    }[kind];
    const layer: CustomLayer = {
      id: crypto.randomUUID(),
      kind,
      label,
      src,
      x: Math.round((draft.width - w) / 2),
      y: Math.round((draft.height - h) / 2),
      width: w,
      height: h,
      color: kind === "shape" ? "#01039E" : "#FFFFFF",
      fontSize: Math.max(12, Math.round(draft.height * 0.055)),
      text: kind === "text" ? "Tu texto" : undefined,
    };
    change({ layers: [...draft.layers, layer] });
    setSelected(layer.id);
  };
  const importPNG = async (file?: File) => {
    if (!file || !draft) return;
    setBusy(true);
    try {
      if (file.type !== "image/png" || file.size > 25 * 1024 * 1024)
        throw Error("Selecciona un PNG de hasta 25 MB.");
      const src = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(Error("No se pudo leer el PNG."));
        reader.readAsDataURL(file);
      });
      const img = await customImage(src);
      if (img.naturalWidth * img.naturalHeight > 33554432)
        throw Error("El PNG supera 32 megapíxeles.");
      const fit = Math.min(1, draft.width / img.naturalWidth, draft.height / img.naturalHeight);
      add("image", src, {
        width: Math.max(1, Math.round(img.naturalWidth * fit)),
        height: Math.max(1, Math.round(img.naturalHeight * fit)),
      });
    } catch (e) {
      setStatus((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const save = async (copy = false) => {
    if (!draft) return;
    setBusy(true);
    try {
      const next = {
        ...draft,
        id: copy ? `custom-${crypto.randomUUID()}` : draft.id,
        name: (draft.name.trim() || "Mi plantilla") + (copy ? " · copia" : ""),
        updatedAt: new Date().toISOString(),
      };
      const items = await templateStorage("save", next);
      setSaved(items);
      setDraft(next);
      setDirty(false);
      setStatus(
        copy ? "Copia guardada." : "Plantilla guardada con sus imágenes en este navegador.",
      );
    } catch (e) {
      setStatus((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const remove = async (id: string) => {
    setBusy(true);
    try {
      setSaved(await templateStorage("delete", id));
      if (draft?.id === id) {
        setDraft(null);
        setDirty(false);
      }
      setPendingDelete(null);
      setStatus("Plantilla personalizada eliminada.");
    } catch (e) {
      setStatus((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const download = async () => {
    if (!draft) return;
    setBusy(true);
    try {
      const canvas = document.createElement("canvas");
      await renderCustom(draft, canvas);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(Error("No se pudo exportar el PNG."))),
          "image/png",
        ),
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${draft.name.replace(/[^\p{L}\p{N}_-]+/gu, "_") || "plantilla"}_${draft.width}x${draft.height}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setStatus(`PNG transparente exportado a ${draft.width} × ${draft.height} px.`);
    } catch (e) {
      setStatus((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const reorder = (direction: number) => {
    if (!draft || !active) return;
    const layers = [...draft.layers],
      i = layers.findIndex((l) => l.id === selected),
      target = i + direction;
    if (target < 0 || target >= layers.length) return;
    [layers[i], layers[target]] = [layers[target], layers[i]];
    change({ layers });
  };
  return (
    <div
      role="region"
      className="mt-6 rounded-2xl border border-white/15 bg-white/[.04] p-4 md:p-5"
      aria-label="Plantillas personalizadas"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Crear plantillas</h2>
          <p className="text-xs text-slate-300">
            Crea y administra tus diseños personalizados. El gráfico Soul Stream está en «Selecciona tu gráfico».
          </p>
        </div>
        <button
          type="button"
          className={`${button} border-[#F05E07]/60 text-[#F05E07]`}
          onClick={() => {
            setOpen(true);
            guard(() => {
              setDraft(null);
              setDirty(false);
            });
          }}
        >
          + Nueva plantilla
        </button>
        <button
          type="button"
          className={button}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Ocultar mis plantillas" : `Mis plantillas (${saved.length})`}
        </button>
      </div>
      {open && (
        <fieldset disabled={busy} className="mt-4 min-w-0 space-y-4">
          <p className="text-xs text-slate-300">
            El guardado incluye imágenes y capas en este navegador y dispositivo. Guarda antes de
            salir; borrar los datos del navegador elimina estas plantillas.
          </p>
          {saved.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {saved.map((item) => (
                <div
                  key={item.id}
                  className="flex max-w-full items-center gap-1 rounded-xl border border-white/15 p-1"
                >
                  <button
                    disabled={busy}
                    className={`${button} min-w-0 truncate border-0`}
                    onClick={() =>
                      guard(() => {
                        setDraft(structuredClone(item));
                        setSelected("");
                        setDirty(false);
                        setStatus("");
                      })
                    }
                  >
                    Editar {item.name} · {item.width} × {item.height}
                  </button>
                  <button
                    disabled={busy}
                    aria-label={`Eliminar ${item.name}`}
                    className={`${button} border-0 text-red-300`}
                    onClick={() => setPendingDelete(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
          {!draft ? (
            <form
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
              onSubmit={(e) => {
                e.preventDefault();
                create();
              }}
            >
              <label className="text-sm">
                Nombre
                <input
                  className={input}
                  value={name}
                  maxLength={100}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="text-sm">
                Formato
                <select
                  className={input}
                  value={
                    width === 1920 && height === 1080
                      ? "horizontal"
                      : width === 1080 && height === 1920
                        ? "vertical"
                        : "custom"
                  }
                  onChange={(e) => {
                    if (e.target.value === "horizontal") {
                      setWidth(1920);
                      setHeight(1080);
                    } else if (e.target.value === "vertical") {
                      setWidth(1080);
                      setHeight(1920);
                    } else {
                      setWidth(2048);
                      setHeight(2048);
                    }
                  }}
                >
                  <option value="horizontal">16:9 · Horizontal</option>
                  <option value="vertical">9:16 · Vertical</option>
                  <option value="custom">Personalizado</option>
                </select>
              </label>
              <label className="text-sm">
                Ancho (px)
                <input
                  className={input}
                  type="number"
                  min={64}
                  max={8192}
                  required
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
              </label>
              <label className="text-sm">
                Alto (px)
                <input
                  className={input}
                  type="number"
                  min={64}
                  max={8192}
                  required
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </label>
              <button className={`${button} self-end bg-[#F05E07] font-semibold text-black`}>
                Crear diseño
              </button>
            </form>
          ) : (
            <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-end gap-2">
                  <label className="min-w-0 flex-1 text-sm">
                    Nombre de plantilla
                    <input
                      className={input}
                      value={draft.name}
                      maxLength={100}
                      onChange={(e) => change({ name: e.target.value })}
                    />
                  </label>
                  <span className="py-2 text-xs text-slate-300">
                    {draft.width} × {draft.height} px · {dirty ? "Sin guardar" : "Guardada"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={busy}
                    className={`${button} bg-[#F05E07] font-semibold text-black`}
                    onClick={() => void save()}
                  >
                    Guardar plantilla
                  </button>
                  <button disabled={busy} className={button} onClick={() => void save(true)}>
                    Duplicar plantilla
                  </button>
                  <button disabled={busy} className={button} onClick={() => void download()}>
                    Exportar PNG transparente
                  </button>
                </div>
                <div
                  className="overflow-hidden rounded-xl"
                  style={{
                    backgroundColor: "#1b2540",
                    backgroundImage:
                      "conic-gradient(#36415a 25%,transparent 0 50%,#36415a 0 75%,transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                >
                  {active ? (
                    <StreamPackAreaEditor
                      background={preview}
                      imageWidth={draft.width}
                      imageHeight={draft.height}
                      area={active}
                      zones={draft.layers.filter((l) => !l.hidden)}
                      selectedId={selected}
                      onSelect={setSelected}
                      onChange={(rect) => patchLayer(rect)}
                    />
                  ) : preview ? (
                    <img
                      src={preview}
                      alt="Vista previa de plantilla personalizada; cuadrícula indica transparencia"
                      className="mx-auto max-h-[600px] w-full object-contain"
                    />
                  ) : (
                    <div className="p-10 text-center text-sm">
                      Lienzo transparente listo para agregar elementos.
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-300">
                  Selecciona una capa para moverla y redimensionarla. Gameplay, webcam y chat
                  recortan huecos transparentes en el PNG; sus guías no se exportan.
                </p>
              </div>
              <div className="min-w-0 space-y-3">
                <h3 className="font-semibold">Agregar elementos</h3>
                <div className="flex flex-wrap gap-2">
                  {(["gameplay", "webcam", "chat", "text", "shape"] as const).map((kind) => (
                    <button key={kind} disabled={busy} className={button} onClick={() => add(kind)}>
                      +{" "}
                      {
                        {
                          gameplay: "Gameplay",
                          webcam: "Webcam",
                          chat: "Chat",
                          text: "Texto",
                          shape: "Rectángulo",
                        }[kind]
                      }
                    </button>
                  ))}
                  <button
                    disabled={busy}
                    className={button}
                    onClick={() => picker.current?.click()}
                  >
                    + Imagen / logo PNG
                  </button>
                  <button
                    disabled={busy}
                    className={button}
                    onClick={() => add("image", officialLogo)}
                  >
                    + Logo oficial Soul
                  </button>
                  <input
                    ref={picker}
                    type="file"
                    accept="image/png"
                    className="hidden"
                    aria-label="Importar imagen PNG"
                    onChange={(e) => {
                      void importPNG(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </div>
                <h3 className="font-semibold">Capas · de fondo a frente</h3>
                {draft.layers.length === 0 && (
                  <p className="text-xs text-slate-300">Tu lienzo está vacío.</p>
                )}
                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {draft.layers.map((l) => (
                    <div
                      key={l.id}
                      className={`flex min-w-0 items-center gap-1 rounded-lg ${selected === l.id ? "bg-[#F05E07]/20" : "bg-white/5"}`}
                    >
                      <button
                        className="min-w-0 flex-1 truncate p-2 text-left text-sm"
                        onClick={() => setSelected(l.id)}
                      >
                        {l.label}
                      </button>
                      <button
                        className="p-2 text-xs"
                        aria-label={`${l.hidden ? "Mostrar" : "Ocultar"} ${l.label}`}
                        onClick={() =>
                          change({
                            layers: draft.layers.map((x) =>
                              x.id === l.id ? { ...x, hidden: !x.hidden } : x,
                            ),
                          })
                        }
                      >
                        {l.hidden ? "Oculta" : "Visible"}
                      </button>
                    </div>
                  ))}
                </div>
                {active && (
                  <div className="space-y-3 rounded-xl border border-white/20 p-3">
                    <label className="block text-sm">
                      Nombre de capa
                      <input
                        className={input}
                        value={active.label}
                        onChange={(e) => patchLayer({ label: e.target.value })}
                      />
                    </label>
                    {active.kind === "text" && (
                      <>
                        <label className="block text-sm">
                          Texto
                          <textarea
                            className={input}
                            value={active.text || ""}
                            onChange={(e) => patchLayer({ text: e.target.value })}
                          />
                        </label>
                        <label className="block text-sm">
                          Tamaño de texto (px)
                          <input
                            type="number"
                            min={1}
                            max={2048}
                            className={input}
                            value={active.fontSize}
                            onChange={(e) =>
                              patchLayer({
                                fontSize: Math.max(1, Math.min(2048, Number(e.target.value) || 1)),
                              })
                            }
                          />
                        </label>
                      </>
                    )}
                    {["shape", "text"].includes(active.kind) && (
                      <label className="flex items-center justify-between text-sm">
                        Color
                        <input
                          type="color"
                          value={active.color}
                          onChange={(e) => patchLayer({ color: e.target.value })}
                        />
                      </label>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {(["x", "y", "width", "height"] as const).map((key) => (
                        <label key={key} className="text-xs">
                          {{ x: "X", y: "Y", width: "Ancho", height: "Alto" }[key]}
                          <input
                            className={input}
                            type="number"
                            min={key === "x" || key === "y" ? 0 : 1}
                            max={key === "x" || key === "width" ? draft.width : draft.height}
                            value={active[key]}
                            onChange={(e) => {
                              const value = Math.round(Number(e.target.value));
                              if (!Number.isFinite(value)) return;
                              const horizontal = key === "x" || key === "width",
                                max = horizontal ? draft.width : draft.height;
                              if (key === "x" || key === "y")
                                patchLayer({
                                  [key]: Math.max(
                                    0,
                                    Math.min(
                                      max - (horizontal ? active.width : active.height),
                                      value,
                                    ),
                                  ),
                                });
                              else
                                patchLayer({
                                  [key]: Math.max(
                                    1,
                                    Math.min(max - (horizontal ? active.x : active.y), value),
                                  ),
                                });
                            }}
                          />
                        </label>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className={button} onClick={() => reorder(-1)}>
                        Atrás
                      </button>
                      <button className={button} onClick={() => reorder(1)}>
                        Adelante
                      </button>
                      <button
                        className={button}
                        onClick={() => {
                          const copy = {
                            ...active,
                            id: crypto.randomUUID(),
                            label: active.label + " copia",
                          };
                          change({ layers: [...draft.layers, copy] });
                          setSelected(copy.id);
                        }}
                      >
                        Duplicar capa
                      </button>
                      <button
                        className={`${button} text-red-300`}
                        onClick={() => {
                          change({ layers: draft.layers.filter((l) => l.id !== selected) });
                          setSelected("");
                        }}
                      >
                        Eliminar capa
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {confirmAction && (
            <div
              role="alert"
              className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-400/50 p-3"
            >
              <p>Hay cambios sin guardar. ¿Quieres descartarlos?</p>
              <button
                className={button}
                onClick={() => {
                  confirmAction();
                  setConfirmAction(null);
                }}
              >
                Descartar cambios
              </button>
              <button className={button} onClick={() => setConfirmAction(null)}>
                Seguir editando
              </button>
            </div>
          )}
          {pendingDelete && (
            <div
              role="alert"
              className="flex flex-wrap items-center gap-3 rounded-xl border border-red-400/50 p-3"
            >
              <p>¿Eliminar esta plantilla personalizada y sus imágenes guardadas?</p>
              <button disabled={busy} className={button} onClick={() => void remove(pendingDelete)}>
                Eliminar plantilla
              </button>
              <button className={button} onClick={() => setPendingDelete(null)}>
                Cancelar
              </button>
            </div>
          )}
        </fieldset>
      )}
      <p role="status" className="mt-3 text-sm text-orange-200">
        {busy ? "Procesando…" : status}
      </p>
    </div>
  );
}
