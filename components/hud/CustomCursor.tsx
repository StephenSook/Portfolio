"use client";

import { useEffect, useRef } from "react";
import { useCoarsePointer, useReducedMotion } from "@/lib/motion";

/**
 * A small energy reticle that follows the pointer on fine-pointer devices.
 * Adds body.custom-cursor (which hides the native cursor via globals.css).
 * Never active on touch or under reduced motion.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();
  const reduced = useReducedMotion();
  const off = coarse || reduced;

  useEffect(() => {
    if (off) return;
    document.body.classList.add("custom-cursor");

    let rx = 0;
    let ry = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      const target = e.target as HTMLElement;
      const interactive = !!target.closest("a, button, [role='button'], input, [data-cursor]");
      if (ring.current) {
        ring.current.dataset.hot = interactive ? "1" : "0";
      }
    };
    const follow = () => {
      if (ring.current) {
        const el = ring.current;
        const tx = parseFloat(el.dataset.tx || "0");
        const ty = parseFloat(el.dataset.ty || "0");
        rx += (tx - rx) * 0.18;
        ry += (ty - ry) * 0.18;
        el.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      raf = requestAnimationFrame(follow);
    };
    const store = (e: MouseEvent) => {
      if (ring.current) {
        ring.current.dataset.tx = String(e.clientX);
        ring.current.dataset.ty = String(e.clientY);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousemove", store);
    raf = requestAnimationFrame(follow);

    return () => {
      document.body.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", store);
      cancelAnimationFrame(raf);
    };
  }, [off]);

  if (off) return null;

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[250] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
      />
      <div
        ref={ring}
        aria-hidden
        data-hot="0"
        className="pointer-events-none fixed left-0 top-0 z-[250] -ml-4 -mt-4 h-8 w-8 rounded-full border border-[var(--accent)]/60 transition-[width,height,opacity] duration-200 data-[hot=1]:h-12 data-[hot=1]:w-12 data-[hot=1]:-ml-6 data-[hot=1]:-mt-6"
      />
    </>
  );
}
