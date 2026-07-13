"use client";

import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Vector3, type Group } from "three";
import { geoContains } from "d3-geo";
import { feature } from "topojson-client";
import landTopology from "world-atlas/land-50m.json";
import type { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";
import type { Signal } from "@/data/signals";
import { latLngToVector3 } from "@/lib/geo";
import { SignalPoint } from "./SignalPoint";
import { getContinentCountryFeatures, getContinentIdAtLngLat, getGeometryRings } from "./continent-geo";
import { CONTINENTS, type ContinentId } from "./continent-data";

type ParticleGlobeProps = {
  signals: Signal[];
  selectedSignalId: string | null;
  hoveredSignalId?: string | null;
  userColor: string;
  particleCount?: number;
  radius?: number;
  onSignalHover?: (signalId: string | null) => void;
  onSignalSelect?: (signalId: string) => void;
  selectedContinentId?: ContinentId | null;
  onContinentHover?: (continentId: ContinentId | null) => void;
  onContinentSelect?: (continentId: ContinentId) => void;
};

const landFeatureCollection = feature(
  landTopology as never,
  (landTopology as { objects: { land: unknown } }).objects.land as never,
) as unknown as FeatureCollection<Polygon | MultiPolygon>;

const landGeometry = landFeatureCollection.features[0].geometry;
const landGeoContainsFeature = landFeatureCollection as unknown as Feature<Polygon | MultiPolygon>;

export function ParticleGlobe({
  signals,
  selectedSignalId = null,
  hoveredSignalId = null,
  userColor,
  particleCount = 4200,
  radius = 1.72,
  onSignalHover,
  onSignalSelect,
  selectedContinentId = null,
  onContinentHover,
  onContinentSelect,
}: ParticleGlobeProps) {
  return (
    <div
      aria-label="Real Earth particle globe with mapped signal points"
      className="vm-globe-rise relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-full sm:max-w-[440px] lg:max-w-[520px]"
    >
      <div className="pointer-events-none absolute inset-[8%] rounded-full border border-[rgba(var(--vm-user-color-rgb),0.16)] shadow-[var(--vm-glow-user-strong)]" />
      <div className="pointer-events-none absolute inset-[11.5%] rounded-full border border-[rgba(255,255,255,0.05)] bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.03),rgba(255,255,255,0)_58%)]" />
      <Canvas
        camera={{ position: [0, 0, 5.1], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={() => {
          onSignalHover?.(null);
          onContinentHover?.(null);
        }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.44} />
        <RotatingEarth
          hoveredSignalId={hoveredSignalId}
          onSignalHover={onSignalHover}
          onSignalSelect={onSignalSelect}
          onContinentHover={onContinentHover}
          onContinentSelect={onContinentSelect}
          particleCount={particleCount}
          radius={radius}
          selectedContinentId={selectedContinentId}
          selectedSignalId={selectedSignalId}
          signals={signals}
          userColor={userColor}
        />
      </Canvas>
    </div>
  );
}

type RotatingEarthProps = {
  signals: Signal[];
  selectedSignalId: string | null;
  hoveredSignalId?: string | null;
  userColor: string;
  particleCount: number;
  radius: number;
  onSignalHover?: (signalId: string | null) => void;
  onSignalSelect?: (signalId: string) => void;
  selectedContinentId?: ContinentId | null;
  onContinentHover?: (continentId: ContinentId | null) => void;
  onContinentSelect?: (continentId: ContinentId) => void;
};

function RotatingEarth({
  signals,
  selectedSignalId,
  hoveredSignalId = null,
  userColor,
  particleCount,
  radius,
  onSignalHover,
  onSignalSelect,
  selectedContinentId = null,
  onContinentHover,
  onContinentSelect,
}: RotatingEarthProps) {
  const groupRef = useRef<Group>(null);
  useFrameSafe(groupRef);

  return (
    <group ref={groupRef} rotation={[0.04, 1.05, 0]}>
      <OceanShell radius={radius * 0.995} />
      <LandFillParticles count={Math.round(particleCount * 0.62)} radius={radius * 1.002} />
      <CoastlineParticles count={Math.round(particleCount * 0.96)} radius={radius * 1.009} />
      <CoastlineRimParticles count={Math.round(particleCount * 0.28)} radius={radius * 1.016} />
      <ContinentInteractionLayer
        onContinentHover={onContinentHover}
        onContinentSelect={onContinentSelect}
        radius={radius * 1.035}
        selectedContinentId={selectedContinentId}
      />
      <MappedSignalPoints
        hoveredSignalId={hoveredSignalId}
        onSignalHover={onSignalHover}
        onSignalSelect={onSignalSelect}
        radius={radius + 0.06}
        selectedSignalId={selectedSignalId}
        signals={signals}
        userColor={userColor}
      />
    </group>
  );
}

function useFrameSafe(groupRef: RefObject<Group | null>) {
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.055;
    groupRef.current.rotation.x = 0.04 + Math.sin(Date.now() * 0.00008) * 0.035;
  });
}

type OceanShellProps = {
  radius: number;
};

function OceanShell({ radius }: OceanShellProps) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshBasicMaterial color="#061322" opacity={0.16} transparent depthWrite={false} />
    </mesh>
  );
}

type ParticleLayerProps = {
  count: number;
  radius: number;
};

function CoastlineParticles({ count, radius }: ParticleLayerProps) {
  const positions = useMemo(() => createCoastlineParticlePositions(count, radius), [count, radius]);

  return (
    <Points positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#dffcff"
        size={0.013}
        sizeAttenuation
        depthWrite={false}
        opacity={0.94}
      />
    </Points>
  );
}

function CoastlineRimParticles({ count, radius }: ParticleLayerProps) {
  const positions = useMemo(() => createCoastlineParticlePositions(count, radius), [count, radius]);

  return (
    <Points positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#7db5ff"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.42}
      />
    </Points>
  );
}

function LandFillParticles({ count, radius }: ParticleLayerProps) {
  const positions = useMemo(() => createLandFillParticlePositions(count, radius), [count, radius]);

  return (
    <Points positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#5fa9d7"
        size={0.0095}
        sizeAttenuation
        depthWrite={false}
        opacity={0.42}
      />
    </Points>
  );
}

type ContinentInteractionLayerProps = {
  radius: number;
  selectedContinentId: ContinentId | null;
  onContinentHover?: (continentId: ContinentId | null) => void;
  onContinentSelect?: (continentId: ContinentId) => void;
};

function ContinentInteractionLayer({
  radius,
  selectedContinentId,
  onContinentHover,
  onContinentSelect,
}: ContinentInteractionLayerProps) {
  const [hoveredContinentId, setHoveredContinentId] = useState<ContinentId | null>(null);
  const activeId = hoveredContinentId ?? selectedContinentId;
  const activeContinent = activeId ? CONTINENTS.find((continent) => continent.id === activeId) : null;

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const continentId = pickContinentFromPointer(event, radius);
    if (continentId === hoveredContinentId) return;
    setHoveredContinentId(continentId);
    onContinentHover?.(continentId);
    document.body.style.cursor = continentId ? "pointer" : "";
  };

  const handlePointerOut = () => {
    setHoveredContinentId(null);
    onContinentHover?.(null);
    document.body.style.cursor = "";
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    const continentId = pickContinentFromPointer(event, radius);
    if (!continentId) return;
    event.stopPropagation();
    onContinentSelect?.(continentId);
  };

  return (
    <group>
      <mesh onClick={handleClick} onPointerMove={handlePointerMove} onPointerOut={handlePointerOut}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial color="#ffffff" opacity={0} transparent depthWrite={false} />
      </mesh>
      {activeContinent ? (
        <ContinentCoastlineHighlight continentId={activeContinent.id} radius={radius * 1.018} />
      ) : null}
    </group>
  );
}

type ContinentCoastlineHighlightProps = {
  continentId: ContinentId;
  radius: number;
};

function ContinentCoastlineHighlight({ continentId, radius }: ContinentCoastlineHighlightProps) {
  const [positions, setPositions] = useState<Float32Array | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setPositions(createContinentCoastlinePositions(continentId, radius));
    }, 0);

    return () => window.clearTimeout(handle);
  }, [continentId, radius]);

  if (!positions || positions.length === 0) return null;

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#f7f7fa"
        size={0.026}
        sizeAttenuation
        depthWrite={false}
        opacity={0.98}
      />
    </Points>
  );
}


type MappedSignalPointsProps = {
  signals: Signal[];
  selectedSignalId: string | null;
  hoveredSignalId?: string | null;
  userColor: string;
  radius: number;
  onSignalHover?: (signalId: string | null) => void;
  onSignalSelect?: (signalId: string) => void;
};

function MappedSignalPoints({
  signals,
  selectedSignalId,
  hoveredSignalId = null,
  userColor,
  radius,
  onSignalHover,
  onSignalSelect,
}: MappedSignalPointsProps) {
  const signalPositions = useMemo(
    () =>
      signals.map((signal) => ({
        signal,
        position: latLngToVector3(signal.lat, signal.lng, radius),
      })),
    [signals, radius],
  );

  return (
    <group>
      {signalPositions.map(({ signal, position }) => (
        <SignalPoint
          isHovered={signal.id === hoveredSignalId}
          isSelected={signal.id === selectedSignalId}
          key={signal.id}
          onHover={onSignalHover}
          onSelect={onSignalSelect}
          position={position}
          signal={signal}
          userColor={userColor}
        />
      ))}
    </group>
  );
}


type Segment = {
  start: Position;
  end: Position;
  length: number;
  continentId?: ContinentId;
};

function createContinentCoastlinePositions(continentId: ContinentId, radius: number) {
  const segments = getContinentCoastlineSegments(continentId);
  const points: number[] = [];

  for (const segment of segments) {
    const steps = Math.max(2, Math.ceil(segment.length * 1.8));

    for (let i = 0; i <= steps; i += 1) {
      const localT = i / steps;
      const lng = interpolateLongitude(segment.start[0], segment.end[0], localT);
      const lat = lerp(segment.start[1], segment.end[1], localT);
      points.push(...latLngToVector3(lat, lng, radius));
    }
  }

  return new Float32Array(points);
}

function createCoastlineParticlePositions(count: number, radius: number) {
  const segments = getCoastlineSegments();
  const totalLength = segments.reduce((sum, segment) => sum + segment.length, 0);
  const points: number[] = [];

  for (let i = 0; i < count; i += 1) {
    const distance = (i / count) * totalLength;
    const segment = pickSegment(segments, distance);
    const localT = (distance % segment.length) / segment.length;
    const jitter = (seededNoise(i) - 0.5) * 0.18;
    const lng = interpolateLongitude(segment.start[0], segment.end[0], localT);
    const lat = lerp(segment.start[1], segment.end[1], Math.min(1, Math.max(0, localT + jitter / Math.max(segment.length, 1))));

    points.push(...latLngToVector3(lat, lng, radius));
  }

  return new Float32Array(points);
}

function createLandFillParticlePositions(count: number, radius: number) {
  const landPoints: number[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const maxCandidates = count * 10;

  for (let i = 0; i < maxCandidates && landPoints.length < count * 3; i += 1) {
    const y = 1 - (i / (maxCandidates - 1)) * 2;
    const radial = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * radial;
    const z = Math.sin(theta) * radial;
    const lat = Math.asin(y) * (180 / Math.PI);
    const lng = Math.atan2(z, x) * (180 / Math.PI);

    if (!geoContains(landGeoContainsFeature, [lng, lat])) continue;

    const noise = 0.993 + seededNoise(i) * 0.014;
    landPoints.push(x * radius * noise, y * radius * noise, z * radius * noise);
  }

  return new Float32Array(landPoints);
}

function getContinentCoastlineSegments(continentId: ContinentId) {
  const segments: Segment[] = [];

  for (const country of getContinentCountryFeatures(continentId)) {
    for (const ring of getGeometryRings(country.geometry)) {
      for (let i = 0; i < ring.length - 1; i += 1) {
        const start = ring[i];
        const end = ring[i + 1];
        if (Math.abs(end[0] - start[0]) > 180) continue;
        const length = approximateLonLatDistance(start, end);
        if (length < 0.02) continue;
        segments.push({ start, end, length, continentId });
      }
    }
  }

  return segments;
}

function getCoastlineSegments() {
  const rings = getLandRings();
  const segments: Segment[] = [];

  for (const ring of rings) {
    for (let i = 0; i < ring.length - 1; i += 1) {
      const start = ring[i];
      const end = ring[i + 1];
      if (Math.abs(end[0] - start[0]) > 180) continue;
      const length = approximateLonLatDistance(start, end);
      if (length < 0.02) continue;
      segments.push({ start, end, length });
    }
  }

  return segments;
}

function getLandRings() {
  if (landGeometry.type === "Polygon") return landGeometry.coordinates;
  return landGeometry.coordinates.flat();
}

function approximateLonLatDistance(start: Position, end: Position) {
  const meanLat = ((start[1] + end[1]) / 2) * (Math.PI / 180);
  const dx = (end[0] - start[0]) * Math.cos(meanLat);
  const dy = end[1] - start[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function pickSegment(segments: Segment[], distance: number) {
  let cursor = 0;
  for (const segment of segments) {
    cursor += segment.length;
    if (cursor >= distance) return segment;
  }
  return segments[segments.length - 1];
}

function interpolateLongitude(start: number, end: number, t: number) {
  return lerp(start, end, t);
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function seededNoise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function pickContinentFromPointer(event: ThreeEvent<PointerEvent | MouseEvent>, radius: number) {
  const localPoint = event.object.worldToLocal(event.point.clone()).normalize().multiplyScalar(radius);
  const { lat, lng } = vector3ToLatLng(localPoint);
  return getContinentIdAtLngLat(lng, lat);
}

function vector3ToLatLng(point: Vector3) {
  const normalized = point.clone().normalize();
  const lat = Math.asin(normalized.y) * (180 / Math.PI);
  const lng = normalizeLongitude(Math.atan2(-normalized.z, normalized.x) * (180 / Math.PI));
  return { lat, lng };
}

function normalizeLongitude(lng: number) {
  if (lng < -180) return lng + 360;
  if (lng > 180) return lng - 360;
  return lng;
}

export type SignalPointEvent = ThreeEvent<PointerEvent>;

