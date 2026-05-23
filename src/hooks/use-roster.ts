import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type RosterCategory = "crew" | "legends" | "killers";
export type RosterMember = { id: string; nickname: string; category: RosterCategory; sort_order: number };

export function useRoster() {
  const [members, setMembers] = useState<RosterMember[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("roster_members")
        .select("id, nickname, category, sort_order")
        .order("category")
        .order("sort_order");
      if (mounted && data) setMembers(data as RosterMember[]);
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

  return {
    all: members,
    crew: members.filter((m) => m.category === "crew").map((m) => m.nickname),
    legends: members.filter((m) => m.category === "legends").map((m) => m.nickname),
    killers: members.filter((m) => m.category === "killers").map((m) => m.nickname),
  };
}
