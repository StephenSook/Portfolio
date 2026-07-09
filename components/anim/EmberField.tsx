"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useCoarsePointer, useHydrated, useReducedMotion } from "@/lib/motion";

/**
 * Voxel ember particles for the hero. On mount the bust's alpha channel is
 * sampled once into a table of silhouette-edge points, so embers spawn along
 * the actual figure outline: drifting up off it ambiently, pouring down it
 * while the figure is hovered. Draws axis-aligned voxel cores plus
 * pre-rendered radial glow sprites under a single "lighter" pass (no
 * shadowBlur), DPR-clamped, paused offscreen / hidden tab. Never mounts on
 * touch or under reduced motion.
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: number; // palette index
  cascade: boolean;
};

type EdgePoint = { nx: number; ny: number };

const AMBIENT_CAP = 90;
const HOVER_CAP = 240;
const BUST_SRC = "/personal/bust-green.webp";

function readPalette(): string[] {
  const cs = getComputedStyle(document.documentElement);
  const gold = cs.getPropertyValue("--forerunner").trim() || "#f5b33c";
  const energy = cs.getPropertyValue("--energy").trim() || "#8dff5a";
  // ember orange carries the fire read; gold and the theme energy accent it
  return ["#ff8a3d", "#ff8a3d", gold, gold, energy, "#ffe9c4"];
}

/** One soft radial glow sprite per palette color, blitted behind each core. */
function buildSprites(palette: string[]): HTMLCanvasElement[] {
  return palette.map((color) => {
    const c = document.createElement("canvas");
    c.width = 32;
    c.height = 32;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, color);
    grad.addColorStop(0.35, color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
    return c;
  });
}

/**
 * Sample the bust cutout's alpha channel on a coarse grid and keep opaque
 * pixels that touch a transparent neighbour: the silhouette edge, in
 * normalized image coordinates.
 */
async function sampleSilhouette(src: string): Promise<EdgePoint[]> {
  const img = new Image();
  img.src = src;
  await img.decode();
  const W = 96;
  const H = Math.round((img.naturalHeight / img.naturalWidth) * W);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(img, 0, 0, W, H);
  const data = g.getImageData(0, 0, W, H).data;
  const a = (x: number, y: number) =>
    x < 0 || y < 0 || x >= W || y >= H ? 0 : data[(y * W + x) * 4 + 3];
  const points: EdgePoint[] = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (a(x, y) > 120) {
        if (a(x - 1, y) < 40 || a(x + 1, y) < 40 || a(x, y - 1) < 40 || a(x, y + 1) < 40) {
          points.push({ nx: x / W, ny: y / H });
        }
      }
    }
  }
  return points;
}

export function EmberField({
  figureRef,
  hoverRef,
}: {
  figureRef: RefObject<HTMLElement | null>;
  hoverRef: RefObject<boolean>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const hydrated = useHydrated();
  const active = hydrated && !reduced && !coarse;

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let palette = readPalette();
    let sprites = buildSprites(palette);
    const themeWatch = new MutationObserver(() => {
      palette = readPalette();
      sprites = buildSprites(palette);
    });
    themeWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let edges: EdgePoint[] = [];
    let disposed = false;
    sampleSilhouette(BUST_SRC)
      .then((pts) => {
        if (!disposed) edges = pts;
      })
      .catch(() => {
        /* bounding-box fallback below keeps working */
      });

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Figure bounds in host coordinates, refreshed occasionally.
    let fig = { left: w * 0.72, top: h * 0.24, width: w * 0.28, height: h * 0.76 };
    const syncFigure = () => {
      const el = figureRef.current;
      if (!el) return;
      const fr = el.getBoundingClientRect();
      const hr = host.getBoundingClientRect();
      fig = {
        left: fr.left - hr.left,
        top: fr.top - hr.top,
        width: fr.width,
        height: fr.height,
      };
    };
    syncFigure();

    const particles: Particle[] = [];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    /** A spawn point on the silhouette (or bounding-box fallback). */
    const edgeSpot = (topBias: boolean): { x: number; y: number } => {
      if (edges.length) {
        // cascade wants the hood: bias toward points in the upper half
        for (let tries = 0; tries < 4; tries++) {
          const p = edges[(Math.random() * edges.length) | 0];
          if (!topBias || p.ny < 0.55 || tries === 3) {
            return {
              x: fig.left + p.nx * fig.width + rand(-3, 3),
              y: fig.top + p.ny * fig.height + rand(-3, 3),
            };
          }
        }
      }
      return {
        x: rand(fig.left - 20, fig.left + fig.width * 0.4),
        y: topBias
          ? rand(fig.top, fig.top + fig.height * 0.35)
          : rand(fig.top + fig.height * 0.1, fig.top + fig.height),
      };
    };

    const spawnAmbient = () => {
      // mostly off the silhouette, a few from the screen's right edge
      const offEdge = Math.random() < 0.85;
      const spot = offEdge
        ? edgeSpot(false)
        : { x: rand(w - 70, w - 6), y: rand(h * 0.15, h * 0.9) };
      particles.push({
        x: spot.x,
        y: spot.y,
        vx: rand(-0.7, -0.1),
        vy: rand(-1.15, -0.3),
        size: rand(2.5, 7.5),
        life: 0,
        maxLife: rand(90, 200),
        color: (Math.random() * palette.length) | 0,
        cascade: false,
      });
    };

    const spawnCascade = () => {
      // fire pouring down the silhouette from the hood
      const spot = edgeSpot(true);
      particles.push({
        x: spot.x,
        y: spot.y,
        vx: rand(-0.4, 0.4),
        vy: rand(1.2, 3.0),
        size: rand(2, 6.5),
        life: 0,
        maxLife: rand(45, 110),
        color: (Math.random() * palette.length) | 0,
        cascade: true,
      });
    };

    let raf = 0;
    let running = false;
    let frame = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      frame++;
      if (frame % 90 === 0) syncFigure();

      const hovering = hoverRef.current;
      const cap = hovering ? HOVER_CAP : AMBIENT_CAP;
      if (hovering) {
        for (let s = 0; s < 5 && particles.length < cap; s++) {
          if (Math.random() < 0.72) spawnCascade();
          else spawnAmbient();
        }
      } else if (particles.length < cap && Math.random() < 0.75) {
        spawnAmbient();
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.cascade) p.vy += 0.035; // gravity on the pour
        else p.vy -= 0.004; // ambient embers keep lifting

        const t = p.life / p.maxLife;
        const fade = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        const flicker = 0.82 + Math.random() * 0.18;
        const s = p.size * (1 - t * 0.5);
        const x = p.x | 0;
        const y = p.y | 0;

        // soft glow sprite behind an axis-aligned voxel core
        ctx.globalAlpha = Math.max(0, fade * flicker * 0.4);
        const g = s * 3.2;
        ctx.drawImage(sprites[p.color], x - g / 2, y - g / 2, g, g);
        ctx.globalAlpha = Math.max(0, fade * flicker * 0.95);
        ctx.fillStyle = palette[p.color];
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden) stop();
      else if (canvas.getBoundingClientRect().bottom > 0) start();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      themeWatch.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [active, figureRef, hoverRef]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[16]"
    />
  );
}
