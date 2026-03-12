"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Atmosphere() {
  const keyLightRef = useRef<THREE.PointLight>(null);
  const accentRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (keyLightRef.current) {
      keyLightRef.current.intensity = 2.5 + Math.sin(t * 0.2) * 0.5;
    }
    if (accentRef.current) {
      accentRef.current.intensity = 1.2 + Math.sin(t * 0.3 + 1) * 0.3;
    }
  });

  return (
    <>
      {/* Brighter ambient — not pitch black */}
      <ambientLight intensity={0.15} color="#1a2a44" />

      {/* Strong cyan key light from ring direction */}
      <pointLight
        ref={keyLightRef}
        position={[6, 3, -12]}
        color="#00d4ff"
        intensity={2.5}
        distance={80}
      />

      {/* Purple-blue accent light — adds color variety */}
      <pointLight
        ref={accentRef}
        position={[-10, 5, -15]}
        color="#4444cc"
        intensity={1.2}
        distance={60}
      />

      {/* Warm rim light from below */}
      <pointLight
        position={[-5, -8, -8]}
        color="#224466"
        intensity={0.8}
        distance={50}
      />

      {/* Upper fill — prevents top from being dead black */}
      <pointLight
        position={[0, 15, -10]}
        color="#1a3050"
        intensity={0.6}
        distance={45}
      />

      {/* Directional light for ship highlights */}
      <directionalLight
        position={[10, 5, 5]}
        color="#88bbdd"
        intensity={0.3}
      />

      {/* Fog — slightly less aggressive, more blue */}
      <fog attach="fog" args={["#06101e", 18, 60]} />
    </>
  );
}
