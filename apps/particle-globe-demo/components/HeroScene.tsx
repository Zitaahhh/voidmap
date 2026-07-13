"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ExplorerProfile, Signal } from "@/data/signals";
import { ParticleGlobe } from "./ParticleGlobe";
import { VoidCTA } from "./VoidCTA";
import { CONTINENTS, type ContinentId } from "./continent-data";
import { getContinentCountryFeatures, getGeometryRings } from "./continent-geo";

const EMOTION_TAGS = [
  "lonely",
  "warm",
  "nostalgic",
  "calm",
  "restless",
  "electric",
  "hidden",
  "hopeful",
  "strange",
  "dreamy",
  "tired",
  "open",
] as const;
type SplashPhase = "intro" | "fragments" | "tunnel" | "reveal" | "done";

type HeroSceneProps = {
  signals: Signal[];
  profile: ExplorerProfile;
  initialSignalId?: string;
};

export function HeroScene({ signals, profile, initialSignalId }: HeroSceneProps) {
  const shouldReduceMotion = useReducedMotion();
  const isCompact = useIsCompactViewport();
  const didPlaySplash = useRef(false);
  const [splashPhase, setSplashPhase] = useState<SplashPhase>(shouldReduceMotion ? "done" : "intro");
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(initialSignalId ?? null);
  const [hoveredSignalId, setHoveredSignalId] = useState<string | null>(null);
  const [signalEntries, setSignalEntries] = useState(signals);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerMediaName, setComposerMediaName] = useState<string | null>(null);
  const [composerDescription, setComposerDescription] = useState("");
  const [composerLocationDisclosure, setComposerLocationDisclosure] = useState(true);
  const [composerEmotionTags, setComposerEmotionTags] = useState<string[]>([]);
  const [composerLocationName, setComposerLocationName] = useState<string | null>(null);
  const [composerLatLng, setComposerLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [hoveredContinentId, setHoveredContinentId] = useState<ContinentId | null>(null);
  const [selectedContinentId, setSelectedContinentId] = useState<ContinentId | null>(null);

  const activeSignalId = hoveredSignalId ?? selectedSignalId;
  const activeSignal = signalEntries.find((signal) => signal.id === activeSignalId) ?? null;
  const activeContinentId = hoveredContinentId ?? selectedContinentId;
  const selectedContinent = CONTINENTS.find((continent) => continent.id === selectedContinentId) ?? null;
  const totalSignals = signalEntries.length;

  const fadeIn = shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 };
  const fadeInitial = shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 };

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (didPlaySplash.current) return;
    didPlaySplash.current = true;

    const timers = [
      window.setTimeout(() => setSplashPhase("fragments"), 900),
      window.setTimeout(() => setSplashPhase("tunnel"), 2800),
      window.setTimeout(() => setSplashPhase("reveal"), 6200),
      window.setTimeout(() => setSplashPhase("done"), 7800),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [shouldReduceMotion]);

  const openComposer = () => setIsComposerOpen(true);

  const closeComposer = () => {
    setIsComposerOpen(false);
    setComposerDescription("");
    setComposerMediaName(null);
    setComposerLocationDisclosure(true);
    setComposerEmotionTags([]);
    setComposerLocationName(null);
    setComposerLatLng(null);
  };

  const requestCurrentLocation = async () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(5));
        const lng = Number(position.coords.longitude.toFixed(5));
        setComposerLatLng({ lat, lng });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
            {
              headers: {
                Accept: "application/json",
              },
            },
          );
          if (!response.ok) return;
          const data = (await response.json()) as {
            display_name?: string;
          };
          if (data.display_name) setComposerLocationName(data.display_name);
        } catch {
          // Keep coordinates even if reverse geocoding is unavailable.
        }
      },
      () => {
        // User denied or location unavailable.
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const submitComposer = () => {
    const anchorSignal = activeSignal ?? signalEntries[0] ?? signals[0];
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    const mediaKind = composerMediaName ? "photo" : undefined;
    const fileBase = composerMediaName ? composerMediaName.replace(/\.[^.]+$/, "") : "Untitled Signal";

    const moodTags = composerEmotionTags.slice(0, 2);
    const mood = moodTags.length > 0 ? moodTags.join(" / ") : composerLocationDisclosure ? "shared / draft" : "private / draft";
    const latLng = composerLatLng ?? (anchorSignal ? { lat: anchorSignal.lat, lng: anchorSignal.lng } : { lat: 0, lng: 0 });

    const nextSignal: Signal = {
      id: `signal-${Date.now()}`,
      name: fileBase,
      city: composerLocationName ?? anchorSignal?.city ?? "Private",
      area: composerLocationName ? "Current location" : anchorSignal?.area ?? "Personal trace",
      time,
      mood,
      emotionTags: moodTags,
      story: composerDescription || "No description added yet.",
      lat: latLng.lat,
      lng: latLng.lng,
      mediaKind,
      mapsUrl: composerLocationDisclosure && anchorSignal?.mapsUrl ? anchorSignal.mapsUrl : undefined,
    };

    setSignalEntries((current) => [nextSignal, ...current]);
    setSelectedSignalId(nextSignal.id);
    setHoveredSignalId(nextSignal.id);
    closeComposer();
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden px-3 py-3 text-[var(--vm-text-primary)] sm:px-6 sm:py-6 lg:px-10">
      <BackgroundGrid />
      {splashPhase !== "done" ? <SplashIntroOverlay phase={splashPhase} /> : null}
      <motion.section
        animate={fadeIn}
        className="relative z-10 mx-auto flex min-h-[calc(100vh-24px)] max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[var(--vm-border-soft)] bg-[rgba(4,6,14,0.64)] px-4 py-4 shadow-[var(--vm-shadow-panel)] backdrop-blur-[var(--vm-blur-panel)] sm:min-h-[calc(100vh-48px)] sm:rounded-[36px] sm:px-6 sm:py-6 lg:px-8 lg:py-8 transition duration-700"
        style={{
          filter: splashPhase === "done" ? "none" : "blur(2px)",
          pointerEvents: splashPhase === "done" ? "auto" : "none",
          opacity: splashPhase === "done" ? 1 : 0.92,
        }}
        initial={fadeInitial}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.nav
          animate={fadeIn}
          className="flex items-center justify-between gap-4 border-b border-[#26262f] pb-4"
          initial={fadeInitial}
          transition={{ delay: shouldReduceMotion ? 0 : 0.08, duration: 0.5 }}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center border border-[#3a3a46] bg-[#0a0a0d] text-sm font-semibold tracking-[0.16em] text-[var(--vm-user-color)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                V
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.26em] text-[var(--vm-text-primary)]">
                  VOIDMAP
                </p>
                <p className="mt-1 text-[13px] font-medium uppercase tracking-[0.24em] text-[#d8dbe3]">
                  城市暗面
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="group relative font-mono text-[10px] uppercase tracking-[0.34em] text-[#a9a9b4] transition hover:text-[#f7f7fa]"
              href="/personal-map"
            >
              <span className="pointer-events-none absolute -inset-x-2 -inset-y-1 border border-transparent transition group-hover:border-[#3a3a46] group-hover:bg-[rgba(255,255,255,0.02)]" />
              <span className="relative z-10">MY MAP</span>
            </Link>
            <span className="text-[#484852]">/</span>
            <VoidCTA label="DROP A SIGNAL" onClick={openComposer} size="sm" />
          </div>
        </motion.nav>

        <div className="relative flex flex-1 flex-col items-center justify-center py-6 lg:py-9">
          {activeSignal ? (
            <motion.aside
              animate={fadeIn}
              className="pointer-events-auto absolute left-0 top-1/2 z-30 hidden w-[280px] -translate-y-1/2 lg:block"
              initial={fadeInitial}
              transition={{ delay: shouldReduceMotion ? 0 : 0.16, duration: 0.56 }}
            >
              <SignalPreviewCard
                signal={activeSignal}
                onClose={() => {
                  setHoveredSignalId(null);
                  setSelectedSignalId(null);
                }}
              />
            </motion.aside>
          ) : null}

          <motion.section
            animate={fadeIn}
            className="w-full max-w-4xl text-center"
            initial={fadeInitial}
            transition={{ delay: shouldReduceMotion ? 0 : 0.24, duration: 0.62 }}
          >
            <div className="mx-auto max-w-3xl space-y-5">
              <p className="text-[11px] uppercase tracking-[0.42em] text-[var(--vm-user-color)]">
                your city hidden in signals
              </p>
              <h1 className="mx-auto max-w-4xl text-2xl font-semibold leading-[1.02] tracking-[-0.08em] sm:text-4xl lg:text-[clamp(44px,4.6vw,64px)]">
                留下你的信号
              </h1>
              <p className="mx-auto max-w-3xl text-xs leading-[1.75] text-[var(--vm-text-secondary)] sm:text-sm lg:text-base">
                留下你没说完的话：让每个地点，情绪和故事，在voidmap上变成一颗可再次抵达的光点。
              </p>
            </div>

            <div className="mx-auto mt-7 w-full max-w-[560px] rounded-[32px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)] p-3 sm:p-4">
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-3 z-20 sm:left-4 sm:top-4">
                  <p className="font-mono text-[7px] uppercase tracking-[0.46em] text-[#a9a9b4]">People:</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#f7f7fa] tabular-nums">
                      {profile.peopleCount}
                  </p>
                  <p className="mt-3 font-mono text-[7px] uppercase tracking-[0.46em] text-[#a9a9b4]">Signals:</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#f7f7fa] tabular-nums">
                    {totalSignals}
                  </p>
                </div>
                <ParticleGlobe
                  hoveredSignalId={hoveredSignalId}
                  onSignalHover={(signalId) => {
                    setHoveredSignalId(signalId);
                    if (signalId) setSelectedSignalId(signalId);
                  }}
                  onContinentHover={setHoveredContinentId}
                  onContinentSelect={(continentId) => {
                    setSelectedContinentId(continentId);
                    setHoveredContinentId(continentId);
                  }}
                  selectedContinentId={activeContinentId}
                  selectedSignalId={selectedSignalId}
                  particleCount={isCompact ? 3200 : 6500}
                  signals={signalEntries}
                  userColor={profile.userColor}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2 sm:gap-3">
              {signalEntries.map((signal) => {
                const isActive = signal.id === selectedSignalId || signal.id === hoveredSignalId;
                return (
                  <button
                    aria-pressed={signal.id === selectedSignalId}
                    className={`rounded-full border px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--vm-border-active)] hover:bg-[rgba(var(--vm-user-color-rgb),0.12)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--vm-user-color-rgb),0.3)] ${
                      isActive
                        ? "border-[rgba(var(--vm-user-color-rgb),0.72)] bg-[rgba(var(--vm-user-color-rgb),0.14)] text-[var(--vm-user-color)] shadow-[var(--vm-glow-user)]"
                        : "border-[var(--vm-border-soft)] bg-[rgba(255,255,255,0.025)] text-[var(--vm-text-muted)]"
                    }`}
                    key={signal.id}
                    onClick={() => {
                      setSelectedSignalId(signal.id);
                      setHoveredSignalId(signal.id);
                    }}
                    onBlur={() => setHoveredSignalId(null)}
                    onFocus={() => {
                      setHoveredSignalId(signal.id);
                      setSelectedSignalId(signal.id);
                    }}
                    onMouseEnter={() => {
                      setHoveredSignalId(signal.id);
                      setSelectedSignalId(signal.id);
                    }}
                    onMouseLeave={() => setHoveredSignalId(null)}
                    type="button"
                  >
                    {signal.name}
                  </button>
                );
              })}
            </div>
          </motion.section>
        </div>

        <motion.footer
          animate={fadeIn}
          className="mt-2 flex flex-col gap-3 border-t border-[rgba(255,255,255,0.06)] pt-4 sm:flex-row sm:items-center sm:justify-between"
          initial={fadeInitial}
          transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: 0.45 }}
        >
          <p className="text-sm text-[var(--vm-text-secondary)]">
            当前聚焦：<span className="text-[var(--vm-text-primary)]">{activeSignal?.name ?? ""}</span>
            <span className="mx-2 text-[var(--vm-text-muted)]">/</span>
            <span>{activeSignal?.city ?? ""}</span>
          </p>
          <div className="flex items-center gap-3">
            <Link
              className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#a9a9b4] transition hover:text-[#f7f7fa]"
              href="/personal-map"
            >
              MY MAP
            </Link>
            <span className="text-[#484852]">/</span>
            <VoidCTA label="DROP A SIGNAL" onClick={openComposer} size="sm" />
          </div>
        </motion.footer>
      {selectedContinent ? (
        <ContinentMapPopup continentId={selectedContinent.id} onClose={() => setSelectedContinentId(null)} />
      ) : null}

      {isComposerOpen ? (
        <SignalComposerModal
          description={composerDescription}
          emotionTags={composerEmotionTags}
          latLng={composerLatLng}
          locationDisclosure={composerLocationDisclosure}
          locationName={composerLocationName}
          mediaName={composerMediaName}
          onClose={closeComposer}
          onDescriptionChange={setComposerDescription}
          onEmotionTagsChange={setComposerEmotionTags}
          onLocationDisclosureChange={setComposerLocationDisclosure}
          onMediaChange={setComposerMediaName}
          onRequestCurrentLocation={requestCurrentLocation}
          onSubmit={submitComposer}
        />
      ) : null}

      </motion.section>
    </main>
  );
}

function ContinentMapPopup({ continentId, onClose }: { continentId: ContinentId; onClose: () => void }) {
  const continent = CONTINENTS.find((entry) => entry.id === continentId);
  if (!continent) return null;

  const countries = getContinentCountryFeatures(continentId);
  const toPoint = ([lng, lat]: [number, number]) => `${((lng + 180) / 360) * 100},${((90 - lat) / 180) * 100}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,0,0,0.68)] px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <section
        className="pixel-panel pointer-events-auto w-full max-w-3xl border border-[#2b2b34] bg-[#050508] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_28px_120px_rgba(0,0,0,0.86)] sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#26262f] pb-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.42em] text-[var(--vm-user-color)]">CONTINENT TRACE</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[#f7f7fa]">{continent.name}</h2>
            <p className="mt-2 max-w-md font-mono text-[10px] uppercase tracking-[0.24em] text-[#8e8e9a]">
              Natural Earth countries / flat projection / edge signal isolated
            </p>
          </div>
          <button
            className="border border-[#33333d] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.26em] text-[#a9a9b4] transition hover:border-[#f7f7fa] hover:text-[#f7f7fa]"
            onClick={onClose}
            type="button"
          >
            close
          </button>
        </div>

        <div className="mt-4 overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[radial-gradient(circle_at_50%_50%,rgba(var(--vm-user-color-rgb),0.1),transparent_36%),#07070b] p-3">
          <svg className="h-[260px] w-full sm:h-[340px]" role="img" viewBox="0 0 100 100" aria-label={`${continent.name} flat map`}>
            <defs>
              <filter id="continent-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width="100" height="100" fill="rgba(255,255,255,0.015)" />
            {[20, 40, 60, 80].map((x) => <path d={`M ${x} 0 V 100`} key={`lng-${x}`} stroke="rgba(255,255,255,0.05)" strokeWidth="0.16" />)}
            {[25, 50, 75].map((y) => <path d={`M 0 ${y} H 100`} key={`lat-${y}`} stroke="rgba(255,255,255,0.05)" strokeWidth="0.16" />)}
            {countries.flatMap((country, countryIndex) =>
              getGeometryRings(country.geometry).map((ring, ringIndex) => (
                <polygon
                  fill="rgba(var(--vm-user-color-rgb),0.18)"
                  filter="url(#continent-glow)"
                  key={`${country.properties?.name ?? countryIndex}-${ringIndex}`}
                  points={ring.map((position) => toPoint(position as [number, number])).join(" ")}
                  stroke="rgba(var(--vm-user-color-rgb),0.92)"
                  strokeLinejoin="round"
                  strokeWidth="0.2"
                />
              )),
            )}
            <text fill="rgba(247,247,250,0.8)" fontFamily="monospace" fontSize="2.6" letterSpacing="0.24em" x="4" y="94">
              {continent.mapLabel}
            </text>
          </svg>
        </div>
      </section>
    </div>
  );
}

function SignalComposerModal({
  description,
  locationDisclosure,
  locationName,
  latLng,
  mediaName,
  emotionTags,
  onEmotionTagsChange,
  onClose,
  onDescriptionChange,
  onLocationDisclosureChange,
  onMediaChange,
  onRequestCurrentLocation,
  onSubmit,
}: {
  description: string;
  locationDisclosure: boolean;
  locationName: string | null;
  latLng: { lat: number; lng: number } | null;
  mediaName: string | null;
  emotionTags: string[];
  onEmotionTagsChange: (value: string[]) => void;
  onClose: () => void;
  onDescriptionChange: (value: string) => void;
  onLocationDisclosureChange: (value: boolean) => void;
  onMediaChange: (value: string | null) => void;
  onRequestCurrentLocation: () => void;
  onSubmit: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.72)] px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div
        className="pixel-panel pointer-events-auto w-full max-w-2xl border border-[#2b2b34] bg-[#07070b] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_90px_rgba(0,0,0,0.8)] sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#26262f] pb-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--vm-user-color)]">
              DROP A SIGNAL
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[#f7f7fa]">
              Compose signal
            </h2>
            <p className="mt-2 max-w-md font-mono text-[10px] uppercase tracking-[0.24em] text-[#8e8e9a]">
              upload media, write the trace, choose whether the map pin is disclosed
            </p>
          </div>
          <button
            className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#a9a9b4] transition hover:text-[#f7f7fa]"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="border border-[#23232a] bg-[#09090c] p-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.36em] text-[#8e8e9a]">
                01 / media
              </p>
              <label className="mt-3 block cursor-pointer border border-dashed border-[rgba(255,255,255,0.12)] bg-[#060608] px-3 py-6 text-center transition hover:border-[rgba(var(--vm-user-color-rgb),0.35)] hover:bg-[rgba(var(--vm-user-color-rgb),0.04)]">
                <input
                  className="sr-only"
                  accept="image/*"
                  capture="environment"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    onMediaChange(file ? file.name : null);
                  }}
                  type="file"
                />
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#f7f7fa]">
                  upload image / photo
                </p>
                <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.26em] text-[#8e8e9a]">
                  tap to choose file or camera
                </p>
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--vm-user-color)]">
                  {mediaName ?? "no media selected"}
                </p>
              </label>
            </div>

            <div className="border border-[#23232a] bg-[#09090c] p-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.36em] text-[#8e8e9a]">
                02 / mood
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {EMOTION_TAGS.map((tag) => {
                  const active = emotionTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      aria-pressed={active}
                      className={`rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] transition ${
                        active
                          ? "border-[rgba(var(--vm-user-color-rgb),0.36)] bg-[rgba(var(--vm-user-color-rgb),0.12)] text-[var(--vm-user-color)]"
                          : "border-[#2b2b34] bg-[#060608] text-[#8e8e9a] hover:border-[rgba(var(--vm-user-color-rgb),0.24)] hover:text-[#f7f7fa]"
                      }`}
                      onClick={() => {
                        const nextTags = emotionTags.includes(tag)
                          ? emotionTags.filter((item) => item !== tag)
                          : emotionTags.length >= 2
                            ? emotionTags
                            : [...emotionTags, tag];
                        onEmotionTagsChange(nextTags);
                      }}
                      type="button"
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.28em] text-[#8e8e9a]">
                {emotionTags.length}/2 selected
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-[#23232a] bg-[#09090c] p-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.36em] text-[#8e8e9a]">
                03 / description
              </p>
              <textarea
                className="mt-3 min-h-[220px] w-full resize-none border border-[#23232a] bg-[#060608] p-3 font-mono text-[10px] leading-6 text-[#f7f7fa] outline-none placeholder:text-[#64646f] focus:border-[rgba(var(--vm-user-color-rgb),0.35)]"
                onChange={(event) => onDescriptionChange(event.target.value)}
                placeholder="留下你没说完的话..."
                value={description}
              />
            </div>

            <div className="border border-[#23232a] bg-[#09090c] p-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.36em] text-[#8e8e9a]">
                04 / location
              </p>
              <div className="mt-3 flex items-center justify-between gap-4 border border-[#23232a] bg-[#060608] px-3 py-2">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#f7f7fa]">
                    current location
                  </p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.24em] text-[#8e8e9a]">
                    tap to fill from browser GPS
                  </p>
                </div>
                <button
                  className="border border-[rgba(var(--vm-user-color-rgb),0.36)] bg-[rgba(var(--vm-user-color-rgb),0.08)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--vm-user-color)] transition hover:bg-[rgba(var(--vm-user-color-rgb),0.14)]"
                  onClick={() => {
                    onRequestCurrentLocation();
                  }}
                  type="button"
                >
                  use gps
                </button>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="border border-[#23232a] bg-[#060608] px-3 py-2">
                  <p className="font-mono text-[8px] uppercase tracking-[0.36em] text-[#8e8e9a]">position</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f7f7fa]">
                    {latLng ? `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}` : "not set"}
                  </p>
                </div>
                <div className="border border-[#23232a] bg-[#060608] px-3 py-2">
                  <p className="font-mono text-[8px] uppercase tracking-[0.36em] text-[#8e8e9a]">address</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f7f7fa]">
                    {locationName ?? (locationDisclosure ? "visible" : "masked")}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 border border-[#23232a] bg-[#060608] px-3 py-2">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#f7f7fa]">
                    google location
                  </p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.24em] text-[#8e8e9a]">
                    disclose on map pin
                  </p>
                </div>
                <button
                  aria-pressed={locationDisclosure}
                  className={`border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.24em] transition ${
                    locationDisclosure
                      ? "border-[rgba(var(--vm-user-color-rgb),0.36)] bg-[rgba(var(--vm-user-color-rgb),0.08)] text-[var(--vm-user-color)]"
                      : "border-[#2b2b34] bg-[#09090c] text-[#8e8e9a]"
                  }`}
                  onClick={() => onLocationDisclosureChange(!locationDisclosure)}
                  type="button"
                >
                  {locationDisclosure ? "public" : "hidden"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#26262f] pt-4">
              <button
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a9a9b4] transition hover:text-[#f7f7fa]"
                onClick={onClose}
                type="button"
              >
                cancel
              </button>
              <button
                className="border border-[rgba(var(--vm-user-color-rgb),0.36)] bg-[rgba(var(--vm-user-color-rgb),0.08)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--vm-user-color)] transition hover:bg-[rgba(var(--vm-user-color-rgb),0.14)]"
                onClick={onSubmit}
                type="button"
              >
                drop signal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SplashIntroOverlay({ phase }: { phase: SplashPhase }) {
  const fragments = [
    { text: "02:43 AM", rhythm: 0, style: { "--vm-fragment-duration": "5.7s", "--vm-fragment-delay": "-0.3s", "--vm-fragment-drift-duration": "12.7s", "--vm-fragment-drift-delay": "-1.9s" }, className: "left-[8%] top-[14%] text-[0.82rem] text-[#f7f7fa]/80" },
    { text: "Tokyo / Nakameguro", rhythm: 3, style: { "--vm-fragment-duration": "7.9s", "--vm-fragment-delay": "-2.7s", "--vm-fragment-drift-duration": "17.3s", "--vm-fragment-drift-delay": "-8.1s" }, className: "left-[63%] top-[18%] text-[0.7rem] text-[#d8dbe3]/65 blur-[0.2px]" },
    { text: "35.6444, 139.6992", rhythm: 1, style: { "--vm-fragment-duration": "6.4s", "--vm-fragment-delay": "-4.9s", "--vm-fragment-drift-duration": "14.2s", "--vm-fragment-drift-delay": "-3.4s" }, className: "left-[13%] top-[30%] text-[0.68rem] text-[#f7f7fa]/45 blur-[0.8px]" },
    { text: "03:17 AM", rhythm: 5, style: { "--vm-fragment-duration": "9.1s", "--vm-fragment-delay": "-1.1s", "--vm-fragment-drift-duration": "19.6s", "--vm-fragment-drift-delay": "-11.2s" }, className: "left-[78%] top-[33%] text-[0.74rem] text-[#ffffff]/86" },
    { text: "Shibuya Backstreet", rhythm: 2, style: { "--vm-fragment-duration": "6.9s", "--vm-fragment-delay": "-5.8s", "--vm-fragment-drift-duration": "13.6s", "--vm-fragment-drift-delay": "-6.7s" }, className: "left-[22%] top-[49%] text-[0.66rem] text-[#d8dbe3]/55 blur-[0.4px]" },
    { text: "01:04 AM", rhythm: 4, style: { "--vm-fragment-duration": "8.3s", "--vm-fragment-delay": "-3.6s", "--vm-fragment-drift-duration": "16.1s", "--vm-fragment-drift-delay": "-2.8s" }, className: "left-[54%] top-[55%] text-[0.74rem] text-[#ffffff]/70" },
    { text: "Euljiro / B1", rhythm: 1, style: { "--vm-fragment-duration": "5.9s", "--vm-fragment-delay": "-1.8s", "--vm-fragment-drift-duration": "11.9s", "--vm-fragment-drift-delay": "-9.5s" }, className: "left-[80%] top-[63%] text-[0.7rem] text-[#d8dbe3]/48 blur-[1px]" },
    { text: "37.5665, 126.9780", rhythm: 3, style: { "--vm-fragment-duration": "10.2s", "--vm-fragment-delay": "-6.4s", "--vm-fragment-drift-duration": "20.4s", "--vm-fragment-drift-delay": "-4.6s" }, className: "left-[34%] top-[69%] text-[0.66rem] text-[#f7f7fa]/38 blur-[0.9px]" },
    { text: "22.3193, 114.1694", rhythm: 0, style: { "--vm-fragment-duration": "7.1s", "--vm-fragment-delay": "-4.1s", "--vm-fragment-drift-duration": "15.8s", "--vm-fragment-drift-delay": "-12.4s" }, className: "left-[62%] top-[78%] text-[0.68rem] text-[#ffffff]/78" },
    { text: "Mong Kok service door", rhythm: 5, style: { "--vm-fragment-duration": "6.2s", "--vm-fragment-delay": "-2.2s", "--vm-fragment-drift-duration": "12.1s", "--vm-fragment-drift-delay": "-5.1s" }, className: "left-[9%] top-[82%] text-[0.72rem] text-[#d8dbe3]/85" },
    { text: "00:26 AM", rhythm: 2, style: { "--vm-fragment-duration": "11.4s", "--vm-fragment-delay": "-8.7s", "--vm-fragment-drift-duration": "22.6s", "--vm-fragment-drift-delay": "-14.8s" }, className: "left-[42%] top-[18%] text-[0.7rem] text-[#f7f7fa]/50 blur-[0.3px]" },
    { text: "Taipei / Ximending", rhythm: 4, style: { "--vm-fragment-duration": "7.6s", "--vm-fragment-delay": "-0.9s", "--vm-fragment-drift-duration": "13.1s", "--vm-fragment-drift-delay": "-7.6s" }, className: "left-[6%] top-[42%] text-[0.66rem] text-[#ffffff]/66" },
    { text: "25.0421, 121.5079", rhythm: 1, style: { "--vm-fragment-duration": "8.8s", "--vm-fragment-delay": "-7.5s", "--vm-fragment-drift-duration": "18.4s", "--vm-fragment-drift-delay": "-1.7s" }, className: "left-[67%] top-[48%] text-[0.66rem] text-[#d8dbe3]/44 blur-[0.7px]" },
    { text: "Berlin / U8", rhythm: 3, style: { "--vm-fragment-duration": "6.7s", "--vm-fragment-delay": "-3.3s", "--vm-fragment-drift-duration": "14.9s", "--vm-fragment-drift-delay": "-10.1s" }, className: "left-[47%] top-[84%] text-[0.7rem] text-[#f7f7fa]/58 blur-[0.4px]" },
    { text: "52.5200, 13.4050", rhythm: 5, style: { "--vm-fragment-duration": "9.6s", "--vm-fragment-delay": "-5.2s", "--vm-fragment-drift-duration": "21.3s", "--vm-fragment-drift-delay": "-6.2s" }, className: "left-[73%] top-[8%] text-[0.64rem] text-[#d8dbe3]/42 blur-[0.8px]" },
    { text: "04:11 AM", rhythm: 0, style: { "--vm-fragment-duration": "5.4s", "--vm-fragment-delay": "-2.9s", "--vm-fragment-drift-duration": "10.8s", "--vm-fragment-drift-delay": "-4.9s" }, className: "left-[19%] top-[72%] text-[0.78rem] text-[#ffffff]/74" },
    { text: "underpass 17", rhythm: 4, style: { "--vm-fragment-duration": "10.7s", "--vm-fragment-delay": "-6.9s", "--vm-fragment-drift-duration": "16.8s", "--vm-fragment-drift-delay": "-13.5s" }, className: "left-[86%] top-[82%] text-[0.66rem] text-[#f7f7fa]/46 blur-[1px]" },
    { text: "34.0522, -118.2437", rhythm: 2, style: { "--vm-fragment-duration": "7.3s", "--vm-fragment-delay": "-5.5s", "--vm-fragment-drift-duration": "19.1s", "--vm-fragment-drift-delay": "-8.8s" }, className: "left-[28%] top-[9%] text-[0.64rem] text-[#d8dbe3]/36 blur-[0.9px]" },
  ];

  return (
    <div
      aria-hidden="true"
      className={`vm-splash vm-splash--${phase} pointer-events-none fixed inset-0 z-50 overflow-hidden bg-[#050508]`}
    >
      <div className="vm-splash__wash" />
      <div className="vm-splash__dream" />
      <div className="vm-splash__grain pixel-noise" />
      <div className="vm-splash__slice vm-splash__slice--a" />
      <div className="vm-splash__slice vm-splash__slice--b" />
      <div className="vm-splash__slice vm-splash__slice--c" />
      <div className="vm-splash__tunnel">
        <div className="vm-splash__rift" />
        <div className="vm-splash__ring" />
        <div className="vm-splash__fragments">
          {fragments.map((fragment) => (
            <span
              className={`vm-splash__fragment vm-splash__fragment--${fragment.rhythm} absolute font-mono uppercase tracking-[0.28em] ${fragment.className}`}
              key={fragment.text}
              style={fragment.style as CSSProperties}
            >
              {fragment.text}
            </span>
          ))}
        </div>
        <div className="vm-splash__scan" />
        <div className="vm-splash__axis" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="vm-splash__title text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.44em] text-[#a9a9b4]">
            {phase === "intro" ? "retrieving memory" : phase === "fragments" ? "drifting through time" : phase === "tunnel" ? "signal tunnel" : phase === "reveal" ? "waking the map" : ""}
          </p>
          <p className="mt-3 text-lg font-semibold tracking-[-0.05em] text-[#f7f7fa] sm:text-2xl">
            voidmap
          </p>
        </div>
      </div>
    </div>
  );
}

function BackgroundGrid() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:26px_26px]" />
      <div className="pixel-noise opacity-[0.12]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(var(--vm-user-color-rgb),0.06),transparent_30%),radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.05),transparent_22%),radial-gradient(circle_at_88%_78%,rgba(216,219,227,0.08),transparent_24%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(var(--vm-user-color-rgb),0.06)] blur-[110px] sm:h-[700px] sm:w-[700px] sm:blur-[140px]" />
      <div className="pointer-events-none absolute -left-28 top-12 h-72 w-72 rounded-full bg-[rgba(216,219,227,0.12)] blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[rgba(216,219,227,0.08)] blur-[120px]" />
    </>
  );
}

function HomeStatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-none border border-[#2b2b34] bg-[#0a0a0d] px-4 py-3 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#8e8e9a]">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[#f4f4f7]">{value}</p>
    </div>
  );
}

function SignalPreviewCard({ signal, onClose }: { signal: Signal; onClose: () => void }) {
  const isVideo = signal.mediaKind === "video" || /\.(mov|mp4|webm)$/i.test(signal.mediaUrl ?? "");

  return (
    <section className="pointer-events-auto rounded-[20px] border border-[rgba(255,255,255,0.06)] bg-[rgba(6,9,18,0.72)] p-3 shadow-[var(--vm-shadow-panel)] backdrop-blur-[var(--vm-blur-panel)]">
      <div className="flex items-start justify-between gap-3 border-b border-[rgba(255,255,255,0.06)] pb-3">
        <div>
          <p className="text-[9px] uppercase tracking-[0.28em] text-[var(--vm-text-muted)]">Active trace</p>
          <h2 className="mt-1 text-sm font-semibold tracking-[-0.03em] text-[var(--vm-text-primary)]">
            {signal.name}
          </h2>
        </div>
        <button
          className="pointer-events-auto text-[9px] uppercase tracking-[0.24em] text-[var(--vm-text-muted)] transition hover:text-[var(--vm-text-primary)]"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      </div>

      <div className="mt-3 overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-[linear-gradient(160deg,rgba(10,13,24,0.95),rgba(2,4,10,0.95))]">
        {signal.mediaUrl ? (
          isVideo ? (
            <video
              className="aspect-[4/3] w-full object-cover"
              controls
              playsInline
              poster={signal.posterUrl}
              src={signal.mediaUrl}
            />
          ) : (
            <img
              alt={signal.altText ?? signal.name}
              className="aspect-[4/3] w-full object-cover"
              src={signal.mediaUrl}
            />
          )
        ) : (
          <div className="flex aspect-[4/3] items-end p-3">
            <div className="w-full rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-3">
              <p className="text-[9px] uppercase tracking-[0.28em] text-[var(--vm-text-muted)]">
                {isVideo ? "Video" : "Photo"}
              </p>
              <p className="mt-2 text-xs font-medium text-[var(--vm-text-primary)]">
                {signal.city} / {signal.area}
              </p>
              <p className="mt-2 text-[11px] leading-5 text-[var(--vm-text-secondary)]">
                Uploaded media preview will live here.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <p className="text-[9px] uppercase tracking-[0.28em] text-[var(--vm-text-muted)]">Description</p>
          <p className="mt-2 text-xs leading-6 text-[var(--vm-text-secondary)]">{signal.story}</p>
        </div>

        <div className="grid gap-2 text-xs text-[var(--vm-text-secondary)]">
          <SignalMeta label="Mood" value={signal.mood} />
          <SignalMeta label="Trace" value={`${signal.city} / ${signal.area}`} />
        </div>

        {signal.mapsUrl ? (
          <a
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--vm-user-color-rgb),0.22)] bg-[rgba(var(--vm-user-color-rgb),0.06)] px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-[var(--vm-user-color)] transition hover:-translate-y-0.5 hover:bg-[rgba(var(--vm-user-color-rgb),0.1)]"
            href={signal.mapsUrl}
            rel="noreferrer"
            target="_blank"
          >
            Google Maps
          </a>
        ) : null}
      </div>
    </section>
  );
}

function SignalMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[16px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-3 py-2">
      <span className="text-[9px] uppercase tracking-[0.26em] text-[var(--vm-text-muted)]">{label}</span>
      <span className="text-right text-[11px] text-[var(--vm-text-primary)]">{value}</span>
    </div>
  );
}

function useIsCompactViewport() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsCompact(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isCompact;
}
