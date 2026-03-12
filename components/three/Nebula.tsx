"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Nebula() {
  const cloud1Ref = useRef<THREE.Mesh>(null);
  const cloud2Ref = useRef<THREE.Mesh>(null);
  const cloud3Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (cloud1Ref.current) {
      (cloud1Ref.current.material as THREE.MeshStandardMaterial).opacity =
        0.06 + Math.sin(t * 0.12) * 0.02;
    }
    if (cloud2Ref.current) {
      (cloud2Ref.current.material as THREE.MeshStandardMaterial).opacity =
        0.05 + Math.sin(t * 0.15 + 2) * 0.015;
    }
    if (cloud3Ref.current) {
      (cloud3Ref.current.material as THREE.MeshStandardMaterial).opacity =
        0.04 + Math.sin(t * 0.1 + 4) * 0.015;
    }
  });

  return (
    <group>
      {/* Main nebula — blue/teal, large backdrop */}
      <mesh ref={cloud1Ref} position={[-5, 2, -30]}>
        <planeGeometry args={[50, 35]} />
        <meshStandardMaterial
          color="#0a4060"
          emissive="#006688"
          emissiveIntensity={0.5}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Secondary nebula — purple-blue accent */}
      <mesh ref={cloud2Ref} position={[10, -3, -25]} rotation={[0, 0, 0.3]}>
        <planeGeometry args={[35, 25]} />
        <meshStandardMaterial
          color="#1a1a50"
          emissive="#3333aa"
          emissiveIntensity={0.4}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Warm accent cloud — upper area */}
      <mesh ref={cloud3Ref} position={[-8, 5, -22]} rotation={[0.1, 0, -0.2]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial
          color="#2a1a40"
          emissive="#4422aa"
          emissiveIntensity={0.3}
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Lower atmospheric band — gives horizon feel */}
      <mesh position={[0, -6, -20]} rotation={[0.15, 0, 0]}>
        <planeGeometry args={[80, 10]} />
        <meshStandardMaterial
          color="#0a3050"
          emissive="#008899"
          emissiveIntensity={0.35}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Bright accent streak — like a distant emission nebula */}
      <mesh position={[5, 1, -35]} rotation={[0, 0, 0.5]}>
        <planeGeometry args={[25, 2]} />
        <meshStandardMaterial
          color="#00bbcc"
          emissive="#00ddff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.035}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
