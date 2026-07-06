import Link from "next/link";
import type { Metadata } from "next";
import { AimTrainer } from "@/components/lab/AimTrainer";
import { HeroShader } from "@/components/three/HeroShader";
import { KineticText } from "@/components/hud/KineticText";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "A playground of interactive experiments from Stephen Sookra. Play a Spartan aim drill and drag a live WebGL energy field.",
};

export default function LabPage() {
  return (
    <main
      id="main"
      className="mx-auto w-full max-w-5xl px-6 py-24 md:py-32"
      style={{ ["--accent"]: "#8dff5a" } as React.CSSProperties}
    >
      <Link
        href="/"
        className="hud-label transition-colors hover:text-[var(--text)]"
      >
        ← HOME
      </Link>

      <div className="mt-6">
        <span className="hud-label">PLAYGROUND // THE LAB</span>
        <KineticText
          as="h1"
          text="The Lab"
          onScroll
          className="mt-3 font-display text-6xl text-[var(--text)] md:text-8xl"
        />
        <p className="mt-4 max-w-xl text-[var(--muted)]">
          The stuff I build for fun. No case studies here, just things to click.
        </p>
      </div>

      {/* Experiment 1: aim trainer */}
      <section className="mt-14">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-[var(--text)]">
            01 · Spartan Training
          </h2>
          <span className="hud-label">reaction drill</span>
        </div>
        <AimTrainer />
      </section>

      {/* Experiment 2: live WebGL ring */}
      <section className="mt-16">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-[var(--text)]">
            02 · Energy Field
          </h2>
          <span className="hud-label">live WebGL</span>
        </div>
        <div className="hud-frame relative h-[440px] overflow-hidden rounded-sm">
          <HeroShader />
          <div className="pointer-events-none absolute bottom-4 left-4">
            <span className="hud-label">
              GLSL fragment shader // domain-warped noise, Bayer dither, mouse-reactive
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
