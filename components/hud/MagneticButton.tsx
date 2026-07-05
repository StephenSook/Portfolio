"use client";

import { useRef } from "react";
import { useReducedMotion, useCoarsePointer } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

/** Button/link with a magnetic hover pull. Static under reduced motion / touch. */
export function MagneticButton({
  children,
  href,
  onClick,
  className,
  external,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const still = reduced || coarse;

  const onMove = (e: React.MouseEvent) => {
    if (still || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 px-6 py-3",
    "font-hud text-sm uppercase tracking-[0.18em] text-[var(--text)]",
    "border border-[var(--line-strong)] rounded-sm transition-colors duration-300",
    "hover:border-[var(--accent)] hover:text-[var(--accent)]",
    "will-change-transform",
    className
  );

  const inner = (
    <>
      <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[var(--accent)]/10 transition-transform duration-300 group-hover:scale-x-100" />
      {children}
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className={classes}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={classes}
    >
      {inner}
    </button>
  );
}
