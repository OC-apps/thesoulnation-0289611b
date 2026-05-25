import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type WavesSocialsRow = {
  name: string;
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
    const load = async () => {
      const { data } = await supabase
        .from("waves_socials")
        .select("name, tiktok_url, twitch_url, youtube_url, x_url, facebook_url, photo_url, bio, redes");
      if (mounted && data) setRows(data as WavesSocialsRow[]);
    };
    load();



    const ch = supabase
      .channel("waves_socials_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "waves_socials" }, () => load())
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(ch);
    };
  }, []);

  const map = new Map<string, WavesSocialsRow>();
  rows.forEach((r) => map.set(r.name.toUpperCase(), r));
  return map;
}
