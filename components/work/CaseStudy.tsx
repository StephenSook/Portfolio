import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/types";
import { projects } from "@/data/projects";
import { HudFrame } from "@/components/hud/HudFrame";
import { KineticText } from "@/components/hud/KineticText";
import { MagneticButton } from "@/components/hud/MagneticButton";

const featured = projects.filter((p) => p.tier === "featured");

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

const NARRATIVE: { label: string; key: "problem" | "build" | "result" }[] = [
  { label: "THE PROBLEM", key: "problem" },
  { label: "THE BUILD", key: "build" },
  { label: "THE RESULT", key: "result" },
];

/** Full case-study page body for one featured mission. */
export function CaseStudy({ project }: { project: Project }) {
  const caseStudy = project.caseStudy;
  const index = featured.findIndex((p) => p.slug === project.slug);
  const total = featured.length;
  const prev = featured[(index - 1 + total) % total];
  const next = featured[(index + 1) % total];

  return (
    <div style={{ ["--accent"]: "var(--energy)" } as CSSProperties}>
      {/* back bar */}
      <Link
        href="/work"
        className="hud-label inline-flex items-center gap-2 transition-colors hover:text-[var(--text)]"
      >
        ← ALL WORK
      </Link>

      {/* hero */}
      <header className="mt-10">
        <span className="hud-label">MISSION INTEL // {project.dates}</span>

        <KineticText
          as="h1"
          text={project.name}
          className="mt-4 font-display text-6xl text-[var(--text)] md:text-8xl"
        />

        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          {project.tagline}
        </p>

        {/* meta: outcome medal + role */}
        {(project.outcome || project.role) && (
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {project.outcome && (
              <span className="inline-flex items-center gap-2 rounded-sm border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-2.5 py-1">
                <MedalMark />
                {project.outcome.place && (
                  <span className="font-hud text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
                    {project.outcome.place}
                  </span>
                )}
                <span className="font-hud text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  {project.outcome.event}
                </span>
                {project.outcome.note && (
                  <span className="font-hud text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    {"// "}
                    {project.outcome.note}
                  </span>
                )}
              </span>
            )}
            {project.role && (
              <span className="font-hud text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                {project.role}
              </span>
            )}
          </div>
        )}

        {/* stack chips */}
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-sm border border-[var(--line)] px-2 py-1 font-hud text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]"
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {project.links.live && (
            <MagneticButton
              href={project.links.live}
              external
              ariaLabel={`Open the live ${project.name} build`}
              className="px-6 py-3 text-xs"
            >
              VIEW LIVE
            </MagneticButton>
          )}
          {project.links.repo && (
            <MagneticButton
              href={project.links.repo}
              external
              ariaLabel={`View the ${project.name} source on GitHub`}
              className="px-6 py-3 text-xs"
            >
              SOURCE
            </MagneticButton>
          )}
          {project.links.figma && (
            <MagneticButton
              href={project.links.figma}
              external
              ariaLabel={`Open the ${project.name} Figma file`}
              className="px-6 py-3 text-xs"
            >
              FIGMA
            </MagneticButton>
          )}
        </div>

        {project.links.note && (
          <p className="mt-3 font-hud text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
            {project.links.note}
          </p>
        )}
      </header>

      {/* gallery (rendered only when screenshots exist) */}
      {project.gallery.length > 0 && (
        <div className="mt-16 flex flex-col gap-8">
          {project.gallery.map((src, i) => (
            <HudFrame key={src} className="overflow-hidden">
              <Image
                src={src}
                alt={`${project.name} interface, view ${i + 1}`}
                width={1440}
                height={900}
                className="h-auto w-full rounded-sm"
              />
            </HudFrame>
          ))}
        </div>
      )}

      {/* narrative */}
      {caseStudy && (
        <div className="mt-16 flex flex-col gap-12 border-t border-[var(--line)] pt-14">
          {NARRATIVE.map(({ label, key }) => (
            <section key={key}>
              <h2 className="hud-label">{label}</h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text)] md:text-lg">
                {caseStudy[key]}
              </p>
            </section>
          ))}
        </div>
      )}

      {/* prev / next featured missions (wraps around) */}
      <nav className="mt-20 grid grid-cols-1 gap-4 border-t border-[var(--line)] pt-10 sm:grid-cols-2">
        <Link
          href={`/work/${prev.slug}`}
          className="group rounded-sm border border-[var(--line)] p-5 transition-colors hover:border-[var(--accent)]"
        >
          <span className="hud-label">← PREV MISSION</span>
          <p className="mt-2 font-display text-2xl text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
            {prev.name}
          </p>
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="group rounded-sm border border-[var(--line)] p-5 text-right transition-colors hover:border-[var(--accent)]"
        >
          <span className="hud-label">NEXT MISSION →</span>
          <p className="mt-2 font-display text-2xl text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
            {next.name}
          </p>
        </Link>
      </nav>
    </div>
  );
}
