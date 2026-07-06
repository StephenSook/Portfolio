"use client";

import type { CSSProperties } from "react";
import { HudFrame } from "@/components/hud/HudFrame";
import { KineticText } from "@/components/hud/KineticText";
import { MagneticButton } from "@/components/hud/MagneticButton";
import { useCoarsePointer } from "@/lib/motion";
import { profile } from "@/data/profile";

const RESUME_SRC = "/resume/Stephen_Sookra_Resume.pdf";

/** Small rotated bracketed stamp built from the .hud-label utility. */
function Stamp({
  text,
  accent,
  className,
}: {
  text: string;
  accent?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`hud-label inline-block border px-3 py-1.5 ${className ?? ""}`}
      style={
        {
          borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)",
          ...(accent ? { "--accent": accent } : {}),
        } as CSSProperties
      }
    >
      {text}
    </span>
  );
}

export function Dossier() {
  const coarse = useCoarsePointer();

  return (
    <section
      id="resume"
      className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32"
      style={{ "--accent": "#8dff5a" } as CSSProperties}
    >
      {/* Floating decorative stamp, desktop only so it never crowds mobile. */}
      <Stamp
        text="CLASSIFIED // UNSC"
        accent="#f5b33c"
        className="pointer-events-none absolute right-6 top-20 hidden rotate-6 opacity-70 md:inline-block"
      />

      <span className="hud-label">RESUME // DOSSIER</span>

      <KineticText
        as="h2"
        text="Dossier"
        onScroll
        className="mt-3 font-display text-5xl text-[var(--text)] md:text-7xl"
      />

      <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
        The full service record for {profile.name}. Read it inline below, or pull
        the file for your own archive.
      </p>

      {/* Metadata strip: reads like the header of a redacted file. */}
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Stamp text="CLASSIFIED // UNSC" className="-rotate-2" />
        <span className="hud-label text-[var(--muted)]">
          FILE // {profile.handle}
        </span>
        <span className="hud-label text-[var(--muted)]">
          LOC // {profile.location}
        </span>
        <span className="hud-label text-[var(--muted)]">FORMAT // PDF</span>
      </div>

      {/* Viewer. Inline PDF on fine-pointer desktops; a note on touch devices. */}
      <HudFrame
        label="DOSSIER // S. SOOKRA"
        className="mt-8 p-2 md:p-3"
      >
        {coarse ? (
          <div className="flex flex-col items-start gap-4 px-4 py-10 sm:px-8">
            <span className="hud-label">VIEWER // DESKTOP ONLY</span>
            <p className="max-w-md text-sm leading-relaxed text-[var(--muted)]">
              The embedded reader is built for larger displays. Download the
              file to open the full dossier on your device.
            </p>
            <div className="flex items-center gap-2 font-hud text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              Ready for exfil
            </div>
          </div>
        ) : (
          <iframe
            src={RESUME_SRC}
            title={`${profile.name} resume`}
            loading="lazy"
            className="h-[80vh] w-full rounded-sm border-0 bg-[var(--panel-2)]"
          />
        )}
      </HudFrame>

      {/* Download is always available, regardless of viewer mode. */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <MagneticButton
          href={RESUME_SRC}
          external
          ariaLabel={`Download ${profile.name} resume as a PDF`}
        >
          EXFIL DOSSIER
        </MagneticButton>
        <span className="hud-label text-[var(--muted)]">
          {"//"} NO REDACTIONS ON RECORD
        </span>
      </div>
    </section>
  );
}
