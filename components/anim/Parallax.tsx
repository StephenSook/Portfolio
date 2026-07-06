"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Net vertical travel across the viewport pass, in px. Negative = faster up. */
  distance?: number;
};

/**
 * Scrub-linked parallax (decorative only, so a missed trigger just leaves the
 * element still). ease: none, transform-only, reduced-motion safe.
 */
export function Parallax({ children, className, distance = -60 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: -distance / 2 },
        {
          y: distance / 2,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [reduced, distance]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
