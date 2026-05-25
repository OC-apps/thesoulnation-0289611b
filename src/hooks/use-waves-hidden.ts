import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useWavesHidden() {
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase.from("waves_hidden").select("name");
      if (mounted && data) setHidden(new Set(data.map((r) => (r.name as string).toUpperCase())));
    };
    load();

    const ch = supabase
      .channel("waves_hidden_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "waves_hidden" }, () => load())
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(ch);
    };
  }, []);

  return hidden;
}
