type VoidCTAProps = {
  label: string;
  userColor?: string;
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
};

const sizeClass = {
  sm: "px-4 py-2 text-[10px]",
  md: "px-5 py-3 text-xs",
  lg: "px-6 py-4 text-sm",
};

export function VoidCTA({ label, variant = "primary", size = "md", disabled = false, type = "button", onClick }: VoidCTAProps) {
  const variantClass =
    variant === "primary"
      ? "border-[rgba(var(--vm-user-color-rgb),0.55)] bg-[rgba(var(--vm-user-color-rgb),0.12)] text-[var(--vm-text-primary)] shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
      : "border-[var(--vm-border-soft)] bg-transparent text-[var(--vm-text-secondary)]";

  return (
    <button
      className={`${sizeClass[size]} ${variantClass} group relative overflow-hidden rounded-none border uppercase tracking-[0.24em] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--vm-border-active)] hover:bg-[rgba(var(--vm-user-color-rgb),0.18)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--vm-user-color-rgb),0.42)] disabled:cursor-not-allowed disabled:opacity-45`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)] transition duration-500 group-hover:translate-x-[120%]" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}
