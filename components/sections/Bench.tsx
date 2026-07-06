"use client";

import { type CSSProperties } from "react";
import { HudFrame } from "@/components/hud/HudFrame";
import { KineticText } from "@/components/hud/KineticText";
import { useReducedMotion, useCoarsePointer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { fandoms } from "@/data/fandoms";

export default function Bench() {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const tilt = !reduced && !coarse;

  return (
    <section
      id="bench"
      className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32"
      style={{ ["--accent"]: "#f5b33c" } as CSSProperties}
    >
      <span className="hud-label">OFF THE CLOCK // THE BENCH</span>

      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <KineticText
          as="h2"
          text="The Bench"
          onScroll
          className="font-display text-5xl text-[var(--text)] md:text-7xl"
        />
        <p className="font-hud text-xs tracking-[0.28em] text-[var(--muted)] uppercase">
          {String(fandoms.length).padStart(2, "0")} on the roster
        </p>
      </div>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
        The lineup outside the editor. The teams, worlds, and stories that set
        the tone while I build.
      </p>

      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 md:gap-5 lg:grid-cols-3">
        {fandoms.map((f, i) => {
          const num = String(i + 1).padStart(2, "0");
          const tiltClass = tilt
            ? cn(
                "will-change-transform",
                i % 2 === 0
                  ? "hover:[transform:perspective(900px)_rotateX(6deg)_rotateY(-7deg)_translateY(-6px)]"
                  : "hover:[transform:perspective(900px)_rotateX(6deg)_rotateY(7deg)_translateY(-6px)]"
              )
            : "";

          return (
            <HudFrame
              key={f.name}
              as="article"
              accent={f.accent}
              className={cn(
                "group relative min-h-[196px] rounded-sm transition-[transform,box-shadow] duration-300 ease-out",
                "hover:shadow-[0_16px_44px_-18px_var(--accent)]",
                tiltClass
              )}
            >
              {/* Accent wash on hover, clipped to the card bounds. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(120% 82% at 50% 0%, color-mix(in srgb, var(--accent) 15%, transparent), transparent 72%)",
                }}
              />

              <div className="relative flex h-full min-h-[196px] flex-col p-5 md:p-6">
                <div className="flex items-start justify-between">
                  <span className="font-hud text-xs tracking-[0.34em] text-[var(--accent)]">
                    {num}
                  </span>
                  <span
                    aria-hidden
                    className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]"
                  />
                </div>

                <div className="mt-auto pt-8">
                  <span
                    aria-hidden
                    className="mb-3 block h-0.5 w-8 bg-[var(--accent)]"
                  />
                  <h3 className="font-display text-2xl leading-none text-[var(--text)] md:text-3xl">
                    {f.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    {f.note}
                  </p>
                </div>
              </div>
            </HudFrame>
          );
        })}
      </ul>
    </section>
  );
}
