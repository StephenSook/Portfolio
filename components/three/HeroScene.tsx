"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion, useCoarsePointer, useHydrated } from "@/lib/motion";

/** Deterministic PRNG so geometry is stable and render stays pure (no Math.random). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Starfield({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rng = mulberry32(1337);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rng() - 0.5) * 120;
      pos[i * 3 + 1] = (rng() - 0.5) * 120;
      pos[i * 3 + 2] = -rng() * 80 - 5;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.002;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        color="#cfeecb"
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Energy particles that orbit the ring path. */
function RingParticles({ radius, count }: { radius: number; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const rng = mulberry32(99);
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const offset = (rng() - 0.5) * 0.6;
      pos[i * 3] = Math.cos(angle) * (radius + offset);
      pos[i * 3 + 1] = (rng() - 0.5) * 0.35;
      pos[i * 3 + 2] = Math.sin(angle) * (radius + offset);
      spd[i] = 0.12 + rng() * 0.22;
    }
    return { positions: pos, speeds: spd };
  }, [radius, count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const x = arr[i * 3];
      const z = arr[i * 3 + 2];
      const angle = Math.atan2(z, x) + delta * speeds[i];
      const dist = Math.sqrt(x * x + z * z);
      arr[i * 3] = Math.cos(angle) * dist;
      arr[i * 3 + 2] = Math.sin(angle) * dist;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#8dff5a"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** A tilted Halo ring: structural torus + bright edge + gold accent, slow spin. */
function HaloRing() {
  const group = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.03;
    if (glow.current) {
      const mat = glow.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.05 + Math.sin(clock.getElapsedTime() * 0.7) * 0.03;
    }
  });

  return (
    <group ref={group} position={[3, -0.5, -14]} rotation={[0.62, 0.34, 0.12]}>
      <mesh>
        <torusGeometry args={[9, 0.18, 24, 220]} />
        <meshStandardMaterial
          color="#2c7a3f"
          emissive="#8dff5a"
          emissiveIntensity={0.35}
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[9, 0.05, 12, 220]} />
        <meshStandardMaterial
          color="#eaffe0"
          emissive="#b6ff8f"
          emissiveIntensity={1.3}
          transparent
          opacity={0.55}
        />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <torusGeometry args={[9, 0.06, 12, 220]} />
        <meshStandardMaterial
          color="#f5b33c"
          emissive="#f5b33c"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      <mesh ref={glow}>
        <torusGeometry args={[9, 0.5, 16, 220]} />
        <meshStandardMaterial
          color="#8dff5a"
          emissive="#8dff5a"
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>
      <RingParticles radius={9} count={120} />
      <pointLight position={[0, 0, 0]} color="#8dff5a" intensity={1.1} distance={16} />
    </group>
  );
}

function SceneContent({ mobile }: { mobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <Starfield count={mobile ? 700 : 1600} />
      <HaloRing />
    </>
  );
}

export function HeroScene() {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const hydrated = useHydrated();

  // Static fallback for reduced-motion and before hydration.
  if (!hydrated || reduced) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(141,255,90,0.12),transparent_60%),radial-gradient(ellipse_at_30%_70%,rgba(245,179,60,0.08),transparent_55%)]"
      />
    );
  }

  return (
    <div aria-hidden className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={coarse ? 1 : [1, 1.5]}
        gl={{ antialias: !coarse, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <SceneContent mobile={coarse} />
        </Suspense>
      </Canvas>
    </div>
  );
}
