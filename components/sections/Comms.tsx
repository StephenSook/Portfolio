"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { KineticText } from "@/components/hud/KineticText";
import { MagneticButton } from "@/components/hud/MagneticButton";
import { profile } from "@/data/profile";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const ACCENT = "#8dff5a";

const KONAMI = "↑ ↑ ↓ ↓ ← → ← → B A";

// Phrase that curves around the rotating badge. Repeated so it wraps the ring.
const ORBIT = "GET IN TOUCH • OPEN A CHANNEL • GET IN TOUCH • OPEN A CHANNEL • ";

// Full circle, starting at 12 o'clock and running clockwise so the text sits
// upright along the top. textLength stretches the phrase to the exact
// circumference for a seamless loop with no seam gap.
const RADIUS = 72;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ORBIT_PATH = `M 100,${100 - RADIUS} A ${RADIUS},${RADIUS} 0 1,1 100,${100 + RADIUS} A ${RADIUS},${RADIUS} 0 1,1 100,${100 - RADIUS}`;

/**
 * Spinning circular-text badge. The phrase curves around an SVG <textPath> and
 * the whole group rotates continuously via CSS. Purely decorative, so it is
 * hidden from assistive tech. Spin halts (but stays visible) under
 * prefers-reduced-motion via motion-reduce:animate-none.
 */
function OrbitBadge() {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-square w-48 shrink-0 sm:w-56 md:w-60"
    >
      {/* soft accent bloom behind the ring */}
      <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_24%,transparent),transparent_70%)] blur-xl" />

      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <defs>
          <path id="comms-orbit" d={ORBIT_PATH} fill="none" />
        </defs>

        {/* faint guide rings */}
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="0.75"
        />
        <circle
          cx="100"
          cy="100"
          r="54"
          fill="none"
          stroke="var(--line)"
          strokeWidth="0.75"
        />

        <g
          className="animate-spin [animation-duration:22s] motion-reduce:animate-none"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <text
            className="font-hud"
            fill="var(--accent)"
            fontSize="11"
            fontWeight={600}
          >
            <textPath
              href="#comms-orbit"
              startOffset="0"
              textLength={CIRCUMFERENCE}
              lengthAdjust="spacingAndGlyphs"
            >
              {ORBIT}
            </textPath>
          </text>
        </g>
      </svg>

      {/* center hub: SS accent dot + outbound arrow */}
      <div className="absolute inset-0 grid place-items-center">
        <span className="relative grid h-16 w-16 place-items-center rounded-full border border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--panel)_92%,transparent)] shadow-[0_0_30px_-8px_var(--accent)]">
          <span className="absolute inset-0 rounded-full bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]" />
          <FiArrowUpRight
            className="relative text-[var(--accent)]"
            size={26}
            strokeWidth={2.25}
          />
        </span>
      </div>
    </div>
  );
}

export default function Comms() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast.unlock({
        title: "CHANNEL OPEN",
        detail: "Email copied to clipboard.",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the mailto button below still opens a channel.
      setCopied(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32"
      style={{ ["--accent"]: ACCENT } as CSSProperties}
    >
      <span className="hud-label">CONTACT // ESTABLISH COMMS</span>

      <KineticText
        as="h2"
        text="Let's build something."
        onScroll
        className="mt-4 font-display text-5xl text-[var(--text)] md:text-7xl"
      />

      <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
        Recruiters, collaborators, and fellow builders, the line is open. Bring a
        team to join, an idea worth building, or a hard problem you want another
        set of hands on, and I will answer.
      </p>

      {/* channel panel */}
      <div className="relative mt-10 overflow-hidden rounded-lg border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_70%,transparent)] backdrop-blur-sm md:mt-14">
        {/* accent wash pinned to the badge side */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_140%_at_100%_0%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_55%)]"
        />

        {/* corner ticks */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-[var(--accent)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[var(--accent)]"
        />

        {/* status bar */}
        <div className="relative flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-3 md:px-8">
          <span className="hud-label text-[var(--muted)]">CHANNEL // OPEN</span>
          <span className="flex items-center gap-2 font-hud text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)] motion-reduce:animate-none" />
            Online
          </span>
        </div>

        {/* body */}
        <div className="relative grid gap-10 p-6 md:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-6">
          {/* left: frequency + actions */}
          <div className="min-w-0">
            <span className="font-hud text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
              Primary frequency
            </span>

            {/* oversized email copy control */}
            <button
              type="button"
              onClick={copyEmail}
              aria-label={`Copy email address ${profile.email} to clipboard`}
              className="group mt-3 flex w-full flex-col gap-3 text-left"
            >
              <span className="flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className="font-hud text-lg text-[var(--accent)] md:text-2xl"
                >
                  $
                </span>
                <span className="min-w-0 break-all font-hud text-2xl leading-none text-[var(--text)] transition-colors duration-200 group-hover:text-[var(--accent)] sm:text-3xl md:text-4xl">
                  {profile.email}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex items-center gap-2 font-hud text-[10px] uppercase tracking-[0.24em] transition-colors duration-200",
                  copied
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted)] group-hover:text-[var(--accent)]"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-px w-8 transition-colors duration-200",
                    copied
                      ? "bg-[var(--accent)]"
                      : "bg-[var(--line-strong)] group-hover:bg-[var(--accent)]"
                  )}
                />
                {copied ? "Copied to clipboard" : "Click to copy"}
              </span>
            </button>
            <span aria-live="polite" className="sr-only">
              {copied ? "Email address copied to clipboard" : ""}
            </span>

            {/* actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton
                href={`mailto:${profile.email}`}
                ariaLabel="Compose an email to Stephen Sookra"
                className="px-6 py-3 text-xs"
              >
                SEND MAIL
              </MagneticButton>
              <MagneticButton
                href={profile.github}
                external
                ariaLabel="Open Stephen Sookra's GitHub profile"
                className="px-6 py-3 text-xs"
              >
                GITHUB
              </MagneticButton>
              <MagneticButton
                href={profile.linkedin}
                external
                ariaLabel="Open Stephen Sookra's LinkedIn profile"
                className="px-6 py-3 text-xs"
              >
                LINKEDIN
              </MagneticButton>
            </div>
          </div>

          {/* right: spinning circular badge */}
          <div className="flex justify-center lg:justify-end">
            <OrbitBadge />
          </div>
        </div>
      </div>

      {/* more pages */}
      <nav aria-label="More pages" className="mt-8 flex gap-6">
        <Link
          href="/work"
          className="font-hud text-xs uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          All Work →
        </Link>
        <Link
          href="/lab"
          className="font-hud text-xs uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          The Lab →
        </Link>
      </nav>

      {/* minimal footer */}
      <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-[var(--line)] pt-6 font-hud text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] sm:flex-row sm:items-center">
        <span>&copy; 2026 Stephen Sookra</span>
        <span aria-hidden="true" className="tracking-[0.32em] opacity-40">
          {KONAMI}
        </span>
      </div>
    </section>
  );
}
