import type { Signal } from "@/data/signals";
import { VoidCTA } from "./VoidCTA";

type BottomStatusBarProps = {
  activeSignal: Signal;
  activeSignalIndex?: number;
  totalSignals: number;
  userColor: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

export function BottomStatusBar({
  activeSignal,
  activeSignalIndex = 0,
  totalSignals,
  ctaLabel = "Enter My VoidMap",
  onCtaClick,
}: BottomStatusBarProps) {
  return (
    <footer className="flex flex-col gap-4 border-t border-[rgba(255,255,255,0.06)] pt-4 text-[11px] text-[var(--vm-text-muted)] sm:text-xs lg:flex-row lg:items-center lg:justify-between lg:pt-5">
      <div className="grid gap-2 sm:grid-cols-3 sm:items-center sm:gap-5 xl:gap-8">
        <span className="uppercase tracking-[0.24em] text-[var(--vm-text-secondary)]">
          Active: {activeSignal.name}
        </span>
        <span className="font-mono text-[var(--vm-text-secondary)]">
          {activeSignal.city} / {activeSignal.time}
        </span>
        <span className="font-mono text-[var(--vm-text-secondary)]">
          {activeSignalIndex + 1}/{totalSignals} mapped signals
        </span>
      </div>
      <VoidCTA label={ctaLabel} onClick={onCtaClick} size="sm" />
    </footer>
  );
}
