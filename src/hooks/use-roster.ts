import { ROSTER_SYNC_MARKER } from "@/lib/roster-current";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { normalizeRoster, type LegacyRosterCategory } from "@/lib/roster-model";
export type { RosterCategory } from "@/lib/roster-model";
export type RosterMember = { id: string; nickname: string; category: LegacyRosterCategory; sort_order: number };

export function useRoster() {
  const [members, setMembers] = useState<RosterMember[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data, error: fetchError } = await supabase
        .from("roster_members")
        .select("id, nickname, category, sort_order")
        .order("category")
        .order("sort_order");
      if (!mounted) return;
      if (fetchError) {
        setError("No se pudo actualizar el roster. Se muestran los datos disponibles.");
      } else if (data) {
        setMembers(data as RosterMember[]);
        setError(null);
      }
      setLoaded(true);
    };
    load();

    const ch = supabase
      .channel("roster_members_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "roster_members" }, () => load())
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(ch);
    };
  }, []);

  const synced = members.some((m) => m.nickname.trim().toUpperCase() === ROSTER_SYNC_MARKER);
  const normalized = normalizeRoster(members.filter((m) => m.nickname.trim().toUpperCase() !== ROSTER_SYNC_MARKER));
  return {
    loaded,
    error,
    synced,
    all: normalized,
    crew: normalized.filter((m) => m.category === "crew").map((m) => m.nickname),
    legends: normalized.filter((m) => m.category === "legends").map((m) => m.nickname),
  };
}
