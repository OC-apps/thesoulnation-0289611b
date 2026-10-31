import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useLiveStatus() {
  const [liveSet, setLiveSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data, error } = await supabase.from("live_status").select("member_id, is_live");
      if (error) { console.warn("[Soul Live] No fue posible actualizar los estados:", error.message); return; }
      if (!mounted || !data) return;
      setLiveSet(new Set(data.filter((r) => r.is_live).map((r) => r.member_id)));
    };
    void load();
    const refresh = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 60000);
    const onFocus = () => { void load(); };
    window.addEventListener("focus", onFocus);

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
      window.clearInterval(refresh);
      window.removeEventListener("focus", onFocus);
      supabase.removeChannel(channel);
    };
  }, []);

  return liveSet;
}
