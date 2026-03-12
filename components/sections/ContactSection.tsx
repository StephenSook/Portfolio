"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import CopyEmailButton from "@/components/ui/CopyEmailButton";
import HUDPanel from "@/components/ui/HUDPanel";
import { Spotlight } from "@/components/ui/Spotlight";
import { FancyContactLink } from "@/components/ui/FancyContactLink";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { siteContent } from "@/data/siteContent";

export default function ContactSection() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-24">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-40" size={400} />
      <SectionHeading label="Establish Comms" id="contact" />

      <HUDPanel glow className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="mb-3 text-2xl font-semibold text-white">
            Ready to connect?
          </h3>
          <p className="mb-8 text-sm text-slate-400 max-w-md mx-auto">
            <HighlightedText inView from="left" delay={0.2}>
              Whether you&apos;re a recruiter, collaborator, or fellow builder
            </HighlightedText>{" "}
            <HighlightedText inView from="right" delay={0.5}>
              — I&apos;m always open to new opportunities and conversations.
            </HighlightedText>
          </p>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <FancyContactLink
              href={siteContent.github}
              icon={<FiGithub size={16} />}
              label="GitHub"
            />
            <FancyContactLink
              href={siteContent.linkedin}
              icon={<FiLinkedin size={16} />}
              label="LinkedIn"
            />
            <CopyEmailButton email={siteContent.email} />
          </div>
        </motion.div>
      </HUDPanel>

      {/* Footer */}
      <div className="mt-16 text-center">
        <div className="mb-3 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
          &copy; {new Date().getFullYear()} {siteContent.name} — All rights
          reserved
        </p>
      </div>
    </section>
  );
}
