import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type WavesSocialsRow = {
  name: string;
  extra_links?: { label: string; href: string }[];
  tiktok_url: string | null;
  twitch_url: string | null;
  youtube_url: string | null;
  x_url: string | null;
  facebook_url: string | null;
  photo_url: string | null;
  bio: string | null;
  redes: string | null;
};

export function useWavesSocials() {
  const [rows, setRows] = useState<WavesSocialsRow[]>([]);

  useEffect(() => {
    let mounted = true;
    let requestId = 0;
    const load = async () => {
      const currentRequest = ++requestId;
      const { data, error } = await supabase
        .from("waves_socials")
        .select("name, tiktok_url, twitch_url, youtube_url, x_url, facebook_url, photo_url, bio, redes, extra_links");
      if (error) {
        console.error("[Soul Waves] Could not refresh public profiles:", error.message);
        return;
      }
      if (mounted && currentRequest === requestId && data) setRows(data as WavesSocialsRow[]);
    };
    load();



    // Cloudflare upload server functions do not guarantee a Supabase Realtime event.
    // Recheck on tab focus and on successful admin uploads.
    const onFocus = () => { void load(); };
    const onVisibility = () => { if (document.visibilityState === "visible") void load(); };
    window.addEventListener("focus", onFocus);
    window.addEventListener("soul:roster-updated", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    // Recheck regularly so public roster follows admin saves without relying on Realtime.
    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 15000);
    const ch = supabase
      .channel("waves_socials_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "waves_socials" }, () => load())
      .subscribe();
    return () => {
      mounted = false;
      window.clearInterval(poll);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("soul:roster-updated", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      supabase.removeChannel(ch);
    };
  }, []);

  const map = new Map<string, WavesSocialsRow>();
  rows.forEach((r) => map.set(r.name.toUpperCase(), r));
  return map;
}
