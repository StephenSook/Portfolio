"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Home,
  User,
  FolderKanban,
  Briefcase,
  FileText,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", url: "#hero", icon: Home },
  { name: "Waypoint", url: "#about", icon: User },
  { name: "Projects", url: "#projects", icon: FolderKanban },
  { name: "Service Record", url: "#experience", icon: Briefcase },
  { name: "Dossier", url: "#resume", icon: FileText },
  { name: "Contact", url: "#contact", icon: Mail },
];

export default function NavDock() {
  const [activeTab, setActiveTab] = useState("Home");
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed left-1/2 -translate-x-1/2 z-50",
            isMobile ? "bottom-4" : "top-4"
          )}
        >
          <nav className="flex items-center gap-1 rounded-full border border-cyan-500/15 bg-[#060e1a]/80 px-1.5 py-1.5 shadow-[0_0_20px_rgba(0,240,255,0.06)] backdrop-blur-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "relative cursor-pointer rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors",
                    "text-slate-400 hover:text-cyan-300",
                    isActive && "text-cyan-300"
                  )}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden">
                    <Icon size={16} strokeWidth={2} />
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="tubelight"
                      className="absolute inset-0 rounded-full bg-cyan-500/10 -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      {/* Tubelight glow on top */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-cyan-400">
                        <div className="absolute -top-1.5 -left-2 w-12 h-4 rounded-full bg-cyan-400/20 blur-md" />
                        <div className="absolute -top-1 left-0 w-8 h-4 rounded-full bg-cyan-400/15 blur-md" />
                        <div className="absolute -top-0.5 left-2 w-4 h-3 rounded-full bg-cyan-400/20 blur-sm" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
