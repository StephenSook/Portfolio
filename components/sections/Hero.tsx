"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { KineticText } from "@/components/hud/KineticText";
import { MagneticButton } from "@/components/hud/MagneticButton";
import { useReducedMotion } from "@/lib/motion";
import { profile } from "@/data/profile";

/**
 * SSR-safe static energy backdrop shown until the WebGL chunk loads. Mirrors
 * HeroShader's own StaticFallback exactly so the swap is seamless and there is
 * never a second stacked gradient layer. Defined locally (no three.js import)
 * so the heavy WebGL deps stay fully code-split from the initial route bundle.
 */
function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,rgba(141,255,90,0.12),transparent_58%),radial-gradient(ellipse_at_28%_72%,rgba(245,179,60,0.08),transparent_55%),#05070a]"
    />
  );
}

// Code-split the WebGL hero (three.js + @react-three/fiber, ~heavy) out of the
// initial route bundle. It only renders after hydration and is purely
// decorative, so it must never sit in the first-paint critical path.
const HeroShader = dynamic(
  () => import("@/components/three/HeroShader").then((m) => m.HeroShader),
  { ssr: false, loading: () => <HeroBackdrop /> }
);

const ROLES = [
  "Software Engineer",
  "AI + ML Engineer",
  "Full-Stack Builder",
  "Hackathon Finisher",
];

function RoleRotator() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2600);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <span className="font-hud text-[var(--accent)]">
      {ROLES[i]}
    </span>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-6 w-6 border-[var(--accent)]/50 ${className}`}
    />
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh w-full items-center overflow-hidden"
    >
      <HeroShader />
      {/* soft floor + edge vignette to seat the type */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,var(--bg),transparent_45%)]"
      />

      {/* operator HUD frame */}
      <Corner className="left-5 top-5 border-l-2 border-t-2" />
      <Corner className="right-5 top-5 border-r-2 border-t-2" />
      <Corner className="bottom-5 left-5 border-b-2 border-l-2" />
      <Corner className="bottom-5 right-5 border-b-2 border-r-2" />

      {/* top status bar */}
      <div className="absolute inset-x-0 top-6 z-10 mx-auto flex max-w-6xl items-center justify-between px-8 md:px-10">
        <span className="hud-label flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
          System online // {profile.handle}
        </span>
        <span className="hud-label hidden text-[var(--muted)] sm:block">
          {profile.location} · 33.75N
        </span>
      </div>

      {/* hero content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <p className="hud-label mb-5 text-[var(--muted)]">Portfolio // 2026</p>
        <h1 className="font-display text-[19vw] leading-[0.86] text-[var(--text)] sm:text-[16vw] md:text-[13rem]">
          <KineticText text="STEPHEN" as="span" className="block" />
          <KineticText
            text="SOOKRA"
            as="span"
            className="block text-[var(--accent)]"
            delay={0.12}
          />
        </h1>

        <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-hud text-lg text-[var(--muted)] md:text-xl">
              <RoleRotator />
            </p>
            <p className="mt-2 max-w-md text-sm text-[var(--muted)] md:text-base">
              {profile.tagline}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <MagneticButton
              href="#work"
              className="!border-[var(--accent)] !text-[var(--accent)]"
            >
              View Missions
            </MagneticButton>
            <MagneticButton href="#resume">Dossier</MagneticButton>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2">
        <span className="hud-label flex flex-col items-center gap-2 text-[var(--muted)]">
          Scroll
          <span className="h-8 w-px animate-pulse bg-[var(--muted)]" />
        </span>
      </div>
    </section>
  );
}
