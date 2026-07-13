"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Signal } from "@/data/signals";

type StoryCardProps = {
  signal: Signal;
  userColor: string;
  variant?: "desktop" | "mobile";
};

export function StoryCard({ signal }: StoryCardProps) {
  return (
    <aside className="rounded-[28px] border border-[var(--vm-border-soft)] bg-[rgba(8,11,22,0.62)] p-4 shadow-[var(--vm-shadow-panel)] backdrop-blur-[var(--vm-blur-panel)] sm:p-5 lg:p-6">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          initial={{ opacity: 0, y: 6 }}
          key={signal.id}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-4">
            <span className="rounded-full border border-[rgba(var(--vm-user-color-rgb),0.32)] px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[var(--vm-user-color)]">
              Current Signal
            </span>
            <span className="font-mono text-[10px] text-[var(--vm-text-muted)]">
              {signal.time}
            </span>
          </div>

          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--vm-text-muted)]">
            {signal.city} / {signal.area}
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.06em] text-[var(--vm-text-primary)] sm:text-3xl">
            {signal.name}
          </h2>
          <p className="mt-3 font-mono text-xs text-[var(--vm-user-color)]">{signal.mood}</p>
          <p className="mt-6 text-sm leading-[var(--vm-leading-loose)] text-[var(--vm-text-secondary)] sm:mt-8">
            {signal.story}
          </p>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
