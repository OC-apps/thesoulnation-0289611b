import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Radio, Users, Waves as WavesIcon, Link2, Search, Plus, Trash2, EyeOff, Eye, Save, LogOut, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { updateWavePhoto } from "@/lib/wave-photo.functions";
import { addRosterMember, removeRosterMember } from "@/lib/roster.functions";
import { addWavesMember, removeWavesMember } from "@/lib/waves.functions";
import { upsertWavesSocials } from "@/lib/waves-socials.functions";
import { setWaveHidden } from "@/lib/waves-hidden.functions";
import { verifyAdminPassword } from "@/lib/admin-auth.functions";
import { useWavesMembers } from "@/hooks/use-waves-members";
import { useWavesSocials } from "@/hooks/use-waves-socials";
import { useWavesHidden } from "@/hooks/use-waves-hidden";
import soulBellatriix from "@/assets/soul-bellatriix.jpeg";
import waveMaverick from "@/assets/wave-maverick.png";
import waveAleman from "@/assets/wave-aleman.png";
import wavePxlmaa from "@/assets/wave-pxlmaa.png";
import waveGizzmo from "@/assets/wave-gizzmo.png";
import waveTempla from "@/assets/wave-templa.png";
import waveSystem from "@/assets/wave-system.png";
import waveEmix from "@/assets/wave-emix.png";
import waveEnri from "@/assets/wave-enri.png";

export const Route = createFileRoute("/admin/live")({
  head: () => ({
    meta: [
      { title: "Admin · Live Status" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLivePage,
});

const FIXED_MEMBERS = [
  { id: "soul-maverick-z", name: "SOUL MAVERICK Z", photo: waveMaverick },
];

const OTHER_MEMBERS = [
  { id: "soul-aleman", name: "SOUL ALEMAN", photo: waveAleman },
  { id: "soul-gizzmo", name: "SOUL GIZZMO", photo: waveGizzmo },
  { id: "soul-pxlmaa", name: "SOUL PXLMAA", photo: wavePxlmaa },
  { id: "soul-systeem", name: "SOUL SYSTEEM", photo: waveSystem },
  { id: "soul-templa", name: "SOUL TEMPLA", photo: waveTempla },
  { id: "soul-enri", name: "SOUL ENRI", photo: waveEnri },
  { id: "soul-emi-x", name: "SOUL EMI X", photo: waveEmix },
  { id: "soul-bellatriix", name: "SOUL BELLATRIIX", photo: soulBellatriix },
];

const MEMBERS = [...FIXED_MEMBERS, ...OTHER_MEMBERS];

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
  const [msg, setMsg] = useState<string>("");

  const [roster, setRoster] = useState<RosterRow[]>([]);
  const [newNick, setNewNick] = useState<Record<RosterCategory, string>>({ crew: "", legends: "", killers: "" });
  const [rosterBusy, setRosterBusy] = useState<string | null>(null);

  const [photoBusy, setPhotoBusy] = useState<string | null>(null);


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

  // Auto-login: verifica el password en cada cambio y entra cuando es correcto
  useEffect(() => {
    if (authed) return;
    if (!password || password.length < 3) return;
    const t = setTimeout(async () => {
      try {
        const res = await verifyAdminPassword({ data: { password } });
        if (res.ok) {
          sessionStorage.setItem("admin-live-pw", password);
          setAuthed(true);
          setMsg("");
        }
      } catch {
        /* ignore */
      }
    }, 250);
    return () => clearTimeout(t);
  }, [password, authed]);




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

  const onChangePhoto = async (
    kind: "fixed" | "dynamic",
    keyOrId: string,
    file: File | null,
  ) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setMsg("La foto debe pesar menos de 5MB"); return; }
    const busyKey = `${kind}:${keyOrId}`;
    setPhotoBusy(busyKey);
    setMsg("");
    try {
      const b64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = () => reject(new Error("No se pudo leer la foto"));
        r.readAsDataURL(file);
      });
      await updateWavePhoto({
        data: {
          password,
          kind,
          ...(kind === "dynamic" ? { id: keyOrId } : { name: keyOrId }),
          photoBase64: b64,
          photoMime: file.type,
        },
      });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setPhotoBusy(null);
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

  
  const [socialQuery, setSocialQuery] = useState("");
  const [expandedSocial, setExpandedSocial] = useState<string | null>(null);


  

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <form
          onSubmit={(e) => e.preventDefault()}
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
            placeholder="Se valida automáticamente…"
          />
          {msg && <p className="text-xs text-red-400">{msg}</p>}
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70 text-center">
            Entrarás automáticamente al escribir el password correcto
          </p>
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

        <Tabs defaultValue="roster" className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-blue-deep/40 border border-flame/20 mb-6 h-auto p-1">
            <TabsTrigger value="roster" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-flame data-[state=active]:text-background text-xs font-mono uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" />
              <span>Roster</span>
            </TabsTrigger>
            <TabsTrigger value="waves" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-flame data-[state=active]:text-background text-xs font-mono uppercase tracking-widest">
              <WavesIcon className="w-3.5 h-3.5" />
              <span>Waves · Redes</span>
            </TabsTrigger>
          </TabsList>



          <TabsContent value="roster" className="mt-0">
            <SectionShell icon={Users} title="Roster" subtitle="Crew · Legends · Killers · Waves">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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

                {/* Soul Waves (gestionados desde la pestaña Waves) */}
                <div className="border border-flame/30 rounded-lg p-4 bg-flame/5 flex flex-col">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-flame/15">
                    <h3 className="font-display text-sm text-flame flex items-center gap-1.5">
                      <WavesIcon className="w-3.5 h-3.5" />
                      Soul Waves
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-flame/15 text-flame border border-flame/30">
                      {MEMBERS.length + waves.length}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
                    Se gestionan desde la pestaña Waves
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {MEMBERS.map((m) => {
                      const isHidden = hiddenSet.has(m.name.toUpperCase());
                      return (
                        <li
                          key={m.id}
                          className={`inline-flex items-center gap-1 border rounded px-2 py-1 ${
                            isHidden
                              ? "border-red-500/40 bg-red-950/20 text-red-300/70 line-through"
                              : "border-flame/40 bg-background/60 text-foreground"
                          }`}
                        >
                          <span className="font-mono text-[11px]">{m.name}</span>
                        </li>
                      );
                    })}
                    {waves.map((w) => {
                      const isHidden = hiddenSet.has(w.name.toUpperCase());
                      return (
                        <li
                          key={w.id}
                          className={`inline-flex items-center gap-1 border rounded px-2 py-1 ${
                            isHidden
                              ? "border-red-500/40 bg-red-950/20 text-red-300/70 line-through"
                              : "border-flame/30 bg-background/60 text-foreground"
                          }`}
                        >
                          <span className="font-mono text-[11px]">{w.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </SectionShell>
          </TabsContent>


          <TabsContent value="waves" className="mt-0">
            <SectionShell
              icon={WavesIcon}
              title="Soul Waves"
              subtitle={`${MEMBERS.filter((m) => !hiddenSet.has(m.name.toUpperCase())).length + waves.filter((w) => !hiddenSet.has(w.name.toUpperCase())).length} visibles · ${waves.length} dinámicos`}
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

                <div className="lg:col-span-3 space-y-5">
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

                  {(() => {
                    const q = socialQuery.trim().toLowerCase();
                    type Card = { id: string; name: string; photo: string; fixed: boolean; dyn?: typeof waves[number] };
                    const cards: Card[] = [
                      ...FIXED_MEMBERS.map((m) => ({ id: m.id, name: m.name, photo: m.photo, fixed: true })),
                      ...OTHER_MEMBERS.map((m) => ({ id: m.id, name: m.name, photo: m.photo, fixed: false })),
                      ...waves.map((w) => ({ id: w.id, name: w.name, photo: w.photo_url, fixed: false, dyn: w })),
                    ].filter((c) => c.name.toLowerCase().includes(q));

                    if (cards.length === 0) {
                      return (
                        <div className="text-xs font-mono text-muted-foreground text-center py-8">
                          Sin resultados para "{socialQuery}"
                        </div>
                      );
                    }

                    return (
                      <ul className="space-y-3">
                        {cards.map((c) => {
                          const key = c.name.toUpperCase();
                          const v = getSocial(c.name);
                          const filledCount = [v.tiktok, v.twitch, v.youtube, v.x, v.facebook].filter(Boolean).length;
                          const isHidden = hiddenSet.has(key);
                          const hBusy = hideBusy === key;
                          const sBusy = socialBusy === key;
                          const expanded = expandedSocial === key;
                          const rmBusy = c.dyn ? waveBusy === `rm:${c.dyn.id}` : false;
                          return (
                            <li
                              key={c.id}
                              className={`border rounded-lg overflow-hidden transition ${
                                c.fixed
                                  ? "border-flame/50 bg-flame/5"
                                  : isHidden
                                    ? "border-red-500/40 bg-red-950/20"
                                    : "border-flame/25 bg-blue-deep/40 hover:border-flame/50"
                              }`}
                            >
                              <div className="flex items-stretch gap-3 p-3">
                                <img
                                  src={c.photo}
                                  alt={c.name}
                                  className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border shrink-0 ${
                                    isHidden ? "opacity-50 border-red-500/30" : "border-flame/30"
                                  }`}
                                />
                                <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="font-display text-sm text-flame truncate flex items-center gap-2 flex-wrap">
                                      {c.name}
                                      {c.fixed && (
                                        <span className="text-[9px] font-mono text-flame/80 px-1.5 py-0.5 rounded bg-flame/10 border border-flame/30">
                                          FIJO
                                        </span>
                                      )}
                                      {isHidden && (
                                        <span className="text-[9px] font-mono text-red-400 px-1.5 py-0.5 rounded bg-red-950/50 border border-red-500/40">
                                          OCULTO
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                                      {filledCount} red{filledCount === 1 ? "" : "es"} configurada{filledCount === 1 ? "" : "s"}
                                      {c.dyn?.redes && <> · {c.dyn.redes}</>}
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <button
                                      onClick={() => setExpandedSocial(expanded ? null : key)}
                                      className="inline-flex items-center gap-1.5 border border-flame/40 text-flame hover:bg-flame/10 font-mono uppercase tracking-widest text-[10px] px-2.5 py-1 rounded"
                                    >
                                      <Link2 className="w-3 h-3" />
                                      {expanded ? "Cerrar redes" : "Redes"}
                                    </button>
                                    {!c.fixed && (
                                      <button
                                        onClick={() => toggleHidden(c.name)}
                                        disabled={hBusy}
                                        className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-widest text-[10px] px-2.5 py-1 rounded disabled:opacity-40 ${
                                          isHidden
                                            ? "bg-emerald-600 text-white hover:opacity-90"
                                            : "bg-red-600/80 text-white hover:bg-red-600"
                                        }`}
                                      >
                                        {isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        {hBusy ? "..." : isHidden ? "Restaurar" : "Ocultar"}
                                      </button>
                                    )}
                                    {c.dyn && (
                                      <button
                                        onClick={() => removeWave(c.dyn!.id)}
                                        disabled={rmBusy}
                                        className="inline-flex items-center gap-1.5 border border-red-500/50 text-red-300 hover:bg-red-950/40 font-mono uppercase tracking-widest text-[10px] px-2.5 py-1 rounded disabled:opacity-40"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        {rmBusy ? "..." : "Eliminar"}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {expanded && (
                                <div className="px-3 pb-3 pt-3 border-t border-flame/15 bg-background/30 space-y-2">
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
                                          onChange={(e) => setSocialField(c.name, field, e.target.value)}
                                          placeholder="https://…"
                                          className="w-full px-2 py-1.5 bg-background border border-flame/30 rounded text-foreground text-xs focus:border-flame outline-none"
                                        />
                                      </label>
                                    ))}
                                  </div>
                                  <button
                                    onClick={() => saveSocial(c.name)}
                                    disabled={sBusy}
                                    className="inline-flex items-center gap-1.5 bg-flame text-background font-mono uppercase tracking-widest text-[10px] px-3 py-1.5 rounded hover:opacity-90 disabled:opacity-40"
                                  >
                                    <Save className="w-3 h-3" />
                                    {sBusy ? "Guardando…" : "Guardar redes"}
                                  </button>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    );
                  })()}
                </div>

              </div>
            </SectionShell>


          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

