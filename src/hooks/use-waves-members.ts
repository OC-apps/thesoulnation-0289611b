import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type WavesMemberRow = {
  id: string;
  name: string;
  redes: string;
  bio: string;
  photo_url: string;
  social_label: string | null;
  social_href: string | null;
  sort_order: number;
};

export function useWavesMembers() {
  const [members, setMembers] = useState<WavesMemberRow[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("waves_members")
        .select("id, name, redes, bio, photo_url, social_label, social_href, sort_order")
        .order("sort_order");
      if (mounted && data) setMembers(data as WavesMemberRow[]);
    };
    load();

    const ch = supabase
      .channel("waves_members_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "waves_members" }, () => load())
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(ch);
    };
  }, []);

  return members;
}
