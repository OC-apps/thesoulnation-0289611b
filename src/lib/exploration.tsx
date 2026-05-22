import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ExploreId =
  | "member:soul-maverick-z"
  | "member:soul-aleman"
  | "member:soul-gizzmo"
  | "member:soul-pxlmaa"
  | "member:soul-systeem"
  | "member:soul-templa"
  | "member:soul-enri"
  | "member:soul-emi-x"
  | "member:soul-bellatriix"
  | "social:youtube"
  | "social:tiktok"
  | "social:facebook"
  | "social:x"
  | "social:discord"
  | "nav:about"
  | "nav:roster"
  | "nav:videos"
  | "nav:wallpapers"
  | "nav:jersey"
  | "nav:xplicit-cup"
  | "nav:music"
  | "nav:reclutamiento"
  | "nav:redes"
  | "jersey:specs"
  | "jersey:showcase"
  | "jersey:tiktok"
  | "about:vision"
  | "about:objetivo";

export const EXPLORE_IDS: ExploreId[] = [
  "member:soul-maverick-z",
  "member:soul-aleman",
  "member:soul-gizzmo",
  "member:soul-pxlmaa",
  "member:soul-systeem",
  "member:soul-templa",
  "member:soul-enri",
  "member:soul-emi-x",
  "member:soul-bellatriix",
  "social:youtube",
  "social:tiktok",
  "social:facebook",
  "social:x",
  "social:discord",
  "nav:about",
  "nav:roster",
  "nav:videos",
  "nav:wallpapers",
  "nav:jersey",
  "nav:xplicit-cup",
  "nav:music",
  "nav:reclutamiento",
  "nav:redes",
  "jersey:specs",
  "jersey:showcase",
  "jersey:tiktok",
  "about:vision",
  "about:objetivo",
];

const POINTS_PER = 10;
const STORAGE_KEY = "soul-exploration-v1";
const MAX_FLAG = "soul-exploration-max-celebrated-v1";

export const LEVELS = [
  { name: "Recluta", min: 0 },
  { name: "Cadete", min: 60 },
  { name: "Soldado Soul", min: 120 },
  { name: "Veterano", min: 190 },
  { name: "Élite Soul", min: 280 },
];

type State = { found: ExploreId[] };

type Ctx = {
  found: ExploreId[];
  points: number;
  total: number;
  totalPoints: number;
  level: { name: string; index: number };
  nextLevel: { name: string; min: number } | null;
  progressInLevel: number;
  complete: boolean;
  reset: () => void;
  panelOpen: boolean;
  togglePanel: () => void;
  setPanelOpen: (open: boolean) => void;
};

const ExplorationCtx = createContext<Ctx | null>(null);

function load(): State {
  if (typeof window === "undefined") return { found: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { found: [] };
    const parsed = JSON.parse(raw) as State;
    const valid = (parsed.found ?? []).filter((id) =>
      (EXPLORE_IDS as string[]).includes(id),
    ) as ExploreId[];
    return { found: valid };
  } catch {
    return { found: [] };
  }
}

function chime() {
  try {
    const AC = (window.AudioContext ||
      (window as any).webkitAudioContext) as typeof AudioContext | undefined;
    if (!AC) return;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(660, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(990, ctx.currentTime + 0.18);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.3);
    setTimeout(() => ctx.close(), 500);
  } catch {}
}

export function ExplorationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ found: [] });
  const [panelOpen, setPanelOpen] = useState(false);


  useEffect(() => {
    setState(load());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const track = useCallback((id: string) => {
    if (!(EXPLORE_IDS as string[]).includes(id)) return;
    setState((prev) => {
      if (prev.found.includes(id as ExploreId)) return prev;
      chime();
      return { found: [...prev.found, id as ExploreId] };
    });
  }, []);

  // Global click delegation: any element with data-explore="<id>" tracks on click.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const el = target.closest?.("[data-explore]") as HTMLElement | null;
      if (!el) return;
      const id = el.getAttribute("data-explore");
      if (id) track(id);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [track]);

  const reset = useCallback(() => {
    setState({ found: [] });
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(MAX_FLAG);
    }
  }, []);

  const value = useMemo<Ctx>(() => {
    const points = state.found.length * POINTS_PER;
    const total = EXPLORE_IDS.length;
    const totalPoints = total * POINTS_PER;
    let idx = 0;
    for (let i = 0; i < LEVELS.length; i++) {
      if (points >= LEVELS[i].min) idx = i;
    }
    const level = { name: LEVELS[idx].name, index: idx };
    const nextLevel = LEVELS[idx + 1] ?? null;
    const progressInLevel = nextLevel
      ? Math.min(
          100,
          Math.round(
            ((points - LEVELS[idx].min) /
              (nextLevel.min - LEVELS[idx].min)) *
              100,
          ),
        )
      : 100;
    return {
      found: state.found,
      points,
      total,
      totalPoints,
      level,
      nextLevel,
      progressInLevel,
      complete: state.found.length >= total,
      reset,
    };
  }, [state, reset]);

  return (
    <ExplorationCtx.Provider value={value}>{children}</ExplorationCtx.Provider>
  );
}

export function useExploration() {
  const ctx = useContext(ExplorationCtx);
  if (!ctx) throw new Error("useExploration must be used inside ExplorationProvider");
  return ctx;
}

export { MAX_FLAG };
