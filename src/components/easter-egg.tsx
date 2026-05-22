import { useEasterEggs, type EasterEggId } from "@/lib/easter-eggs";

type Props = {
  id: EasterEggId;
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
};

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-5 w-5 text-[10px]",
  md: "h-7 w-7 text-xs",
  lg: "h-9 w-9 text-sm",
};

export function EasterEgg({ id, className = "", label, size = "md" }: Props) {
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
      className={`group relative inline-flex items-center justify-center rounded-full border border-flame/20 bg-background/40 text-flame/40 opacity-40 backdrop-blur-sm transition-all duration-300 hover:opacity-100 hover:scale-110 hover:border-flame hover:bg-flame/10 hover:text-flame hover:shadow-[0_0_18px_var(--flame-glow)] focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-flame ${SIZE[size]} ${found ? "border-flame/60 text-flame/80 opacity-70" : ""} ${className}`}
    >
      <span className="select-none leading-none">✦</span>
      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-flame/0 group-hover:ring-flame/40 transition-all" />
      {found && (
        <span className="pointer-events-none absolute -top-1 -right-1 h-2 w-2 rounded-full bg-flame shadow-[0_0_8px_var(--flame-glow)]" />
      )}
    </button>
  );
}
