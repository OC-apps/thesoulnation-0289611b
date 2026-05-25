import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { setLiveStatus } from "@/lib/live-status.functions";
import { addRosterMember, removeRosterMember } from "@/lib/roster.functions";
import { addWavesMember, removeWavesMember } from "@/lib/waves.functions";
import { upsertWavesSocials } from "@/lib/waves-socials.functions";
import { useWavesMembers } from "@/hooks/use-waves-members";
import { useWavesSocials } from "@/hooks/use-waves-socials";

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

type RosterCategory = "crew" | "legends" | "killers";
type RosterRow = { id: string; nickname: string; category: RosterCategory; sort_order: number };

const CATEGORIES: { key: RosterCategory; label: string }[] = [
  { key: "killers", label: "Soul Killers" },
  { key: "legends", label: "Soul Legends" },
  { key: "crew", label: "Soul Crew" },
];

function AdminLivePage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [live, setLive] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>("");

  const [roster, setRoster] = useState<RosterRow[]>([]);
  const [newNick, setNewNick] = useState<Record<RosterCategory, string>>({ crew: "", legends: "", killers: "" });
  const [rosterBusy, setRosterBusy] = useState<string | null>(null);

  const waves = useWavesMembers();
  const [waveForm, setWaveForm] = useState({ name: "", redes: "", bio: "", socialLabel: "", socialHref: "" });
  const [wavePhoto, setWavePhoto] = useState<{ base64: string; mime: string; name: string } | null>(null);
  const [waveBusy, setWaveBusy] = useState<string | null>(null);

  const socialsMap = useWavesSocials();
  type SocialFields = { tiktok: string; twitch: string; youtube: string; x: string; facebook: string };
  const [socialEdits, setSocialEdits] = useState<Record<string, SocialFields>>({});
  const [socialBusy, setSocialBusy] = useState<string | null>(null);

  const getSocial = (name: string): SocialFields => {
    const key = name.toUpperCase();
    if (socialEdits[key]) return socialEdits[key];
    const row = socialsMap.get(key);
    return {
      tiktok: row?.tiktok_url ?? "",
      twitch: row?.twitch_url ?? "",
      youtube: row?.youtube_url ?? "",
      x: row?.x_url ?? "",
      facebook: row?.facebook_url ?? "",
    };
  };
  const setSocialField = (name: string, field: keyof SocialFields, value: string) => {
    const key = name.toUpperCase();
    const current = getSocial(key);
    setSocialEdits((p) => ({ ...p, [key]: { ...current, [field]: value } }));
  };
  const saveSocial = async (name: string) => {
    const key = name.toUpperCase();
    const v = getSocial(key);
    setSocialBusy(key);
    setMsg("");
    try {
      await upsertWavesSocials({ data: { password, name: key, tiktok: v.tiktok, twitch: v.twitch, youtube: v.youtube, x: v.x, facebook: v.facebook } });
      setSocialEdits((p) => { const n = { ...p }; delete n[key]; return n; });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setSocialBusy(null);
    }
  };

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

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("roster_members")
        .select("id, nickname, category, sort_order")
        .order("category")
        .order("sort_order");
      if (data) setRoster(data as RosterRow[]);
    };
    load();

    const ch = supabase
      .channel("admin_roster")
      .on("postgres_changes", { event: "*", schema: "public", table: "roster_members" }, () => load())
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

  const addMember = async (category: RosterCategory) => {
    const nickname = newNick[category].trim().toUpperCase();
    if (!nickname) return;
    if (!/^[A-Z0-9 ]+$/.test(nickname)) {
      setMsg("Solo letras, números y espacios");
      return;
    }
    setRosterBusy(`add:${category}`);
    setMsg("");
    try {
      await addRosterMember({ data: { password, nickname, category } });
      setNewNick((p) => ({ ...p, [category]: "" }));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setRosterBusy(null);
    }
  };

  const removeMember = async (id: string) => {
    setRosterBusy(`rm:${id}`);
    setMsg("");
    try {
      await removeRosterMember({ data: { password, id } });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setRosterBusy(null);
    }
  };

  const onPickPhoto = (file: File | null) => {
    if (!file) { setWavePhoto(null); return; }
    if (file.size > 5 * 1024 * 1024) { setMsg("La foto debe pesar menos de 5MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setWavePhoto({ base64: reader.result as string, mime: file.type, name: file.name });
    };
    reader.readAsDataURL(file);
  };

  const submitWave = async () => {
    if (!waveForm.name.trim()) { setMsg("Nickname requerido"); return; }
    if (!wavePhoto) { setMsg("Foto requerida"); return; }
    setWaveBusy("add");
    setMsg("");
    try {
      await addWavesMember({
        data: {
          password,
          name: waveForm.name,
          redes: waveForm.redes,
          bio: waveForm.bio,
          socialLabel: waveForm.socialLabel,
          socialHref: waveForm.socialHref || "",
          photoBase64: wavePhoto.base64,
          photoMime: wavePhoto.mime,
        },
      });
      setWaveForm({ name: "", redes: "", bio: "", socialLabel: "", socialHref: "" });
      setWavePhoto(null);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setWaveBusy(null);
    }
  };

  const removeWave = async (id: string) => {
    setWaveBusy(`rm:${id}`);
    setMsg("");
    try {
      await removeWavesMember({ data: { password, id } });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setWaveBusy(null);
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
    <div className="min-h-screen bg-background p-6 pb-40 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-flame">Admin · Soul Nation</h1>
        <button
          onClick={() => { sessionStorage.removeItem("admin-live-pw"); setAuthed(false); setPassword(""); }}
          className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-flame"
        >
          Salir
        </button>
      </div>

      {msg && <p className="text-xs text-red-400 mb-3">{msg}</p>}

      <section className="mb-10">
        <h2 className="font-display text-xl text-foreground mb-2">Live Status · Soul Waves</h2>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
          Activa cuando alguien empiece a transmitir en TikTok.
        </p>
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
      </section>

      <section>
        <h2 className="font-display text-xl text-foreground mb-2">Roster · Crew, Legends & Killers</h2>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
          Agrega o elimina miembros (solo nickname).
        </p>
        <div className="space-y-6">
          {CATEGORIES.map(({ key, label }) => {
            const list = roster.filter((r) => r.category === key);
            const addBusy = rosterBusy === `add:${key}`;
            return (
              <div key={key} className="border border-flame/20 rounded-lg p-4 bg-blue-deep/40">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-foreground">{label}</h3>
                  <span className="text-xs font-mono text-muted-foreground">{list.length}</span>
                </div>
                <form
                  onSubmit={(e) => { e.preventDefault(); addMember(key); }}
                  className="flex gap-2 mb-3"
                >
                  <input
                    type="text"
                    value={newNick[key]}
                    onChange={(e) => setNewNick((p) => ({ ...p, [key]: e.target.value.toUpperCase() }))}
                    placeholder="SOUL NICKNAME"
                    maxLength={50}
                    className="flex-1 px-3 py-2 bg-background border border-flame/30 rounded text-foreground text-sm focus:border-flame outline-none font-mono uppercase"
                  />
                  <button
                    type="submit"
                    disabled={addBusy || !newNick[key].trim()}
                    className="bg-flame text-background font-mono uppercase tracking-widest text-xs px-4 rounded hover:opacity-90 disabled:opacity-40"
                  >
                    {addBusy ? "..." : "Agregar"}
                  </button>
                </form>
                <ul className="flex flex-wrap gap-2">
                  {list.map((m) => {
                    const rmBusy = rosterBusy === `rm:${m.id}`;
                    return (
                      <li
                        key={m.id}
                        className="flex items-center gap-2 border border-flame/30 rounded px-2 py-1 bg-background/60"
                      >
                        <span className="font-mono text-xs text-foreground">{m.nickname}</span>
                        <button
                          onClick={() => removeMember(m.id)}
                          disabled={rmBusy}
                          className="text-red-400 hover:text-red-300 text-xs leading-none disabled:opacity-40"
                          aria-label={`Eliminar ${m.nickname}`}
                        >
                          ×
                        </button>
                      </li>
                    );
                  })}
                  {list.length === 0 && (
                    <li className="text-xs font-mono text-muted-foreground">Sin miembros</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl text-foreground mb-2">Soul Waves · Nuevo miembro</h2>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
          Agrega un nuevo wave con foto, red social y biografía.
        </p>
        <div className="border border-flame/20 rounded-lg p-4 bg-blue-deep/40 space-y-3">
          <input
            type="text"
            value={waveForm.name}
            onChange={(e) => setWaveForm((p) => ({ ...p, name: e.target.value.toUpperCase() }))}
            placeholder="SOUL NICKNAME"
            maxLength={80}
            className="w-full px-3 py-2 bg-background border border-flame/30 rounded text-foreground text-sm focus:border-flame outline-none font-mono uppercase"
          />
          <input
            type="text"
            value={waveForm.redes}
            onChange={(e) => setWaveForm((p) => ({ ...p, redes: e.target.value }))}
            placeholder="Redes (ej: TikTok · YouTube · X)"
            maxLength={200}
            className="w-full px-3 py-2 bg-background border border-flame/30 rounded text-foreground text-sm focus:border-flame outline-none"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={waveForm.socialLabel}
              onChange={(e) => setWaveForm((p) => ({ ...p, socialLabel: e.target.value }))}
              placeholder="Etiqueta red social (ej: TikTok)"
              maxLength={40}
              className="px-3 py-2 bg-background border border-flame/30 rounded text-foreground text-sm focus:border-flame outline-none"
            />
            <input
              type="url"
              value={waveForm.socialHref}
              onChange={(e) => setWaveForm((p) => ({ ...p, socialHref: e.target.value }))}
              placeholder="https://link-de-la-red.com"
              maxLength={500}
              className="px-3 py-2 bg-background border border-flame/30 rounded text-foreground text-sm focus:border-flame outline-none"
            />
          </div>
          <textarea
            value={waveForm.bio}
            onChange={(e) => setWaveForm((p) => ({ ...p, bio: e.target.value }))}
            placeholder="Biografía…"
            maxLength={4000}
            rows={5}
            className="w-full px-3 py-2 bg-background border border-flame/30 rounded text-foreground text-sm focus:border-flame outline-none resize-y"
          />
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => onPickPhoto(e.target.files?.[0] ?? null)}
              className="text-xs text-foreground file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-flame file:text-background file:font-mono file:uppercase file:tracking-widest file:text-xs hover:file:opacity-90"
            />
            {wavePhoto && (
              <img src={wavePhoto.base64} alt="preview" className="w-14 h-14 object-cover rounded border border-flame/40" />
            )}
          </div>
          <button
            onClick={submitWave}
            disabled={waveBusy === "add"}
            className="w-full bg-flame text-background font-mono uppercase tracking-widest text-sm py-2 rounded hover:opacity-90 disabled:opacity-40"
          >
            {waveBusy === "add" ? "Subiendo…" : "Agregar Wave"}
          </button>
        </div>

        <div className="mt-6">
          <h3 className="font-display text-foreground mb-3">Waves agregados <span className="text-xs font-mono text-muted-foreground">({waves.length})</span></h3>
          {waves.length === 0 ? (
            <p className="text-xs font-mono text-muted-foreground">Aún no has agregado waves dinámicos.</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {waves.map((w) => {
                const busy = waveBusy === `rm:${w.id}`;
                return (
                  <li key={w.id} className="relative border border-flame/30 rounded-lg overflow-hidden bg-background/60">
                    <img src={w.photo_url} alt={w.name} className="w-full aspect-square object-cover" />
                    <div className="p-2">
                      <p className="font-mono text-xs text-flame truncate">{w.name}</p>
                      {w.redes && <p className="text-[10px] text-muted-foreground truncate">{w.redes}</p>}
                    </div>
                    <button
                      onClick={() => removeWave(w.id)}
                      disabled={busy}
                      className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-600 text-white text-xs w-6 h-6 rounded-full leading-none disabled:opacity-40"
                      aria-label={`Eliminar ${w.name}`}
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl text-foreground mb-2">Soul Waves · Redes Sociales</h2>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
          Activa TikTok, Twitch o YouTube por wave. Deja vacío el que no aplique.
        </p>
        <ul className="space-y-3">
          {[...MEMBERS.map((m) => m.name), ...waves.map((w) => w.name)].map((name) => {
            const v = getSocial(name);
            const busy = socialBusy === name.toUpperCase();
            return (
              <li key={name} className="border border-flame/20 rounded-lg p-3 bg-blue-deep/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-sm text-flame">{name}</span>
                  <button
                    onClick={() => saveSocial(name)}
                    disabled={busy}
                    className="bg-flame text-background font-mono uppercase tracking-widest text-[10px] px-3 py-1 rounded hover:opacity-90 disabled:opacity-40"
                  >
                    {busy ? "..." : "Guardar"}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="url"
                    value={v.tiktok}
                    onChange={(e) => setSocialField(name, "tiktok", e.target.value)}
                    placeholder="TikTok URL"
                    className="px-2 py-1.5 bg-background border border-flame/30 rounded text-foreground text-xs focus:border-flame outline-none"
                  />
                  <input
                    type="url"
                    value={v.twitch}
                    onChange={(e) => setSocialField(name, "twitch", e.target.value)}
                    placeholder="Twitch URL"
                    className="px-2 py-1.5 bg-background border border-flame/30 rounded text-foreground text-xs focus:border-flame outline-none"
                  />
                  <input
                    type="url"
                    value={v.youtube}
                    onChange={(e) => setSocialField(name, "youtube", e.target.value)}
                    placeholder="YouTube URL"
                    className="px-2 py-1.5 bg-background border border-flame/30 rounded text-foreground text-xs focus:border-flame outline-none"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
