"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { HudFrame } from "@/components/hud/HudFrame";
import { KineticText } from "@/components/hud/KineticText";
import { MagneticButton } from "@/components/hud/MagneticButton";
import { profile } from "@/data/profile";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const ACCENT = "#8dff5a";

const KONAMI = "↑ ↑ ↓ ↓ ← → ← → B A";

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
        text="Establish Comms"
        onScroll
        className="mt-4 font-display text-5xl text-[var(--text)] md:text-7xl"
      />

      {/* comms terminal */}
      <HudFrame label="CHANNEL // OPEN" className="mt-10 overflow-hidden md:mt-14">
        {/* terminal title bar */}
        <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[color-mix(in_srgb,var(--forerunner)_70%,transparent)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[color-mix(in_srgb,var(--hud)_70%,transparent)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[color-mix(in_srgb,var(--accent)_70%,transparent)]" />
            </span>
            <span className="font-hud text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
              comms.terminal
            </span>
          </div>
          <span className="flex items-center gap-2 font-hud text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
            Online
          </span>
        </div>

        {/* terminal body */}
        <div className="scanlines p-6 md:p-10">
          {/* prompt line */}
          <p className="font-hud text-xs tracking-wide md:text-sm">
            <span className="text-[var(--accent)]">sookra@comms</span>
            <span className="text-[var(--muted)]">:~$</span>
            <span className="ml-2 text-[var(--text)]">./open-channel</span>
            <span
              aria-hidden="true"
              className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-[var(--accent)] align-middle"
            />
          </p>

          <h3 className="mt-6 font-display text-3xl text-[var(--text)] md:text-4xl">
            Open a channel.
          </h3>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
            Recruiters, collaborators, and fellow builders, the line is open. If
            you have a team to join, an idea worth building, or a hard problem
            you want another set of hands on, send a signal and I will answer.
          </p>

          {/* email copy field */}
          <div className="mt-8">
            <span className="font-hud text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
              Primary frequency
            </span>
            <button
              type="button"
              onClick={copyEmail}
              aria-label={`Copy email address ${profile.email} to clipboard`}
              className={cn(
                "group mt-2 flex w-full items-center justify-between gap-4 rounded-sm border px-4 py-3.5 text-left transition-colors duration-200 md:w-auto md:min-w-[26rem]",
                "border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--panel-2)_60%,transparent)]",
                "hover:border-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span aria-hidden="true" className="font-hud text-sm text-[var(--accent)]">
                  $
                </span>
                <span className="truncate font-hud text-sm text-[var(--text)] md:text-base">
                  {profile.email}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "shrink-0 font-hud text-[10px] uppercase tracking-[0.2em] transition-colors duration-200",
                  copied
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted)] group-hover:text-[var(--accent)]"
                )}
              >
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
            <span aria-live="polite" className="sr-only">
              {copied ? "Email address copied to clipboard" : ""}
            </span>
          </div>

          {/* actions */}
          <div className="mt-6 flex flex-wrap gap-3">
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
      </HudFrame>

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
