"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HeroScene } from "@/components/three/HeroScene";
import { KineticText } from "@/components/hud/KineticText";
import { MagneticButton } from "@/components/hud/MagneticButton";
import { useReducedMotion } from "@/lib/motion";
import { profile } from "@/data/profile";

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
    <span className="font-hud text-[var(--accent)]" aria-live="polite">
      {ROLES[i]}
    </span>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh w-full items-center overflow-hidden"
    >
      <HeroScene />
      {/* Legibility vignette over the canvas. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--bg)_0%,rgba(5,7,10,0.72)_42%,transparent_78%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,var(--bg),transparent_35%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="hud-label mb-5 flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
            System online // {profile.handle}
          </p>

          <h1 className="font-display text-6xl leading-[0.9] text-[var(--text)] sm:text-7xl md:text-8xl">
            <KineticText text="STEPHEN" as="span" className="block" />
            <KineticText
              text="SOOKRA"
              as="span"
              className="block text-[var(--accent)]"
              delay={0.15}
            />
          </h1>

          <p className="mt-6 font-hud text-lg text-[var(--muted)] md:text-xl">
            <RoleRotator />
          </p>
          <p className="mt-3 max-w-md text-sm text-[var(--muted)] md:text-base">
            {profile.tagline}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <MagneticButton
              href="#work"
              className="!border-[var(--accent)] !text-[var(--accent)]"
            >
              View Missions
            </MagneticButton>
            <MagneticButton href="#resume">Dossier</MagneticButton>
          </div>
        </div>

        {/* Player card */}
        <div className="relative mx-auto hidden w-full max-w-[300px] md:block">
          <div className="hud-frame overflow-hidden rounded-sm">
            <Image
              src="/personal/player-card.png"
              alt="Stephen Sookra as a UNSC operator player-select card"
              width={600}
              height={800}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <span className="hud-label flex flex-col items-center gap-2 text-[var(--muted)]">
          Scroll
          <span className="h-8 w-px animate-pulse bg-[var(--muted)]" />
        </span>
      </div>
    </section>
  );
}
