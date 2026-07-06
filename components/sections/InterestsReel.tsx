"use client";

import type { CSSProperties } from "react";
import { fandoms } from "@/data/fandoms";
import { KineticText } from "@/components/hud/KineticText";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

function Row({
  reverse,
  duration,
  animate,
}: {
  reverse?: boolean;
  duration: number;
  animate: boolean;
}) {
  // Duplicate the list so the marquee loops seamlessly.
  const items = [...fandoms, ...fandoms];
  return (
    <div className="flex overflow-hidden py-3" aria-hidden={animate}>
      <ul
        className={cn(
          "flex shrink-0 items-center gap-10 pr-10",
          animate && (reverse ? "animate-[marquee-r_var(--d)_linear_infinite]" : "animate-[marquee-l_var(--d)_linear_infinite]"),
          !animate && "flex-wrap"
        )}
        style={{ ["--d"]: `${duration}s` } as CSSProperties}
      >
        {items.map((f, i) => (
          <li key={`${f.name}-${i}`} className="group flex items-center gap-10">
            <span
              className="font-display text-4xl leading-none transition-opacity md:text-6xl"
              style={{ color: f.accent }}
            >
              {f.name}
            </span>
            <span aria-hidden className="text-2xl text-[var(--muted)]/40">
              /
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function InterestsReel() {
  const reduced = useReducedMotion();
  const animate = !reduced;

  return (
    <section
      id="bench"
      className="relative w-full overflow-hidden py-24 md:py-32"
      style={{ ["--accent"]: "#f5b33c" } as CSSProperties}
    >
      <div className="mx-auto mb-10 max-w-6xl px-6">
        <span className="hud-label">OFF THE CLOCK // THE LINEUP</span>
        <KineticText
          as="h2"
          text="What I run on"
          onScroll
          className="mt-3 font-display text-5xl text-[var(--text)] md:text-7xl"
        />
        <p className="mt-4 max-w-md text-sm text-[var(--muted)] md:text-base">
          The worlds, teams, and games that set the tone while I build.
        </p>
      </div>

      {/* dual marquee */}
      <div className="flex flex-col gap-1 border-y border-[var(--line)] py-4">
        <Row duration={38} animate={animate} />
        <Row duration={46} reverse animate={animate} />
      </div>

      {/* edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent md:w-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent md:w-40"
      />
    </section>
  );
}
