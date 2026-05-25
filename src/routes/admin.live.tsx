import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Radio, Users, Waves as WavesIcon, Link2, Search, Plus, Trash2, EyeOff, Eye, Save, LogOut, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { setLiveStatus } from "@/lib/live-status.functions";
import { addRosterMember, removeRosterMember } from "@/lib/roster.functions";
import { addWavesMember, removeWavesMember } from "@/lib/waves.functions";
import { upsertWavesSocials } from "@/lib/waves-socials.functions";
import { setWaveHidden } from "@/lib/waves-hidden.functions";
import { verifyAdminPassword } from "@/lib/admin-auth.functions";
import { useWavesMembers } from "@/hooks/use-waves-members";
import { useWavesSocials } from "@/hooks/use-waves-socials";
import { useWavesHidden } from "@/hooks/use-waves-hidden";

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

  const hiddenSet = useWavesHidden();
  const [hideBusy, setHideBusy] = useState<string | null>(null);
  const toggleHidden = async (name: string) => {
    const key = name.toUpperCase();
    setHideBusy(key);
    setMsg("");
    try {
      await setWaveHidden({ data: { password, name: key, hidden: !hiddenSet.has(key) } });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setHideBusy(null);
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

  const liveCount = Object.values(live).filter(Boolean).length;
  const allWaveNames = useMemo(
    () => [...MEMBERS.map((m) => m.name), ...waves.map((w) => w.name)],
    [waves]
  );
  const [socialQuery, setSocialQuery] = useState("");
  const [expandedSocial, setExpandedSocial] = useState<string | null>(null);
  const filteredSocialNames = allWaveNames.filter((n) =>
    n.toLowerCase().includes(socialQuery.trim().toLowerCase())
  );
  const visibleHardcoded = MEMBERS.filter((m) => !hiddenSet.has(m.name.toUpperCase())).length;

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


  const SectionShell = ({
    icon: Icon,
    title,
    subtitle,
    children,
  }: {
    icon: typeof Radio;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-4">
      <div className="flex items-start gap-3 border-b border-flame/15 pb-3">
        <div className="w-9 h-9 rounded-lg bg-flame/15 border border-flame/30 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-flame" />
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-lg text-foreground leading-tight">{title}</h2>
          {subtitle && (
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-40">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/85 border-b border-flame/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-flame to-flame/60 flex items-center justify-center shadow-[0_0_18px_var(--flame-glow)]">
              <Radio className="w-4 h-4 text-background" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-base sm:text-lg text-flame leading-tight truncate">
                Admin · Soul Nation
              </h1>
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                Control Center
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-red-500/40 bg-red-950/30">
              <span className={`w-1.5 h-1.5 rounded-full ${liveCount > 0 ? "bg-red-500 animate-pulse" : "bg-muted-foreground/40"}`} />
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground">
                {liveCount} live
              </span>
            </div>
            <button
              onClick={() => { sessionStorage.removeItem("admin-live-pw"); setAuthed(false); setPassword(""); }}
              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-flame border border-flame/30 hover:border-flame px-2.5 py-1 rounded-full transition"
            >
              <LogOut className="w-3 h-3" /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {msg && (
          <div className="mb-4 border border-red-500/40 bg-red-950/30 text-red-300 text-xs font-mono px-3 py-2 rounded">
            {msg}
          </div>
        )}

        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid grid-cols-4 w-full bg-blue-deep/40 border border-flame/20 mb-6 h-auto p-1">
            <TabsTrigger value="live" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-flame data-[state=active]:text-background text-xs font-mono uppercase tracking-widest">
              <Radio className="w-3.5 h-3.5" />
              <span>Live</span>
            </TabsTrigger>
            <TabsTrigger value="roster" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-flame data-[state=active]:text-background text-xs font-mono uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" />
              <span>Roster</span>
            </TabsTrigger>
            <TabsTrigger value="waves" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-flame data-[state=active]:text-background text-xs font-mono uppercase tracking-widest">
              <WavesIcon className="w-3.5 h-3.5" />
              <span>Waves</span>
            </TabsTrigger>
            <TabsTrigger value="redes" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-flame data-[state=active]:text-background text-xs font-mono uppercase tracking-widest">
              <Link2 className="w-3.5 h-3.5" />
              <span>Redes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-0">
            <SectionShell icon={Radio} title="Live Status" subtitle={`${liveCount} en vivo de ${MEMBERS.length} miembros`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MEMBERS.map((m) => {
                  const on = !!live[m.id];
                  const busy = saving === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggle(m.id)}
                      disabled={busy}
                      className={`group text-left flex items-center justify-between border rounded-lg px-4 py-3 transition-all ${
                        on
                          ? "border-red-500/60 bg-red-950/30 shadow-[0_0_24px_-8px_rgba(220,38,38,0.6)]"
                          : "border-flame/20 bg-blue-deep/40 hover:border-flame/60"
                      } ${busy ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full ${on ? "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]" : "bg-muted-foreground/40"}`} />
                        <div className="min-w-0">
                          <div className="font-display text-sm text-foreground truncate">{m.name}</div>
                          <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                            {on ? "TikTok live" : "Offline"}
                          </div>
                        </div>
                      </div>
                      <div className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${on ? "bg-red-600" : "bg-muted-foreground/30"}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </SectionShell>
          </TabsContent>

          <TabsContent value="roster" className="mt-0">
            <SectionShell icon={Users} title="Roster" subtitle="Crew · Legends · Killers">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CATEGORIES.map(({ key, label }) => {
                  const list = roster.filter((r) => r.category === key);
                  const addBusy = rosterBusy === `add:${key}`;
                  return (
                    <div key={key} className="border border-flame/20 rounded-lg p-4 bg-blue-deep/40 flex flex-col">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-flame/15">
                        <h3 className="font-display text-sm text-flame">{label}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-flame/15 text-flame border border-flame/30">
                          {list.length}
                        </span>
                      </div>
                      <form onSubmit={(e) => { e.preventDefault(); addMember(key); }} className="flex gap-1.5 mb-3">
                        <input
                          type="text"
                          value={newNick[key]}
                          onChange={(e) => setNewNick((p) => ({ ...p, [key]: e.target.value.toUpperCase() }))}
                          placeholder="NICKNAME"
                          maxLength={50}
                          className="flex-1 min-w-0 px-2 py-1.5 bg-background border border-flame/30 rounded text-foreground text-xs focus:border-flame outline-none font-mono uppercase"
                        />
                        <button
                          type="submit"
                          disabled={addBusy || !newNick[key].trim()}
                          className="inline-flex items-center gap-1 bg-flame text-background font-mono uppercase tracking-widest text-[10px] px-2.5 rounded hover:opacity-90 disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                          {addBusy ? "..." : "Add"}
                        </button>
                      </form>
                      <ul className="flex flex-wrap gap-1.5 min-h-[40px]">
                        {list.map((m) => {
                          const rmBusy = rosterBusy === `rm:${m.id}`;
                          return (
                            <li key={m.id} className="group inline-flex items-center gap-1.5 border border-flame/30 hover:border-flame rounded px-2 py-1 bg-background/60 transition">
                              <span className="font-mono text-[11px] text-foreground">{m.nickname}</span>
                              <button
                                onClick={() => removeMember(m.id)}
                                disabled={rmBusy}
                                className="text-muted-foreground hover:text-red-400 transition disabled:opacity-40"
                                aria-label={`Eliminar ${m.nickname}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </li>
                          );
                        })}
                        {list.length === 0 && (
                          <li className="text-[10px] font-mono text-muted-foreground italic">Sin miembros</li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </SectionShell>
          </TabsContent>

          <TabsContent value="waves" className="mt-0">
            <SectionShell
              icon={WavesIcon}
              title="Soul Waves"
              subtitle={`${visibleHardcoded + waves.filter((w) => !hiddenSet.has(w.name.toUpperCase())).length} visibles · ${waves.length} dinámicos`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                  <div className="border border-flame/30 rounded-lg p-4 bg-blue-deep/40 space-y-3 lg:sticky lg:top-24">
                    <div className="flex items-center gap-2 pb-2 border-b border-flame/15">
                      <Plus className="w-4 h-4 text-flame" />
                      <h3 className="font-display text-sm text-flame">Nuevo Wave</h3>
                    </div>
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
                        placeholder="Etiqueta red"
                        maxLength={40}
                        className="px-3 py-2 bg-background border border-flame/30 rounded text-foreground text-xs focus:border-flame outline-none"
                      />
                      <input
                        type="url"
                        value={waveForm.socialHref}
                        onChange={(e) => setWaveForm((p) => ({ ...p, socialHref: e.target.value }))}
                        placeholder="https://…"
                        maxLength={500}
                        className="px-3 py-2 bg-background border border-flame/30 rounded text-foreground text-xs focus:border-flame outline-none"
                      />
                    </div>
                    <textarea
                      value={waveForm.bio}
                      onChange={(e) => setWaveForm((p) => ({ ...p, bio: e.target.value }))}
                      placeholder="Biografía…"
                      maxLength={4000}
                      rows={4}
                      className="w-full px-3 py-2 bg-background border border-flame/30 rounded text-foreground text-sm focus:border-flame outline-none resize-y"
                    />
                    <label className="flex items-center gap-3 border border-dashed border-flame/40 rounded-lg p-3 bg-background/40 cursor-pointer hover:border-flame transition">
                      {wavePhoto ? (
                        <img src={wavePhoto.base64} alt="preview" className="w-14 h-14 object-cover rounded border border-flame/40" />
                      ) : (
                        <div className="w-14 h-14 rounded border border-flame/30 bg-background/60 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-flame/60" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-mono uppercase tracking-widest text-flame">
                          {wavePhoto ? "Cambiar foto" : "Subir foto"}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {wavePhoto?.name ?? "PNG · JPG · WEBP · max 5MB"}
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={(e) => onPickPhoto(e.target.files?.[0] ?? null)}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={submitWave}
                      disabled={waveBusy === "add"}
                      className="w-full inline-flex items-center justify-center gap-2 bg-flame text-background font-mono uppercase tracking-widest text-sm py-2.5 rounded hover:opacity-90 disabled:opacity-40 shadow-[0_0_18px_var(--flame-glow)]"
                    >
                      <Plus className="w-4 h-4" />
                      {waveBusy === "add" ? "Subiendo…" : "Agregar Wave"}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <h3 className="font-display text-sm text-foreground mb-3 flex items-center gap-2">
                      Waves fijos
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-flame/15 text-flame border border-flame/30">
                        {visibleHardcoded}/{MEMBERS.length}
                      </span>
                    </h3>
                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {MEMBERS.map((m) => {
                        const key = m.name.toUpperCase();
                        const isHidden = hiddenSet.has(key);
                        const hBusy = hideBusy === key;
                        return (
                          <li
                            key={m.id}
                            className={`relative group border rounded-lg p-3 transition flex flex-col gap-2 ${
                              isHidden
                                ? "border-red-500/40 bg-red-950/20 opacity-70"
                                : "border-flame/30 bg-background/60 hover:border-flame"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-6 rounded-full ${isHidden ? "bg-red-500/60" : "bg-flame"}`} />
                              <p className="font-mono text-[11px] text-flame truncate flex-1">{m.name}</p>
                            </div>
                            {isHidden && (
                              <span className="text-[9px] font-mono text-red-400 px-1.5 py-0.5 rounded bg-red-950/50 border border-red-500/40 self-start">
                                OCULTO
                              </span>
                            )}
                            <button
                              onClick={() => toggleHidden(m.name)}
                              disabled={hBusy}
                              className={`inline-flex items-center justify-center gap-1.5 font-mono uppercase tracking-widest text-[10px] px-2 py-1.5 rounded disabled:opacity-40 ${
                                isHidden
                                  ? "bg-emerald-600 text-white hover:opacity-90"
                                  : "bg-red-600/80 text-white hover:bg-red-600"
                              }`}
                            >
                              {isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              {hBusy ? "..." : isHidden ? "Restaurar" : "Ocultar"}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-display text-sm text-foreground mb-3 flex items-center gap-2">
                      Waves dinámicos
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-flame/15 text-flame border border-flame/30">
                        {waves.length}
                      </span>
                    </h3>
                    {waves.length === 0 ? (
                      <div className="border border-dashed border-flame/30 rounded-lg p-8 text-center text-xs font-mono text-muted-foreground bg-blue-deep/20">
                        Aún no has agregado waves dinámicos.
                      </div>
                    ) : (
                      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {waves.map((w) => {
                          const busy = waveBusy === `rm:${w.id}`;
                          const key = w.name.toUpperCase();
                          const isHidden = hiddenSet.has(key);
                          const hBusy = hideBusy === key;
                          return (
                            <li key={w.id} className={`relative group border rounded-lg overflow-hidden transition ${isHidden ? "border-red-500/40 bg-red-950/20 opacity-70" : "border-flame/30 bg-background/60 hover:border-flame"}`}>
                              <img src={w.photo_url} alt={w.name} className="w-full aspect-square object-cover" />
                              <div className="p-2 border-t border-flame/20 space-y-2">
                                <div>
                                  <p className="font-mono text-[11px] text-flame truncate">{w.name}</p>
                                  {w.redes && <p className="text-[9px] text-muted-foreground truncate">{w.redes}</p>}
                                </div>
                                <button
                                  onClick={() => toggleHidden(w.name)}
                                  disabled={hBusy}
                                  className={`w-full inline-flex items-center justify-center gap-1 font-mono uppercase tracking-widest text-[9px] px-2 py-1 rounded disabled:opacity-40 ${
                                    isHidden
                                      ? "bg-emerald-600 text-white hover:opacity-90"
                                      : "bg-red-600/70 text-white hover:bg-red-600"
                                  }`}
                                >
                                  {isHidden ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                                  {hBusy ? "..." : isHidden ? "Restaurar" : "Ocultar"}
                                </button>
                              </div>
                              <button
                                onClick={() => removeWave(w.id)}
                                disabled={busy}
                                className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-600 text-white w-7 h-7 rounded-full inline-flex items-center justify-center disabled:opacity-40 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Eliminar ${w.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                          </li>
                        );
                      })}
                    </ul>
                  )}
                  </div>
                </div>
              </div>
            </SectionShell>

          </TabsContent>

          <TabsContent value="redes" className="mt-0">
            <SectionShell icon={Link2} title="Redes Sociales" subtitle="Activa TikTok · Twitch · YouTube · X · Facebook">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={socialQuery}
                  onChange={(e) => setSocialQuery(e.target.value)}
                  placeholder="Buscar wave…"
                  className="w-full pl-9 pr-3 py-2 bg-blue-deep/40 border border-flame/20 rounded-lg text-foreground text-sm focus:border-flame outline-none"
                />
              </div>
              <ul className="space-y-2">
                {filteredSocialNames.map((name) => {
                  const v = getSocial(name);
                  const busy = socialBusy === name.toUpperCase();
                  const key = name.toUpperCase();
                  const isHidden = hiddenSet.has(key);
                  const hBusy = hideBusy === key;
                  const expanded = expandedSocial === key;
                  const filledCount = [v.tiktok, v.twitch, v.youtube, v.x, v.facebook].filter(Boolean).length;
                  return (
                    <li
                      key={name}
                      className={`border rounded-lg transition ${
                        isHidden
                          ? "border-red-500/40 bg-red-950/20"
                          : "border-flame/20 bg-blue-deep/40 hover:border-flame/40"
                      }`}
                    >
                      <button
                        onClick={() => setExpandedSocial(expanded ? null : key)}
                        className="w-full flex items-center justify-between gap-2 p-3 text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-1.5 h-8 rounded-full ${isHidden ? "bg-red-500/60" : filledCount > 0 ? "bg-flame" : "bg-muted-foreground/30"}`} />
                          <div className="min-w-0">
                            <div className="font-display text-sm text-flame truncate flex items-center gap-2">
                              {name}
                              {isHidden && (
                                <span className="text-[9px] font-mono text-red-400 px-1.5 py-0.5 rounded bg-red-950/50 border border-red-500/40">
                                  OCULTO
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-muted-foreground">
                              {filledCount} red{filledCount === 1 ? "" : "es"} configurada{filledCount === 1 ? "" : "s"}
                            </div>
                          </div>
                        </div>
                        <span className={`text-flame transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`}>▾</span>
                      </button>

                      {expanded && (
                        <div className="px-3 pb-3 space-y-2 border-t border-flame/10 pt-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {([
                              ["tiktok", "TikTok"],
                              ["twitch", "Twitch"],
                              ["youtube", "YouTube"],
                              ["x", "X (Twitter)"],
                              ["facebook", "Facebook"],
                            ] as const).map(([field, label]) => (
                              <label key={field} className="space-y-1 block">
                                <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                                  {label}
                                </span>
                                <input
                                  type="url"
                                  value={v[field]}
                                  onChange={(e) => setSocialField(name, field, e.target.value)}
                                  placeholder="https://…"
                                  className="w-full px-2 py-1.5 bg-background border border-flame/30 rounded text-foreground text-xs focus:border-flame outline-none"
                                />
                              </label>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            <button
                              onClick={() => saveSocial(name)}
                              disabled={busy}
                              className="inline-flex items-center gap-1.5 bg-flame text-background font-mono uppercase tracking-widest text-[10px] px-3 py-1.5 rounded hover:opacity-90 disabled:opacity-40"
                            >
                              <Save className="w-3 h-3" />
                              {busy ? "Guardando…" : "Guardar"}
                            </button>
                            <button
                              onClick={() => toggleHidden(name)}
                              disabled={hBusy}
                              className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-widest text-[10px] px-3 py-1.5 rounded disabled:opacity-40 ${
                                isHidden
                                  ? "bg-emerald-600 text-white hover:opacity-90"
                                  : "bg-red-600/80 text-white hover:bg-red-600"
                              }`}
                            >
                              {isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              {hBusy ? "..." : isHidden ? "Restaurar" : "Ocultar"}
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
                {filteredSocialNames.length === 0 && (
                  <li className="text-xs font-mono text-muted-foreground text-center py-8">
                    Sin resultados para "{socialQuery}"
                  </li>
                )}
              </ul>
            </SectionShell>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

