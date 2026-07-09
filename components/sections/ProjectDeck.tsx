"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiArrowRight } from "react-icons/fi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { useCoarsePointer, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const featured = projects.filter((p) => p.tier === "featured");
const archiveCount = projects.filter((p) => p.tier === "archive").length;

/** Scroll distance per card step, in viewport-heights. Short = one flick. */
const STEP_VH = 0.55;

type Rarity = { name: string; color: string };

/**
 * Card rarity derived from the podium result, trading-card style:
 * 1st = Legendary (gold), 2nd = Epic (silver), 3rd = Rare (bronze),
 * anything else (founding work) = Founder (green).
 */
function rarityOf(p: Project): Rarity {
  const place = p.outcome?.place ?? "";
  if (place.startsWith("1st")) return { name: "Legendary", color: "var(--forerunner)" };
  if (place.startsWith("2nd")) return { name: "Epic", color: "#c8d2dc" };
  if (place.startsWith("3rd")) return { name: "Rare", color: "#d08b52" };
  return { name: "Founder", color: "var(--energy)" };
}

/**
 * The card face: a full trading card. Foil rim tinted by rarity, project
 * preview video as the art window, name plate, stack chips as abilities and a
 * pointer-tracked holo sheen + 3D tilt on fine pointers. All pointer motion is
 * written straight to the element (no React state per frame).
 */
function TradingCard({
  p,
  index,
  total,
  interactive,
}: {
  p: Project;
  index: number;
  total: number;
  interactive: boolean;
}) {
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const tier = rarityOf(p);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `rotateX(${((py - 0.5) * -10).toFixed(2)}deg) rotateY(${((px - 0.5) * 12).toFixed(2)}deg)`;
    el.style.setProperty("--hx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--hy", `${(py * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      className="group h-full w-full [perspective:1200px]"
      onPointerMove={interactive ? onMove : undefined}
      onPointerLeave={interactive ? onLeave : undefined}
    >
      <div
        ref={tiltRef}
        className="relative h-full w-full rounded-2xl p-[2px] transition-transform duration-200 ease-out will-change-transform [transform-style:preserve-3d]"
        style={
          {
            ["--tier"]: tier.color,
            ["--hx"]: "50%",
            ["--hy"]: "35%",
            background:
              "linear-gradient(165deg, var(--tier) 0%, color-mix(in srgb, var(--tier) 20%, transparent) 26%, var(--tier) 52%, color-mix(in srgb, var(--tier) 14%, transparent) 74%, var(--tier) 100%)",
            boxShadow:
              "0 30px 80px -24px rgba(0,0,0,0.9), 0 0 44px -18px color-mix(in srgb, var(--tier) 55%, transparent)",
          } as CSSProperties
        }
      >
        <div className="relative flex h-full flex-col overflow-hidden rounded-[14px] bg-[#0a0e13]">
          {/* art window */}
          <div className="relative h-[52%] w-full shrink-0 overflow-hidden">
            <video
              key={p.slug}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              poster={p.gallery[0]}
              className="h-full w-full object-cover"
            >
              <source src={`/projects/${p.slug}/preview.webm`} type="video/webm" />
              <source src={`/projects/${p.slug}/preview.mp4`} type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0e13] via-transparent to-black/30" />

            {/* rarity + card number */}
            <span
              className="absolute left-3 top-3 rounded-sm border bg-black/55 px-2 py-1 font-hud text-[9px] uppercase tracking-[0.22em] backdrop-blur-sm"
              style={{ color: "var(--tier)", borderColor: "color-mix(in srgb, var(--tier) 55%, transparent)" }}
            >
              {tier.name}
            </span>
            <span className="absolute right-3 top-3 rounded-sm bg-black/55 px-2 py-1 font-hud text-[9px] tracking-[0.2em] text-[var(--muted)] backdrop-blur-sm">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* name plate */}
          <div className="flex items-baseline justify-between gap-3 border-b border-[var(--line)] px-5 pb-3 pt-4">
            <h3 className="font-display text-2xl leading-none text-[var(--text)] md:text-3xl">
              {p.name}
            </h3>
            {p.outcome?.place && (
              <span
                className="shrink-0 font-hud text-[10px] uppercase tracking-[0.16em]"
                style={{ color: "var(--tier)" }}
              >
                {p.outcome.place}
              </span>
            )}
          </div>

          {/* body */}
          <div className="flex min-h-0 flex-1 flex-col px-5 py-4">
            <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
              {p.tagline}
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {p.stack.slice(0, 4).map((t) => (
                <li
                  key={t}
                  className="rounded-sm border border-[var(--line)] px-2 py-0.5 font-hud text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]"
                >
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between pt-3 font-hud text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
              <span className="line-clamp-1">{p.outcome?.event ?? "Founding initiative"}</span>
              <span className="shrink-0 pl-3">{p.dates}</span>
            </div>
          </div>

          {/* holo sheen: pointer glare + masked rainbow foil */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(420px circle at var(--hx) var(--hy), rgba(255,255,255,0.16), transparent 62%)",
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-color-dodge transition-opacity duration-300 group-hover:opacity-30"
            style={{
              background:
                "linear-gradient(115deg, #ff4d4d 0%, #ffb84d 25%, #8dff5a 50%, #4cc2ff 75%, #b84dff 100%)",
              maskImage:
                "radial-gradient(560px circle at var(--hx) var(--hy), black, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(560px circle at var(--hx) var(--hy), black, transparent 72%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** Face-down card rendered behind the active one so the deck reads as a stack. */
function CardBack({ p, className }: { p: Project; className?: string }) {
  const tier = rarityOf(p);
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 rounded-2xl p-[2px]", className)}
      style={{
        background: `linear-gradient(165deg, color-mix(in srgb, ${tier.color} 45%, transparent), transparent 40%, color-mix(in srgb, ${tier.color} 30%, transparent) 100%)`,
      }}
    >
      <div
        className="grid h-full w-full place-items-center rounded-[14px] border border-[var(--line)] bg-[#080c11]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 14px)",
        }}
      >
        <span className="font-display text-3xl tracking-tight text-white/10">SS</span>
      </div>
    </div>
  );
}

/** Slim side panel: result + actions. The card itself carries the story. */
function InfoPanel({ p }: { p: Project }) {
  const tier = rarityOf(p);
  return (
    <div key={p.slug} className="animate-[word-in_0.55s_cubic-bezier(0.16,1,0.3,1)]">
      <span className="hud-label text-[var(--muted)]">
        {p.role || "Project"} — {p.dates}
      </span>
      {p.outcome ? (
        <p className="mt-3 font-display text-2xl leading-snug md:text-3xl" style={{ color: tier.color }}>
          {p.outcome.place ? `${p.outcome.place} — ` : ""}
          {p.outcome.event}
        </p>
      ) : (
        <p className="mt-3 font-display text-2xl leading-snug text-[var(--text)] md:text-3xl">
          Founder-led, in the field
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/work/${p.slug}`}
          className="inline-flex items-center gap-2 rounded-sm border border-[var(--line-strong)] px-5 py-2.5 font-hud text-xs uppercase tracking-[0.16em] text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Case study <FiArrowRight size={13} />
        </Link>
        {p.links.live && (
          <a
            href={p.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-[var(--accent)] px-5 py-2.5 font-hud text-xs uppercase tracking-[0.16em] text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
          >
            View live <FiArrowUpRight size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

export function ProjectDeck() {
  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const prevRef = useRef(0);
  const [active, setActive] = useState(0);
  const coarse = useCoarsePointer();
  const reduced = useReducedMotion();

  // Pin the deck; every ~half-viewport of scroll snaps to the next card.
  useEffect(() => {
    if (coarse || reduced || !sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const n = featured.length;
    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => "+=" + Math.round(window.innerHeight * (n - 1) * STEP_VH),
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (n - 1),
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: "power2.out",
          directional: true,
        },
        onUpdate: (self) => {
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${self.progress})`;
          }
          const idx = Math.min(n - 1, Math.round(self.progress * (n - 1)));
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [coarse, reduced]);

  // Deal-in animation whenever the active card changes.
  useEffect(() => {
    if (coarse || reduced || !deckRef.current) return;
    const dir = active >= prevRef.current ? 1 : -1;
    prevRef.current = active;
    gsap.fromTo(
      deckRef.current,
      { y: -22 * dir, scale: 0.94, opacity: 0.4, rotate: 2.5 * dir },
      { y: 0, scale: 1, opacity: 1, rotate: 0, duration: 0.5, ease: "power3.out" }
    );
  }, [active, coarse, reduced]);

  const goTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const n = featured.length;
    const top = st.start + (i / (n - 1)) * (st.end - st.start);
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Mobile / reduced motion: static stacked trading cards, native scroll.
  if (coarse || reduced) {
    return (
      <section id="work" className="mx-auto max-w-6xl px-6 py-20">
        <span className="hud-label text-[var(--muted)]">Selected work</span>
        <h2 className="mt-3 font-display text-5xl text-[var(--text)]">Work</h2>
        <div className="mt-10 flex flex-col gap-14">
          {featured.map((p, i) => (
            <div key={p.slug}>
              <div className="mx-auto aspect-[5/7] w-full max-w-[380px]">
                <TradingCard p={p} index={i} total={featured.length} interactive={false} />
              </div>
              <div className="mx-auto mt-6 max-w-[380px]">
                <InfoPanel p={p} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link
            href="/work"
            className="font-hud text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            View all work ({archiveCount} more) →
          </Link>
        </div>
      </section>
    );
  }

  const p = featured[active];
  const n = featured.length;

  return (
    <section id="work" ref={sectionRef} className="relative h-svh w-full overflow-hidden">
      <div className="flex h-full w-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="hud-label text-[var(--muted)]">Selected work</span>
              <h2 className="mt-1 font-display text-4xl text-[var(--text)] md:text-5xl">
                Work
              </h2>
            </div>
            <span className="font-hud text-sm text-[var(--muted)]">
              {String(active + 1).padStart(2, "0")}{" "}
              <span className="opacity-40">/ {String(n).padStart(2, "0")}</span>
            </span>
          </div>

          <div className="grid grid-cols-[auto_minmax(0,1.15fr)_minmax(0,1fr)] items-center gap-10">
            {/* numbered nav */}
            <ul className="flex flex-col gap-3">
              {featured.map((f, i) => (
                <li key={f.slug}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className={cn(
                      "group flex items-center gap-3 text-left transition-opacity",
                      i === active ? "opacity-100" : "opacity-35 hover:opacity-70"
                    )}
                  >
                    <span
                      className={cn(
                        "font-hud text-sm tabular-nums",
                        i === active ? "text-[var(--accent)]" : "text-[var(--muted)]"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "h-px bg-current transition-all duration-300",
                        i === active ? "w-8 text-[var(--accent)]" : "w-3 text-[var(--muted)]"
                      )}
                    />
                    <span className="font-display text-lg text-[var(--text)]">
                      {f.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* the deck: two face-down cards behind, active card in front */}
            <div className="relative mx-auto aspect-[5/7] w-full max-w-[400px]">
              {active + 2 < n && (
                <div className="absolute inset-0 -translate-y-6 scale-[0.9] rotate-[-2.5deg] opacity-25">
                  <CardBack p={featured[active + 2]} />
                </div>
              )}
              {active + 1 < n && (
                <div className="absolute inset-0 -translate-y-3 scale-[0.95] rotate-[2deg] opacity-50">
                  <CardBack p={featured[active + 1]} />
                </div>
              )}
              <div ref={deckRef} className="relative h-full w-full will-change-transform">
                <TradingCard p={p} index={active} total={n} interactive />
              </div>
            </div>

            <InfoPanel p={p} />
          </div>

          <div className="mt-6 flex items-center justify-between gap-6">
            <span className="hud-label text-[var(--muted)]">
              Scroll — one flick per card
            </span>
            {/* deck progress */}
            <span className="relative h-px flex-1 max-w-64 overflow-hidden bg-[var(--line)]">
              <span
                ref={barRef}
                className="absolute inset-0 origin-left scale-x-0 bg-[var(--accent)]"
              />
            </span>
            <Link
              href="/work"
              className="font-hud text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            >
              View all work ({archiveCount} more) →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
