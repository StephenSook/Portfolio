"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion, useCoarsePointer, useHydrated } from "@/lib/motion";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * A central dithered energy artifact. Optimized for cost: mediump, 3-octave
 * FBM, a single domain warp, a cheap interleaved-gradient dither with color
 * quantization for the pixelated look, and it renders at reduced resolution.
 * The Canvas frameloop pauses when the hero scrolls offscreen.
 */
const fragment = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }
  // interleaved gradient noise dither (cheap, no array indexing)
  float ign(vec2 p) {
    return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    p += uMouse * 0.06;
    float t = uTime * 0.05;

    // single domain warp
    vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 + vec2(4.2, -t)));
    float f = fbm(p * 1.4 + q * 1.1);

    float r = length(p);
    float core = smoothstep(0.78, 0.0, r);       // contained central glow
    float energy = core * (0.4 + 0.7 * f);
    float veins = smoothstep(0.66, 1.0, f) * core;

    vec3 base = vec3(0.011, 0.016, 0.02);
    vec3 green = vec3(0.55, 1.0, 0.35);
    vec3 gold = vec3(0.96, 0.70, 0.24);

    vec3 col = base + green * energy * 0.3 + gold * veins * 0.42;

    float star = pow(hash(floor(p * 170.0)), 55.0);
    col += vec3(0.8, 0.95, 0.8) * star * 0.35;

    // posterized ordered-ish dither for the pixelated gradient look
    float levels = 14.0;
    float d = ign(gl_FragCoord.xy);
    col = floor(col * levels + d) / levels;

    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`;

function ShaderPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state, delta) => {
    const m = mat.current;
    if (!m) return;
    m.uniforms.uTime.value += Math.min(delta, 0.05);
    m.uniforms.uRes.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
    target.current.set(state.pointer.x, state.pointer.y);
    mouse.current.lerp(target.current, 0.05);
    m.uniforms.uMouse.value.copy(mouse.current);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function StaticFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(141,255,90,0.14),transparent_52%),radial-gradient(ellipse_at_50%_55%,rgba(245,179,60,0.07),transparent_50%),#05070a]"
    />
  );
}

export function HeroShader() {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const hydrated = useHydrated();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Pause the render loop when the hero scrolls offscreen (biggest lag win).
  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(
      (entries) => setVisible(entries[0]?.isIntersecting ?? true),
      { threshold: 0.01 }
    );
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  if (!hydrated || reduced || coarse) {
    return <StaticFallback />;
  }

  return (
    <div ref={wrap} aria-hidden className="absolute inset-0">
      <Canvas
        dpr={0.75}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "#05070a" }}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}
