import { useEffect } from "react";

export function EffectsLayer() {
  useEffect(() => {
    // Cursor flame follower
    const cursor = document.createElement("div");
    cursor.className = "soul-cursor";
    document.body.appendChild(cursor);
    const onMove = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    window.addEventListener("pointermove", onMove);

    // 3D tilt on .tilt-card following mouse
    const tiltHandlers = new Map<HTMLElement, (e: PointerEvent) => void>();
    const leaveHandlers = new Map<HTMLElement, () => void>();
    const tiltEls = document.querySelectorAll<HTMLElement>(".tilt-card, .wave-card, .wp-card");
    tiltEls.forEach((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (0.5 - y) * 14;
        const ry = (x - 0.5) * 16;
        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
        el.style.setProperty("--mx", `${x * 100}%`);
        el.style.setProperty("--my", `${y * 100}%`);
      };
      const leave = () => {
        el.style.setProperty("--rx", `0deg`);
        el.style.setProperty("--ry", `0deg`);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      tiltHandlers.set(el, move);
      leaveHandlers.set(el, leave);
    });

    // Scroll reveal
    const revealEls = document.querySelectorAll<HTMLElement>("section, article, .reveal");
    revealEls.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealEls.forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("pointermove", onMove);
      cursor.remove();
      tiltHandlers.forEach((fn, el) => el.removeEventListener("pointermove", fn));
      leaveHandlers.forEach((fn, el) => el.removeEventListener("pointerleave", fn));
      io.disconnect();
    };
  }, []);

  return (
    <>
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette-edges" aria-hidden="true" />
    </>
  );
}

function CogSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M50 8 L58 4 L66 8 L70 16 L78 18 L84 24 L86 32 L92 38 L92 46 L96 54 L92 62 L86 68 L84 76 L78 82 L70 84 L66 92 L58 96 L50 92 L42 96 L34 92 L30 84 L22 82 L16 76 L14 68 L8 62 L4 54 L8 46 L8 38 L14 32 L16 24 L22 18 L30 16 L34 8 L42 4 Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="6" fill="currentColor" />
    </svg>
  );
}
