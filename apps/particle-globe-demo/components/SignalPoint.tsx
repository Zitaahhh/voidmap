"use client";

import { type ThreeEvent } from "@react-three/fiber";
import type { Signal } from "@/data/signals";

type SignalPointProps = {
  signal: Signal;
  position: [number, number, number];
  isSelected?: boolean;
  isHovered?: boolean;
  userColor: string;
  size?: number;
  onHover?: (signalId: string | null) => void;
  onSelect?: (signalId: string) => void;
};

export function SignalPoint({
  signal,
  position,
  isSelected = false,
  isHovered = false,
  userColor,
  size = 0.026,
  onHover,
  onSelect,
}: SignalPointProps) {
  const pointSize = isSelected ? size * 1.28 : isHovered ? size * 1.12 : size;
  const isActive = isSelected || isHovered;

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHover?.(signal.id);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHover?.(null);
    document.body.style.cursor = "";
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect?.(signal.id);
  };

  return (
    <group
      name={`signal-${signal.id}`}
      onClick={handleClick}
      onPointerOut={handlePointerOut}
      onPointerOver={handlePointerOver}
      position={position}
    >
      <mesh>
        <sphereGeometry args={[pointSize, 24, 24]} />
        <meshBasicMaterial
          color={isActive ? userColor : "#8cb6ff"}
          transparent
          opacity={isActive ? 1 : 0.72}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[pointSize * 0.52, 18, 18]} />
        <meshBasicMaterial color="#fffdf4" depthWrite={false} opacity={0.82} transparent />
      </mesh>

      <pointLight
        color={isActive ? userColor : "#79a7ff"}
        distance={isActive ? 0.92 : 0.5}
        intensity={isActive ? 0.62 : 0.18}
      />
    </group>
  );
}
