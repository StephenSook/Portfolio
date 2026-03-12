"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ResumeSection from "@/components/sections/ResumeSection";
import ContactSection from "@/components/sections/ContactSection";
import NavDock from "@/components/ui/NavDock";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <CustomCursor />
      <ScanlineOverlay />
      <NavDock />
      <main>
        <HeroSection />
        <div className="relative z-10 bg-[#060e1a]">
          <AboutSection />
          <ProjectsSection />
          <ExperienceSection />
          <ResumeSection />
          <ContactSection />
        </div>
      </main>
    </>
  );
}
