"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import * as THREE from "three";
import { useHydrated } from "@/lib/motion";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

/**
 * Living smoke: domain-warped fbm drifting slowly, tinted by two theme
 * colors, with bright "shine" glints on the densest crests and a gentle
 * pointer-following drift. Runs at half-ish resolution, 4 octaves, mediump,
 * ~30fps on demand, and pauses entirely offscreen.
 */
const fragment = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec3 uTintA;
  uniform vec3 uTintB;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.55;
    }
    return v;
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = vec2(vUv.x * aspect, vUv.y) * 2.1;

    // slow wind + pointer drift, then warp the field through itself
    vec2 drift = vec2(uTime * 0.035, uTime * 0.012) + uMouse * 0.09;
    float q = fbm(p + drift);
    float f = fbm(p + q * 1.7 + vec2(uTime * 0.022, -uTime * 0.016));

    float smoke = smoothstep(0.24, 0.9, f);
    // glints ride the densest crests: the "shine"
    float shine = pow(smoothstep(0.55, 0.9, f), 3.0);
    float sparkle = pow(smoothstep(0.68, 0.92, q * f), 4.0);

    vec3 base = vec3(0.015, 0.024, 0.034);
    vec3 col = base
      + uTintA * smoke * 0.55
      + uTintB * shine * 0.6
      + vec3(1.0, 0.96, 0.88) * sparkle * 0.5;

    // thin out toward the very top and bottom so the vignettes take over
    col *= mix(0.55, 1.0, smoothstep(0.0, 0.22, vUv.y));
    col *= mix(1.0, 0.6, smoothstep(0.72, 1.0, vUv.y));

    gl_FragColor = vec4(col, 1.0);
  }
`;

function themeTints(): { a: THREE.Color; b: THREE.Color } {
  const cs = getComputedStyle(document.documentElement);
  const legendary =
    document.documentElement.getAttribute("data-theme") === "legendary";
  const hud = cs.getPropertyValue("--hud").trim() || "#4cc2ff";
  const gold = cs.getPropertyValue("--forerunner").trim() || "#f5b33c";
  const energy = cs.getPropertyValue("--energy").trim() || "#8dff5a";
  // default: cool teal body with gold shine; legendary: hot energy body
  return {
    a: new THREE.Color(legendary ? energy : hud).multiplyScalar(0.9),
    b: new THREE.Color(gold),
  };
}

function SmokePlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTintA: { value: new THREE.Color("#4cc2ff") },
      uTintB: { value: new THREE.Color("#f5b33c") },
    };
  }, []);

  // theme-reactive tints
  useEffect(() => {
    const apply = () => {
      const { a, b } = themeTints();
      uniforms.uTintA.value.copy(a);
      uniforms.uTintB.value.copy(b);
    };
    apply();
    const mo = new MutationObserver(apply);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, [uniforms]);

  useFrame((state, delta) => {
    const m = mat.current;
    if (!m) return;
    m.uniforms.uTime.value += Math.min(delta, 0.05);
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

export function SmokeShader() {
  const hydrated = useHydrated();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // ~30fps demand loop, only while on screen and the tab is visible
  useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(() => {
      if (!document.hidden) invalidate();
    }, 33);
    return () => window.clearInterval(id);
  }, [visible]);

  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(
      (e) => setVisible(e[0]?.isIntersecting ?? true),
      { threshold: 0.01 }
    );
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  if (!hydrated) return null;

  return (
    <div ref={wrap} aria-hidden className="absolute inset-0">
      <Canvas
        dpr={0.7}
        frameloop="demand"
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "#05070a" }}
      >
        <SmokePlane />
      </Canvas>
    </div>
  );
}
