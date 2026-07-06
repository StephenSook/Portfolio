"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiArrowRight } from "react-icons/fi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { MagneticButton } from "@/components/hud/MagneticButton";
import { useCoarsePointer, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const featured = projects.filter((p) => p.tier === "featured");
const archiveCount = projects.filter((p) => p.tier === "archive").length;

function ProjectCard({ p, active }: { p: Project; active: number }) {
  const card = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();

  // 3D entrance on each project change.
  useEffect(() => {
    if (reduced || coarse || !card.current) return;
    gsap.fromTo(
      card.current,
      { rotateY: -32, y: 24, opacity: 0 },
      { rotateY: 0, y: 0, opacity: 1, duration: 0.75, ease: "power3.out" }
    );
  }, [active, reduced, coarse]);

  const onMove = (e: React.MouseEvent) => {
    if (reduced || coarse || !card.current) return;
    const r = card.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width;
    const y = (e.clientY - (r.top + r.height / 2)) / r.height;
    card.current.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`;
  };
  const reset = () => {
    if (card.current) card.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[560px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <div
        ref={card}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[var(--line-strong)] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)] transition-transform duration-300 will-change-transform [transform-style:preserve-3d]"
        style={{ ["--accent"]: "#8dff5a" } as CSSProperties}
      >
        <video
          key={active}
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
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[var(--accent)]/25" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/85 to-transparent p-5">
          <span className="font-display text-3xl text-white md:text-4xl">
            {p.name}
          </span>
          {p.outcome?.place && (
            <span className="font-hud text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
              {p.outcome.place}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoPanel({ p }: { p: Project }) {
  return (
    <div key={p.slug} className="animate-[word-in_0.55s_cubic-bezier(0.16,1,0.3,1)]">
      <span className="hud-label text-[var(--muted)]">
        {p.role || "Project"} — {p.dates}
      </span>
      <h3 className="mt-2 font-display text-4xl leading-tight text-[var(--text)] md:text-5xl">
        {p.name}
      </h3>
      <p className="mt-4 max-w-sm text-[var(--muted)]">{p.tagline}</p>

      {p.outcome && (
        <div className="mt-5">
          <span className="hud-label text-[var(--muted)]">Result</span>
          <p className="mt-1 font-display text-lg text-[var(--accent)]">
            {p.outcome.place ? `${p.outcome.place} — ` : ""}
            {p.outcome.event}
          </p>
        </div>
      )}

      <ul className="mt-5 flex flex-wrap gap-2">
        {p.stack.slice(0, 5).map((t) => (
          <li
            key={t}
            className="rounded-sm border border-[var(--line)] px-2 py-1 font-hud text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]"
          >
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap gap-3">
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

export function ProjectsCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const coarse = useCoarsePointer();
  const reduced = useReducedMotion();

  // Pin the section and step the active project through scroll, with snap.
  useEffect(() => {
    if (coarse || reduced || !sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const n = featured.length;
    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => "+=" + window.innerHeight * (n - 1) * 1.15,
        pin: true,
        anticipatePin: 1,
        snap: {
          snapTo: (v) => Math.round(v * (n - 1)) / (n - 1),
          duration: { min: 0.2, max: 0.5 },
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
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

  const goTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const n = featured.length;
    const top = st.start + (i / (n - 1)) * (st.end - st.start);
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Mobile / reduced motion: a simple stacked list (no pin).
  if (coarse || reduced) {
    return (
      <section id="work" className="mx-auto max-w-6xl px-6 py-24">
        <span className="hud-label text-[var(--muted)]">Selected work</span>
        <h2 className="mt-3 font-display text-5xl text-[var(--text)]">Work</h2>
        <div className="mt-10 flex flex-col gap-14">
          {featured.map((p, i) => (
            <div key={p.slug}>
              <ProjectCard p={p} active={i} />
              <div className="mt-6">
                <InfoPanel p={p} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-14">
          <MagneticButton href="/work" className="px-6 py-3 text-xs">
            View all work ({archiveCount} more)
          </MagneticButton>
        </div>
      </section>
    );
  }

  const p = featured[active];

  return (
    <section id="work" ref={sectionRef} className="relative h-svh w-full overflow-hidden">
      <div className="flex h-full w-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="hud-label text-[var(--muted)]">Selected work</span>
              <h2 className="mt-1 font-display text-4xl text-[var(--text)] md:text-5xl">
                Work
              </h2>
            </div>
            <span className="font-hud text-sm text-[var(--muted)]">
              {String(active + 1).padStart(2, "0")}{" "}
              <span className="opacity-40">/ {String(featured.length).padStart(2, "0")}</span>
            </span>
          </div>

          <div className="grid grid-cols-[auto_1.2fr_1fr] items-center gap-10">
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

            <ProjectCard p={p} active={active} />

            <InfoPanel p={p} />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <span className="hud-label text-[var(--muted)]">Scroll to step through</span>
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
