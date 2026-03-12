"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  label: string;
  id?: string;
}

export default function SectionHeading({ label, id }: SectionHeadingProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mb-12 flex items-center gap-4 scroll-mt-24"
    >
      <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-cyan-500/50" />
      <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
        {label}
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
    </motion.div>
  );
}
