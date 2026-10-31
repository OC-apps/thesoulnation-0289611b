import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type SoulPost = Database["public"]["Tables"]["soul_posts"]["Row"];

export function useSoulPosts() {
  const [posts, setPosts] = useState<SoulPost[]>([]);
  useEffect(() => {
    let active = true;
    let serial = 0;
    const load = async () => {
      const run = ++serial;
      const {data,error} = await supabase.from("soul_posts")
        .select("*").eq("published",true).order("created_at",{ascending:false}).limit(24);
      if (!active || run !== serial) return;
      if (error) { console.warn("[Soul Feed] Error al cargar novedades:",error.message); return; }
      setPosts(data ?? []);
    };
    void load();
    const onFocus = () => { void load(); };
    const onVisibility = () => { if (document.visibilityState === "visible") void load(); };
    window.addEventListener("focus",onFocus);
    document.addEventListener("visibilitychange",onVisibility);
    window.addEventListener("soul:posts-updated",onFocus);
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") void load(); },60000);
    return () => {
      active=false;window.clearInterval(timer);
      window.removeEventListener("focus",onFocus);
      window.removeEventListener("soul:posts-updated",onFocus);
      document.removeEventListener("visibilitychange",onVisibility);
    };
  }, []);
  return posts;
}
