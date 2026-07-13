import type { ExplorerProfile as ExplorerProfileType, Signal } from "@/data/signals";

type ExplorerProfileProps = {
  profile: ExplorerProfileType;
  activeSignal?: Signal;
  userColor: string;
  compact?: boolean;
};

export function ExplorerProfile({ profile, activeSignal }: ExplorerProfileProps) {
  return (
    <aside className="rounded-[28px] border border-[var(--vm-border-soft)] bg-[rgba(8,11,22,0.62)] p-4 shadow-[var(--vm-shadow-panel)] backdrop-blur-[var(--vm-blur-panel)] sm:p-5 lg:p-6">
      <div className="flex items-start gap-4 border-b border-[rgba(255,255,255,0.06)] pb-5">
        <div className="grid h-12 w-12 place-items-center rounded-full border border-[rgba(var(--vm-user-color-rgb),0.44)] bg-[rgba(var(--vm-user-color-rgb),0.12)] text-sm font-semibold text-[var(--vm-user-color)] shadow-[var(--vm-glow-user)]">
          Z
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold tracking-[-0.04em] text-[var(--vm-text-primary)]">
            {profile.name}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--vm-text-muted)]">
            {profile.title}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-[1.7] text-[var(--vm-text-secondary)]">
            A private signal archive built for late-night exploration and memory mapping.
          </p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:mt-6">
        <ProfileStat label="people" value={profile.peopleCount} />
        <ProfileStat label="signals" value={profile.signalCount} />
        <ProfileStat label="cities" value={profile.cityCount} />
        <ProfileStat label="last" value={profile.lastSignalAt} />
      </dl>

      <div className="mt-5 rounded-[22px] border border-[var(--vm-border-soft)] bg-[rgba(255,255,255,0.03)] p-4 sm:mt-6">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--vm-text-muted)]">
          Active coordinate
        </p>
        <p className="mt-3 font-mono text-xs leading-6 text-[var(--vm-text-secondary)]">
          {activeSignal?.lat.toFixed(4)}, {activeSignal?.lng.toFixed(4)}
        </p>
      </div>
    </aside>
  );
}

function ProfileStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3">
      <dt className="text-[10px] uppercase tracking-[0.26em] text-[var(--vm-text-muted)]">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium text-[var(--vm-text-primary)]">{value}</dd>
    </div>
  );
}
