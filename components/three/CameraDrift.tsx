"use client";

import { useFrame } from "@react-three/fiber";

export default function CameraDrift() {
  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.05) * 0.5;
    camera.position.y = Math.cos(t * 0.04) * 0.3;
  });

  return null;
}
