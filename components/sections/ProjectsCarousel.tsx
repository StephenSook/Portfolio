"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiArrowRight } from "react-icons/fi";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { MagneticButton } from "@/components/hud/MagneticButton";
import { useCoarsePointer, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const featured = projects.filter((p) => p.tier === "featured");
const archiveCount = projects.filter((p) => p.tier === "archive").length;

/** The tilting card with the project's live-site video preview. */
function ProjectCard({ p, active }: { p: Project; active: number }) {
  const card = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();

  const onMove = (e: React.MouseEvent) => {
    if (reduced || coarse || !card.current) return;
    const r = card.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width;
    const y = (e.clientY - (r.top + r.height / 2)) / r.height;
    card.current.style.transform = `perspective(1200px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };
  const reset = () => {
    if (card.current)
      card.current.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[560px]"
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <div
        ref={card}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-[var(--line-strong)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] transition-transform duration-300 will-change-transform"
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
        {/* frame glow + label */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[var(--accent)]/20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-5">
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
    <div
      key={p.slug}
      className="animate-[word-in_0.5s_cubic-bezier(0.16,1,0.3,1)]"
    >
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
  const [active, setActive] = useState(0);
  const coarse = useCoarsePointer();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || coarse) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const prog = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        setActive(Math.round(prog * (featured.length - 1)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [coarse]);

  const scrollTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + (i / (featured.length - 1)) * total;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Mobile: a simple stacked list of cards (no pinning).
  if (coarse) {
    return (
      <section id="work" className="mx-auto max-w-6xl px-6 py-24">
        <span className="hud-label text-[var(--muted)]">Selected work</span>
        <h2 className="mt-3 font-display text-5xl text-[var(--text)]">Work</h2>
        <div className="mt-10 flex flex-col gap-12">
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
    <section
      id="work"
      ref={sectionRef}
      style={{ height: `${featured.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="hud-label text-[var(--muted)]">
                Selected work
              </span>
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
            {/* left numbered nav */}
            <ul className="flex flex-col gap-3">
              {featured.map((f, i) => (
                <li key={f.slug}>
                  <button
                    type="button"
                    onClick={() => scrollTo(i)}
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

            {/* center card */}
            <ProjectCard p={p} active={active} />

            {/* right info */}
            <InfoPanel p={p} />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <span className="hud-label text-[var(--muted)]">Scroll to explore</span>
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
