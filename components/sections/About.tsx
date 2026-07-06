"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from "react-icons/fi";
import { KineticText } from "@/components/hud/KineticText";
import { profile } from "@/data/profile";

const STATS = [
  { k: "GPA", v: profile.education.gpa },
  { k: "Class", v: "KSU CS, 2028" },
  { k: "Record", v: "7 top-3 finishes" },
  { k: "Base", v: profile.location },
];

const AFFILIATIONS = [
  "Kennesaw State University",
  "XR Dojo",
  "JPMorganChase",
  "SMASH Academy",
  "KSU ASCEND",
  "CodePath",
];

export default function About() {
  const paragraphs = profile.bio.split("\n\n");

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden py-24 md:py-36"
      style={{ ["--accent"]: "#8dff5a" } as CSSProperties}
    >
      <div className="mx-auto max-w-6xl px-6">
        <span className="hud-label text-[var(--muted)]">About — who I am</span>

        <div className="mt-10 grid gap-12 md:mt-14 md:grid-cols-[1.35fr_0.9fr] md:gap-16">
          {/* left: story */}
          <div>
            <KineticText
              as="h2"
              text="Student, builder, engineer."
              onScroll
              className="font-display text-4xl leading-[1.05] text-[var(--text)] md:text-6xl"
            />

            <div className="mt-8 space-y-5 text-lg leading-relaxed text-[var(--muted)] md:text-xl">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* clean stat row */}
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[var(--line)] pt-8 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.k}>
                  <dt className="hud-label mb-1 text-[var(--muted)]">{s.k}</dt>
                  <dd className="font-display text-xl text-[var(--text)] md:text-2xl">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>

            {/* links */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {[
                { href: profile.github, Icon: FiGithub, label: "GitHub" },
                { href: profile.linkedin, Icon: FiLinkedin, label: "LinkedIn" },
                { href: `mailto:${profile.email}`, Icon: FiMail, label: "Email" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-4 py-2 font-hud text-xs uppercase tracking-[0.14em] text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <Icon size={14} />
                  {label}
                  <FiArrowUpRight
                    size={12}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* right: clean headshot */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-[var(--line)]">
              <Image
                src="/personal/headshot.jpg"
                alt="Stephen Sookra"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
            </div>
            <p className="hud-label mt-4 text-right text-[var(--muted)]">
              Atlanta, GA
            </p>
          </div>
        </div>
      </div>

      {/* experience marquee */}
      <div className="mt-20 border-y border-[var(--line)] py-6">
        <p className="mx-auto mb-4 max-w-6xl px-6 hud-label text-[var(--muted)]">
          Experience &amp; affiliations
        </p>
        <div className="flex overflow-hidden">
          <ul className="flex shrink-0 animate-[marquee-l_34s_linear_infinite] items-center gap-12 pr-12 motion-reduce:animate-none motion-reduce:flex-wrap">
            {[...AFFILIATIONS, ...AFFILIATIONS].map((a, i) => (
              <li
                key={i}
                className="font-display text-2xl text-[var(--muted)] md:text-3xl"
              >
                {a}
                <span className="ml-12 text-[var(--accent)]/40">✦</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
