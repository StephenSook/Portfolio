import type { CSSProperties } from "react";
import { HudFrame } from "@/components/hud/HudFrame";
import { KineticText } from "@/components/hud/KineticText";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const ACCENT = "#5ad84a";

type Slot = {
  index: string;
  slot: string;
  category: string;
  items: string[];
};

const SLOTS: Slot[] = [
  {
    index: "01",
    slot: "PRIMARY",
    category: "Languages",
    items: profile.skills.languages,
  },
  {
    index: "02",
    slot: "SECONDARY",
    category: "Frameworks & Libraries",
    items: profile.skills.frameworks,
  },
  {
    index: "03",
    slot: "TACTICAL",
    category: "Tools & Platforms",
    items: profile.skills.tools,
  },
  {
    index: "04",
    slot: "PERKS",
    category: "Concepts",
    items: profile.skills.concepts,
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

const total = SLOTS.reduce((sum, s) => sum + s.items.length, 0);

function Chip({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "group/chip inline-flex items-center gap-2 rounded-sm border border-[var(--line-strong)]",
        "bg-[color-mix(in_srgb,var(--panel-2)_60%,transparent)] px-3 py-1.5",
        "font-hud text-[11px] tracking-wide text-[var(--muted)]",
        "transition-colors duration-200",
        "hover:border-[var(--accent)] hover:text-[var(--text)]",
        "hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]"
      )}
    >
      <span
        aria-hidden="true"
        className="h-1 w-1 rounded-full bg-[var(--muted)] transition-colors duration-200 group-hover/chip:bg-[var(--accent)]"
      />
      {label}
    </span>
  );
}

function SlotCard({ slot }: { slot: Slot }) {
  return (
    <HudFrame label={slot.slot} className="flex flex-col gap-5 p-5 md:p-6">
      {/* slot header */}
      <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div>
          <span className="font-hud text-[13px] tracking-[0.18em] text-[var(--accent)]">
            {slot.index} / {slot.slot}
          </span>
          <p className="mt-1 font-hud text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
            {slot.category}
          </p>
        </div>
        <span className="shrink-0 font-hud text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
          {pad(slot.items.length)} Equipped
        </span>
      </div>

      {/* loadout chips */}
      <div className="flex flex-wrap gap-2.5">
        {slot.items.map((item) => (
          <Chip key={item} label={item} />
        ))}
      </div>
    </HudFrame>
  );
}

export default function Arsenal() {
  return (
    <section
      id="arsenal"
      className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32"
      style={{ ["--accent"]: ACCENT } as CSSProperties}
    >
      <span className="hud-label">SKILLS // LOADOUT</span>

      <KineticText
        as="h2"
        text="Arsenal"
        onScroll
        className="mt-4 font-display text-5xl text-[var(--text)] md:text-7xl"
      />

      {/* operator strip */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-[var(--line)] py-3 font-hud text-[11px] uppercase tracking-[0.25em] text-[var(--muted)]">
        <span>
          Operator //{" "}
          <span className="text-[var(--accent)]">{profile.handle}</span>
        </span>
        <span>{total} Modules Equipped</span>
      </div>

      {/* loadout grid */}
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {SLOTS.map((slot) => (
          <SlotCard key={slot.slot} slot={slot} />
        ))}
      </div>
    </section>
  );
}
