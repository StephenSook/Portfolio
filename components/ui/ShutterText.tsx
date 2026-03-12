"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShutterTextProps {
  texts: string[];
  interval?: number;
  className?: string;
  textClassName?: string;
}

export function ShutterText({
  texts,
  interval = 3500,
  className,
  textClassName,
}: ShutterTextProps) {
  const [index, setIndex] = useState(0);
  const characters = texts[index].split("");

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.25 } }}
          className="flex flex-wrap justify-center items-center"
        >
          {characters.map((char, i) => (
            <div
              key={i}
              className="relative overflow-hidden"
              style={{ paddingInline: "0.5px" }}
            >
              {/* Main character — blurs in */}
              <motion.span
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: i * 0.04 + 0.3, duration: 0.8 }}
                className={cn(
                  "leading-none font-bold tracking-tight text-white",
                  textClassName
                )}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>

              {/* Top slice — cyan sweep left-to-right */}
              <motion.span
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "100%", opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.04,
                  ease: "easeInOut",
                }}
                className={cn(
                  "absolute inset-0 leading-none font-bold tracking-tight text-cyan-400 z-10 pointer-events-none",
                  textClassName
                )}
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>

              {/* Middle slice — white sweep right-to-left */}
              <motion.span
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: "-100%", opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.04 + 0.1,
                  ease: "easeInOut",
                }}
                className={cn(
                  "absolute inset-0 leading-none font-bold tracking-tight text-slate-200 z-10 pointer-events-none",
                  textClassName
                )}
                style={{
                  clipPath: "polygon(0 35%, 100% 35%, 100% 65%, 0 65%)",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>

              {/* Bottom slice — cyan sweep left-to-right */}
              <motion.span
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "100%", opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.04 + 0.2,
                  ease: "easeInOut",
                }}
                className={cn(
                  "absolute inset-0 leading-none font-bold tracking-tight text-cyan-400 z-10 pointer-events-none",
                  textClassName
                )}
                style={{
                  clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
