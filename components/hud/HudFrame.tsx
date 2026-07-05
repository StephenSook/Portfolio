import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  label?: string;
  className?: string;
  /** CSS color for the corner brackets + label. Sets local --accent. */
  accent?: string;
  as?: "div" | "section" | "article";
};

/** Bracketed HUD panel. Corner ticks + optional micro-label, all in --accent. */
export function HudFrame({
  children,
  label,
  className,
  accent,
  as = "div",
}: Props) {
  return React.createElement(
    as,
    {
      className: cn("hud-frame rounded-sm", className),
      style: accent
        ? ({ "--accent": accent } as React.CSSProperties)
        : undefined,
    },
    label
      ? React.createElement(
          "span",
          {
            key: "label",
            className: "hud-label absolute -top-2 left-3 bg-[var(--bg)] px-2",
          },
          label
        )
      : null,
    children
  );
}
