"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Rise distance in px. */
  y?: number;
  /** Stagger direct children instead of the wrapper (for grids/lists). */
  stagger?: boolean;
  delay?: number;
};

/**
 * Scroll-in reveal (opacity + rise, power4 easing). Uses IntersectionObserver
 * so content is visible without JS and never stuck hidden behind a scroll
 * trigger. Disabled under reduced motion.
 */
export function Reveal({
  children,
  className,
  y = 42,
  stagger = false,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    const targets = stagger
      ? (Array.from(el.children) as HTMLElement[])
      : [el];
    if (!targets.length) return;

    gsap.set(targets, { opacity: 0, y, force3D: true });
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger: stagger ? 0.09 : 0,
            delay,
            force3D: true,
          });
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, y, stagger, delay]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
