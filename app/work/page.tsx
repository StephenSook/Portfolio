import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { HudFrame } from "@/components/hud/HudFrame";
import { KineticText } from "@/components/hud/KineticText";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All Work",
  description:
    "The full service record: every build Stephen Sookra has shipped, from featured campaigns to the archive.",
};

const STACK_CAP = 5;
const featuredCount = projects.filter((p) => p.tier === "featured").length;

/** Rotated-diamond rank marker, matched to the Missions medal chip. */
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

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-hud text-[11px] uppercase tracking-[0.16em] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
    >
      {label}
    </a>
  );
}

function WorkCard({ project }: { project: Project }) {
  const isFeatured = project.tier === "featured";
  const shownStack = project.stack.slice(0, STACK_CAP);
  const extra = project.stack.length - shownStack.length;

  return (
    <HudFrame
      as="article"
      accent={isFeatured ? "var(--energy)" : "var(--muted)"}
      className={cn(
        "flex h-full flex-col gap-4 p-6",
        isFeatured &&
          "shadow-[0_0_28px_-10px_color-mix(in_srgb,var(--accent)_55%,transparent)]"
      )}
    >
      {/* tier + dates */}
      <div className="flex items-center justify-between gap-3">
        <span className="hud-label">{isFeatured ? "FEATURED" : "ARCHIVE"}</span>
        <span className="font-hud text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
          {project.dates}
        </span>
      </div>

      {/* outcome medal */}
      {project.outcome && (
        <span className="inline-flex w-fit items-center gap-2 rounded-sm border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-2.5 py-1">
          <MedalMark />
          {project.outcome.place && (
            <span className="font-hud text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
              {project.outcome.place}
            </span>
          )}
          <span className="font-hud text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
            {project.outcome.event}
          </span>
        </span>
      )}

      {/* name + tagline */}
      <div>
        <h2 className="font-display text-2xl leading-tight text-[var(--text)]">
          {project.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {project.tagline}
        </p>
      </div>

      {/* stack + footer pinned to the bottom for even card heights */}
      <div className="mt-auto flex flex-col gap-4">
        <ul className="flex flex-wrap gap-2">
          {shownStack.map((tech) => (
            <li
              key={tech}
              className="rounded-sm border border-[var(--line)] px-2 py-1 font-hud text-[9px] uppercase tracking-[0.14em] text-[var(--muted)]"
            >
              {tech}
            </li>
          ))}
          {extra > 0 && (
            <li className="rounded-sm border border-[var(--line)] px-2 py-1 font-hud text-[9px] uppercase tracking-[0.14em] text-[var(--muted)]">
              +{extra}
            </li>
          )}
        </ul>

        <div className="flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-4">
          {isFeatured && (
            <Link
              href={`/work/${project.slug}`}
              aria-label={`Read the ${project.name} mission intel`}
              className="font-hud text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--accent)] transition-colors hover:text-[var(--text)]"
            >
              INTEL →
            </Link>
          )}
          {project.links.live && (
            <ExternalLink href={project.links.live} label="LIVE" />
          )}
          {project.links.repo && (
            <ExternalLink href={project.links.repo} label="CODE" />
          )}
          {project.links.figma && (
            <ExternalLink href={project.links.figma} label="FIGMA" />
          )}
        </div>
      </div>
    </HudFrame>
  );
}

export default function AllWorkPage() {
  return (
    <main
      id="main"
      className="mx-auto max-w-6xl px-6 py-24 md:py-32"
      style={{ ["--accent"]: "var(--energy)" } as CSSProperties}
    >
      {/* header */}
      <div className="flex flex-col gap-4">
        <span className="hud-label">ARCHIVE // FULL SERVICE RECORD</span>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <KineticText
            as="h1"
            text="All Work"
            className="font-display text-5xl text-[var(--text)] md:text-7xl"
          />
          <Link
            href="/"
            className="hud-label transition-colors hover:text-[var(--text)]"
          >
            ← HOME
          </Link>
        </div>
        <p className="font-hud text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
          {projects.length} builds logged // {featuredCount} featured campaigns
        </p>
      </div>

      {/* grid */}
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <WorkCard key={p.slug} project={p} />
        ))}
      </div>
    </main>
  );
}
