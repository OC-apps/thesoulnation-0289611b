export type CustomLayer = {
  id: string;
  label: string;
  kind: "text" | "image" | "shape" | "gameplay" | "webcam" | "chat";
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  src?: string;
  color: string;
  fontSize: number;
  hidden?: boolean;
};
export type CustomTemplate = {
  id: string;
  name: string;
  width: number;
  height: number;
  layers: CustomLayer[];
  updatedAt: string;
};
export function validDimensions(width: number, height: number) {
  return (
    Number.isInteger(width) &&
    Number.isInteger(height) &&
    width >= 64 &&
    height >= 64 &&
    width <= 8192 &&
    height <= 8192 &&
    width * height <= 33554432
  );
}
export function newCustomTemplate(name: string, width: number, height: number): CustomTemplate {
  if (!validDimensions(width, height))
    throw Error("Usa dimensiones enteras de 64 a 8192 px, hasta 32 megapíxeles.");
  return {
    id: `custom-${crypto.randomUUID()}`,
    name: name.trim() || "Mi plantilla",
    width,
    height,
    layers: [],
    updatedAt: new Date().toISOString(),
  };
}
function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("tsn-custom-templates", 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("templates", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(Error("No se pudo abrir el guardado de plantillas en este navegador."));
  });
}
export async function templateStorage(
  action: "list" | "save" | "delete",
  value?: CustomTemplate | string,
): Promise<CustomTemplate[]> {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("templates", action === "list" ? "readonly" : "readwrite");
      const store = tx.objectStore("templates");
      let result: CustomTemplate[] = [];
      if (action === "save") store.put(value as CustomTemplate);
      if (action === "delete") store.delete(value as string);
      const read = store.getAll();
      read.onsuccess = () => {
        result = read.result;
      };
      tx.oncomplete = () => resolve(result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
      tx.onerror = tx.onabort = () =>
        reject(
          Error(
            "No se pudo guardar. Revisa el espacio disponible y los permisos del navegador. Tu diseño sigue abierto.",
          ),
        );
    });
  } finally {
    db.close();
  }
}
const imageCache = new Map<string, Promise<HTMLImageElement>>();
export function customImage(src: string) {
  const cached = imageCache.get(src);
  if (cached) return cached;
  const pending = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      imageCache.delete(src);
      reject(Error("No se pudo cargar una imagen del diseño."));
    };
    img.src = src;
  });
  // Keep decoded images only for a small working set.
  if (imageCache.size > 40) imageCache.delete(imageCache.keys().next().value!);
  imageCache.set(src, pending);
  return pending;
}
export async function renderCustom(template: CustomTemplate, canvas: HTMLCanvasElement) {
  if (!validDimensions(template.width, template.height)) throw Error("Dimensiones inválidas.");
  const visible = template.layers.filter((layer) => !layer.hidden);
  const images = new Map(
    await Promise.all(
      visible
        .filter((l) => l.kind === "image" && l.src)
        .map(async (l) => [l.id, await customImage(l.src!)] as const),
    ),
  );
  if (visible.some((l) => l.kind === "text")) await document.fonts.load('48px "The Soul Nation"');
  canvas.width = template.width;
  canvas.height = template.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Canvas no disponible.");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const l of visible) {
    ctx.save();
    if (l.kind === "image") {
      const img = images.get(l.id);
      if (img) {
        const fit = Math.min(l.width / img.naturalWidth, l.height / img.naturalHeight);
        const w = img.naturalWidth * fit,
          h = img.naturalHeight * fit;
        ctx.drawImage(img, l.x + (l.width - w) / 2, l.y + (l.height - h) / 2, w, h);
      }
    } else if (l.kind === "shape") {
      ctx.fillStyle = l.color;
      ctx.fillRect(l.x, l.y, l.width, l.height);
    } else if (l.kind === "text") {
      ctx.beginPath();
      ctx.rect(l.x, l.y, l.width, l.height);
      ctx.clip();
      ctx.fillStyle = l.color;
      ctx.font = `${l.fontSize}px "The Soul Nation", Arial, sans-serif`;
      ctx.textBaseline = "top";
      (l.text || "")
        .split("\n")
        .forEach((line, i) => ctx.fillText(line, l.x, l.y + i * l.fontSize * 1.2));
    }
    ctx.restore();
  }
  // Streaming sources must remain transparent, including imported backgrounds.
  for (const l of visible)
    if (["gameplay", "webcam", "chat"].includes(l.kind)) ctx.clearRect(l.x, l.y, l.width, l.height);
}
