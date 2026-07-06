import { Boot } from "@/components/sections/Boot";
import { Hero } from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Arsenal from "@/components/sections/Arsenal";
import Missions from "@/components/sections/Missions";
import ServiceRecord from "@/components/sections/ServiceRecord";
import Bench from "@/components/sections/Bench";
import { Dossier } from "@/components/sections/Dossier";
import Comms from "@/components/sections/Comms";
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
          <About />
          <Arsenal />
          <Missions />
          <ServiceRecord />
          <Bench />
          <Dossier />
          <Comms />
        </div>
      </main>
    </>
  );
}
