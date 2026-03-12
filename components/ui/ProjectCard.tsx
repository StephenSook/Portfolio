"use client";

import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  date: string;
  tech: string[];
  bullets: string[];
  award?: string;
  github?: string;
  live?: string;
  index: number;
}

export default function ProjectCard({
  title,
  subtitle,
  date,
  tech,
  bullets,
  award,
  github,
  live,
  index,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-sm border border-cyan-500/15 bg-[#0a1628]/60 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(0,240,255,0.08)]"
    >
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400">{subtitle}</p>
          </div>
          <span className="font-mono text-[10px] text-cyan-500/60 tracking-wider">
            {date}
          </span>
        </div>

        {/* Award badge */}
        {award && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-cyan-500/20 bg-cyan-500/5 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] text-cyan-400 tracking-wider">
              {award}
            </span>
          </div>
        )}

        {/* Bullets */}
        <ul className="mb-5 space-y-2">
          {bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm text-slate-300/80 leading-relaxed"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-500/40" />
              {bullet}
            </li>
          ))}
        </ul>

        {/* Tech stack */}
        <div className="mb-4 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="rounded-sm border border-cyan-500/10 bg-cyan-500/5 px-2 py-0.5 font-mono text-[10px] text-cyan-400/70"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs text-slate-400 transition-colors hover:text-cyan-400"
              aria-label={`View ${title} on GitHub`}
            >
              <FiGithub size={14} />
              Source
            </a>
          )}
          {live && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs text-slate-400 transition-colors hover:text-cyan-400"
              aria-label={`View ${title} live demo`}
            >
              <FiExternalLink size={14} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
