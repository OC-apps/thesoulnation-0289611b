import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useLegendsPhotos() {
  const [photos, setPhotos] = useState<Record<string,string>>({});
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data, error } = await supabase.from("legends_photos" as "roster_members").select("nickname,photo_url");
      if (!mounted || error || !data) return;
      const next: Record<string,string> = {};
      for (const row of data as unknown as { nickname:string;photo_url:string }[]) {
        if (row.photo_url) next[row.nickname.toUpperCase()] = row.photo_url;
      }
      setPhotos(next);
    };
    void load();
    const refresh = () => void load();
    window.addEventListener("focus",refresh);
    window.addEventListener("soul:roster-updated",refresh);
    const ch = supabase.channel("legends_photos_live").on("postgres_changes",{event:"*",schema:"public",table:"legends_photos"},refresh).subscribe();
    return () => { mounted=false; window.removeEventListener("focus",refresh); window.removeEventListener("soul:roster-updated",refresh); void supabase.removeChannel(ch); };
  }, []);
  return photos;
}
