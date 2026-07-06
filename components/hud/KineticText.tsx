"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  splitBy?: "char" | "word";
  className?: string;
  /** Delay before the reveal starts, in seconds. */
  delay?: number;
  /** Reveal when scrolled into view rather than on mount. */
  onScroll?: boolean;
};

/**
 * Split reveal. The real text stays accessible via aria-label; the animated
 * per-unit spans are aria-hidden. Content is visible by default (no JS / no
 * observer) and only hides-then-reveals when the animation can actually run,
 * so nothing is ever permanently hidden behind a scroll trigger.
 */
export function KineticText({
  text,
  as = "span",
  splitBy = "char",
  className,
  delay = 0,
  onScroll = false,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const setRef = useCallback((el: HTMLElement | null) => {
    ref.current = el;
  }, []);
  const reduced = useReducedMotion();

  const units = splitBy === "word" ? text.split(/(\s+)/) : Array.from(text);

  useEffect(() => {
    if (reduced || !ref.current) return;
    const inner = ref.current.querySelectorAll<HTMLElement>("[data-unit] > span");
    if (!inner.length) return;

    // Only now (JS present) hide the units, then reveal.
    gsap.set(inner, { yPercent: 115, opacity: 0 });
    const reveal = () =>
      gsap.to(inner, {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.02,
        delay,
      });

    if (!onScroll) {
      reveal();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduced, delay, onScroll, text]);

  const Tag = as;

  return (
    <Tag
      ref={setRef}
      aria-label={text}
      className={cn("inline-block", className)}
    >
      {units.map((u, i) =>
        /\s+/.test(u) ? (
          <span key={i} aria-hidden="true">
            {u}
          </span>
        ) : (
          <span
            key={i}
            data-unit
            aria-hidden="true"
            className="inline-block overflow-hidden align-bottom"
          >
            <span className="inline-block">{u}</span>
          </span>
        )
      )}
    </Tag>
  );
}
