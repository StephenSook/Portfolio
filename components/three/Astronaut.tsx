"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Astronaut() {
  const groupRef = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);
  const chestLightRef = useRef<THREE.Mesh>(null);
  const driftAngle = useRef(0);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Slow drift in an area on the left side
    driftAngle.current += delta * 0.08;
    const a = driftAngle.current;
    groupRef.current.position.x = -10 + Math.sin(a) * 1.5;
    groupRef.current.position.y = 3 + Math.cos(a * 0.6) * 1;
    groupRef.current.position.z = -10 + Math.sin(a * 0.4) * 1;

    // Gentle tumble — weightless feel
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.2;
    groupRef.current.rotation.y += delta * 0.08;
    groupRef.current.rotation.z = Math.cos(t * 0.12) * 0.15;

    // Visor glow pulse
    if (visorRef.current) {
      const mat = visorRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(t * 1.5) * 0.3;
    }

    // Chest light blink
    if (chestLightRef.current) {
      const mat = chestLightRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = Math.sin(t * 3) > 0.3 ? 3 : 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[-10, 3, -10]} scale={0.45}>
      {/* === HELMET === */}
      <group position={[0, 1.3, 0]}>
        {/* Helmet shell */}
        <mesh>
          <sphereGeometry args={[0.55, 20, 20]} />
          <meshStandardMaterial
            color="#e8e8e8"
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
        {/* Visor — gold/cyan reflective */}
        <mesh ref={visorRef} position={[0, 0, 0.35]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.42, 16, 16, 0, Math.PI, 0, Math.PI / 1.6]} />
          <meshStandardMaterial
            color="#004466"
            emissive="#00aacc"
            emissiveIntensity={0.8}
            metalness={0.95}
            roughness={0.05}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Visor rim */}
        <mesh position={[0, 0, 0.3]}>
          <torusGeometry args={[0.42, 0.03, 8, 24]} />
          <meshStandardMaterial color="#999" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Helmet light — top */}
        <mesh position={[0, 0.5, 0.15]}>
          <boxGeometry args={[0.15, 0.04, 0.08]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* === TORSO === */}
      <group position={[0, 0.3, 0]}>
        {/* Main body */}
        <mesh>
          <boxGeometry args={[1.0, 1.2, 0.65]} />
          <meshStandardMaterial
            color="#e0e0e0"
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>
        {/* Chest panel */}
        <mesh position={[0, 0.15, 0.34]}>
          <boxGeometry args={[0.5, 0.4, 0.02]} />
          <meshStandardMaterial
            color="#3a3a3a"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Chest status light */}
        <mesh ref={chestLightRef} position={[0.12, 0.3, 0.36]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff66"
            emissiveIntensity={3}
          />
        </mesh>
        {/* Second chest light */}
        <mesh position={[-0.12, 0.3, 0.36]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial
            color="#00ccff"
            emissive="#00ccff"
            emissiveIntensity={2}
          />
        </mesh>
        {/* Backpack / life support */}
        <mesh position={[0, 0.1, -0.45]}>
          <boxGeometry args={[0.7, 0.9, 0.35]} />
          <meshStandardMaterial
            color="#cccccc"
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
        {/* Backpack thrusters */}
        <mesh position={[0.2, -0.2, -0.65]}>
          <cylinderGeometry args={[0.06, 0.08, 0.12, 8]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.2, -0.2, -0.65]}>
          <cylinderGeometry args={[0.06, 0.08, 0.12, 8]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* === LEFT ARM === */}
      <group position={[-0.7, 0.5, 0]} rotation={[0.3, 0, 0.4]}>
        {/* Upper arm */}
        <mesh>
          <boxGeometry args={[0.3, 0.6, 0.3]} />
          <meshStandardMaterial color="#d8d8d8" metalness={0.2} roughness={0.6} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.55, 0.1]} rotation={[0.5, 0, 0]}>
          <boxGeometry args={[0.28, 0.5, 0.28]} />
          <meshStandardMaterial color="#d0d0d0" metalness={0.2} roughness={0.6} />
        </mesh>
        {/* Glove */}
        <mesh position={[0, -0.85, 0.3]} rotation={[0.8, 0, 0]}>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.3} roughness={0.5} />
        </mesh>
      </group>

      {/* === RIGHT ARM === */}
      <group position={[0.7, 0.5, 0]} rotation={[-0.2, 0, -0.5]}>
        <mesh>
          <boxGeometry args={[0.3, 0.6, 0.3]} />
          <meshStandardMaterial color="#d8d8d8" metalness={0.2} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.55, -0.05]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.28, 0.5, 0.28]} />
          <meshStandardMaterial color="#d0d0d0" metalness={0.2} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.85, -0.15]} rotation={[-0.5, 0, 0]}>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.3} roughness={0.5} />
        </mesh>
      </group>

      {/* === LEFT LEG === */}
      <group position={[-0.25, -0.7, 0]} rotation={[0.15, 0, 0.1]}>
        <mesh>
          <boxGeometry args={[0.32, 0.7, 0.32]} />
          <meshStandardMaterial color="#d5d5d5" metalness={0.2} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.55, 0.05]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.3, 0.55, 0.3]} />
          <meshStandardMaterial color="#cccccc" metalness={0.2} roughness={0.6} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.9, 0.1]}>
          <boxGeometry args={[0.32, 0.2, 0.4]} />
          <meshStandardMaterial color="#999999" metalness={0.3} roughness={0.5} />
        </mesh>
      </group>

      {/* === RIGHT LEG === */}
      <group position={[0.25, -0.7, 0]} rotation={[-0.1, 0, -0.1]}>
        <mesh>
          <boxGeometry args={[0.32, 0.7, 0.32]} />
          <meshStandardMaterial color="#d5d5d5" metalness={0.2} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.55, -0.03]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.3, 0.55, 0.3]} />
          <meshStandardMaterial color="#cccccc" metalness={0.2} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.9, -0.05]}>
          <boxGeometry args={[0.32, 0.2, 0.4]} />
          <meshStandardMaterial color="#999999" metalness={0.3} roughness={0.5} />
        </mesh>
      </group>

      {/* Astronaut point light — visor glow */}
      <pointLight position={[0, 1.3, 0.8]} color="#00ccff" intensity={0.5} distance={4} />
    </group>
  );
}
