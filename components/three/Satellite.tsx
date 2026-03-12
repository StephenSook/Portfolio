"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Satellite() {
  const groupRef = useRef<THREE.Group>(null);
  const panelLeftRef = useRef<THREE.Mesh>(null);
  const panelRightRef = useRef<THREE.Mesh>(null);
  const scanBeamRef = useRef<THREE.Mesh>(null);
  const antennaLightRef = useRef<THREE.Mesh>(null);
  const orbitAngle = useRef(0);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Orbit in a slow ellipse in the top-right area
    orbitAngle.current += delta * 0.12;
    const a = orbitAngle.current;
    groupRef.current.position.x = 10 + Math.cos(a) * 4;
    groupRef.current.position.y = 5 + Math.sin(a * 0.7) * 2;
    groupRef.current.position.z = -12 + Math.sin(a) * 3;

    // Slow tumble rotation
    groupRef.current.rotation.y += delta * 0.3;
    groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.15;

    // Solar panels gently flex
    if (panelLeftRef.current) {
      panelLeftRef.current.rotation.x = Math.sin(t * 0.4) * 0.05;
    }
    if (panelRightRef.current) {
      panelRightRef.current.rotation.x = Math.sin(t * 0.4 + 1) * 0.05;
    }

    // Scanning beam sweeps
    if (scanBeamRef.current) {
      scanBeamRef.current.rotation.y = t * 1.5;
      const mat = scanBeamRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.15 + Math.sin(t * 2) * 0.1;
    }

    // Antenna blinks
    if (antennaLightRef.current) {
      const mat = antennaLightRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = Math.sin(t * 4) > 0.5 ? 3 : 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[10, 5, -12]} scale={0.4}>
      {/* Central body — octagonal hull */}
      <mesh>
        <boxGeometry args={[1.2, 0.6, 0.8]} />
        <meshStandardMaterial
          color="#3a4a5a"
          metalness={0.9}
          roughness={0.2}
          emissive="#1a2a3a"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Body detail panel — top */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.8, 0.02, 0.5]} />
        <meshStandardMaterial
          color="#2a3a4a"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Body detail — front face */}
      <mesh position={[0.62, 0, 0]}>
        <boxGeometry args={[0.02, 0.4, 0.5]} />
        <meshStandardMaterial
          color="#00aacc"
          emissive="#00ccee"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* === LEFT SOLAR PANEL === */}
      <group ref={panelLeftRef} position={[-1.8, 0, 0]}>
        {/* Panel arm */}
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[0.8, 0.06, 0.06]} />
          <meshStandardMaterial color="#556677" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Panel surface */}
        <mesh>
          <boxGeometry args={[2, 0.03, 0.9]} />
          <meshStandardMaterial
            color="#1a2244"
            metalness={0.3}
            roughness={0.4}
            emissive="#0044aa"
            emissiveIntensity={0.15}
          />
        </mesh>
        {/* Panel grid lines */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[2, 0.005, 0.9]} />
          <meshStandardMaterial
            color="#334466"
            emissive="#2244aa"
            emissiveIntensity={0.2}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>

      {/* === RIGHT SOLAR PANEL === */}
      <group ref={panelRightRef} position={[1.8, 0, 0]}>
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[0.8, 0.06, 0.06]} />
          <meshStandardMaterial color="#556677" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh>
          <boxGeometry args={[2, 0.03, 0.9]} />
          <meshStandardMaterial
            color="#1a2244"
            metalness={0.3}
            roughness={0.4}
            emissive="#0044aa"
            emissiveIntensity={0.15}
          />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[2, 0.005, 0.9]} />
          <meshStandardMaterial
            color="#334466"
            emissive="#2244aa"
            emissiveIntensity={0.2}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>

      {/* === ANTENNA DISH === */}
      <group position={[0, 0.5, 0.3]} rotation={[0.3, 0, 0]}>
        {/* Antenna mast */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color="#667788" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Dish */}
        <mesh position={[0, 0.45, 0]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.3, 0.15, 12, 1, true]} />
          <meshStandardMaterial
            color="#4a5a6a"
            metalness={0.85}
            roughness={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Blinking antenna light */}
        <mesh ref={antennaLightRef} position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color="#ff3333"
            emissive="#ff0000"
            emissiveIntensity={3}
          />
        </mesh>
      </group>

      {/* === SCANNING BEAM === */}
      <mesh ref={scanBeamRef} position={[0, -0.4, 0]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[1.5, 4, 8, 1, true]} />
        <meshStandardMaterial
          color="#00ccff"
          emissive="#00ddff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Status lights on body */}
      <mesh position={[0.3, 0.15, 0.42]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.15, 0.15, 0.42]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#00ccff" emissive="#00ccff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 0.15, 0.42]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#00ccff" emissive="#00ccff" emissiveIntensity={1.5} />
      </mesh>

      {/* Satellite point light */}
      <pointLight position={[0, 0, 1]} color="#00ccff" intensity={0.6} distance={5} />
    </group>
  );
}
