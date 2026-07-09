import type { CSSProperties } from "react";
import { KineticText } from "@/components/hud/KineticText";
import { Reveal } from "@/components/anim/Reveal";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const ACCENT = "#8dff5a";

type Group = {
  index: string;
  label: string;
  items: string[];
};

const languages = profile.skills.languages;

const GROUPS: Group[] = [
  { index: "01", label: "Frameworks", items: profile.skills.frameworks },
  { index: "02", label: "Tools", items: profile.skills.tools },
  { index: "03", label: "Concepts", items: profile.skills.concepts },
];

const pad = (n: number) => String(n).padStart(2, "0");

const total =
  languages.length + GROUPS.reduce((sum, g) => sum + g.items.length, 0);

function Chip({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "group/chip inline-flex items-center gap-2 rounded-full",
        "border border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--panel-2)_55%,transparent)]",
        "px-3.5 py-2 text-sm text-[var(--muted)]",
        "transition-[transform,color,border-color,background-color,box-shadow] duration-300 ease-out",
        "hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--text)]",
        "hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]",
        "hover:shadow-[0_8px_22px_-10px_var(--accent)]"
      )}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-[var(--line-strong)] transition-colors duration-300 group-hover/chip:bg-[var(--accent)]"
      />
      {label}
    </span>
  );
}

function GroupRow({ index, label, items }: Group) {
  return (
    <div className="grid gap-5 border-b border-[var(--line)] py-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] md:gap-10 md:py-10">
      {/* left: index + serif name + count */}
      <Reveal
        y={22}
        className="flex items-baseline gap-4 md:flex-col md:items-start md:gap-3"
      >
        <span className="font-hud text-[11px] tracking-[0.28em] text-[var(--accent)]">
          {index}
        </span>
        <h3 className="font-display text-3xl text-[var(--text)] md:text-4xl">
          {label}
        </h3>
        <span className="font-hud text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] md:mt-1">
          {pad(items.length)} entries
        </span>
      </Reveal>

      {/* right: staggered chips that lift + glow on hover */}
      <Reveal stagger y={22} className="flex flex-wrap gap-2.5 md:pt-1">
        {items.map((item) => (
          <Chip key={item} label={item} />
        ))}
      </Reveal>
    </div>
  );
}

export default function Arsenal() {
  return (
    <section
      id="arsenal"
      className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-24"
      style={{ ["--accent"]: ACCENT } as CSSProperties}
    >
      {/* header: editorial heading + count index */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <span className="hud-label">What I build with</span>
          <KineticText
            as="h2"
            text="Arsenal"
            onScroll
            className="mt-4 font-display text-5xl text-[var(--text)] md:text-7xl"
          />
          <p className="mt-5 text-base leading-relaxed text-[var(--muted)] md:text-lg">
            A working toolkit shaped by shipping across XR, full-stack, and
            machine learning.
          </p>
        </div>

        <div className="flex items-baseline gap-3 md:flex-col md:items-end md:gap-2 md:text-right">
          <span
            className="font-display text-5xl leading-none text-[var(--accent)] md:text-6xl"
            style={{
              textShadow:
                "0 0 32px color-mix(in srgb, var(--accent) 35%, transparent)",
            }}
          >
            {total}
          </span>
          <span className="font-hud text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
            capabilities / {GROUPS.length + 1} groups
          </span>
        </div>
      </div>

      {/* primary languages: oversized serif marquee */}
      <div className="mt-14 border-y border-[var(--line)] py-6 md:mt-16">
        <span className="mb-4 block px-1 hud-label text-[var(--muted)]">
          Primary languages
        </span>
        <div className="relative flex overflow-hidden">
          <ul className="flex shrink-0 animate-[marquee-l_26s_linear_infinite] items-center gap-10 pr-10 motion-reduce:animate-none motion-reduce:flex-wrap">
            {[...languages, ...languages].map((lang, i) => (
              <li
                key={i}
                className="flex items-center gap-10 font-display text-3xl text-[var(--muted)] md:text-5xl"
              >
                <span>{lang}</span>
                <span
                  aria-hidden="true"
                  className="text-2xl text-[var(--accent)]/50 md:text-3xl"
                >
                  ✦
                </span>
              </li>
            ))}
          </ul>
          {/* edge fades */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--bg)] to-transparent md:w-28"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--bg)] to-transparent md:w-28"
          />
        </div>
      </div>

      {/* grouped ledger: Frameworks / Tools / Concepts */}
      <div className="mt-6 border-t border-[var(--line)]">
        {GROUPS.map((g) => (
          <GroupRow
            key={g.label}
            index={g.index}
            label={g.label}
            items={g.items}
          />
        ))}
      </div>
    </section>
  );
}
