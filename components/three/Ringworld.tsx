"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Animated energy particles that flow along the ring path */
function RingParticles({ radius, count = 200 }: { radius: number; count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const offset = (Math.random() - 0.5) * 0.6;
      pos[i * 3] = Math.cos(angle) * (radius + offset);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 2] = Math.sin(angle) * (radius + offset);
      spd[i] = 0.15 + Math.random() * 0.25;
    }
    return { positions: pos, speeds: spd };
  }, [radius, count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const x = posArr[i * 3];
      const z = posArr[i * 3 + 2];
      const angle = Math.atan2(z, x) + delta * speeds[i];
      const dist = Math.sqrt(x * x + z * z);
      posArr[i * 3] = Math.cos(angle) * dist;
      posArr[i * 3 + 2] = Math.sin(angle) * dist;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#00eeff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* Pulsing glow segments along the ring */
function RingGlowSegment({
  radius,
  angle,
  speed,
}: {
  radius: number;
  angle: number;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const currentAngle = angle + t * speed;
    ref.current.position.x = Math.cos(currentAngle) * radius;
    ref.current.position.z = Math.sin(currentAngle) * radius;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.3 + Math.sin(t * 3 + angle) * 0.2;
    mat.emissiveIntensity = 1.5 + Math.sin(t * 4 + angle * 2) * 0.8;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial
        color="#00eeff"
        emissive="#00ddff"
        emissiveIntensity={2}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

interface RingProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  ringRadius?: number;
  spinSpeed?: number;
}

function AnimatedRing({
  position = [2, -1.5, -18],
  rotation = [0.6, 0.3, 0.1],
  ringRadius = 10,
  spinSpeed = 0.008,
}: RingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mainRingRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * spinSpeed;
    }
    if (mainRingRef.current) {
      const mat = mainRingRef.current.material as THREE.MeshStandardMaterial;
      const t = clock.getElapsedTime();
      mat.emissiveIntensity = 0.25 + Math.sin(t * 0.5) * 0.1;
    }
    if (innerGlowRef.current) {
      const mat = innerGlowRef.current.material as THREE.MeshStandardMaterial;
      const t = clock.getElapsedTime();
      mat.opacity = 0.06 + Math.sin(t * 0.8) * 0.03;
    }
  });

  const glowSegments = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        angle: (i / 8) * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.15,
      })),
    []
  );

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Main structural ring */}
      <mesh ref={mainRingRef}>
        <torusGeometry args={[ringRadius, 0.2, 24, 200]} />
        <meshStandardMaterial
          color="#3a8aaa"
          emissive="#00d4ff"
          emissiveIntensity={0.25}
          transparent
          opacity={0.75}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Inner energy glow — pulses */}
      <mesh ref={innerGlowRef}>
        <torusGeometry args={[ringRadius, 0.5, 24, 200]} />
        <meshStandardMaterial
          color="#00f0ff"
          transparent
          opacity={0.06}
          emissive="#00f0ff"
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Bright edge highlight */}
      <mesh>
        <torusGeometry args={[ringRadius, 0.06, 12, 200]} />
        <meshStandardMaterial
          color="#ccf0ff"
          emissive="#00eeff"
          emissiveIntensity={1.2}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Second structural ring — offset */}
      <mesh position={[0, 0.3, 0]}>
        <torusGeometry args={[ringRadius, 0.08, 12, 200]} />
        <meshStandardMaterial
          color="#88ccdd"
          emissive="#00aacc"
          emissiveIntensity={0.4}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Animated energy particles */}
      <RingParticles radius={ringRadius} count={120} />

      {/* Orbiting glow nodes */}
      {glowSegments.map((seg, i) => (
        <RingGlowSegment key={i} radius={ringRadius} angle={seg.angle} speed={seg.speed} />
      ))}

      {/* Ring light */}
      <pointLight position={[0, 0, 0]} color="#00d4ff" intensity={1} distance={15} />
    </group>
  );
}

export default function Ringworld() {
  return (
    <>
      {/* Main ring — right/center */}
      <AnimatedRing
        position={[4, -1, -18]}
        rotation={[0.6, 0.3, 0.1]}
        ringRadius={10}
        spinSpeed={0.008}
      />
      {/* Second ring — left side, different angle and size */}
      <AnimatedRing
        position={[-8, 2, -24]}
        rotation={[0.8, -0.4, -0.2]}
        ringRadius={8}
        spinSpeed={-0.006}
      />
    </>
  );
}
