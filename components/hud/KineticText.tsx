"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  splitBy?: "char" | "word";
  className?: string;
  /** Delay before the reveal starts, in seconds. */
  delay?: number;
  /** Trigger on scroll into view rather than on mount. */
  onScroll?: boolean;
};

/**
 * Cortiz-style split reveal. The real text stays accessible via aria-label
 * on the wrapper; the animated per-unit spans are aria-hidden.
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

  const units =
    splitBy === "word" ? text.split(/(\s+)/) : Array.from(text);

  useEffect(() => {
    if (reduced || !ref.current) return;
    const spans = ref.current.querySelectorAll("[data-unit]");
    if (!spans.length) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(spans, {
        yPercent: 115,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.02,
        delay,
        scrollTrigger: onScroll
          ? { trigger: ref.current, start: "top 85%", once: true }
          : undefined,
      });
    }, ref);
    return () => ctx.revert();
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
