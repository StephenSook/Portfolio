"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export default function Toast({ message, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 left-1/2 z-[100] -translate-x-1/2 rounded border border-cyan-400/30 bg-[#0a1628]/90 px-6 py-3 text-sm font-mono text-cyan-300 shadow-lg shadow-cyan-500/10 backdrop-blur-md"
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
