"use client";

import { useState, type CSSProperties } from "react";
import { FiDownload, FiEye, FiEyeOff } from "react-icons/fi";
import { KineticText } from "@/components/hud/KineticText";
import { MagneticButton } from "@/components/hud/MagneticButton";
import { useCoarsePointer } from "@/lib/motion";
import { profile } from "@/data/profile";

const RESUME_SRC = "/resume/Stephen_Sookra_Resume.pdf";

const FACTS = [
  { k: "File", v: "PDF // 1 page" },
  { k: "Degree", v: "B.S. CS · AI & ML" },
  { k: "Class", v: "May 2028" },
  { k: "Status", v: "Open to internships" },
];

/**
 * Compact resume block. The old always-open 80vh PDF viewer cost a full
 * screen of scroll; now the facts strip + download lead, and the inline
 * viewer mounts only when asked for (desktop only).
 */
export function Dossier() {
  const coarse = useCoarsePointer();
  const [open, setOpen] = useState(false);

  return (
    <section
      id="resume"
      className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-24"
      style={{ "--accent": "#8dff5a" } as CSSProperties}
    >
      <span className="hud-label">RESUME // DOSSIER</span>

      <KineticText
        as="h2"
        text="Dossier"
        onScroll
        className="mt-3 font-display text-5xl text-[var(--text)] md:text-7xl"
      />

      <div className="mt-8 overflow-hidden rounded-lg border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_70%,transparent)]">
        {/* facts strip */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-[var(--line)] p-6 sm:grid-cols-4 md:p-8">
          {FACTS.map((f) => (
            <div key={f.k}>
              <dt className="hud-label mb-1 text-[var(--muted)]">{f.k}</dt>
              <dd className="font-display text-lg text-[var(--text)] md:text-xl">
                {f.v}
              </dd>
            </div>
          ))}
        </dl>

        {/* actions */}
        <div className="flex flex-wrap items-center gap-4 p-6 md:p-8">
          <MagneticButton
            href={RESUME_SRC}
            external
            ariaLabel={`Download ${profile.name} resume as a PDF`}
          >
            <FiDownload size={14} /> Download resume
          </MagneticButton>
          {!coarse && (
            <MagneticButton
              onClick={() => setOpen((v) => !v)}
              ariaLabel={open ? "Hide inline resume preview" : "Preview resume inline"}
            >
              {open ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              {open ? "Hide preview" : "Preview inline"}
            </MagneticButton>
          )}
          <span className="hud-label text-[var(--muted)]">
            {"//"} NO REDACTIONS ON RECORD
          </span>
        </div>

        {/* inline viewer, mounted on demand only */}
        {open && !coarse && (
          <div className="border-t border-[var(--line)] p-2 md:p-3">
            <iframe
              src={RESUME_SRC}
              title={`${profile.name} resume`}
              loading="lazy"
              className="h-[75vh] w-full rounded-sm border-0 bg-[var(--panel-2)]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
