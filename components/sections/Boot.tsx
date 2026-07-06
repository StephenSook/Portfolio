"use client";

import { useEffect, useState } from "react";
import { audioState } from "@/lib/audio";
import { useHydrated, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const LOG = [
  "> initializing UNSC interface",
  "> loading operator profile: SPARTAN-SOOKRA",
  "> mounting mission log",
  "> calibrating HUD",
];

export function Boot() {
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const booted =
    hydrated && typeof window !== "undefined"
      ? sessionStorage.getItem("booted") === "1"
      : false;
  const visible = hydrated && !booted && !dismissed;
  const showConsent = reduced || pct >= 100;

  // Progress animation (rAF callback setState is fine; none run synchronously).
  useEffect(() => {
    if (!visible || reduced) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(100, ((t - start) / 1600) * 100);
      setPct(Math.floor(p));
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduced]);

  // Lock scroll while the overlay is up.
  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const finish = (audio: boolean) => {
    audioState.init();
    if (audio) audioState.set(true);
    sessionStorage.setItem("booted", "1");
    setDismissed(true);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--bg)] px-6">
      <p className="hud-label mb-6">System online // SPARTAN-SOOKRA</p>

      <div className="w-full max-w-md">
        <div className="h-px w-full bg-[var(--line)]">
          <div
            className="h-px bg-[var(--accent)] transition-[width] duration-100"
            style={{ width: `${reduced ? 100 : pct}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between font-hud text-xs text-[var(--muted)]">
          <span>
            {LOG[Math.min(LOG.length - 1, Math.floor((pct / 100) * LOG.length))]}
          </span>
          <span>{reduced ? 100 : pct}%</span>
        </div>
      </div>

      <div
        className={cn(
          "mt-10 max-w-sm text-center transition-opacity duration-300",
          showConsent ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <p className="mb-4 text-sm text-[var(--muted)]">
          This experience has ambient audio. You can turn it on now or toggle it
          any time from the top corner.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => finish(true)}
            className="font-hud rounded-sm border border-[var(--accent)] px-5 py-2 text-sm uppercase tracking-[0.16em] text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
          >
            Enable audio
          </button>
          <button
            type="button"
            onClick={() => finish(false)}
            className="font-hud rounded-sm border border-[var(--line-strong)] px-5 py-2 text-sm uppercase tracking-[0.16em] text-[var(--text)] transition-colors hover:border-[var(--accent)]"
          >
            Continue muted
          </button>
        </div>
      </div>
    </div>
  );
}
