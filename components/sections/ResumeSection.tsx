"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import ResumePanel from "@/components/ui/ResumePanel";
import { Spotlight } from "@/components/ui/Spotlight";

export default function ResumeSection() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-24">
      <Spotlight className="-top-40 right-0 md:-top-20 md:right-40" size={400} />
      <SectionHeading label="Dossier" id="resume" />
      <ResumePanel />
    </section>
  );
}
