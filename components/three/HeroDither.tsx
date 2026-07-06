"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion, useCoarsePointer, useHydrated } from "@/lib/motion";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

/**
 * Cortiz-style dithered image: sample a photo, ordered-dither its luminance
 * into moving pixel-art, tint it green energy on near-black, and diffuse it
 * toward the pointer. mediump + offscreen-paused for cost.
 */
const fragment = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uRes;
  uniform float uImageAspect;
  uniform float uTime;
  uniform vec2 uMouse;

  float bayer(vec2 c) {
    // interleaved gradient noise threshold (cheap ordered-ish dither)
    return fract(52.9829189 * fract(dot(floor(c), vec2(0.06711056, 0.00583715))));
  }

  void main() {
    float screenAspect = uRes.x / uRes.y;
    // cover-fit the portrait
    vec2 st = vUv - 0.5;
    if (screenAspect > uImageAspect) st.y *= uImageAspect / screenAspect;
    else st.x *= screenAspect / uImageAspect;
    st += 0.5;

    // gentle pointer diffuse + drift
    vec2 drift = uMouse * 0.012 + vec2(0.0, sin(uTime * 0.25) * 0.004);
    vec3 tex = texture2D(uTex, st + drift).rgb;
    float lum = dot(tex, vec3(0.299, 0.587, 0.114));

    // pixelated ordered dither: quantize luminance against a coarse cell
    vec2 cell = floor(gl_FragCoord.xy / 3.0);
    float threshold = bayer(cell);
    float d = step(threshold, lum);
    // soften slightly so it is pixel-art, not pure 1-bit
    float shade = mix(lum * 0.35, d, 0.7);

    vec3 base = vec3(0.012, 0.018, 0.022);
    vec3 energy = vec3(0.45, 0.95, 0.4);
    vec3 gold = vec3(0.96, 0.72, 0.28);
    vec3 col = base + energy * shade * 0.45 + gold * pow(shade, 3.0) * 0.15;

    // keep it dark so the headline stays readable
    float vig = smoothstep(1.25, 0.2, length(vUv - 0.5));
    col *= mix(0.35, 0.9, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function DitherPlane() {
  const tex = useTexture("/personal/headshot.jpg");
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  const img = tex.image as { width?: number; height?: number } | undefined;
  const imageAspect = img?.width && img?.height ? img.width / img.height : 0.75;

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uRes: { value: new THREE.Vector2(1, 1) },
      uImageAspect: { value: imageAspect },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [tex, imageAspect]
  );

  useFrame((state, delta) => {
    const m = mat.current;
    if (!m) return;
    m.uniforms.uTime.value += Math.min(delta, 0.05);
    m.uniforms.uRes.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
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
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(141,255,90,0.12),transparent_55%),#05070a]"
    />
  );
}

export function HeroDither() {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const hydrated = useHydrated();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(
      (e) => setVisible(e[0]?.isIntersecting ?? true),
      { threshold: 0.01 }
    );
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  if (!hydrated || reduced || coarse) return <StaticFallback />;

  return (
    <div ref={wrap} aria-hidden className="absolute inset-0">
      <Canvas
        dpr={0.85}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "#05070a" }}
      >
        <Suspense fallback={null}>
          <DitherPlane />
        </Suspense>
      </Canvas>
    </div>
  );
}
