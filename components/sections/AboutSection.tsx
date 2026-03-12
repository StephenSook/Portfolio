"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import HUDPanel from "@/components/ui/HUDPanel";
import { Spotlight } from "@/components/ui/Spotlight";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { siteContent } from "@/data/siteContent";

export default function AboutSection() {
  const { education, skills, bio, name } = siteContent;

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" size={400} />
      <SectionHeading label="Personnel File" id="about" />

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Profile Card */}
        <HUDPanel glow className="flex flex-col items-center text-center lg:sticky lg:top-24 lg:self-start">
          {/* Headshot */}
          <div className="relative mb-5 h-40 w-40 overflow-hidden rounded-sm border border-cyan-500/20">
            <Image
              src="/personal/headshot.jpg"
              alt={`${name} headshot`}
              fill
              className="object-cover"
              sizes="160px"
              priority
            />
            {/* HUD overlay on photo */}
            <div className="absolute inset-0 border border-cyan-400/10" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a1628]/80 to-transparent p-2">
              <span className="font-mono text-[9px] text-cyan-400/60 tracking-wider">
                VERIFIED
              </span>
            </div>
          </div>

          {/* ID Info */}
          <h3 className="mb-1 text-lg font-semibold text-white">{name}</h3>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-cyan-400/60">
            Operator // AI Engineer
          </p>
          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

          {/* Stats */}
          <div className="grid w-full grid-cols-2 gap-3 text-left">
            <div>
              <p className="font-mono text-[9px] uppercase text-slate-500 tracking-wider">
                Status
              </p>
              <p className="flex items-center gap-1.5 text-sm text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Active
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase text-slate-500 tracking-wider">
                GPA
              </p>
              <p className="text-sm text-white">{education.gpa}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase text-slate-500 tracking-wider">
                Clearance
              </p>
              <p className="text-sm text-white">CS / AI-ML</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase text-slate-500 tracking-wider">
                Missions
              </p>
              <p className="text-sm text-white">5× Hackathon</p>
            </div>
          </div>
        </HUDPanel>

        {/* Details column */}
        <div className="space-y-6">
          {/* Bio */}
          <HUDPanel delay={0.1}>
            <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/60">
              Briefing
            </h4>
            <div className="space-y-3 text-sm leading-relaxed text-slate-300/90">
              {bio.split("\n").filter(Boolean).map((paragraph, i) => (
                <p key={i}>
                  <HighlightedText
                    inView
                    from={i % 2 === 0 ? "left" : "right"}
                    delay={i * 0.3}
                  >
                    {paragraph}
                  </HighlightedText>
                </p>
              ))}
            </div>
          </HUDPanel>

          {/* Education */}
          <HUDPanel delay={0.2}>
            <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/60">
              Education
            </h4>
            <p className="text-sm font-medium text-white">{education.school}</p>
            <p className="text-sm text-slate-400">{education.degree}</p>
            <p className="text-sm text-slate-400">
              Concentration: {education.concentration}
            </p>
            <p className="mt-1 font-mono text-[10px] text-cyan-500/50 tracking-wider">
              {education.graduation}
            </p>
          </HUDPanel>

          {/* Skills */}
          <HUDPanel delay={0.3}>
            <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/60">
              Tech Arsenal
            </h4>
            <div className="mb-4">
              <p className="mb-2 font-mono text-[9px] uppercase text-slate-500 tracking-wider">
                Languages & Frameworks
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map((s) => (
                  <motion.span
                    key={s}
                    whileHover={{ scale: 1.05 }}
                    className="rounded-sm border border-cyan-500/15 bg-cyan-500/5 px-3 py-1 font-mono text-[11px] text-cyan-300/70 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-[9px] uppercase text-slate-500 tracking-wider">
                Developer Tools
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((s) => (
                  <motion.span
                    key={s}
                    whileHover={{ scale: 1.05 }}
                    className="rounded-sm border border-slate-500/15 bg-slate-500/5 px-3 py-1 font-mono text-[11px] text-slate-400/70 transition-colors hover:border-slate-400/30 hover:text-slate-300"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          </HUDPanel>

          {/* Awards */}
          <HUDPanel delay={0.4}>
            <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/60">
              Commendations
            </h4>
            <div className="space-y-2">
              {siteContent.awards.map((award, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-cyan-400/60" />
                  <span className="text-sm text-slate-300/80">{award}</span>
                </div>
              ))}
            </div>
          </HUDPanel>
        </div>
      </div>
    </section>
  );
}
