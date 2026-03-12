"use client";

import { motion } from "framer-motion";

interface HUDPanelProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  delay?: number;
}

export default function HUDPanel({
  children,
  className = "",
  glow = false,
  delay = 0,
}: HUDPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={`relative rounded-sm border border-cyan-500/20 bg-[#0a1628]/70 p-6 backdrop-blur-md ${
        glow ? "shadow-[0_0_20px_rgba(0,240,255,0.06)]" : ""
      } ${className}`}
    >
      {/* Corner accents */}
      <span className="absolute left-0 top-0 h-3 w-px bg-cyan-400/60" />
      <span className="absolute left-0 top-0 h-px w-3 bg-cyan-400/60" />
      <span className="absolute right-0 top-0 h-3 w-px bg-cyan-400/60" />
      <span className="absolute right-0 top-0 h-px w-3 bg-cyan-400/60" />
      <span className="absolute bottom-0 left-0 h-3 w-px bg-cyan-400/60" />
      <span className="absolute bottom-0 left-0 h-px w-3 bg-cyan-400/60" />
      <span className="absolute bottom-0 right-0 h-3 w-px bg-cyan-400/60" />
      <span className="absolute bottom-0 right-0 h-px w-3 bg-cyan-400/60" />
      {children}
    </motion.div>
  );
}
