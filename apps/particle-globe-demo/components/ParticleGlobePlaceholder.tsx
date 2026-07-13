import type { Signal } from "@/data/signals";

type ParticleGlobePlaceholderProps = {
  signals: Signal[];
  activeSignal: Signal;
};

const dotPositions = [
  "left-[58%] top-[34%]",
  "left-[48%] top-[41%]",
  "left-[39%] top-[49%]",
  "left-[63%] top-[52%]",
  "left-[52%] top-[61%]",
];

export function ParticleGlobePlaceholder({ signals, activeSignal }: ParticleGlobePlaceholderProps) {
  return (
    <div
      aria-label="Particle globe placeholder"
      className="relative mx-auto grid aspect-square w-full max-w-[520px] place-items-center"
    >
      <div className="absolute inset-[8%] rounded-full border border-[rgba(var(--vm-user-color-rgb),0.18)] bg-[radial-gradient(circle_at_38%_32%,rgba(var(--vm-user-color-rgb),0.22),rgba(216,219,227,0.12)_36%,rgba(3,4,10,0.06)_64%,transparent_72%)] shadow-[var(--vm-glow-user-strong)]" />
      <div className="absolute inset-[16%] rounded-full border border-[rgba(255,255,255,0.07)]" />
      <div className="absolute inset-[27%] rounded-full border border-dashed border-[rgba(255,255,255,0.08)]" />
      <div className="absolute h-[74%] w-[74%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18)_1px,transparent_1.4px)] [background-size:18px_18px] opacity-40 [mask-image:radial-gradient(circle,black_56%,transparent_72%)]" />

      {signals.map((signal, index) => {
        const isActive = signal.id === activeSignal.id;
        return (
          <div
            className={`absolute ${dotPositions[index % dotPositions.length]} -translate-x-1/2 -translate-y-1/2`}
            key={signal.id}
            title={signal.name}
          >
            <span
              className={`block rounded-full bg-[var(--vm-user-color)] ${isActive ? "h-4 w-4 shadow-[var(--vm-glow-user-strong)]" : "h-2.5 w-2.5 opacity-70 shadow-[var(--vm-glow-user)]"}`}
            />
            {isActive ? (
              <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(var(--vm-user-color-rgb),0.34)]" />
            ) : null}
          </div>
        );
      })}

      <div className="absolute bottom-8 rounded-full border border-[var(--vm-border-soft)] bg-[rgba(3,4,10,0.7)] px-4 py-2 text-center text-[10px] uppercase tracking-[0.28em] text-[var(--vm-text-muted)] backdrop-blur-md">
        Static globe placeholder
      </div>
    </div>
  );
}
