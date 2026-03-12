"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Starfield from "./Starfield";
import Ringworld from "./Ringworld";
import Astronaut from "./Astronaut";
import Nebula from "./Nebula";
import Atmosphere from "./Atmosphere";
import FloatingParticles from "./FloatingParticles";
import Spaceships from "./Spaceships";
import Satellite from "./Satellite";
import CameraDrift from "./CameraDrift";

function SceneContent({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <Atmosphere />
      <Starfield count={isMobile ? 800 : 1800} />
      <Nebula />
      <Ringworld />
      {!isMobile && <Astronaut />}
      {!isMobile && <Spaceships />}
      {!isMobile && <Satellite />}
      <FloatingParticles count={isMobile ? 30 : 60} />
      <CameraDrift />
    </>
  );
}

export default function SceneCanvas() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-[#06101e]" />;
  }

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#06101e] via-[#0a1628] to-[#060e1a]" />
    );
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#06101e" }}
      >
        <Suspense fallback={null}>
          <SceneContent isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
