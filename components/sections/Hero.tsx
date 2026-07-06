"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { gsap } from "gsap";
import { MagneticButton } from "@/components/hud/MagneticButton";
import { useReducedMotion } from "@/lib/motion";
import { profile } from "@/data/profile";

function HeroFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(141,255,90,0.12),transparent_55%),#05070a]"
    />
  );
}

// Dithered-portrait WebGL, code-split off the first-paint bundle.
const HeroDither = dynamic(
  () => import("@/components/three/HeroDither").then((m) => m.HeroDither),
  { ssr: false, loading: () => <HeroFallback /> }
);

/** Dark overlay so the headline reads over the dithered portrait. */
function HeroBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#05070a]">
      <HeroDither />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,7,10,0.7)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,10,0.65),transparent_22%,transparent_72%,rgba(5,7,10,0.9))]" />
    </div>
  );
}

const WORDS = ["SYSTEMS", "PRODUCTS", "EXPERIENCES", "TOOLS"];

function RotatingWord() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2800);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <span className="relative inline-block text-[var(--accent)]">
      <span
        key={i}
        className="inline-block animate-[word-in_0.7s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {WORDS[i]}
      </span>
    </span>
  );
}

/** White knockout marquee band (Cortiz technique: bg-white + soft-light blend). */
function Band({ text, reverse }: { text: string; reverse?: boolean }) {
  const reduced = useReducedMotion();
  const items = Array.from({ length: 8 }, () => text);
  return (
    <div className="pointer-events-none w-full overflow-hidden bg-white opacity-[0.55] mix-blend-soft-light">
      <div
        className={
          "flex w-max whitespace-nowrap " +
          (reduced
            ? ""
            : reverse
              ? "animate-[marquee-r_28s_linear_infinite]"
              : "animate-[marquee-l_28s_linear_infinite]")
        }
      >
        {[...items, ...items].map((t, k) => (
          <span
            key={k}
            className="px-6 font-hud text-2xl font-semibold uppercase tracking-[0.12em] text-black md:text-[2.4rem]"
          >
            {t} <span className="opacity-40">—</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !scope.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-in]", {
        opacity: 0,
        filter: "blur(18px)",
        y: 24,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.12,
      });
    }, scope);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="top"
      ref={scope}
      className="relative flex min-h-svh w-full flex-col justify-between overflow-hidden py-6"
    >
      <HeroBackground />

      {/* top bar: wordmark + tag */}
      <div className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6">
        <span
          data-hero-in
          className="font-display text-xl font-semibold tracking-tight text-[var(--text)] md:text-2xl"
        >
          Stephen Sookra
        </span>
        <span data-hero-in className="hud-label hidden text-[var(--muted)] sm:block">
          AI + Full-Stack Engineer
        </span>
      </div>

      {/* top marquee */}
      <div data-hero-in className="relative z-10">
        <Band text="Software Engineer" />
      </div>

      {/* center statement */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 text-center">
        <p data-hero-in className="hud-label mb-6 text-[var(--muted)]">
          Portfolio — 2026
        </p>
        <h1 className="font-display leading-[0.92] text-[var(--text)]">
          <span
            data-hero-in
            className="block text-[13vw] font-light italic text-[var(--text)]/25 md:text-[8rem]"
          >
            Build intelligent
          </span>
          <span
            data-hero-in
            className="block text-[16vw] font-black md:text-[11rem]"
          >
            <RotatingWord />
          </span>
        </h1>

        <div
          data-hero-in
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton
            href="#work"
            className="!border-[var(--accent)] !text-[var(--accent)]"
          >
            View Work
          </MagneticButton>
          <MagneticButton href="#resume">Resume</MagneticButton>
        </div>
      </div>

      {/* bottom: social + marquee */}
      <div className="relative z-20">
        <div
          data-hero-in
          className="mx-auto mb-4 flex w-full max-w-7xl items-center justify-between px-6"
        >
          <div className="flex items-center gap-3">
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
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line-strong)] text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
          <span className="hud-label flex items-center gap-2 text-[var(--muted)]">
            Scroll
            <span className="h-6 w-px animate-pulse bg-[var(--muted)]" />
          </span>
        </div>
        <Band text="Stephen Sookra" reverse />
      </div>
    </section>
  );
}
