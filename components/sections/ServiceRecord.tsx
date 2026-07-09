"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/anim/Reveal";
import { KineticText } from "@/components/hud/KineticText";
import { useCoarsePointer, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { experience } from "@/data/experience";
import { achievements } from "@/data/achievements";
import type { Achievement, Role } from "@/data/types";

const ACCENT = "#8dff5a";

const kindLabel: Record<Role["kind"], string> = {
  founder: "Founder",
  work: "Engineering",
  program: "Program",
  teaching: "Teaching",
};

/** Tier styling keyed by the leading digit of a win label. */
const rankTier: Record<number, { rank: string; color: string; tier: string }> = {
  1: { rank: "1ST", color: "var(--forerunner)", tier: "Gold" },
  2: { rank: "2ND", color: "#c8d2dc", tier: "Silver" },
  3: { rank: "3RD", color: "#d08b52", tier: "Bronze" },
  0: { rank: "TOP", color: "var(--accent)", tier: "Podium" },
};

/** Leading rank digit of a win label ("1st, ..." -> 1). 0 when none. */
function rankOf(label: string): number {
  const m = label.match(/^(\d)/);
  if (!m) return 0;
  const n = Number(m[1]);
  return n === 1 || n === 2 || n === 3 ? n : 0;
}

type StatParts = {
  pre: string;
  value: number;
  decimals: number;
  suffix: string;
  post: string;
};

/** Pull the first number out of a stat label so it can count up on scroll. */
function parseStat(label: string): StatParts | null {
  const m = label.match(/^(.*?)(\d+(?:\.\d+)?)([+x]?)\s*(.*)$/);
  if (!m) return null;
  const [, pre, num, suffix, post] = m;
  return {
    pre: pre.trim(),
    value: Number(num),
    decimals: num.includes(".") ? (num.split(".")[1]?.length ?? 0) : 0,
    suffix,
    post: post.trim(),
  };
}

/**
 * Counts up to a target when scrolled into view. Drives DOM text through a ref
 * inside a requestAnimationFrame loop (no setState in the effect). Under
 * reduced motion the effect no-ops and the final value stays rendered.
 */
function CountUp({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  const final = value.toFixed(decimals) + suffix;

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let started = 0;
    const duration = 1400;

    const step = (t: number) => {
      if (!started) started = t;
      const p = Math.min((t - started) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (value * eased).toFixed(decimals) + suffix;
      if (p < 1) raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.textContent = (0).toFixed(decimals) + suffix;
          raf = requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced, value, decimals, suffix]);

  return <span ref={ref}>{final}</span>;
}

/** Vertical timeline rail that draws itself downward on scroll into view. */
function DrawRail() {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { scaleY: 0, transformOrigin: "top center" });
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          gsap.to(el, { scaleY: 1, duration: 1.6, ease: "power3.out" });
          io.disconnect();
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="absolute left-2 top-1 bottom-1 w-px bg-gradient-to-b from-[var(--accent)] via-[var(--line-strong)] to-transparent"
    />
  );
}

function SectionRule({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="hud-label whitespace-nowrap text-[var(--muted)]">
        {children}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-[var(--line)]" />
    </div>
  );
}

function ClearanceIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
      style={{ color: "var(--accent)" }}
    >
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M5 7 V5 a3 3 0 0 1 5.5 -1.6"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="8" cy="10.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Honors shelf: the horizontal gallery                                */
/* ------------------------------------------------------------------ */

/** One podium finish. Deliberately quiet: tier color, rank glyph, one hover. */
function FinishCard({ win, index }: { win: Achievement; index: number }) {
  const tier = rankTier[rankOf(win.label)] ?? rankTier[0];
  return (
    <article
      className="flex w-[300px] shrink-0 snap-center flex-col rounded-lg border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] px-7 py-7 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--tier)_45%,transparent)] md:w-[350px]"
      style={{ ["--tier"]: tier.color } as CSSProperties}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-hud text-[10px] uppercase tracking-[0.28em]"
          style={{ color: "var(--tier)" }}
        >
          {tier.tier}
        </span>
        <span className="font-hud text-[10px] tracking-[0.2em] text-[var(--muted)]">
          {`// ${String(index + 1).padStart(2, "0")}`}
        </span>
      </div>

      <span
        className="mt-5 block font-display text-6xl leading-[0.85] md:text-7xl"
        style={{
          color: "var(--tier)",
          textShadow: "0 0 30px color-mix(in srgb, var(--tier) 32%, transparent)",
        }}
      >
        {tier.rank}
      </span>

      <p className="mt-5 font-display text-lg leading-snug text-[var(--text)]">
        {win.label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{win.detail}</p>

      <span
        aria-hidden="true"
        className="mt-auto block h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--tier), color-mix(in srgb, var(--tier) 15%, transparent), transparent)",
        }}
      />
    </article>
  );
}

/** Opening panel: the record, in numbers that count up. */
function StatsPanel({ stats }: { stats: Achievement[] }) {
  return (
    <article className="flex w-[320px] shrink-0 snap-center flex-col rounded-lg border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] px-7 py-7 md:w-[440px]">
      <span className="hud-label text-[var(--muted)]">By the numbers</span>
      <div className="mt-6 grid flex-1 grid-cols-2 gap-x-6 gap-y-8">
        {stats.map((s, i) => {
          const parts = parseStat(s.label);
          const color = i === 0 ? "var(--forerunner)" : "var(--accent)";
          return (
            <div key={s.label} className="flex flex-col">
              <span
                className="font-display text-4xl leading-none md:text-5xl"
                style={{
                  color,
                  textShadow: `0 0 26px color-mix(in srgb, ${color} 32%, transparent)`,
                }}
              >
                {parts ? (
                  <CountUp value={parts.value} decimals={parts.decimals} suffix={parts.suffix} />
                ) : (
                  s.label
                )}
              </span>
              <span className="mt-2 text-xs leading-snug text-[var(--text)]/80">
                {parts?.post || s.detail}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}

/** Closing panel: certifications as a quiet ledger. */
function CertsPanel({ certs }: { certs: Achievement[] }) {
  return (
    <article className="flex w-[320px] shrink-0 snap-center flex-col rounded-lg border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] px-7 py-7 md:w-[420px]">
      <span className="hud-label text-[var(--muted)]">Certifications</span>
      <ul className="mt-4 flex flex-1 flex-col justify-center">
        {certs.map((c) => (
          <li
            key={c.label}
            className="flex items-start gap-3 border-b border-[var(--line)] py-3 last:border-b-0"
          >
            <span className="mt-0.5">
              <ClearanceIcon />
            </span>
            <div className="leading-tight">
              <span className="block font-hud text-xs uppercase tracking-[0.08em] text-[var(--text)]">
                {c.label}
              </span>
              <span className="mt-0.5 block text-[11px] text-[var(--muted)]">
                {c.detail}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

/**
 * The commendations shelf. On fine pointers the block pins and vertical scroll
 * slides the whole shelf sideways (px-for-px, so scrub speed feels natural);
 * on touch or reduced motion it falls back to a native snap-x carousel.
 */
function HonorsShelf({
  wins,
  stats,
  certs,
}: {
  wins: Achievement[];
  stats: Achievement[];
  certs: Achievement[];
}) {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const coarse = useCoarsePointer();
  const reduced = useReducedMotion();
  const pinned = !coarse && !reduced;

  useEffect(() => {
    if (!pinned) return;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });
    }, pin);
    return () => ctx.revert();
  }, [pinned]);

  const cards = (
    <>
      <StatsPanel stats={stats} />
      {wins.map((w, i) => (
        <FinishCard key={w.label} win={w} index={i} />
      ))}
      <CertsPanel certs={certs} />
    </>
  );

  // Touch / reduced motion: native horizontal snap carousel, no pinning.
  if (!pinned) {
    return (
      <div className="mt-10">
        <SectionRule>Commendations // swipe</SectionRule>
        <div className="-mx-6 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4">
          {cards}
        </div>
      </div>
    );
  }

  return (
    <div ref={pinRef} className="relative flex h-svh flex-col justify-center overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionRule>Commendations // the shelf slides as you scroll</SectionRule>
      </div>

      <div
        ref={trackRef}
        className="mt-10 flex w-max items-stretch gap-5 will-change-transform"
        style={{
          paddingLeft: "max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))",
          paddingRight: "14vw",
        }}
      >
        {cards}
      </div>

      <div className="mx-auto mt-12 w-full max-w-6xl px-6">
        <span className="relative block h-px w-full max-w-72 overflow-hidden bg-[var(--line)]">
          <span
            ref={barRef}
            className="absolute inset-0 origin-left scale-x-0 bg-[var(--accent)]"
          />
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function ServiceRecord() {
  // Founder role first, everything else keeps source order.
  const roles = [...experience].sort((a, b) => {
    if (a.kind === "founder" && b.kind !== "founder") return -1;
    if (b.kind === "founder" && a.kind !== "founder") return 1;
    return 0;
  });

  const wins = achievements.filter((a) => a.kind === "win");
  const stats = achievements.filter((a) => a.kind === "stat");
  const certs = achievements.filter((a) => a.kind === "cert");

  return (
    <section
      id="service-record"
      className="relative w-full"
      style={{ ["--accent"]: ACCENT } as CSSProperties}
    >
      <div className="mx-auto w-full max-w-6xl px-6 pt-20 md:pt-28">
        {/* Header */}
        <span className="hud-label text-[var(--muted)]">
          Experience // Service record
        </span>
        <div className="mt-3 overflow-hidden">
          <KineticText
            as="h2"
            text="Service Record"
            onScroll
            className="font-display text-5xl text-[var(--text)] md:text-7xl"
          />
        </div>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          Field history and the commendations that came with it, pulled straight
          from the record.
        </p>

        {/* Deployment log timeline (compact) */}
        <div className="mt-12 md:mt-16">
          <SectionRule>Deployment log</SectionRule>

          <div className="relative mt-8">
            <DrawRail />
            <ol className="space-y-7 md:space-y-9">
              {roles.map((role) => {
                const founder = role.kind === "founder";
                return (
                  <li key={role.org} className="group relative pl-11 md:pl-14">
                    <span
                      aria-hidden="true"
                      className="absolute left-[1px] top-1.5 z-10 h-3.5 w-3.5 rounded-full border-2 transition-transform duration-300 group-hover:scale-125"
                      style={{
                        borderColor: founder ? "var(--accent)" : "var(--line-strong)",
                        background: founder ? "var(--accent)" : "var(--bg)",
                        boxShadow: founder
                          ? "0 0 16px color-mix(in srgb, var(--accent) 70%, transparent)"
                          : undefined,
                      }}
                    />
                    <Reveal
                      className={cn(
                        "transition-colors duration-300",
                        founder &&
                          "rounded-sm border-l-2 border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)] p-5"
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span
                          className="hud-label"
                          style={{ color: founder ? "var(--accent)" : "var(--muted)" }}
                        >
                          {founder ? "★ Founder" : kindLabel[role.kind]}
                        </span>
                        <span className="ml-auto font-hud text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                          {role.period}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-2xl text-[var(--text)] transition-colors duration-300 group-hover:text-[var(--accent)] md:text-3xl">
                        {role.org}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--text)]/85">
                        {role.title}{" "}
                        <span className="text-[var(--muted)]">
                          {"// "}
                          {role.location}
                        </span>
                      </p>
                      <ul className="mt-3 space-y-2">
                        {role.bullets.map((bullet, j) => (
                          <li
                            key={j}
                            className="flex gap-3 text-sm leading-relaxed text-[var(--muted)]"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[7px] h-1 w-1 shrink-0 rounded-full"
                              style={{ background: "var(--accent)" }}
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* Commendations: horizontal shelf */}
      <div className="mt-8 md:mt-12">
        <HonorsShelf wins={wins} stats={stats} certs={certs} />
      </div>
    </section>
  );
}
