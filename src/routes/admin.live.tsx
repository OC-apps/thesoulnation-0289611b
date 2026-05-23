import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { setLiveStatus } from "@/lib/live-status.functions";

export const Route = createFileRoute("/admin/live")({
  head: () => ({
    meta: [
      { title: "Admin · Live Status" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLivePage,
});

const MEMBERS = [
  { id: "soul-maverick-z", name: "SOUL MAVERICK Z" },
  { id: "soul-aleman", name: "SOUL ALEMAN" },
  { id: "soul-gizzmo", name: "SOUL GIZZMO" },
  { id: "soul-pxlmaa", name: "SOUL PXLMAA" },
  { id: "soul-systeem", name: "SOUL SYSTEEM" },
  { id: "soul-templa", name: "SOUL TEMPLA" },
  { id: "soul-enri", name: "SOUL ENRI" },
  { id: "soul-emi-x", name: "SOUL EMI X" },
  { id: "soul-bellatriix", name: "SOUL BELLATRIIX" },
];

function AdminLivePage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [live, setLive] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin-live-pw");
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("live_status").select("member_id, is_live");
      const map: Record<string, boolean> = {};
      data?.forEach((r) => { map[r.member_id] = r.is_live; });
      setLive(map);
    };
    load();

    const ch = supabase
      .channel("admin_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "live_status" }, (payload) => {
        const row = (payload.new ?? payload.old) as { member_id: string; is_live?: boolean };
        if (!row?.member_id) return;
        setLive((p) => ({ ...p, [row.member_id]: !!row.is_live }));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const toggle = async (memberId: string) => {
    setSaving(memberId);
    setMsg("");
    try {
      const next = !live[memberId];
      await setLiveStatus({ data: { password, memberId, isLive: next } });
      setLive((p) => ({ ...p, [memberId]: next }));
      sessionStorage.setItem("admin-live-pw", password);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
      setAuthed(false);
      sessionStorage.removeItem("admin-live-pw");
    } finally {
      setSaving(null);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <form
          onSubmit={(e) => { e.preventDefault(); setAuthed(true); }}
          className="w-full max-w-sm border border-flame/40 rounded-xl p-6 bg-blue-deep/60 backdrop-blur space-y-4"
        >
          <h1 className="font-display text-2xl text-flame">Admin · Live</h1>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Ingresa la contraseña</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-flame/30 rounded text-foreground focus:border-flame outline-none"
            autoFocus
          />
          {msg && <p className="text-xs text-red-400">{msg}</p>}
          <button type="submit" className="w-full bg-flame text-background font-mono uppercase tracking-widest text-sm py-2 rounded hover:opacity-90">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-flame">Live Status · Soul Waves</h1>
        <button
          onClick={() => { sessionStorage.removeItem("admin-live-pw"); setAuthed(false); setPassword(""); }}
          className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-flame"
        >
          Salir
        </button>
      </div>
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
        Activa el switch cuando alguien empiece a transmitir en TikTok. Se actualiza en tiempo real.
      </p>
      {msg && <p className="text-xs text-red-400 mb-3">{msg}</p>}
      <ul className="space-y-2">
        {MEMBERS.map((m) => {
          const on = !!live[m.id];
          const busy = saving === m.id;
          return (
            <li key={m.id} className="flex items-center justify-between border border-flame/20 rounded-lg px-4 py-3 bg-blue-deep/40">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${on ? "bg-red-500 animate-pulse" : "bg-muted-foreground/40"}`} />
                <span className="font-display text-foreground">{m.name}</span>
              </div>
              <button
                onClick={() => toggle(m.id)}
                disabled={busy}
                className={`relative w-14 h-7 rounded-full transition-colors ${on ? "bg-red-600" : "bg-muted-foreground/30"} ${busy ? "opacity-50" : ""}`}
                aria-label={`Toggle live for ${m.name}`}
              >
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${on ? "translate-x-7" : "translate-x-0.5"}`} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
