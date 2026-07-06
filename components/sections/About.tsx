"use client";

import React from "react";
import Image from "next/image";
import { HudFrame } from "@/components/hud/HudFrame";
import { KineticText } from "@/components/hud/KineticText";
import { profile } from "@/data/profile";

/** Tale-of-the-tape stat rows. Values flagged `highlight` render in --accent. */
const tape: { label: string; value: string; highlight?: boolean }[] = [
  { label: "Class", value: "AI / ML Engineer" },
  { label: "Reach", value: "Full-Stack" },
  { label: "Record", value: "7-0 on the podium", highlight: true },
  { label: "Base", value: profile.location },
  { label: "League", value: "KSU CS, Class of 2028" },
  { label: "GPA", value: profile.education.gpa, highlight: true },
];

export default function About() {
  const story = profile.bio.split("\n\n");

  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32"
      style={{ ["--accent"]: "#ff5a1f" } as React.CSSProperties}
    >
      <span className="hud-label">PERSONNEL // TALE OF THE TAPE</span>
      <KineticText
        as="h2"
        text="About"
        onScroll
        className="mt-3 font-display text-5xl text-[var(--text)] md:text-7xl"
      />

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[minmax(0,360px)_1fr] md:gap-14">
        {/* LEFT: fighter card */}
        <div className="flex flex-col">
          <HudFrame
            label="FIGHTER"
            className="overflow-hidden p-2"
          >
            <div className="relative overflow-hidden rounded-sm">
              <Image
                src="/personal/headshot.jpg"
                alt={`${profile.name}, fighter portrait`}
                width={480}
                height={640}
                priority
                sizes="(max-width: 768px) 100vw, 360px"
                className="h-auto w-full rounded-sm object-cover"
              />
              {/* scanline + gradient wash to seat the photo in the HUD */}
              <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/40 to-transparent" />
            </div>
          </HudFrame>

          <div className="mt-5 border-l-2 pl-4" style={{ borderColor: "var(--accent)" }}>
            <p className="font-display text-2xl text-[var(--text)] md:text-3xl">
              {profile.name}
            </p>
            <p className="hud-label mt-1">{profile.handle}</p>
          </div>
        </div>

        {/* RIGHT: tale of the tape + fighter story */}
        <div className="flex flex-col">
          <HudFrame label="TALE OF THE TAPE" className="px-5 pb-5 pt-7 md:px-7 md:pb-7 md:pt-9">
            <dl className="relative">
              {/* center divider running down the stat sheet */}
              <div
                className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
                style={{ background: "color-mix(in srgb, var(--accent) 45%, transparent)" }}
                aria-hidden="true"
              />
              {tape.map((row, i) => (
                <div
                  key={row.label}
                  className="grid grid-cols-2 items-baseline gap-x-6 py-3"
                  style={{
                    borderBottom:
                      i === tape.length - 1
                        ? "none"
                        : "1px solid var(--line)",
                  }}
                >
                  <dt className="font-hud pr-5 text-right text-xs uppercase tracking-[0.28em] text-[var(--muted)] md:text-sm">
                    {row.label}
                  </dt>
                  <dd
                    className={
                      "pl-5 text-left font-display text-lg leading-tight md:text-2xl " +
                      (row.highlight
                        ? "text-[var(--accent)]"
                        : "text-[var(--text)]")
                    }
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </HudFrame>

          {/* Fighter story */}
          <div className="mt-8">
            <span className="hud-label">RECORD // FIGHTER STORY</span>
            <div className="mt-4 space-y-4">
              {story.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-relaxed text-[var(--muted)] md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
