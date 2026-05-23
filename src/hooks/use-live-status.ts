import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useLiveStatus() {
  const [liveSet, setLiveSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase.from("live_status").select("member_id, is_live");
      if (!mounted || !data) return;
      setLiveSet(new Set(data.filter((r) => r.is_live).map((r) => r.member_id)));
    };
    load();

    const channel = supabase
      .channel("live_status_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_status" },
        (payload) => {
          setLiveSet((prev) => {
            const next = new Set(prev);
            const row = (payload.new ?? payload.old) as { member_id: string; is_live?: boolean };
            if (!row?.member_id) return prev;
            if (payload.eventType === "DELETE" || !row.is_live) next.delete(row.member_id);
            else next.add(row.member_id);
            return next;
          });
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return liveSet;
}
