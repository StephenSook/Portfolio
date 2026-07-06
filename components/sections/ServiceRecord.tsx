"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { Reveal } from "@/components/anim/Reveal";
import { KineticText } from "@/components/hud/KineticText";
import { toast } from "@/lib/toast";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { experience } from "@/data/experience";
import { achievements } from "@/data/achievements";
import type { Role } from "@/data/types";

const ACCENT = "#8dff5a";

const kindLabel: Record<Role["kind"], string> = {
  founder: "Founder",
  work: "Engineering",
  program: "Program",
  teaching: "Teaching",
};

const medalMeta: Record<number, { color: string; tier: string }> = {
  1: { color: "var(--forerunner)", tier: "Gold" },
  2: { color: "#c8d2dc", tier: "Silver" },
  3: { color: "#d08b52", tier: "Bronze" },
  0: { color: "var(--accent)", tier: "Commendation" },
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
 * inside a requestAnimationFrame loop (no setState in the effect). Under reduced
 * motion the effect no-ops and the final value stays rendered.
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

/** Reveals its direct children in a rising cascade on scroll (reduced-safe). */
function Stagger({
  children,
  className,
  y = 26,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLUListElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const targets = Array.from(el.children) as HTMLElement[];
    if (!targets.length) return;
    gsap.set(targets, { opacity: 0, y, force3D: true });
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power4.out",
            stagger: 0.08,
            force3D: true,
          });
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, y]);

  return (
    <ul ref={ref} className={cn(className)}>
      {children}
    </ul>
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

function Medal({ color }: { color: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
      style={{
        filter: `drop-shadow(0 0 9px color-mix(in srgb, ${color} 42%, transparent))`,
      }}
    >
      <path d="M15 4 L22 18 L16 22 Z" fill={color} opacity="0.55" />
      <path d="M29 4 L22 18 L28 22 Z" fill={color} opacity="0.32" />
      <circle cx="22" cy="28" r="12" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="22" cy="28" r="7" fill={color} opacity="0.14" />
      <path
        d="M22 22 l1.8 3.7 4 .5 -3 2.8 .8 4 -3.6 -1.9 -3.6 1.9 .8 -4 -3 -2.8 4 -.5 Z"
        fill={color}
      />
    </svg>
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

export default function ServiceRecord() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const firedRef = useRef(false);

  // Founder role first, everything else keeps source order.
  const roles = [...experience].sort((a, b) => {
    if (a.kind === "founder" && b.kind !== "founder") return -1;
    if (b.kind === "founder" && a.kind !== "founder") return 1;
    return 0;
  });

  const wins = achievements.filter((a) => a.kind === "win");
  const stats = achievements.filter((a) => a.kind === "stat");
  const certs = achievements.filter((a) => a.kind === "cert");

  // On first scroll into view, cascade the top wins as achievement toasts (once).
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          achievements
            .filter((a) => a.kind === "win")
            .slice(0, 3)
            .forEach((a, i) => {
              timers.push(
                setTimeout(
                  () => toast.unlock({ title: a.label, detail: a.detail }),
                  400 + i * 700
                )
              );
            });
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section
      id="service-record"
      ref={sectionRef}
      className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32"
      style={{ ["--accent"]: ACCENT } as CSSProperties}
    >
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
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)] md:text-xl">
        Field history and the commendations that came with it, pulled straight
        from the record.
      </p>

      {/* Part 1: Deployment log timeline */}
      <div className="mt-16 md:mt-24">
        <SectionRule>Deployment log</SectionRule>

        <div className="relative mt-10">
          <DrawRail />
          <ol className="space-y-9 md:space-y-12">
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
                        "rounded-sm border-l-2 border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)] p-5 md:p-6"
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
                    <h3 className="mt-2 font-display text-3xl text-[var(--text)] transition-colors duration-300 group-hover:text-[var(--accent)] md:text-4xl">
                      {role.org}
                    </h3>
                    <p className="mt-1.5 text-sm text-[var(--text)]/85">
                      {role.title}{" "}
                      <span className="text-[var(--muted)]">
                        {"// "}
                        {role.location}
                      </span>
                    </p>
                    <ul className="mt-4 space-y-2.5">
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

      {/* Part 2: Commendations */}
      <div className="mt-16 md:mt-24">
        <SectionRule>Commendations</SectionRule>

        {/* Wins as medals */}
        <span className="mt-9 block font-hud text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          Podium finishes
        </span>
        <Stagger className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wins.map((w) => {
            const meta = medalMeta[rankOf(w.label)];
            return (
              <li
                key={w.label}
                className="group"
                style={{ ["--tier"]: meta.color } as CSSProperties}
              >
                <div className="flex h-full items-start gap-4 rounded-sm border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_55%,transparent)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--tier)] hover:shadow-[0_0_34px_-14px_var(--tier)]">
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    <Medal color={meta.color} />
                  </span>
                  <div className="min-w-0">
                    <span
                      className="font-hud text-[10px] uppercase tracking-[0.22em]"
                      style={{ color: meta.color }}
                    >
                      {meta.tier}
                    </span>
                    <p className="mt-1 font-display text-base leading-snug text-[var(--text)]">
                      {w.label}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">
                      {w.detail}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </Stagger>

        {/* Stats as big count-up numbers */}
        <span className="mt-12 block font-hud text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          By the numbers
        </span>
        <Stagger className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => {
            const parts = parseStat(s.label);
            return (
              <li key={s.label} className="group">
                <div className="flex h-full flex-col rounded-sm border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_55%,transparent)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_0_34px_-14px_var(--accent)]">
                  {parts?.pre && (
                    <span className="font-hud text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {parts.pre}
                    </span>
                  )}
                  <span
                    className="mt-1 font-display text-4xl leading-none text-[var(--accent)] md:text-5xl"
                    style={{
                      textShadow:
                        "0 0 26px color-mix(in srgb, var(--accent) 40%, transparent)",
                    }}
                  >
                    {parts ? (
                      <CountUp
                        value={parts.value}
                        decimals={parts.decimals}
                        suffix={parts.suffix}
                      />
                    ) : (
                      s.label
                    )}
                  </span>
                  {parts?.post && (
                    <span className="mt-2.5 text-sm leading-snug text-[var(--text)]/80">
                      {parts.post}
                    </span>
                  )}
                  <span className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">
                    {s.detail}
                  </span>
                </div>
              </li>
            );
          })}
        </Stagger>

        {/* Certs as clearance chips */}
        <span className="mt-12 block font-hud text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          Certifications
        </span>
        <Stagger className="mt-4 flex flex-wrap gap-2.5" y={16}>
          {certs.map((c) => (
            <li key={c.label}>
              <div className="group inline-flex items-center gap-2.5 rounded-sm border border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--panel)_55%,transparent)] px-3.5 py-2.5 transition-colors duration-300 hover:border-[var(--accent)]">
                <ClearanceIcon />
                <div className="leading-tight">
                  <span className="block font-hud text-xs uppercase tracking-[0.08em] text-[var(--text)]">
                    {c.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[var(--muted)]">
                    {c.detail}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
