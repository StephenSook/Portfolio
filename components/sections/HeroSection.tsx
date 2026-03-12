"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { TextShimmer } from "@/components/ui/TextShimmer";
import { ShutterText } from "@/components/ui/ShutterText";
import { siteContent } from "@/data/siteContent";

const SceneCanvas = dynamic(() => import("@/components/three/SceneCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#040a14]" />,
});

export default function HeroSection() {
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <SceneCanvas />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Status line */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-cyan-500/50" />
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-400/60">
            System Online
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="h-px w-8 bg-cyan-500/50" />
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <TextShimmer
            as="h1"
            className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
            duration={3}
            spread={3}
          >
            {siteContent.name}
          </TextShimmer>
        </motion.div>

        {/* Tagline — shutter text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-10"
        >
          <ShutterText
            texts={[
              "Software Engineer",
              "AI & ML Specialist",
              "Full Stack Developer",
              "System Builder",
            ]}
            interval={3500}
            className="h-[40px] sm:h-[50px]"
            textClassName="text-lg sm:text-xl md:text-2xl"
          />
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#about"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm p-px transition-shadow hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]"
          >
            <span
              className="absolute inset-[-300%] animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,#0a1628_0%,#00f0ff_50%,#0a1628_100%)]"
              style={{ animationDuration: "4s" }}
            />
            <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-sm bg-cyan-500/10 px-8 py-3 font-mono text-sm uppercase tracking-widest text-cyan-300 backdrop-blur-xl transition-all group-hover:bg-cyan-500/20">
              Open Waypoint
            </span>
          </a>
          <a
            href="#projects"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm p-px transition-shadow hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
          >
            {/* Spinning conic-gradient — creates the animated light trail around the border */}
            <span
              className="absolute inset-[-300%] animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,#0a1628_0%,#00f0ff_50%,#0a1628_100%)]"
              style={{ animationDuration: "4s" }}
            />
            <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-sm bg-[#060e1a]/90 px-8 py-3 font-mono text-sm uppercase tracking-widest text-slate-400 backdrop-blur-xl transition-all group-hover:text-cyan-300">
              View Projects
            </span>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-cyan-500/40">
              Scroll
            </span>
            <div className="h-6 w-px bg-gradient-to-b from-cyan-500/40 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
