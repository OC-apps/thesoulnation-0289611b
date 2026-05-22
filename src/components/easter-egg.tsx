import { useEasterEggs, type EasterEggId } from "@/lib/easter-eggs";
import eggLogo from "@/assets/easter-egg-logo.png";

type Props = {
  id: EasterEggId;
  className?: string;
  label?: string;
  size?: "xs" | "sm" | "md" | "lg";
};

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  xs: "h-5 w-5",
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export function EasterEgg({ id, className = "", label, size = "xs" }: Props) {
  const { discover, isFound } = useEasterEggs();
  const found = isFound(id);

  return (
    <button
      type="button"
      aria-label={label ?? "Easter egg oculto"}
      onClick={(e) => {
        e.stopPropagation();
        discover(id);
      }}
      className={`group relative inline-flex items-center justify-center rounded-full border border-flame/25 bg-background/50 opacity-55 backdrop-blur-sm transition-all duration-300 hover:opacity-100 hover:scale-110 hover:border-flame hover:bg-flame/10 hover:shadow-[0_0_18px_var(--flame-glow)] focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-flame ${SIZE[size]} ${found ? "border-flame/60 opacity-80" : ""} ${className}`}
    >
      <img
        src={eggLogo}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="h-[78%] w-[78%] object-contain transition-transform duration-300 group-hover:scale-110"
        style={{ filter: "drop-shadow(0 0 4px var(--flame-glow))" }}
      />
      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-flame/0 transition-all group-hover:ring-flame/40" />
      {found && (
        <span className="pointer-events-none absolute -top-1 -right-1 h-2 w-2 rounded-full bg-flame shadow-[0_0_8px_var(--flame-glow)]" />
      )}
    </button>
  );
}
