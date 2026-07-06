"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { HudFrame } from "@/components/hud/HudFrame";
import { KineticText } from "@/components/hud/KineticText";
import { MagneticButton } from "@/components/hud/MagneticButton";
import { useCoarsePointer, useReducedMotion } from "@/lib/motion";

const featured = projects.filter((p) => p.tier === "featured");
const archivedCount = projects.filter((p) => p.tier === "archive").length;

/** Small rotated-diamond rank marker used on the outcome medal. */
function MedalMark() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex h-3.5 w-3.5 shrink-0 rotate-45 items-center justify-center border border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_22%,transparent)]"
    >
      <span className="h-1 w-1 bg-[var(--accent)]" />
    </span>
  );
}

function MissionRow({ p, index }: { p: Project; index: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const coarse = useCoarsePointer();
  const reduced = useReducedMotion();
  const canPreview = !coarse && !reduced && p.gallery.length > 0;
  const poster = p.gallery[0];

  const onEnter = () => {
    if (canPreview && video.current) {
      video.current.currentTime = 0;
      video.current.play().catch(() => {});
    }
  };
  const onLeave = () => {
    if (video.current) video.current.pause();
  };

  return (
    <li
      className="group relative overflow-hidden border-b border-[var(--line)]"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* hover video preview of the live site */}
      {canPreview && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        >
          <video
            ref={video}
            muted
            loop
            playsInline
            preload="none"
            poster={poster}
            className="h-full w-full object-cover opacity-25"
          >
            <source src={`/projects/${p.slug}/preview.webm`} type="video/webm" />
            <source src={`/projects/${p.slug}/preview.mp4`} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[color-mix(in_srgb,var(--bg)_88%,transparent)] to-[color-mix(in_srgb,var(--bg)_45%,transparent)]" />
        </div>
      )}

      {/* growing accent rail */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-0.5 bg-[var(--line-strong)] transition-all duration-300 group-hover:w-1 group-hover:bg-[var(--accent)] group-hover:shadow-[0_0_14px_var(--accent)]"
      />

      <div className="flex flex-col gap-6 py-8 pl-5 pr-1 transition-transform duration-300 group-hover:translate-x-1 md:flex-row md:items-start md:gap-8">
        {/* index + date */}
        <div className="flex shrink-0 items-baseline gap-4 md:w-28 md:flex-col md:items-start md:gap-2">
          <span className="font-hud text-5xl font-bold leading-none text-[var(--muted)] opacity-30 transition-all duration-300 group-hover:text-[var(--accent)] group-hover:opacity-100 md:text-6xl">
            {index}
          </span>
          <span className="font-hud text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
            {p.dates}
          </span>
        </div>

        {/* body */}
        <div className="min-w-0 flex-1">
          {(p.role || p.outcome) && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {p.role && (
                <span className="font-hud text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                  {p.role}
                </span>
              )}
              {p.outcome && (
                <span className="inline-flex items-center gap-2 rounded-sm border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-2.5 py-1">
                  <MedalMark />
                  {p.outcome.place && (
                    <span className="font-hud text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
                      {p.outcome.place}
                    </span>
                  )}
                  <span className="font-hud text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    {p.outcome.event}
                  </span>
                </span>
              )}
            </div>
          )}

          <h3 className="font-display text-3xl leading-tight text-[var(--text)] transition-colors duration-300 group-hover:text-[var(--accent)] md:text-4xl">
            {p.name}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
            {p.tagline}
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {p.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-sm border border-[var(--line)] px-2 py-1 font-hud text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition-colors duration-300 group-hover:border-[var(--line-strong)]"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {/* actions */}
        <div className="flex shrink-0 flex-row gap-3 md:flex-col md:items-stretch">
          {p.links.live && (
            <MagneticButton
              href={p.links.live}
              external
              ariaLabel={`Deploy the live ${p.name} build`}
              className="px-5 py-2.5 text-xs"
            >
              DEPLOY
            </MagneticButton>
          )}
          <Link
            href={`/work/${p.slug}`}
            aria-label={`Read the ${p.name} mission intel`}
            className="group/intel relative inline-flex items-center justify-center gap-2 rounded-sm border border-[var(--line-strong)] px-5 py-2.5 font-hud text-xs uppercase tracking-[0.18em] text-[var(--text)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] transition-transform duration-300 group-hover/intel:scale-x-100"
            />
            INTEL
          </Link>
        </div>
      </div>
    </li>
  );
}

export default function Missions() {
  return (
    <section
      id="work"
      className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32"
      style={{ ["--accent"]: "#8dff5a" } as CSSProperties}
    >
      <div className="flex flex-col gap-4">
        <span className="hud-label">SELECTED WORK // MISSION LOG</span>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <KineticText
            as="h2"
            text="Missions"
            onScroll
            className="font-display text-5xl text-[var(--text)] md:text-7xl"
          />
          <p className="font-hud text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            {String(featured.length).padStart(2, "0")} campaign ops · hover to preview
          </p>
        </div>
      </div>

      <ol className="mt-14 border-t border-[var(--line)]">
        {featured.map((p, i) => (
          <MissionRow key={p.slug} p={p} index={String(i + 1).padStart(2, "0")} />
        ))}
      </ol>

      <HudFrame className="mt-14 flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <span className="hud-label">ARCHIVE // FULL SERVICE RECORD</span>
          <p className="text-sm text-[var(--muted)]">
            {archivedCount} more builds logged beyond the featured campaign.
          </p>
        </div>
        <MagneticButton
          href="/work"
          ariaLabel="View all work in the archive"
          className="px-6 py-3 text-xs"
        >
          VIEW ALL WORK
        </MagneticButton>
      </HudFrame>
    </section>
  );
}
