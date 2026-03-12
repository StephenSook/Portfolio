"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Ship({
  startPos,
  speed,
  size,
  delay,
  direction,
}: {
  startPos: [number, number, number];
  speed: number;
  size: number;
  delay: number;
  direction?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const trail1Ref = useRef<THREE.Mesh>(null);
  const trail2Ref = useRef<THREE.Mesh>(null);
  const elapsed = useRef(-delay);
  const dir = direction ?? -1; // -1 = right to left, 1 = left to right

  useFrame((_, delta) => {
    elapsed.current += delta;
    if (elapsed.current < 0 || !groupRef.current) return;

    groupRef.current.position.x += dir * speed * delta;
    groupRef.current.position.z += speed * delta * 0.1;

    // Slight vertical bob
    groupRef.current.position.y =
      startPos[1] + Math.sin(elapsed.current * 0.6) * 0.2;

    // Reset when off screen
    if (dir < 0 && groupRef.current.position.x < -40) {
      groupRef.current.position.set(...startPos);
      elapsed.current = 0;
    }
    if (dir > 0 && groupRef.current.position.x > 40) {
      groupRef.current.position.set(...startPos);
      elapsed.current = 0;
    }

    // Engine trail pulse
    const pulse = 1.8 + Math.sin(elapsed.current * 10) * 0.6;
    if (trail1Ref.current) {
      (trail1Ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
    if (trail2Ref.current) {
      (trail2Ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
  });

  const s = size;
  const flipY = dir > 0 ? Math.PI : 0;

  return (
    <group ref={groupRef} position={startPos} rotation={[0, -0.3 + flipY, 0.05 * dir]}>
      {/* Main hull — angular frigate shape */}
      <mesh>
        <boxGeometry args={[s * 3, s * 0.25, s * 0.8]} />
        <meshStandardMaterial
          color="#2a3a50"
          metalness={0.9}
          roughness={0.25}
          emissive="#1a2a3a"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Bridge / command structure */}
      <mesh position={[s * 0.4, s * 0.2, 0]}>
        <boxGeometry args={[s * 1, s * 0.2, s * 0.4]} />
        <meshStandardMaterial
          color="#344a60"
          metalness={0.8}
          roughness={0.3}
          emissive="#1a3050"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Nose / prow — pointed */}
      <mesh position={[s * 1.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[s * 0.3, s * 0.8, 4]} />
        <meshStandardMaterial
          color="#3a4a5a"
          metalness={0.9}
          roughness={0.2}
          emissive="#2a3a4a"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Wing / fin — top */}
      <mesh position={[-s * 0.2, s * 0.25, 0]}>
        <boxGeometry args={[s * 1.2, s * 0.04, s * 0.15]} />
        <meshStandardMaterial
          color="#2a3a50"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Left engine nacelle */}
      <mesh position={[-s * 0.9, -s * 0.05, s * 0.45]}>
        <boxGeometry args={[s * 1, s * 0.15, s * 0.18]} />
        <meshStandardMaterial
          color="#2a3a50"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Right engine nacelle */}
      <mesh position={[-s * 0.9, -s * 0.05, -s * 0.45]}>
        <boxGeometry args={[s * 1, s * 0.15, s * 0.18]} />
        <meshStandardMaterial
          color="#2a3a50"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Engine glow — left */}
      <mesh ref={trail1Ref} position={[-s * 1.5, 0, s * 0.45]}>
        <sphereGeometry args={[s * 0.12, 8, 8]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={2}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Engine glow — right */}
      <mesh ref={trail2Ref} position={[-s * 1.5, 0, -s * 0.45]}>
        <sphereGeometry args={[s * 0.12, 8, 8]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={2}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Engine exhaust trail — left */}
      <mesh position={[-s * 2.2, 0, s * 0.45]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[s * 0.07, s * 1.6, 6]} />
        <meshStandardMaterial
          color="#00aaff"
          emissive="#00ccff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Engine exhaust trail — right */}
      <mesh position={[-s * 2.2, 0, -s * 0.45]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[s * 0.07, s * 1.6, 6]} />
        <meshStandardMaterial
          color="#00aaff"
          emissive="#00ccff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Center engine glow */}
      <mesh position={[-s * 1.5, 0, 0]}>
        <sphereGeometry args={[s * 0.08, 8, 8]} />
        <meshStandardMaterial
          color="#00eeff"
          emissive="#00eeff"
          emissiveIntensity={2.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Hull running lights */}
      <pointLight
        position={[0, s * 0.3, 0]}
        color="#00d4ff"
        intensity={0.8}
        distance={s * 6}
      />
    </group>
  );
}

export default function Spaceships() {
  const ships = useMemo(
    () => [
      // === RIGHT TO LEFT ===
      { startPos: [32, 1, -16] as [number, number, number], speed: 1.6, size: 1.05, delay: 0, direction: -1 },
      { startPos: [28, -1.5, -7] as [number, number, number], speed: 5, size: 0.3, delay: 5, direction: -1 },
      { startPos: [45, 2.5, -35] as [number, number, number], speed: 0.5, size: 1.5, delay: 2, direction: -1 },
      // === LEFT TO RIGHT ===
      { startPos: [-32, 0.5, -14] as [number, number, number], speed: 2.0, size: 0.8, delay: 0, direction: 1 },
      { startPos: [-38, 2.5, -22] as [number, number, number], speed: 1.5, size: 0.65, delay: 4, direction: 1 },
      { startPos: [-42, 1, -30] as [number, number, number], speed: 0.7, size: 1.2, delay: 7, direction: 1 },
    ],
    []
  );

  return (
    <group>
      {ships.map((ship, i) => (
        <Ship key={i} {...ship} />
      ))}
    </group>
  );
}
