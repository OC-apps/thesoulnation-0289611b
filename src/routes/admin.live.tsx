import waveMaverickTile from "@/assets/wave-maverick.png";
import soulNationTeamTile from "@/assets/soul-nation-team.png";
import wallpaperTile from "@/assets/wallpaper-olimpo.jpg";
import jerseyTile from "@/assets/jersey-front.png";
import { HOME_ASSET_KEYS, useSiteAssets, type SiteAssetKey } from "@/hooks/use-site-assets";
import { updateSiteAsset } from "@/lib/site-assets.functions";
import { CURRENT_LEGENDS } from "@/lib/roster-current";
import { useLegendsPhotos } from "@/hooks/use-legends-photos";
import { uploadLegendPhoto } from "@/lib/legends-photo.functions";
import { ROSTER_SYNC_MARKER } from "@/lib/roster-current";
import { WAVES } from "@/lib/waves-defaults";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Radio, Users, Waves as WavesIcon, Link2, Search, Plus, Trash2, EyeOff, Eye, Save, LogOut, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { updateWavePhoto } from "@/lib/wave-photo.functions";
import { addRosterMember, removeRosterMember, syncOfficialRoster } from "@/lib/roster.functions";
import { addWavesMember, removeWavesMember } from "@/lib/waves.functions";
import { upsertWavesSocials, updateWavesMemberContent } from "@/lib/waves-socials.functions";
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

const FIXED_MEMBERS = WAVES.map((member) => ({ id: member.name.toLowerCase().replace(/\s+/g, "-"), name: member.name, photo: member.photo }));
const OTHER_MEMBERS: typeof FIXED_MEMBERS = [];
const MEMBERS = FIXED_MEMBERS;

import { normalizeRoster, type RosterCategory, type RosterRow as LegacyRosterRow } from "@/lib/roster-model";
type RosterRow = { id: string; nickname: string; category: RosterCategory; sort_order: number };

const CATEGORIES: { key: RosterCategory; label: string }[] = [
  { key: "legends", label: "Soul Legends" },
  { key: "crew", label: "Soul Crew" },
];

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

function AdminLivePage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const [roster, setRoster] = useState<RosterRow[]>([]);
  const [newNick, setNewNick] = useState<Record<RosterCategory, string>>({ crew: "", legends: "" });
  const [rosterBusy, setRosterBusy] = useState<string | null>(null);
  const [rosterSynced, setRosterSynced] = useState(false);

  const [photoBusy, setPhotoBusy] = useState<string | null>(null);
  const siteAssets = useSiteAssets();
  const [imageBusy,setImageBusy] = useState<SiteAssetKey|null>(null);
  const [imageOverrides,setImageOverrides] = useState<Partial<Record<SiteAssetKey,string>>>({});
  const defaultHomeImages:Partial<Record<SiteAssetKey,string>> = {
    home_banner:"/the%20soul%20nation%20header.jpg",
    home_roster:waveMaverickTile,
    home_videos:soulNationTeamTile,
    home_wallpapers:wallpaperTile,
    home_jersey:jerseyTile,
  };
  const onHomeImage = async (key:SiteAssetKey,file:File|null)=>{
    if(!file)return;
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>8*1024*1024){
      setMsg("La imagen debe ser JPG, PNG o WebP de máximo 8 MB");return;
    }
    setImageBusy(key);setMsg("");
    try {
      const dataUrl=await new Promise<string>((resolve,reject)=>{
        const reader=new FileReader();
        reader.onload=()=>resolve(String(reader.result));
        reader.onerror=()=>reject(new Error("No se pudo leer la imagen"));
        reader.readAsDataURL(file);
      });
      const result=await updateSiteAsset({data:{password,key,photoBase64:dataUrl,photoMime:file.type as "image/jpeg"|"image/png"|"image/webp"}});
      if(!result.ok)throw new Error("No fue posible guardar la imagen");
      setImageOverrides(prev=>({...prev,[key]:result.url}));
      window.dispatchEvent(new Event("soul:site-assets-updated"));
      setMsg("Imagen actualizada correctamente: "+HOME_ASSET_KEYS.find(item=>item.key===key)?.label);
    }catch(err){setMsg(err instanceof Error?err.message:"Error al subir la imagen");}
    finally{setImageBusy(null);}
  };

  const [photoOverrides, setPhotoOverrides] = useState<Record<string, string>>({});


  const legendsPhotos = useLegendsPhotos();
  const [legendPhotoOverrides, setLegendPhotoOverrides] = useState<Record<string,string>>({});
  const waves = useWavesMembers();
  const [waveForm, setWaveForm] = useState({ name: "", redes: "", bio: "", socialLabel: "", socialHref: "" });
  const [wavePhoto, setWavePhoto] = useState<{ base64: string; mime: string; name: string } | null>(null);
  const [waveBusy, setWaveBusy] = useState<string | null>(null);

  const socialsMap = useWavesSocials();
  type WaveLink = { label: string; href: string };
  const [newLinks, setNewLinks] = useState<WaveLink[]>([
    { label: "YouTube", href: "" }, { label: "Facebook", href: "" },
    { label: "Instagram", href: "" }, { label: "TikTok", href: "" },
    { label: "Twitch", href: "" }, { label: "X", href: "" },
  ]);
  const [extraEdits, setExtraEdits] = useState<Record<string, WaveLink[]>>({});
  const getExtraLinks = (name: string) => extraEdits[name.toUpperCase()] ?? socialsMap.get(name.toUpperCase())?.extra_links ?? [];
  const setExtraLinks = (name: string, links: WaveLink[]) => setExtraEdits(p => ({...p, [name.toUpperCase()]: links}));
  type SocialFields = { tiktok: string; twitch: string; youtube: string; x: string; facebook: string };
  const [socialEdits, setSocialEdits] = useState<Record<string, SocialFields>>({});
  const [socialBusy, setSocialBusy] = useState<string | null>(null);

  const getSocial = (name: string): SocialFields => {
    const key = name.toUpperCase();
    if (socialEdits[key]) return socialEdits[key];
    const row = socialsMap.get(key);
    const original = WAVES.find((m) => m.name.toUpperCase() === key);
    const originalUrl = (label: string) => original?.socials?.find((s) => s.label.toLowerCase() === label.toLowerCase())?.href ?? "";
    return {
      tiktok: row?.tiktok_url ?? originalUrl("TikTok"),
      twitch: row?.twitch_url ?? originalUrl("Twitch"),
      youtube: row?.youtube_url ?? originalUrl("YouTube"),
      x: row?.x_url ?? originalUrl("X"),
      facebook: row?.facebook_url ?? originalUrl("Facebook"),
    };
  };
  const setSocialField = (name: string, field: keyof SocialFields, value: string) => {
    const key = name.toUpperCase();
    const current = getSocial(key);
    setSocialEdits((p) => ({ ...p, [key]: { ...current, [field]: value } }));
  };
  // Bio / redes edits (works for both fixed-override and dynamic-direct)
  type ContentFields = { bio: string; redes: string };
  const [contentEdits, setContentEdits] = useState<Record<string, ContentFields>>({});
  const getContent = (name: string, fallback: ContentFields): ContentFields => {
    const key = name.toUpperCase();
    return contentEdits[key] ?? fallback;
  };
  const setContentField = (name: string, field: keyof ContentFields, value: string, fallback: ContentFields) => {
    const key = name.toUpperCase();
    const current = getContent(key, fallback);
    setContentEdits((p) => ({ ...p, [key]: { ...current, [field]: value } }));
  };

  const saveAll = async (
    name: string,
    opts: { isFixed: boolean; dynId?: string; fallbackContent: ContentFields },
  ) => {
    const key = name.toUpperCase();
    const v = getSocial(key);
    const c = getContent(key, opts.fallbackContent);
    setSocialBusy(key);
    setMsg("");
    try {
      await upsertWavesSocials({
        data: {
          password, name: key,
          tiktok: v.tiktok, twitch: v.twitch, youtube: v.youtube, x: v.x, facebook: v.facebook,
          extraLinks: getExtraLinks(key).filter(l => l.label.trim() && l.href.trim()),
          ...(opts.isFixed ? { bio: c.bio, redes: c.redes } : {}),
        },
      });
      if (!opts.isFixed && opts.dynId) {
        await updateWavesMemberContent({
          data: { password, id: opts.dynId, bio: c.bio, redes: c.redes },
        });
      }
      setSocialEdits((p) => { const n = { ...p }; delete n[key]; return n; });
      setContentEdits((p) => { const n = { ...p }; delete n[key]; return n; });
      setExtraEdits((p) => { const n = { ...p }; delete n[key]; return n; });
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
      if (data) {
        setRosterSynced(data.some((r) => String(r.nickname).toUpperCase() === ROSTER_SYNC_MARKER));
        setRoster(normalizeRoster((data as LegacyRosterRow[]).filter((r) => r.nickname.toUpperCase() !== ROSTER_SYNC_MARKER)));
      }
    };
    load();

    const ch = supabase
      .channel("admin_roster")
      .on("postgres_changes", { event: "*", schema: "public", table: "roster_members" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const applyOfficialRoster = async () => {
    setRosterBusy("sync");
    setMsg("");
    try {
      const result = await syncOfficialRoster({ data: { password } });
      if (result.ok) setMsg("Roster oficial actualizado: 19 Crew · 6 Waves · 5 Legends. Los cambios ya están en la base de datos.");
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "No fue posible sincronizar el roster");
    } finally {
      setRosterBusy(null);
    }
  };

  const onLegendPhoto = async (nickname: string, file: File | null) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setMsg("Elige una imagen PNG, JPG o WebP de máximo 5 MB");
      return;
    }
    setPhotoBusy("legend:" + nickname);
    setMsg("");
    try {
      const b64 = await new Promise<string>((resolve,reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
        reader.readAsDataURL(file);
      });
      const result = await uploadLegendPhoto({data:{password,nickname,photoBase64:b64,photoMime:file.type as "image/jpeg"|"image/png"|"image/webp"}});
      if (!result.ok) throw new Error("No se pudo guardar");
      setLegendPhotoOverrides(prev=>({...prev,[nickname.toUpperCase()]:result.url}));
      window.dispatchEvent(new Event("soul:roster-updated"));
      setMsg("Foto de " + nickname + " guardada correctamente.");
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "Error al subir la fotografía");
    } finally {
      setPhotoBusy(null);
    }
  };

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
      const result = await updateWavePhoto({
        data: {
          password,
          kind,
          ...(kind === "dynamic" ? { id: keyOrId } : { name: keyOrId }),
          photoBase64: b64,
          photoMime: file.type,
        },
      });
      if (!result.ok || !result.url) throw new Error("La foto no pudo actualizarse");
      setPhotoOverrides((prev) => ({ ...prev, [keyOrId]: result.url }));
      window.dispatchEvent(new Event("soul:roster-updated"));
      setMsg("Fotografía guardada correctamente. Ya puedes verla en el roster.");
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
          links: newLinks.filter(l => l.label.trim() && l.href.trim()).map(l => ({label:l.label.trim(),href:l.href.trim()})),
          photoBase64: wavePhoto.base64,
          photoMime: wavePhoto.mime,
        },
      });
      setWaveForm({ name: "", redes: "", bio: "", socialLabel: "", socialHref: "" });
      setWavePhoto(null);
      setNewLinks([{ label: "YouTube", href: "" }, { label: "Facebook", href: "" }, { label: "Instagram", href: "" }, { label: "TikTok", href: "" }, { label: "Twitch", href: "" }, { label: "X", href: "" }]);
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
  const [confirm, setConfirm] = useState<{ title: string; description: string; onConfirm: () => void } | null>(null);


  

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
          <TabsList className="grid grid-cols-3 w-full bg-blue-deep/40 border border-flame/20 mb-6 h-auto p-1">
            <TabsTrigger value="roster" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-flame data-[state=active]:text-background text-xs font-mono uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" />
              <span>Roster</span>
            </TabsTrigger>
            <TabsTrigger value="waves" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-flame data-[state=active]:text-background text-xs font-mono uppercase tracking-widest">
              <WavesIcon className="w-3.5 h-3.5" />
              <span>Waves · Redes</span>
            </TabsTrigger>
            <TabsTrigger value="imagenes" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-flame data-[state=active]:text-background text-[10px] sm:text-xs font-mono uppercase tracking-widest">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Imágenes</span>
            </TabsTrigger>
          </TabsList>



          <TabsContent value="imagenes" className="mt-0">
            <SectionShell icon={ImageIcon} title="Imágenes del sitio" subtitle="Cambiar portada y tarjetas del inicio">
              <p className="text-sm text-foreground/75">Reemplaza las fotografías de la portada y los accesos del inicio. Guarda cada cambio desde aquí, sin modificar GitHub. JPG, PNG o WebP, máximo 8 MB.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HOME_ASSET_KEYS.map(item=>{
                  const url=imageOverrides[item.key]||siteAssets[item.key]||defaultHomeImages[item.key];
                  const busy=imageBusy===item.key;
                  return (
                    <div key={item.key} className="rounded-xl border border-flame/25 bg-blue-deep/30 p-4 min-w-0 space-y-3">
                      <div>
                        <h3 className="font-display text-flame text-base">{item.label}</h3>
                        <p className="text-xs text-foreground/60 mt-1">{item.hint}</p>
                      </div>
                      <div className={item.key==="home_banner"?"aspect-[16/5]":"aspect-video"}>
                        {url?<img src={url} alt={item.label} className="w-full h-full object-contain bg-black/30 rounded-lg border border-white/10" />:
                          <div className="w-full h-full flex items-center justify-center rounded-lg border border-dashed border-white/20 text-white/40 text-xs">Sin imagen personalizada. Se muestra la original.</div>}
                      </div>
                      <label className={`block cursor-pointer text-center rounded-lg bg-flame px-4 py-3 text-sm font-semibold text-background transition hover:brightness-110 ${busy?"pointer-events-none opacity-50":""}`}>
                        {busy?"Subiendo imagen…": "Cambiar imagen"}
                        <input type="file" className="hidden" disabled={busy} accept="image/jpeg,image/png,image/webp"
                          onChange={e=>{void onHomeImage(item.key,e.target.files?.[0]??null);e.target.value="";}} />
                      </label>
                    </div>
                  );
                })}
              </div>
            </SectionShell>
          </TabsContent>

          <TabsContent value="roster" className="mt-0">
            <SectionShell icon={Users} title="Roster" subtitle="Waves · Legends · Crew">
              {!rosterSynced && (
                <div className="rounded-xl border border-[#F05E07]/50 bg-[#01039E]/20 p-4 mb-5 space-y-3">
                  <p className="text-sm text-white">Roster actualizado: <strong>19 Crew · 6 Waves · 5 Legends</strong>.</p>
                  <p className="text-xs text-white/70">La página pública ya utiliza la lista nueva. Sincroniza la base de datos una sola vez para que puedas administrarla desde este panel. Se reemplazarán los registros anteriores de Crew y Legends y se ocultarán los Waves que salieron; sus fotos no se eliminarán.</p>
                  <button type="button" disabled={rosterBusy === "sync"}
                    onClick={() => setConfirm({
                      title: "Sincronizar roster oficial",
                      description: "Se aplicarán los 30 integrantes de la lista actualizada. Se reemplazará el roster antiguo de Crew y Legends y se ocultarán los Waves anteriores. ¿Confirmas?",
                      onConfirm: applyOfficialRoster,
                    })}
                    className="rounded-lg bg-[#F05E07] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
                    {rosterBusy === "sync" ? "Sincronizando…" : "Aplicar roster actualizado (30 miembros)"}
                  </button>
                </div>
              )}

              <div className="mb-5 rounded-xl border border-flame/25 bg-blue-deep/20 p-4">
                <h3 className="font-display text-flame mb-2">Fotografías · Soul Legends</h3>
                <p className="text-xs text-white/60 mb-4">Sube una foto para cada Legend. Si no hay fotografía se mostrará el emblema oficial. Formatos JPG, PNG o WebP, máximo 5 MB.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {(rosterSynced ? roster.filter((m)=>m.category==="legends").map((m)=>m.nickname) : [...CURRENT_LEGENDS]).map(nickname=>{
                    const photo = legendPhotoOverrides[nickname] || legendsPhotos[nickname];
                    const busy = photoBusy === "legend:" + nickname;
                    return (
                      <div key={nickname} className="min-w-0 rounded-lg overflow-hidden border border-flame/20 bg-background/60 p-2">
                        <div className="aspect-[3/4] rounded-md bg-[#010339]/30 overflow-hidden flex items-center justify-center">
                          {photo ? <img src={photo} alt={nickname} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-white/30" />}
                        </div>
                        <p className="mt-2 text-[11px] font-display text-white truncate" title={nickname}>{nickname}</p>
                        <label className={`mt-2 block rounded bg-flame text-center px-2 py-2 text-[10px] font-semibold text-background cursor-pointer ${busy ? "opacity-50 pointer-events-none" : ""}`}>
                          {busy ? "Subiendo…" : photo ? "Cambiar foto" : "Subir foto"}
                          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={busy}
                            onChange={(e)=>{ void onLegendPhoto(nickname,e.target.files?.[0] ?? null);e.target.value=""; }} />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                                onClick={() => setConfirm({ title: "Eliminar miembro", description: `¿Seguro que quieres eliminar a "${m.nickname}" del roster? Esta acción no se puede deshacer.`, onConfirm: () => removeMember(m.id) })}
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

              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-4">
                Los waves se editan completos (foto · bio · redes) desde la pestaña <span className="text-flame">Waves · Redes</span>
              </p>

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
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-flame">Enlaces sociales (opcionales)</p>
                      {newLinks.map((link, i) => (
                        <div key={i} className="grid grid-cols-[105px_1fr] gap-2">
                          <input value={link.label} onChange={e => setNewLinks(p => p.map((l,j) => j===i ? {...l,label:e.target.value} : l))} placeholder="Red" maxLength={40} className="min-w-0 px-2 py-2 bg-background border border-flame/30 rounded text-foreground text-xs" />
                          <input type="url" value={link.href} onChange={e => setNewLinks(p => p.map((l,j) => j===i ? {...l,href:e.target.value} : l))} placeholder="https://…" maxLength={500} className="min-w-0 px-2 py-2 bg-background border border-flame/30 rounded text-foreground text-xs" />
                        </div>
                      ))}
                      <button type="button" onClick={() => setNewLinks(p => [...p,{label:"",href:""}])} className="text-flame text-xs font-mono">+ Otra red</button>
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
                      ...FIXED_MEMBERS.map((m) => ({ id: m.id, name: m.name, photo: photoOverrides[m.name.toUpperCase()] || socialsMap.get(m.name.toUpperCase())?.photo_url || m.photo, fixed: true })),
                      ...OTHER_MEMBERS.map((m) => ({ id: m.id, name: m.name, photo: photoOverrides[m.name.toUpperCase()] || socialsMap.get(m.name.toUpperCase())?.photo_url || m.photo, fixed: false })),
                      ...waves.map((w) => ({ id: w.id, name: w.name, photo: photoOverrides[w.id] || w.photo_url, fixed: false, dyn: w })),
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
                          const photoKind: "fixed" | "dynamic" = c.dyn ? "dynamic" : "fixed";
                          const photoKey = c.dyn ? c.dyn.id : key;
                          const pBusy = photoBusy === `${photoKind}:${photoKey}`;
                          const socialsRow = socialsMap.get(key);
                          const fallbackContent: ContentFields = {
                            bio: c.dyn?.bio || socialsRow?.bio || WAVES.find((m) => m.name.toUpperCase() === key)?.bio || "",
                            redes: c.dyn?.redes || socialsRow?.redes || WAVES.find((m) => m.name.toUpperCase() === key)?.redes || "",
                          };
                          const content = getContent(c.name, fallbackContent);
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
                                <div className="relative shrink-0">
                                  <img
                                    src={c.photo}
                                    alt={c.name}
                                    className={`w-20 h-20 sm:w-24 sm:h-24 object-cover object-[center_25%] rounded-md border ${
                                      isHidden ? "opacity-50 border-red-500/30" : "border-flame/30"
                                    }`}
                                  />
                                  <label className={`absolute inset-x-0 bottom-0 text-center bg-background/80 backdrop-blur-sm border-t border-flame/30 text-[9px] font-mono uppercase tracking-widest text-flame py-1 cursor-pointer hover:bg-flame/20 transition ${pBusy ? "opacity-60 cursor-not-allowed" : ""}`}>
                                    {pBusy ? "Subiendo…" : "Cambiar"}
                                    <input
                                      type="file"
                                      accept="image/png,image/jpeg,image/webp,image/gif"
                                      disabled={pBusy}
                                      onChange={(e) => {
                                        const f = e.target.files?.[0] ?? null;
                                        onChangePhoto(photoKind, photoKey, f);
                                        e.target.value = "";
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
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
                                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5 line-clamp-2">
                                      {filledCount} red{filledCount === 1 ? "" : "es"} · {content.bio ? `${content.bio.slice(0, 80)}${content.bio.length > 80 ? "…" : ""}` : "sin bio personalizada"}
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <button
                                      onClick={() => setExpandedSocial(expanded ? null : key)}
                                      className="inline-flex items-center gap-1.5 bg-flame text-background font-mono uppercase tracking-widest text-[10px] px-2.5 py-1 rounded hover:opacity-90"
                                    >
                                      <Link2 className="w-3 h-3" />
                                      {expanded ? "Cerrar editor" : "Editar todo"}
                                    </button>
                                    
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
                                    {c.dyn && (
                                      <button
                                        onClick={() => setConfirm({ title: "Eliminar wave", description: `¿Seguro que quieres eliminar a "${c.name}" de Waves? Se borrará su foto y datos. Esta acción no se puede deshacer.`, onConfirm: () => removeWave(c.dyn!.id) })}
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
                                <div className="px-3 pb-3 pt-3 border-t border-flame/15 bg-background/30 space-y-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <label className="sm:col-span-1 space-y-1 block">
                                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                                        Redes (texto del header)
                                      </span>
                                      <input
                                        type="text"
                                        value={content.redes}
                                        onChange={(e) => setContentField(c.name, "redes", e.target.value, fallbackContent)}
                                        placeholder="TikTok · YouTube · X"
                                        maxLength={200}
                                        className="w-full px-2 py-1.5 bg-background border border-flame/30 rounded text-foreground text-xs focus:border-flame outline-none"
                                      />
                                    </label>
                                    <label className="sm:col-span-2 space-y-1 block">
                                      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                                        Biografía
                                      </span>
                                      <textarea
                                        value={content.bio}
                                        onChange={(e) => setContentField(c.name, "bio", e.target.value, fallbackContent)}
                                        placeholder="Biografía…"
                                        maxLength={4000}
                                        rows={5}
                                        className="w-full px-2 py-1.5 bg-background border border-flame/30 rounded text-foreground text-xs focus:border-flame outline-none resize-y"
                                      />
                                    </label>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                                      Redes sociales (URLs)
                                    </p>
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
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-[10px] text-flame font-mono uppercase">Instagram y otras redes (opcionales)</p>
                                    {getExtraLinks(c.name).map((link, i) => (
                                      <div key={i} className="grid grid-cols-[105px_1fr_24px] gap-2">
                                        <input value={link.label} onChange={e => setExtraLinks(c.name, getExtraLinks(c.name).map((l,j)=>j===i?{...l,label:e.target.value}:l))} placeholder="Red" className="min-w-0 px-2 py-1.5 bg-background border border-flame/30 rounded text-xs" />
                                        <input type="url" value={link.href} onChange={e => setExtraLinks(c.name, getExtraLinks(c.name).map((l,j)=>j===i?{...l,href:e.target.value}:l))} placeholder="https://…" className="min-w-0 px-2 py-1.5 bg-background border border-flame/30 rounded text-xs" />
                                        <button type="button" onClick={() => setExtraLinks(c.name, getExtraLinks(c.name).filter((_,j)=>j!==i))} aria-label="Eliminar red" className="text-red-400">×</button>
                                      </div>
                                    ))}
                                    <button type="button" onClick={() => setExtraLinks(c.name,[...getExtraLinks(c.name),{label:"",href:""}])} className="text-flame text-xs font-mono">+ Añadir red</button>
                                  </div>
                                  <button
                                    onClick={() => saveAll(c.name, { isFixed: c.fixed, dynId: c.dyn?.id, fallbackContent })}
                                    disabled={sBusy}
                                    className="w-full inline-flex items-center justify-center gap-1.5 bg-flame text-background font-mono uppercase tracking-widest text-xs px-3 py-2 rounded hover:opacity-90 disabled:opacity-40 shadow-[0_0_18px_var(--flame-glow)]"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                    {sBusy ? "Guardando…" : "Guardar todo"}
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

      <AlertDialog open={!!confirm} onOpenChange={(o) => { if (!o) setConfirm(null); }}>
        <AlertDialogContent className="bg-blue-deep border-flame/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-flame">{confirm?.title}</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
              {confirm?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono uppercase tracking-widest text-[10px]">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { confirm?.onConfirm(); setConfirm(null); }}
              className="bg-red-600 hover:bg-red-700 text-white font-mono uppercase tracking-widest text-[10px]"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

