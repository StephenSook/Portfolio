"use client";

import { useEffect, useRef } from "react";
import { HudFrame } from "@/components/hud/HudFrame";
import { KineticText } from "@/components/hud/KineticText";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { experience } from "@/data/experience";
import { achievements } from "@/data/achievements";
import type { Role } from "@/data/types";

const ACCENT = "#4cc2ff";

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

/** Split a stat label into a big value token and the trailing words. */
function splitStat(label: string): { value: string; rest: string } {
  const m = label.match(/^([\d.]+\+?x?)/);
  if (m) return { value: m[1], rest: label.slice(m[1].length).trim() };
  return { value: label, rest: "" };
}

function Medal({ color }: { color: string }) {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M13 3 L20 15 L14 19 Z" fill={color} opacity="0.5" />
      <path d="M27 3 L20 15 L26 19 Z" fill={color} opacity="0.3" />
      <circle cx="20" cy="25" r="11" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="20" cy="25" r="6.5" fill={color} opacity="0.16" />
      <path
        d="M20 19.6 l1.7 3.4 3.7.5 -2.7 2.6 .7 3.7 -3.4 -1.8 -3.4 1.8 .7 -3.7 -2.7 -2.6 3.7 -.5 Z"
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
      style={{ ["--accent" as string]: ACCENT } as React.CSSProperties}
    >
      {/* Header */}
      <span className="hud-label">EXPERIENCE // SERVICE RECORD</span>
      <div className="mt-3 overflow-hidden">
        <KineticText
          as="h2"
          text="Service Record"
          onScroll
          className="font-display text-5xl text-[var(--text)] md:text-7xl"
        />
      </div>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
        Field history and earned commendations, pulled straight from the record.
      </p>

      {/* Part 1: Deployment log timeline */}
      <div className="mt-16 md:mt-20">
        <div className="flex items-center gap-3">
          <span className="hud-label">DEPLOYMENT LOG</span>
          <span aria-hidden="true" className="h-px flex-1 bg-[var(--line)]" />
        </div>

        <div className="relative mt-8">
          <span
            aria-hidden="true"
            className="absolute left-2 top-1 bottom-2 w-px bg-gradient-to-b from-[var(--accent)]/50 via-[var(--line-strong)] to-transparent"
          />
          <ol className="space-y-6">
            {roles.map((role) => {
              const founder = role.kind === "founder";
              return (
                <li key={role.org} className="relative pl-9 md:pl-11">
                  <span
                    aria-hidden="true"
                    className="absolute left-[2px] top-4 h-3 w-3 rounded-full border-2"
                    style={{
                      borderColor: founder ? "var(--accent)" : "var(--line-strong)",
                      background: "var(--bg)",
                      boxShadow: founder
                        ? "0 0 14px color-mix(in srgb, var(--accent) 65%, transparent)"
                        : undefined,
                    }}
                  />
                  <HudFrame
                    className={cn(
                      "p-5 md:p-6",
                      founder &&
                        "border-[var(--accent)]/40 bg-[color-mix(in_srgb,var(--accent)_5%,var(--panel))] shadow-[0_0_36px_-14px_var(--accent)]"
                    )}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span
                        className="hud-label"
                        style={{ color: founder ? "var(--accent)" : "var(--muted)" }}
                      >
                        {kindLabel[role.kind]}
                      </span>
                      <span className="font-hud text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                        {role.period}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl text-[var(--text)] md:text-3xl">
                      {role.org}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text)]/90">
                      {role.title}{" "}
                      <span className="text-[var(--muted)]">{"// "}{role.location}</span>
                    </p>
                    <ul className="mt-4 space-y-2">
                      {role.bullets.map((bullet, j) => (
                        <li
                          key={j}
                          className="flex gap-2.5 text-sm leading-relaxed text-[var(--muted)]"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1 w-1 shrink-0 rounded-full"
                            style={{ background: "var(--accent)" }}
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </HudFrame>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Part 2: Trophy case */}
      <div className="mt-16 md:mt-20">
        <div className="flex items-center gap-3">
          <span className="hud-label">TROPHY CASE</span>
          <span aria-hidden="true" className="h-px flex-1 bg-[var(--line)]" />
        </div>

        {/* Wins as medal cards */}
        <span className="mt-8 block font-hud text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          Podium Finishes
        </span>
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wins.map((w) => {
            const meta = medalMeta[rankOf(w.label)];
            return (
              <li key={w.label}>
                <HudFrame className="h-full p-5" accent={meta.color}>
                  <div className="flex items-start gap-4">
                    <Medal color={meta.color} />
                    <div className="min-w-0">
                      <span
                        className="font-hud text-[10px] uppercase tracking-[0.22em]"
                        style={{ color: meta.color }}
                      >
                        {meta.tier}
                      </span>
                      <p className="mt-1 font-display text-base leading-tight text-[var(--text)]">
                        {w.label}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">
                        {w.detail}
                      </p>
                    </div>
                  </div>
                </HudFrame>
              </li>
            );
          })}
        </ul>

        {/* Stats as big number tiles */}
        <span className="mt-10 block font-hud text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          By The Numbers
        </span>
        <ul className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => {
            const { value, rest } = splitStat(s.label);
            const big = value.length <= 4;
            return (
              <li key={s.label}>
                <HudFrame className="h-full p-5">
                  <div
                    className={cn(
                      "font-display leading-none text-[var(--accent)]",
                      big ? "text-5xl md:text-6xl" : "text-2xl md:text-3xl"
                    )}
                    style={{
                      textShadow:
                        "0 0 26px color-mix(in srgb, var(--accent) 40%, transparent)",
                    }}
                  >
                    {value}
                  </div>
                  {rest && (
                    <div className="mt-2 font-hud text-[11px] uppercase leading-snug tracking-[0.14em] text-[var(--text)]/80">
                      {rest}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-[var(--muted)]">{s.detail}</div>
                </HudFrame>
              </li>
            );
          })}
        </ul>

        {/* Certs as clearance chips */}
        <span className="mt-10 block font-hud text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          Certifications
        </span>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {certs.map((c) => (
            <li key={c.label}>
              <div className="group inline-flex items-center gap-2.5 rounded-sm border border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--panel)_60%,transparent)] px-3 py-2 transition-colors duration-300 hover:border-[var(--accent)]">
                <ClearanceIcon />
                <div className="leading-tight">
                  <span className="block font-hud text-xs uppercase tracking-[0.1em] text-[var(--text)]">
                    {c.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[var(--muted)]">
                    {c.detail}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
