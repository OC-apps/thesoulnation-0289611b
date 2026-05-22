import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type EasterEggId =
  | "xplicit-legacy"
  | "xplicit-broadcast"
  | "xplicit-champion"
  | "soul-flame"
  | "og-member"
  | "maverick-signal"
  | "hall-of-champions"
  | "jersey-code"
  | "soul-anthem"
  | "recruitment-key";

export type EasterEggConfig = {
  id: EasterEggId;
  nombre: string;
  mensaje: string;
  xp: number;
  badge: string;
  seccion: string;
  icono: string;
};

export const EASTER_EGGS: EasterEggConfig[] = [
  {
    id: "soul-flame",
    nombre: "Soul Flame Hunter",
    mensaje: "La llama Soul sigue encendida. +30 XP",
    xp: 30,
    badge: "Soul Flame Hunter",
    seccion: "Hero principal",
    icono: "🔥",
  },
  {
    id: "og-member",
    nombre: "OG Soul Member",
    mensaje: "Encontraste una marca de los miembros originales. +75 XP",
    xp: 75,
    badge: "OG Soul Member",
    seccion: "Historia",
    icono: "✦",
  },
  {
    id: "maverick-signal",
    nombre: "Maverick Signal",
    mensaje: "Señal de Maverick detectada. +100 XP",
    xp: 100,
    badge: "Maverick Signal",
    seccion: "Roster",
    icono: "📡",
  },
  {
    id: "hall-of-champions",
    nombre: "Champion Hunter",
    mensaje: "Has encontrado el Salón de Campeones. +50 XP",
    xp: 50,
    badge: "Champion Hunter",
    seccion: "Videos",
    icono: "👑",
  },
  {
    id: "jersey-code",
    nombre: "Jersey Code",
    mensaje: "Desbloqueaste el código del jersey oficial. +60 XP",
    xp: 60,
    badge: "Jersey Code",
    seccion: "Jersey",
    icono: "🎽",
  },
  {
    id: "soul-anthem",
    nombre: "Soul Anthem",
    mensaje: "Escuchaste el himno Soul oculto. +40 XP",
    xp: 40,
    badge: "Soul Anthem",
    seccion: "Música",
    icono: "🎧",
  },
  {
    id: "recruitment-key",
    nombre: "Recruit Key",
    mensaje: "Encontraste la llave de reclutamiento. +55 XP",
    xp: 55,
    badge: "Recruit Key",
    seccion: "Reclutamiento",
    icono: "🗝️",
  },
  {
    id: "xplicit-legacy",
    nombre: "Xplicit Legacy",
    mensaje: "Has encontrado el legado Xplicit Cup. +50 XP",
    xp: 50,
    badge: "Xplicit Legacy",
    seccion: "Xplicit Cup",
    icono: "🏆",
  },
  {
    id: "xplicit-broadcast",
    nombre: "Broadcast Master",
    mensaje: "Sintonizaste el broadcast original. +65 XP",
    xp: 65,
    badge: "Broadcast Master",
    seccion: "Xplicit Cup",
    icono: "🎙️",
  },
  {
    id: "xplicit-champion",
    nombre: "Cup Champion",
    mensaje: "Coronaste al campeón oculto. +80 XP",
    xp: 80,
    badge: "Cup Champion",
    seccion: "Xplicit Cup",
    icono: "🥇",
  },
];

const STORAGE_KEY = "soul-easter-eggs-v1";

type State = {
  found: EasterEggId[];
  xp: number;
};

type Notification = {
  config: EasterEggConfig;
  already: boolean;
  key: number;
};

type Ctx = {
  state: State;
  total: number;
  discover: (id: EasterEggId) => void;
  isFound: (id: EasterEggId) => boolean;
  reset: () => void;
  notification: Notification | null;
  dismissNotification: () => void;
  panelOpen: boolean;
  togglePanel: () => void;
};

const EasterEggCtx = createContext<Ctx | null>(null);

function loadState(): State {
  if (typeof window === "undefined") return { found: [], xp: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { found: [], xp: 0 };
    const parsed = JSON.parse(raw) as State;
    return { found: parsed.found ?? [], xp: parsed.xp ?? 0 };
  } catch {
    return { found: [], xp: 0 };
  }
}

function playSound() {
  try {
    const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes = [523.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.0001, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.15, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
    setTimeout(() => ctx.close(), 800);
  } catch {}
}

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ found: [], xp: 0 });
  const [notification, setNotification] = useState<Notification | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const isFound = useCallback((id: EasterEggId) => state.found.includes(id), [state.found]);

  const discover = useCallback((id: EasterEggId) => {
    const config = EASTER_EGGS.find((e) => e.id === id);
    if (!config) return;
    setState((prev) => {
      if (prev.found.includes(id)) {
        setNotification({ config, already: true, key: Date.now() });
        return prev;
      }
      setNotification({ config, already: false, key: Date.now() });
      playSound();
      return { found: [...prev.found, id], xp: prev.xp + config.xp };
    });
  }, []);

  const reset = useCallback(() => {
    setState({ found: [], xp: 0 });
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  }, []);

  const dismissNotification = useCallback(() => setNotification(null), []);
  const togglePanel = useCallback(() => setPanelOpen((v) => !v), []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      total: EASTER_EGGS.length,
      discover,
      isFound,
      reset,
      notification,
      dismissNotification,
      panelOpen,
      togglePanel,
    }),
    [state, discover, isFound, reset, notification, dismissNotification, panelOpen, togglePanel],
  );

  return <EasterEggCtx.Provider value={value}>{children}</EasterEggCtx.Provider>;
}

export function useEasterEggs() {
  const ctx = useContext(EasterEggCtx);
  if (!ctx) throw new Error("useEasterEggs must be used within EasterEggProvider");
  return ctx;
}
