"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Reveal } from "@/components/anim/Reveal";
import { KineticText } from "@/components/hud/KineticText";
import { toast } from "@/lib/toast";
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

const medalArt: Record<number, { src: string; color: string; tier: string }> = {
  1: { src: "/brand/medals/gold.png", color: "var(--forerunner)", tier: "Gold" },
  2: { src: "/brand/medals/silver.png", color: "#c8d2dc", tier: "Silver" },
  3: { src: "/brand/medals/bronze.png", color: "#d08b52", tier: "Bronze" },
  0: { src: "/brand/medals/gold.png", color: "var(--forerunner)", tier: "Gold" },
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

/**
 * A single podium finish rendered as a premium, mouse-reactive medal card.
 * The card tilts toward the pointer, with the transform mutated directly on the
 * ref inside the event handler (never through React state), and the medal art
 * floats on a gsap loop. Under reduced motion or on coarse pointers it renders
 * fully static. The pure-black medal background drops out via mix-blend-lighten.
 */
function MedalCard({ win, index }: { win: Achievement; index: number }) {
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const floatRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const interactive = !reduced && !coarse;
  const art = medalArt[rankOf(win.label)] ?? medalArt[0];

  // Gentle idle float on the medal art (transform-only, auto-pauses offscreen).
  useEffect(() => {
    if (reduced || coarse) return;
    const el = floatRef.current;
    if (!el) return;
    const tween = gsap.to(el, {
      y: -9,
      duration: 2.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    tween.seek((index % 3) * 0.9); // desync neighbouring medals
    return () => {
      tween.kill();
    };
  }, [reduced, coarse, index]);

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${(py * -14).toFixed(2)}deg) rotateY(${(px * 16).toFixed(2)}deg)`;
  };

  const handleLeave = () => {
    const el = tiltRef.current;
    if (el) el.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <li className="group [perspective:1100px]">
      <div
        ref={tiltRef}
        onPointerMove={interactive ? handleMove : undefined}
        onPointerLeave={interactive ? handleLeave : undefined}
        style={{ ["--tier"]: art.color } as CSSProperties}
        className="relative flex h-full flex-col items-center overflow-hidden rounded-md border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel)_90%,transparent),var(--bg))] px-6 pb-6 pt-8 text-center transition-transform duration-200 ease-out will-change-transform hover:border-[color-mix(in_srgb,var(--tier)_55%,var(--line-strong))]"
      >
        {/* top hairline lights up on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--tier), transparent)",
          }}
        />
        {/* glow pool behind the medal, intensifies on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-7 h-40 w-40 -translate-x-1/2 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in srgb, var(--tier) 60%, transparent), transparent)",
          }}
        />
        <div ref={floatRef} className="relative">
          <Image
            src={art.src}
            alt=""
            width={200}
            height={244}
            sizes="(max-width: 640px) 42vw, 190px"
            className="h-auto w-36 mix-blend-lighten sm:w-44"
            style={{
              filter:
                "drop-shadow(0 10px 16px color-mix(in srgb, var(--tier) 32%, transparent))",
            }}
          />
        </div>
        <span
          className="mt-4 font-hud text-[10px] uppercase tracking-[0.28em]"
          style={{ color: "var(--tier)" }}
        >
          {art.tier}
        </span>
        <p className="mt-2 font-display text-base leading-snug text-[var(--text)]">
          {win.label}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
          {win.detail}
        </p>
      </div>
    </li>
  );
}

/** Thin accent bar under a stat that draws in from the left on scroll. */
function DrawBar({ color }: { color: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          gsap.to(el, {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.15,
          });
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="mt-3 block h-[2px] w-full origin-left rounded-full"
      style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
    />
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

        {/* Wins as an interactive medal showcase */}
        <span className="mt-9 block font-hud text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          Podium finishes
        </span>
        <Stagger className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wins.map((w, i) => (
            <MedalCard key={w.label} win={w} index={i} />
          ))}
        </Stagger>

        {/* Stats as big count-up numbers */}
        <span className="mt-14 block font-hud text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          By the numbers
        </span>
        <Stagger className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => {
            const parts = parseStat(s.label);
            const color = i === 0 ? "var(--forerunner)" : "var(--accent)";
            return (
              <li key={s.label} className="group">
                <div
                  className="flex h-full flex-col rounded-md border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_55%,transparent)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--stat)] hover:shadow-[0_0_40px_-18px_var(--stat)]"
                  style={{ ["--stat"]: color } as CSSProperties}
                >
                  {parts?.pre && (
                    <span className="font-hud text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {parts.pre}
                    </span>
                  )}
                  <span
                    className="mt-1 font-display text-5xl leading-none md:text-6xl"
                    style={{
                      color,
                      textShadow: `0 0 28px color-mix(in srgb, ${color} 38%, transparent)`,
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
                  <DrawBar color={color} />
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
        <span className="mt-14 block font-hud text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          Certifications
        </span>
        <Stagger className="mt-5 flex flex-wrap gap-2.5" y={16}>
          {certs.map((c) => (
            <li key={c.label}>
              <div className="group inline-flex items-center gap-2.5 rounded-md border border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--panel)_55%,transparent)] px-3.5 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:shadow-[0_0_30px_-16px_var(--accent)]">
                <span className="transition-transform duration-300 group-hover:scale-110">
                  <ClearanceIcon />
                </span>
                <div className="leading-tight">
                  <span className="block font-hud text-xs uppercase tracking-[0.08em] text-[var(--text)] transition-colors duration-300 group-hover:text-[var(--accent)]">
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
