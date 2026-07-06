"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { audioState } from "@/lib/audio";
import { useHydrated, useReducedMotion } from "@/lib/motion";

const NAME = "STEPHEN SOOKRA";
const PANELS = 5;

/**
 * Cinematic entry: the name reveals over a bar, then a multi-panel curtain
 * wipes upward to unveil the site (adapted from the daveholloway.uk loader).
 * Plays once per session; skipped entirely under reduced motion.
 */
export function Boot() {
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [dismissed, setDismissed] = useState(false);

  const alreadyBooted =
    hydrated && typeof window !== "undefined"
      ? sessionStorage.getItem("booted") === "1"
      : false;
  const visible = hydrated && !alreadyBooted && !dismissed && !reduced;

  // Mark booted + init audio once we skip (reduced / already seen).
  useEffect(() => {
    if (hydrated && (reduced || alreadyBooted)) {
      audioState.init();
    }
  }, [hydrated, reduced, alreadyBooted]);

  useEffect(() => {
    if (!visible || !root.current) return;
    audioState.init();
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("booted", "1");
          document.body.style.overflow = "";
          setDismissed(true);
        },
      });
      tl.from(".boot-letter", {
        yPercent: 120,
        opacity: 0,
        duration: 0.7,
        ease: "power4.out",
        stagger: 0.035,
      });
      tl.fromTo(
        ".boot-bar",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: "power2.inOut",
          onUpdate() {
            if (pctRef.current) {
              pctRef.current.textContent =
                Math.round(this.progress() * 100) + "%";
            }
          },
        },
        "-=0.25"
      );
      tl.to(".boot-center", { opacity: 0, duration: 0.35 }, "+=0.15");
      tl.to(
        ".boot-panel",
        {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          stagger: 0.07,
        },
        "-=0.1"
      );
    }, root);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[200] overflow-hidden">
      {/* curtain panels */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: PANELS }).map((_, i) => (
          <div key={i} className="boot-panel h-full flex-1 bg-[#05070a]" />
        ))}
      </div>

      {/* center content */}
      <div className="boot-center absolute inset-0 flex flex-col items-center justify-center gap-6 px-6">
        <h2 className="flex overflow-hidden font-display text-4xl text-[var(--text)] md:text-6xl">
          {Array.from(NAME).map((ch, i) => (
            <span key={i} className="boot-letter inline-block">
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h2>
        <div className="flex w-64 items-center gap-3">
          <div className="h-px flex-1 overflow-hidden bg-[var(--line)]">
            <div className="boot-bar h-px w-full origin-left bg-[var(--accent)]" />
          </div>
          <span
            ref={pctRef}
            className="font-hud text-xs tabular-nums text-[var(--muted)]"
          >
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
