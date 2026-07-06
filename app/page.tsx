import { Boot } from "@/components/sections/Boot";
import { Hero } from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Arsenal from "@/components/sections/Arsenal";
import { ProjectsCarousel } from "@/components/sections/ProjectsCarousel";
import ServiceRecord from "@/components/sections/ServiceRecord";
import { InterestsReel } from "@/components/sections/InterestsReel";
import { Dossier } from "@/components/sections/Dossier";
import Comms from "@/components/sections/Comms";
import { Reveal } from "@/components/anim/Reveal";
import { NavDock } from "@/components/hud/NavDock";
import { CustomCursor } from "@/components/hud/CustomCursor";
import { Scanline } from "@/components/hud/Scanline";
import { KonamiTheme } from "@/components/hud/KonamiTheme";
import { AudioManager } from "@/components/audio/AudioManager";
import { AchievementToaster } from "@/components/hud/AchievementToast";

export default function Home() {
  return (
    <>
      <Boot />
      <Scanline />
      <CustomCursor />
      <NavDock />
      <AudioManager />
      <AchievementToaster />
      <KonamiTheme />

      <main id="main">
        <Hero />
        <div className="relative z-10 bg-[var(--bg)]">
          <Reveal><About /></Reveal>
          <Reveal><Arsenal /></Reveal>
          <ProjectsCarousel />
          <Reveal><ServiceRecord /></Reveal>
          <InterestsReel />
          <Reveal><Dossier /></Reveal>
          <Reveal><Comms /></Reveal>
        </div>
      </main>
    </>
  );
}
