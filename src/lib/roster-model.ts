export type RosterCategory = "crew" | "legends";
export type LegacyRosterCategory = RosterCategory | "killers";
export type RosterRow = { id: string; nickname: string; category: LegacyRosterCategory; sort_order: number };

/** Read legacy rows as Crew until the database migration has been applied. */
export function normalizeRoster<T extends RosterRow>(rows: T[]): (Omit<T, "category"> & { category: RosterCategory })[] {
  const seen = new Set<string>();
  return [...rows].sort((a, b) => Number(a.category === "killers") - Number(b.category === "killers"))
    .flatMap((row) => {
      const category = row.category === "killers" ? "crew" : row.category;
      const key = `${category}:${row.nickname.trim().toUpperCase()}`;
      if (seen.has(key)) return [];
      seen.add(key);
      return [{ ...row, category }];
    });
}
