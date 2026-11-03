export type GearsSegment = "intro" | "background" | "outro";
export type GearsMedia = { id: GearsSegment; path: string; bytes: number };
export type GearsEpisode = {
  id: string;
  title: string;
  description: string;
  audio_path: string;
  audio_bytes: number;
  status: "draft" | "published" | "archived";
  published_at: string;
};
export const GEARS_BUCKET = "gears-media";
export const gearsUrl = (path: string) =>
  `https://quscgfasziijdjyixsex.supabase.co/storage/v1/object/public/${GEARS_BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`;
export const gearsTime = (value: number) =>
  `${Math.floor((Number.isFinite(value) ? value : 0) / 60)}:${String(Math.floor((Number.isFinite(value) ? value : 0) % 60)).padStart(2, "0")}`;
