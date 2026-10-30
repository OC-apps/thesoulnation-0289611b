import { useEffect } from "react";

/** Reveal content without hiding it; no pointer tracking or continuous animation. */
export function EffectsLayer() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const selector = ".soul-home-tile, .soul-portrait, .soul-hub article, .soul-purpose, .area-chip, .soul-hub section h2";
    let frame = 0;
    let observer: IntersectionObserver | undefined;
    let seen = new WeakSet<Element>();
    const animations = new Set<Animation>();
    const observe = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (reduced.matches || !observer) return;
        document.querySelectorAll(selector).forEach(el => {
          if (!seen.has(el)) observer!.observe(el);
        });
      });
    };
    const configure = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      if (reduced.matches) return;
      seen = new WeakSet<Element>();
      observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        visible.forEach((entry, index) => {
          seen.add(entry.target);
          observer?.unobserve(entry.target);
          if (!(entry.target instanceof HTMLElement)) return;
          const animation = entry.target.animate(
            [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 550, delay: Math.min(index * 45, 180), easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" },
          );
          animations.add(animation);
          animation.finished.then(() => animations.delete(animation)).catch(() => {});
        });
      }, { threshold: 0.08 });
      observe();
    };
    configure();
    const mutations = new MutationObserver(observe);
    mutations.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("hashchange", observe);
    reduced.addEventListener("change", configure);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      mutations.disconnect();
      animations.forEach(animation => animation.cancel());
      window.removeEventListener("hashchange", observe);
      reduced.removeEventListener("change", configure);
    };
  }, []);
  return null;
}
