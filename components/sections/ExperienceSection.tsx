"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import HUDPanel from "@/components/ui/HUDPanel";
import { Spotlight } from "@/components/ui/Spotlight";
import { siteContent } from "@/data/siteContent";

export default function ExperienceSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" size={400} />
      <SectionHeading label="Service Record" id="experience" />

      <div className="space-y-8">
        {/* Experience entries */}
        {siteContent.experience.map((exp, i) => (
          <div key={i} className="relative flex gap-6">
            {/* Timeline line */}
            <div className="hidden sm:flex flex-col items-center">
              <div className="h-3 w-3 rounded-full border-2 border-cyan-400/50 bg-[#0a1628]" />
              <div className="flex-1 w-px bg-gradient-to-b from-cyan-500/30 to-transparent" />
            </div>

            <HUDPanel className="flex-1" delay={i * 0.15}>
              <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {exp.role}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {exp.company} — {exp.location}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-cyan-500/50 tracking-wider">
                  {exp.period}
                </span>
              </div>
              <ul className="space-y-2">
                {exp.bullets.map((bullet, j) => (
                  <li
                    key={j}
                    className="flex gap-2 text-sm text-slate-300/80 leading-relaxed"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-500/40" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </HUDPanel>
          </div>
        ))}

        {/* Certifications */}
        {siteContent.certifications.map((cert, i) => (
          <div key={i} className="relative flex gap-6">
            <div className="hidden sm:flex flex-col items-center">
              <div className="h-3 w-3 rounded-full border-2 border-cyan-400/30 bg-[#0a1628]" />
              <div className="flex-1 w-px bg-gradient-to-b from-cyan-500/20 to-transparent" />
            </div>

            <HUDPanel className="flex-1" delay={0.3}>
              <div className="mb-2">
                <div className="mb-1 inline-block rounded-sm border border-cyan-500/15 bg-cyan-500/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan-400/60">
                  Certification
                </div>
                <h3 className="text-base font-semibold text-white">
                  {cert.title}
                </h3>
                <p className="text-sm text-slate-400">
                  Issued by {cert.issuer}
                </p>
              </div>
              <p className="text-sm text-slate-300/80">{cert.description}</p>
            </HUDPanel>
          </div>
        ))}
      </div>
    </section>
  );
}
