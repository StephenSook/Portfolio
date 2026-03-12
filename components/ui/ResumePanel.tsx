"use client";

import { FiDownload } from "react-icons/fi";
import HUDPanel from "./HUDPanel";

export default function ResumePanel() {
  return (
    <HUDPanel glow>
      <div className="flex flex-col gap-6">
        {/* PDF Embed */}
        <div className="relative aspect-[8.5/11] w-full overflow-hidden rounded-sm border border-cyan-500/10 bg-[#050d18]">
          <iframe
            src="/resume/Stephen_Sookra_Resume.pdf"
            className="h-full w-full"
            title="Stephen Sookra Resume"
          />
        </div>

        {/* Download button */}
        <a
          href="/resume/Stephen_Sookra_Resume.pdf"
          download
          className="inline-flex items-center justify-center gap-2 self-center rounded-sm border border-cyan-500/30 bg-cyan-500/5 px-6 py-3 font-mono text-xs uppercase tracking-widest text-cyan-400 transition-all hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]"
        >
          <FiDownload size={14} />
          Download Dossier
        </a>
      </div>
    </HUDPanel>
  );
}
