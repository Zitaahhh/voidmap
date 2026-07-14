"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import landTopology from "world-atlas/land-50m.json";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { signals } from "@/data/signals";
import { getCurrentUser, logoutUser, type VoidMapUser } from "@/lib/auth";

const favoriteSignals = [signals[1], signals[3], signals[4]].filter(Boolean);

const worldFeatureCollection = feature(
  landTopology as never,
  (landTopology as { objects: { land: unknown } }).objects.land as never,
) as unknown as FeatureCollection<Polygon | MultiPolygon>;

const worldProjection = geoEquirectangular().scale(170).translate([600, 300]);
const worldPath = geoPath(worldProjection);
const MAP_VIEW_WIDTH = 1200;
const MAP_VIEW_HEIGHT = 600;
const WORLD_WIDTH_KM = 40075;
const MIN_ZOOM = 1;
const MAX_ZOOM = 400;

function projectSignal(signal: (typeof signals)[number]) {
  const projected = worldProjection([signal.lng, signal.lat]);
  return {
    left: projected?.[0] ?? 0,
    top: projected?.[1] ?? 0,
  };
}

export default function PersonalMapPage() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ pointerId: number; x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const pinchState = useRef<{ distance: number; zoom: number } | null>(null);
  const activePointers = useRef(new Map<number, { x: number; y: number }>());
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [hoveredSignalId, setHoveredSignalId] = useState<string | null>(null);
  const [pinnedSignalId, setPinnedSignalId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<VoidMapUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const user = getCurrentUser();
      setCurrentUser(user);
      setIsAuthReady(true);
      if (!user) router.replace("/");
    }, 0);

    return () => window.clearTimeout(handle);
  }, [router]);

  const personalSignals = useMemo(() => {
    if (!currentUser) return [];
    const username = currentUser.username.toLowerCase();
    return signals.filter(
      (signal) => signal.authorId === currentUser.id || signal.authorName.toLowerCase() === username,
    );
  }, [currentUser]);
  const recentSignals = useMemo(() => personalSignals.slice(0, 3), [personalSignals]);
  const uniquePlaces = useMemo(
    () => new Set(personalSignals.map((signal) => `${signal.city} / ${signal.area}`)).size,
    [personalSignals],
  );
  const lastSignalAt = personalSignals[0]?.time ?? "silent";

  const activeSignal = signals.find((signal) => signal.id === (pinnedSignalId ?? hoveredSignalId)) ?? null;
  const mapScale = zoom;
  const mapTransform = `translate3d(${mapOffset.x}px, ${mapOffset.y}px, 0) scale(${mapScale})`;
  const visibleRangeKm = Math.max(100, Math.round(WORLD_WIDTH_KM / zoom));

  const handleMapWheel = useCallback((deltaY: number) => {
    setZoom((currentZoom) => {
      const nextZoom = Number((currentZoom * Math.exp(-deltaY * 0.0028)).toFixed(2));
      return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
    });
  }, []);

  useEffect(() => {
    const element = mapRef.current;
    if (!element) return;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      handleMapWheel(event.deltaY);
    };

    const onGestureStart = (event: Event) => {
      event.preventDefault();
    };

    const onGestureChange = (event: Event & { scale?: number }) => {
      event.preventDefault();
      const scale = typeof event.scale === "number" ? event.scale : 1;
      const deltaY = (1 - scale) * 500;
      handleMapWheel(deltaY);
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("gesturestart", onGestureStart as EventListener, { passive: false });
    element.addEventListener("gesturechange", onGestureChange as EventListener, { passive: false });
    return () => {
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("gesturestart", onGestureStart as EventListener);
      element.removeEventListener("gesturechange", onGestureChange as EventListener);
    };
  }, [handleMapWheel]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch" && event.pointerType !== "mouse") return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const element = event.currentTarget as HTMLDivElement;
    element.setPointerCapture(event.pointerId);

    activePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (activePointers.current.size === 1) {
      dragState.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        offsetX: mapOffset.x,
        offsetY: mapOffset.y,
      };
      pinchState.current = null;
      return;
    }

    if (activePointers.current.size === 2) {
      const [first, second] = Array.from(activePointers.current.values());
      pinchState.current = {
        distance: Math.max(1, Math.hypot(second.x - first.x, second.y - first.y)),
        zoom,
      };
      dragState.current = null;
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch" && event.pointerType !== "mouse") return;

    const pointer = activePointers.current.get(event.pointerId);
    if (!pointer) return;

    pointer.x = event.clientX;
    pointer.y = event.clientY;

    if (activePointers.current.size >= 2) {
      const [first, second] = Array.from(activePointers.current.values());
      const distance = Math.max(1, Math.hypot(second.x - first.x, second.y - first.y));

      if (!pinchState.current) {
        pinchState.current = {
          distance,
          zoom,
        };
        return;
      }

      const ratio = distance / pinchState.current.distance;
      if (Math.abs(ratio - 1) < 0.02) return;

      const nextZoom = Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, Number((pinchState.current.zoom * Math.pow(ratio, 1.35)).toFixed(2))),
      );
      pinchState.current = {
        distance,
        zoom: nextZoom,
      };
      setZoom(nextZoom);
      return;
    }

    if (dragState.current?.pointerId !== event.pointerId) return;
    const dx = event.clientX - dragState.current.x;
    const dy = event.clientY - dragState.current.y;
    setMapOffset({
      x: dragState.current.offsetX + dx,
      y: dragState.current.offsetY + dy,
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch" && event.pointerType !== "mouse") return;

    activePointers.current.delete(event.pointerId);
    if (dragState.current?.pointerId === event.pointerId) {
      dragState.current = null;
    }

    if (activePointers.current.size === 1) {
      const [remainingPointerId, remainingPointer] = Array.from(activePointers.current.entries())[0];
      dragState.current = {
        pointerId: remainingPointerId,
        x: remainingPointer.x,
        y: remainingPointer.y,
        offsetX: mapOffset.x,
        offsetY: mapOffset.y,
      };
      pinchState.current = null;
      return;
    }

    pinchState.current = null;
  }

  const visibleSignalPoints = useMemo(() => {
    const activeSignalId = pinnedSignalId ?? hoveredSignalId;

    return signals
      .map((signal) => {
        const projected = projectSignal(signal);
        if (
          projected.left < -32 ||
          projected.left > MAP_VIEW_WIDTH + 32 ||
          projected.top < -32 ||
          projected.top > MAP_VIEW_HEIGHT + 32
        ) {
          return null;
        }

        return {
          signal,
          left: projected.left,
          top: projected.top,
          isActive: signal.id === activeSignalId,
        };
      })
      .filter((point): point is { signal: (typeof signals)[number]; left: number; top: number; isActive: boolean } => point !== null);
  }, [hoveredSignalId, pinnedSignalId]);

  function handleLogout() {
    logoutUser();
    setCurrentUser(null);
    router.replace("/");
  }

  if (!isAuthReady || !currentUser) {
    return <main className="min-h-screen bg-[var(--vm-bg-void)]" />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-3 py-3 text-[var(--vm-text-primary)] sm:px-6 sm:py-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:26px_26px]" />
      <div className="pixel-noise opacity-[0.12]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(var(--vm-user-color-rgb),0.08),transparent_28%),radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.05),transparent_18%),radial-gradient(circle_at_84%_74%,rgba(216,219,227,0.08),transparent_24%)]" />

      <section className="pixel-panel relative z-10 mx-auto flex min-h-[calc(100vh-24px)] max-w-6xl flex-col border border-[#2b2b34] bg-[rgba(4,4,6,0.88)] px-4 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_70px_rgba(0,0,0,0.68)] sm:min-h-[calc(100vh-48px)] sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-4 border-b border-[#26262f] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Link
              className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#a9a9b4] transition hover:text-[#f7f7fa]"
              href="/"
            >
              / back
            </Link>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-[#f7f7fa]">
                MY MAP / PRIVATE TRACE
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-[#f7f7fa] sm:text-4xl">
                {currentUser.username} 的个人地图
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-3 border border-[#2b2b34] bg-[#09090c] px-3 py-2">
              <div className="grid h-9 w-9 place-items-center border border-[#3a3a46] bg-[#0f0f13] font-mono text-[10px] uppercase tracking-[0.2em] text-[#d8dbe3]">
                {currentUser.username.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.36em] text-[#8e8e9a]">profile</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#f7f7fa]">
                  {currentUser.username}
                </p>
              </div>
            </div>
            <button
              className="border border-[#3a3a46] bg-[#09090c] px-3 py-3 font-mono text-[9px] uppercase tracking-[0.28em] text-[#a9a9b4] transition hover:border-[#555560] hover:text-[#f7f7fa]"
              onClick={handleLogout}
              type="button"
            >
              log out
            </button>
          </div>
        </header>

        <div className="mt-6 grid flex-1 gap-4 lg:grid-cols-[1.35fr_0.85fr]">
          <section className="space-y-4">
            <div className="border border-[#2b2b34] bg-[#09090c] p-4">
              <div className="flex items-center justify-between border-b border-[#26262f] pb-3">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.42em] text-[#8e8e9a]">
                    archive surface
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#f7f7fa]">
                    global map
                  </p>
                </div>
                <div className="text-right font-mono text-[8px] uppercase tracking-[0.3em] text-[#a9a9b4]">
                  <p>range / {visibleRangeKm}km</p>
                  <p className="mt-1">grid / local</p>
                </div>
              </div>

              <div ref={mapRef} className="relative mt-4 aspect-[2/1] cursor-grab overflow-hidden border border-[#23232a] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.018)_28%,rgba(255,255,255,0)_60%),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:100%_100%,30px_30px,30px_30px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} style={{ touchAction: "none" }}>
                <div className="absolute inset-0" style={{ transform: mapTransform, transformOrigin: "50% 50%" }}>
                  <svg
                    aria-label="Global map"
                    className="absolute inset-0 h-full w-full"
                    role="img"
                    viewBox="0 0 1200 600"
                  >
                    <defs>
                      <linearGradient id="oceanGlow" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
                        <stop offset="100%" stopColor="rgba(216,219,227,0.02)" />
                      </linearGradient>
                      <filter id="softGlow" height="200%" width="200%" x="-50%" y="-50%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <rect fill="#060608" height="600" width="1200" />
                    <rect fill="url(#oceanGlow)" height="600" opacity="0.35" width="1200" />

                    {Array.from({ length: 9 }).map((_, index) => {
                      const y = 60 + index * 60;
                      return (
                        <line
                          key={`lat-${y}`}
                          stroke="rgba(255,255,255,0.08)"
                          strokeDasharray={index === 4 ? "0" : "5 9"}
                          strokeWidth={index === 4 ? 1.1 : 0.7}
                          x1="0"
                          x2="1200"
                          y1={y}
                          y2={y}
                        />
                      );
                    })}
                    {Array.from({ length: 13 }).map((_, index) => {
                      const x = 50 + index * 100;
                      return (
                        <line
                          key={`lon-${x}`}
                          stroke="rgba(255,255,255,0.08)"
                          strokeDasharray={index === 6 ? "0" : "5 9"}
                          strokeWidth={index === 6 ? 1.1 : 0.7}
                          x1={x}
                          x2={x}
                          y1="0"
                          y2="600"
                        />
                      );
                    })}

                    <path
                      d={worldPath(worldFeatureCollection as never) ?? ""}
                      fill="rgba(255,255,255,0.015)"
                      filter="url(#softGlow)"
                      stroke="rgba(255,255,255,0.24)"
                      strokeWidth="1.2"
                    />

                    <g opacity="0.5">
                      <path d="M120 180 C240 140 330 140 420 180" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                      <path d="M760 220 C860 180 950 170 1060 210" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                      <path d="M230 390 C360 360 470 360 580 390" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                      <circle cx="180" cy="210" fill="rgba(255,255,255,0.015)" r="22" />
                      <circle cx="340" cy="305" fill="rgba(255,255,255,0.015)" r="14" />
                      <circle cx="920" cy="190" fill="rgba(255,255,255,0.015)" r="18" />
                      <circle cx="980" cy="400" fill="rgba(255,255,255,0.015)" r="12" />
                    </g>
                  </svg>

                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_38%)]" />
                  <div className="pointer-events-none absolute left-[8%] top-[14%] font-mono text-[8px] uppercase tracking-[0.28em] text-[#a9a9b4]">north</div>
                  <div className="pointer-events-none absolute bottom-[14%] right-[10%] font-mono text-[8px] uppercase tracking-[0.28em] text-[#a9a9b4]">east</div>
                  <div className="pointer-events-none absolute left-[12%] top-[48%] h-px w-[30%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)]" />
                  <div className="pointer-events-none absolute left-[18%] top-[24%] h-[46%] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.22),transparent)]" />
                  <div className="pointer-events-none absolute right-[18%] top-[16%] h-[60%] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.18),transparent)]" />

                  {visibleSignalPoints.map((point) => {
                    const isSelected = point.signal.id === hoveredSignalId || point.signal.id === pinnedSignalId;
                    return (
                      <button
                        aria-label={`${point.signal.city} ${point.signal.area}`}
                        className={`group absolute -translate-x-1/2 -translate-y-1/2 ${isSelected ? "z-20" : "z-10"}`}
                        key={point.signal.id}
                        onClick={() => {
                          setHoveredSignalId(point.signal.id);
                          setPinnedSignalId(point.signal.id);
                        }}
                        onMouseEnter={() => setHoveredSignalId(point.signal.id)}
                        onMouseLeave={() => {
                          if (!pinnedSignalId) setHoveredSignalId(null);
                        }}
                        style={{ left: `${(point.left / MAP_VIEW_WIDTH) * 100}%`, top: `${(point.top / MAP_VIEW_HEIGHT) * 100}%` }}
                        title={point.signal.city}
                        type="button"
                      >
                        <span className="relative block h-0.5 w-0.5 bg-[#ffffff] shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_0_4px_rgba(var(--vm-user-color-rgb),0.65)] transition duration-200 group-hover:scale-125 group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_0_6px_rgba(var(--vm-user-color-rgb),0.8)]" />
                        <span className={`absolute left-4 top-0 font-mono text-[8px] uppercase tracking-[0.18em] ${isSelected ? "text-[#f7f7fa]" : "text-[#8e8e9a] opacity-0 group-hover:opacity-100"} transition`}>
                          {point.signal.city}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(6,6,8,0.78)] px-2 py-1 text-[8px] uppercase tracking-[0.28em] text-[#8e8e9a] backdrop-blur-sm">
                  <button className="pointer-events-auto px-2 text-[#f7f7fa]" type="button" onClick={() => setZoom((value) => Math.max(MIN_ZOOM, Number((value - 0.1).toFixed(2))))}>-</button>
                  <input aria-label="Zoom" className="pointer-events-auto w-40 accent-[#f7f7fa]" max={MAX_ZOOM} min={MIN_ZOOM} onChange={(event) => setZoom(Number(event.target.value))} step={0.01} type="range" value={zoom} />
                  <button className="pointer-events-auto px-2 text-[#f7f7fa]" type="button" onClick={() => setZoom((value) => Math.min(MAX_ZOOM, Number((value + 0.1).toFixed(2))))}>+</button>
                </div>

                <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between border-t border-[rgba(255,255,255,0.08)] pt-2 font-mono text-[8px] uppercase tracking-[0.28em] text-[#8e8e9a]">
                  <span>trace layer / 01</span>
                  <span>private archive</span>
                </div>
              </div>
            </div>

            {activeSignal ? (
              <div className="absolute left-4 top-14 z-40 hidden w-[280px] lg:block">
                <SignalHoverCard
                  signal={activeSignal}
                  onClose={() => {
                    setHoveredSignalId(null);
                    setPinnedSignalId(null);
                  }}
                />
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricCard label="uploaded signals" value={personalSignals.length} />
              <MetricCard label="places" value={uniquePlaces} />
              <MetricCard label="last active" value={lastSignalAt} />
            </div>
          </section>

          <aside className="space-y-4">
            <div className="border border-[#2b2b34] bg-[#09090c] p-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.42em] text-[#8e8e9a]">personal signals</p>
              <div className="mt-4 space-y-3">
                {recentSignals.length > 0 ? recentSignals.map((signal, index) => (
                  <button
                    className="block w-full border border-[#23232a] bg-[#060608] px-3 py-2 text-left transition hover:border-[#3b3b46] hover:bg-[#0c0c10]"
                    key={signal.id}
                    onClick={() => {
                      setHoveredSignalId(signal.id);
                      setPinnedSignalId(signal.id);
                    }}
                    onMouseEnter={() => setHoveredSignalId(signal.id)}
                    onMouseLeave={() => {
                      if (!pinnedSignalId) setHoveredSignalId(null);
                    }}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f7f7fa]">
                        {String(index + 1).padStart(2, "0")}
                        <span className="mx-2 text-[#64646f]">/</span>
                        {signal.name}
                      </p>
                      <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#a9a9b4]">
                        {signal.time}
                      </p>
                    </div>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.24em] text-[#8e8e9a]">
                      {signal.city} / {signal.area}
                    </p>
                  </button>
                )) : (
                  <div className="border border-[#23232a] bg-[#060608] px-3 py-3 text-xs leading-6 text-[#8e8e9a]">
                    还没有属于 {currentUser.username} 的上传信号。
                  </div>
                )}
              </div>
            </div>

            <div className="border border-[#2b2b34] bg-[#09090c] p-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.42em] text-[#8e8e9a]">
                favorites / recent visits
              </p>
              <div className="mt-4 grid gap-3">
                {favoriteSignals.map((signal) => (
                  <button
                    className="group block w-full border border-[#23232a] bg-[#060608] px-3 py-2 text-left transition hover:-translate-y-0.5 hover:border-[#3b3b46] hover:bg-[#0c0c10]"
                    key={signal.id}
                    onClick={() => {
                      setHoveredSignalId(signal.id);
                      setPinnedSignalId(signal.id);
                    }}
                    onMouseEnter={() => setHoveredSignalId(signal.id)}
                    onMouseLeave={() => {
                      if (!pinnedSignalId) setHoveredSignalId(null);
                    }}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f7f7fa] transition group-hover:text-[#f7f7fa]">
                        {signal.name}
                      </p>
                      <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#a9a9b4]">
                        open
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.24em] text-[#8e8e9a]">
                      {signal.city} / {signal.area}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <ToggleCard label="privacy" value="private" />
              <ToggleCard label="layers" value="signals / places / archive" />
              <ToggleCard label="view" value="orthographic / locked" />
            </div>
          </aside>
        </div>

        <footer className="mt-4 border-t border-[#26262f] pt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MiniList title="favorites" value="ARCHIVE / NEON / NIGHT" />
            <MiniList title="saved places" value={`${uniquePlaces} HIDDEN STOPS`} />
            <MiniList title="scope" value="PRIVATE TRACE" />
            <MiniList title="mode" value="PIXEL GRID" />
          </div>
        </footer>
      </section>
    </main>
  );
}

function SignalHoverCard({ signal, onClose }: { signal: (typeof signals)[number] | null; onClose: () => void }) {
  if (!signal) return null;

  return (
    <div className="border border-[#2b2b34] bg-[#09090c] p-4 shadow-[0_18px_70px_rgba(0,0,0,0.62)]">
      <div className="flex items-start justify-between gap-4 border-b border-[#26262f] pb-3">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.42em] text-[#8e8e9a]">hover trace</p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-[#f7f7fa]">
            {signal.name}
          </h3>
        </div>
        <button
          className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#f7f7fa] transition hover:text-[#f7f7fa]"
          onClick={onClose}
          type="button"
        >
          close
        </button>
      </div>
      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.24em] text-[#a9a9b4]">
        {signal.city} / {signal.area}
      </p>
      <p className="mt-3 text-xs leading-6 text-[#b7bcc8]">{signal.story}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <MiniList title="time" value={signal.time} />
        <MiniList title="mood" value={signal.mood} />
      </div>
      <div className="mt-4 rounded-2xl border border-[#23232a] bg-[#060608] p-3">
        <p className="font-mono text-[8px] uppercase tracking-[0.36em] text-[#8e8e9a]">media</p>
        {signal.mediaKind === "photo" && signal.mediaUrl ? (
          <div className="mt-3 overflow-hidden border border-[#2f2f39] bg-[#101014]">
            <img alt={signal.altText ?? signal.name} className="aspect-[16/10] w-full object-cover" src={signal.mediaUrl} />
          </div>
        ) : signal.mediaKind === "video" && signal.mediaUrl ? (
          <div className="mt-3 overflow-hidden border border-[#2f2f39] bg-[#101014]">
            <video className="aspect-[16/10] w-full object-cover" controls playsInline poster={signal.posterUrl} src={signal.mediaUrl} />
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {signal.mapsUrl ? (
          <a
            className="border border-[rgba(var(--vm-user-color-rgb),0.24)] bg-[rgba(var(--vm-user-color-rgb),0.06)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-[#f7f7fa] transition hover:bg-[rgba(var(--vm-user-color-rgb),0.12)]"
            href={signal.mapsUrl}
            rel="noreferrer"
            target="_blank"
          >
            google maps
          </a>
        ) : null}
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-[#2b2b34] bg-[#09090c] px-4 py-3">
      <p className="font-mono text-[8px] uppercase tracking-[0.36em] text-[#8e8e9a]">{label}</p>
      <p className="mt-2 font-mono text-[13px] uppercase tracking-[0.16em] text-[#f7f7fa] tabular-nums">
        {value}
      </p>
    </div>
  );
}

function ToggleCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#2b2b34] bg-[#09090c] px-4 py-3">
      <p className="font-mono text-[8px] uppercase tracking-[0.36em] text-[#8e8e9a]">{label}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f7f7fa]">{value}</p>
    </div>
  );
}

function MiniList({ title, value }: { title: string; value: string }) {
  return (
    <div className="border border-[#2b2b34] bg-[#09090c] px-4 py-3">
      <p className="font-mono text-[8px] uppercase tracking-[0.36em] text-[#8e8e9a]">{title}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f7f7fa]">{value}</p>
    </div>
  );
}
