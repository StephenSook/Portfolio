"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";

type Phase = "idle" | "playing" | "done";
type Target = { x: number; y: number; born: number; life: number; r: number };

const GAME_MS = 20000;
const W = 900;
const H = 480;

/** A small Halo-flavored reaction aim trainer. Real, playable, self-contained. */
export function AimTrainer() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [shots, setShots] = useState(0);
  const [best, setBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_MS);

  const state = useRef({ targets: [] as Target[], start: 0, nextSpawn: 0, seed: 1 });

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem("aim-best") || "0"));
    } catch {
      /* ignore */
    }
  }, []);

  const rand = () => {
    // deterministic-ish PRNG seeded from a mutable counter; fine for gameplay.
    const s = state.current;
    s.seed = (s.seed * 1664525 + 1013904223) % 4294967296;
    return s.seed / 4294967296;
  };

  const spawn = (now: number) => {
    const r = 26 + rand() * 20;
    state.current.targets.push({
      x: r + rand() * (W - 2 * r),
      y: r + rand() * (H - 2 * r),
      born: now,
      life: 1100 + rand() * 500,
      r,
    });
  };

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, now: number) => {
      ctx.clearRect(0, 0, W, H);
      // backdrop grid
      ctx.strokeStyle = "rgba(141,255,90,0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 45) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y += 45) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      for (const t of state.current.targets) {
        const age = (now - t.born) / t.life;
        const rr = t.r * (1 - age * 0.35);
        ctx.beginPath();
        ctx.arc(t.x, t.y, rr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(141,255,90,0.14)";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#8dff5a";
        ctx.stroke();
        // reticle
        ctx.beginPath();
        ctx.arc(t.x, t.y, rr * 0.42, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(245,179,60,0.9)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    },
    []
  );

  useEffect(() => {
    if (phase !== "playing") return;
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const s = state.current;
    s.targets = [];
    s.start = performance.now();
    s.nextSpawn = s.start;
    setScore(0);
    setHits(0);
    setShots(0);

    let raf = 0;
    const loop = (now: number) => {
      const elapsed = now - s.start;
      setTimeLeft(Math.max(0, GAME_MS - elapsed));
      if (now >= s.nextSpawn) {
        spawn(now);
        s.nextSpawn = now + 620;
      }
      s.targets = s.targets.filter((t) => now - t.born < t.life);
      draw(ctx, now);
      if (elapsed < GAME_MS) {
        raf = requestAnimationFrame(loop);
      } else {
        setPhase("done");
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    setScore((sc) => {
      try {
        if (sc > Number(localStorage.getItem("aim-best") || "0")) {
          localStorage.setItem("aim-best", String(sc));
          setBest(sc);
        }
      } catch {
        /* ignore */
      }
      return sc;
    });
  }, [phase]);

  const onClick = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "playing") return;
    const el = canvas.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    setShots((n) => n + 1);
    const now = performance.now();
    let hit = false;
    for (let i = state.current.targets.length - 1; i >= 0; i--) {
      const t = state.current.targets[i];
      if ((x - t.x) ** 2 + (y - t.y) ** 2 <= t.r * t.r) {
        state.current.targets.splice(i, 1);
        const speed = 1 - (now - t.born) / t.life; // faster = more points
        setScore((sc) => sc + Math.round(50 + speed * 100));
        setHits((n) => n + 1);
        hit = true;
        break;
      }
    }
    if (!hit) setScore((sc) => Math.max(0, sc - 15));
  };

  const acc = shots > 0 ? Math.round((hits / shots) * 100) : 0;

  if (reduced) {
    return (
      <div className="hud-frame rounded-sm p-8 text-center">
        <p className="hud-label mb-2">Spartan Training</p>
        <p className="text-sm text-[var(--muted)]">
          This one needs motion, so it stays parked while reduced motion is on.
          Flip the setting off to run the drill.
        </p>
      </div>
    );
  }

  return (
    <div className="hud-frame rounded-sm p-4 md:p-6" style={{ ["--accent"]: "#8dff5a" } as React.CSSProperties}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span className="hud-label">Spartan Training // aim drill</span>
        <div className="flex gap-5 font-hud text-sm">
          <span className="text-[var(--muted)]">
            SCORE <span className="text-[var(--accent)]">{score}</span>
          </span>
          <span className="text-[var(--muted)]">
            ACC <span className="text-[var(--text)]">{acc}%</span>
          </span>
          <span className="text-[var(--muted)]">
            BEST <span className="text-[var(--forerunner)]">{best}</span>
          </span>
          <span className="text-[var(--muted)]">
            {(timeLeft / 1000).toFixed(1)}s
          </span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvas}
          width={W}
          height={H}
          onPointerDown={onClick}
          className="w-full cursor-crosshair rounded-sm border border-[var(--line)] bg-[#04060a] [aspect-ratio:900/480]"
          data-cursor
        />
        {phase !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--bg)]/70 backdrop-blur-sm">
            {phase === "done" && (
              <p className="font-display text-4xl text-[var(--text)]">
                {score} <span className="text-[var(--muted)] text-lg">pts</span>
              </p>
            )}
            <button
              type="button"
              onClick={() => setPhase("playing")}
              className="font-hud rounded-sm border border-[var(--accent)] px-6 py-3 text-sm uppercase tracking-[0.18em] text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
            >
              {phase === "done" ? "Run it back" : "Start drill"}
            </button>
            <p className="max-w-xs text-center text-xs text-[var(--muted)]">
              Twenty seconds. Click the reticles before they fade. Faster hits
              score more.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
