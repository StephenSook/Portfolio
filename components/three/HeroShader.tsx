"use client";

import { useMemo, useRef } from "react";
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
 * Dark Halo energy field: domain-warped fractal noise, green + gold veins,
 * a slow drift, mouse parallax, and an ordered 8x8 Bayer dither (the Cortiz
 * signature) for a premium banding-free gradient. No ring, no orbiting dots.
 */
const fragment = /* glsl */ `
  precision highp float;
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
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }
  // ordered 8x8 Bayer dither
  float bayer8(vec2 c) {
    const float m[64] = float[64](
      0.,32.,8.,40.,2.,34.,10.,42., 48.,16.,56.,24.,50.,18.,58.,26.,
      12.,44.,4.,36.,14.,46.,6.,38., 60.,28.,52.,20.,62.,30.,54.,22.,
      3.,35.,11.,43.,1.,33.,9.,41., 51.,19.,59.,27.,49.,17.,57.,25.,
      15.,47.,7.,39.,13.,45.,5.,37., 63.,31.,55.,23.,61.,29.,53.,21.
    );
    int x = int(mod(c.x, 8.0));
    int y = int(mod(c.y, 8.0));
    return m[y * 8 + x] / 64.0;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    float t = uTime * 0.045;

    // parallax toward the pointer
    p += uMouse * 0.08;

    // domain warp for organic flow
    vec2 q = vec2(fbm(p * 1.6 + vec2(0.0, t)), fbm(p * 1.6 + vec2(5.2, -t)));
    vec2 r = vec2(fbm(p * 1.6 + q * 1.4 + vec2(1.7, 9.2) + t * 0.6),
                  fbm(p * 1.6 + q * 1.4 + vec2(8.3, 2.8) - t * 0.4));
    float f = fbm(p * 1.6 + r * 1.2);

    // energy veins
    float vein = smoothstep(0.55, 0.95, f + 0.15 * r.x);
    float glow = smoothstep(0.2, 0.75, f);

    vec3 base = vec3(0.02, 0.03, 0.04);
    vec3 green = vec3(0.55, 1.0, 0.35);
    vec3 gold = vec3(0.96, 0.70, 0.24);

    vec3 col = base;
    col += green * glow * 0.30;
    col += gold * pow(vein, 2.0) * 0.35;

    // faint drifting star sparkle
    float star = pow(hash(floor(p * 220.0)), 40.0);
    col += vec3(0.8, 0.95, 0.8) * star * 0.5;

    // radial vignette to seat the type
    float vig = smoothstep(1.15, 0.25, length(p));
    col *= mix(0.35, 1.0, vig);

    // Bayer dither so the dark gradient never bands
    float d = (bayer8(gl_FragCoord.xy) - 0.5) / 64.0;
    col += d * 2.0;

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

  // Mutate through the material's own uniforms (three's live object) so the
  // frame loop never touches a memoized value directly.
  useFrame((state, delta) => {
    const m = mat.current;
    if (!m) return;
    m.uniforms.uTime.value += delta;
    m.uniforms.uRes.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
    target.current.set(state.pointer.x, state.pointer.y);
    mouse.current.lerp(target.current, 0.04);
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

/** Static dark-energy gradient for reduced-motion, mobile, and pre-hydration. */
function StaticFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,rgba(141,255,90,0.12),transparent_58%),radial-gradient(ellipse_at_28%_72%,rgba(245,179,60,0.08),transparent_55%),#05070a]"
    />
  );
}

export function HeroShader() {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const hydrated = useHydrated();

  if (!hydrated || reduced || coarse) {
    return <StaticFallback />;
  }

  return (
    <div aria-hidden className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "#05070a" }}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}
