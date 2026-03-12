"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Procedural planet surface — deserts, oceans, ice caps, terrain variation */
function usePlanetTexture() {
  return useMemo(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Deep ocean base
    ctx.fillStyle = "#081830";
    ctx.fillRect(0, 0, size, size);

    // Seeded pseudo-random for consistent look
    const rand = (seed: number) => {
      const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    // Generate terrain blobs — continents
    for (let c = 0; c < 18; c++) {
      const cx = rand(c * 13.1) * size;
      const cy = rand(c * 7.3 + 5) * size * 0.7 + size * 0.15;
      const baseR = rand(c * 3.7 + 2) * 80 + 30;

      // Terrain type varies by latitude
      const latRatio = cy / size;
      let color: string;
      if (latRatio < 0.2 || latRatio > 0.8) {
        // Polar — tundra/ice
        color = `rgb(${140 + Math.floor(rand(c + 100) * 60)}, ${160 + Math.floor(rand(c + 200) * 50)}, ${180 + Math.floor(rand(c + 300) * 40)})`;
      } else if (latRatio > 0.35 && latRatio < 0.65) {
        // Equatorial — desert/arid
        const r = 80 + Math.floor(rand(c + 50) * 60);
        const g = 60 + Math.floor(rand(c + 60) * 40);
        const b = 30 + Math.floor(rand(c + 70) * 25);
        color = `rgb(${r}, ${g}, ${b})`;
      } else {
        // Temperate — forests/green
        const r = 20 + Math.floor(rand(c + 80) * 40);
        const g = 50 + Math.floor(rand(c + 90) * 50);
        const b = 25 + Math.floor(rand(c + 110) * 30);
        color = `rgb(${r}, ${g}, ${b})`;
      }

      // Draw organic continent shape
      ctx.fillStyle = color;
      ctx.beginPath();
      const points = 20 + Math.floor(rand(c * 5) * 15);
      for (let p = 0; p < points; p++) {
        const angle = (p / points) * Math.PI * 2;
        const noise = baseR * (0.5 + rand(c * 100 + p * 17) * 1.0);
        const x = cx + Math.cos(angle) * noise;
        const y = cy + Math.sin(angle) * noise * 0.7;
        if (p === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // Mountain/detail noise within continent
      for (let d = 0; d < 8; d++) {
        const dx = cx + (rand(c * 200 + d * 31) - 0.5) * baseR * 1.5;
        const dy = cy + (rand(c * 300 + d * 47) - 0.5) * baseR;
        const dr = rand(c * 400 + d * 13) * 20 + 5;
        const bright = Math.floor(rand(c * 500 + d) * 30) - 15;
        ctx.fillStyle = `rgba(${128 + bright}, ${100 + bright}, ${60 + bright}, 0.3)`;
        ctx.beginPath();
        ctx.arc(dx, dy, dr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Ice caps — north
    const northGrad = ctx.createLinearGradient(0, 0, 0, size * 0.12);
    northGrad.addColorStop(0, "rgba(220, 235, 250, 0.85)");
    northGrad.addColorStop(0.5, "rgba(200, 220, 240, 0.5)");
    northGrad.addColorStop(1, "transparent");
    ctx.fillStyle = northGrad;
    ctx.fillRect(0, 0, size, size * 0.12);

    // Ice caps — south
    const southGrad = ctx.createLinearGradient(0, size * 0.88, 0, size);
    southGrad.addColorStop(0, "transparent");
    southGrad.addColorStop(0.5, "rgba(200, 220, 240, 0.5)");
    southGrad.addColorStop(1, "rgba(220, 235, 250, 0.85)");
    ctx.fillStyle = southGrad;
    ctx.fillRect(0, size * 0.88, size, size * 0.12);

    // Ocean depth variation
    for (let i = 0; i < 30; i++) {
      const ox = rand(i * 77) * size;
      const oy = rand(i * 33 + 5) * size;
      const or = rand(i * 11 + 2) * 60 + 20;
      ctx.fillStyle = `rgba(10, 30, 60, ${rand(i * 55) * 0.15})`;
      ctx.beginPath();
      ctx.arc(ox, oy, or, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = 4;
    return texture;
  }, []);
}

/* Procedural cloud texture */
function useCloudTexture() {
  return useMemo(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Transparent base
    ctx.clearRect(0, 0, size, size);

    // Cloud bands and wisps
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const w = Math.random() * 120 + 30;
      const h = Math.random() * 12 + 3;
      const opacity = Math.random() * 0.2 + 0.03;
      ctx.fillStyle = `rgba(230, 240, 255, ${opacity})`;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, Math.random() * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Storm systems — larger cloud clusters
    for (let s = 0; s < 5; s++) {
      const sx = Math.random() * size;
      const sy = Math.random() * size * 0.6 + size * 0.2;
      for (let j = 0; j < 15; j++) {
        const jx = sx + (Math.random() - 0.5) * 80;
        const jy = sy + (Math.random() - 0.5) * 40;
        const jr = Math.random() * 30 + 10;
        ctx.fillStyle = `rgba(240, 245, 255, ${Math.random() * 0.12 + 0.03})`;
        ctx.beginPath();
        ctx.arc(jx, jy, jr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);
}

export default function Planet() {
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const rimRef = useRef<THREE.Mesh>(null);

  const planetTexture = usePlanetTexture();
  const cloudTexture = useCloudTexture();

  useFrame(({ clock }, delta) => {
    // Planet spins
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.04;
    }
    // Clouds spin faster in a different axis
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.055;
      cloudsRef.current.rotation.x += delta * 0.003;
    }
    // Atmospheric rim pulses
    if (rimRef.current) {
      const t = clock.getElapsedTime();
      const mat = rimRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.15 + Math.sin(t * 0.6) * 0.04;
    }
  });

  return (
    <group position={[-18, 10, -38]}>
      {/* Planet body — textured surface */}
      <mesh ref={planetRef} rotation={[0.25, 0, 0.12]}>
        <sphereGeometry args={[5.5, 64, 64]} />
        <meshStandardMaterial
          map={planetTexture}
          metalness={0.05}
          roughness={0.85}
          emissive="#0a1a2a"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef} scale={1.015} rotation={[0.2, 0.8, 0.05]}>
        <sphereGeometry args={[5.5, 48, 48]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.65}
          depthWrite={false}
          emissive="#aabbcc"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Atmospheric rim — bright blue edge visible against dark space */}
      <mesh ref={rimRef} scale={1.06}>
        <sphereGeometry args={[5.5, 48, 48]} />
        <meshStandardMaterial
          color="#00aaee"
          emissive="#00ccff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Second atmosphere layer — wider, softer */}
      <mesh scale={1.14}>
        <sphereGeometry args={[5.5, 32, 32]} />
        <meshStandardMaterial
          color="#0077aa"
          emissive="#0099cc"
          emissiveIntensity={0.3}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outermost glow halo */}
      <mesh scale={1.25}>
        <sphereGeometry args={[5.5, 24, 24]} />
        <meshStandardMaterial
          color="#005588"
          emissive="#0088bb"
          emissiveIntensity={0.2}
          transparent
          opacity={0.025}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Day-side illumination light */}
      <pointLight
        position={[-10, 4, 12]}
        color="#aaccee"
        intensity={2}
        distance={25}
      />
    </group>
  );
}
