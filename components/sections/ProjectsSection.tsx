"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import { Spotlight } from "@/components/ui/Spotlight";
import { siteContent } from "@/data/siteContent";

export default function ProjectsSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <Spotlight className="-top-40 right-0 md:-top-20 md:right-60" size={400} />
      <SectionHeading label="Mission Log // Projects" id="projects" />
      <div className="grid gap-6 md:grid-cols-2">
        {siteContent.projects.map((project, i) => (
          <ProjectCard key={project.title} {...project} index={i} />
        ))}
      </div>
    </section>
  );
}
