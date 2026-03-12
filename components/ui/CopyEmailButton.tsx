"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { FiMail } from "react-icons/fi";
import gsap from "gsap";
import Toast from "./Toast";

const SCATTER_TRANSFORMS: Record<
  number,
  { x: string; y: string; rotate: number }
> = {
  1: { x: "-15%", y: "60%", rotate: 8 },
  2: { x: "-30%", y: "30%", rotate: 4 },
  3: { x: "-20%", y: "40%", rotate: -6 },
  4: { x: "0%", y: "8%", rotate: -8 },
  5: { x: "0%", y: "-20%", rotate: 5 },
};

export default function CopyEmailButton({ email }: { email: string }) {
  const [showToast, setShowToast] = useState(false);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    return () => {
      letterRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setShowToast(true);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setShowToast(true);
    }
  }, [email]);

  const handleEnter = () => {
    letterRefs.current.forEach((el, i) => {
      if (!el) return;
      const transform = SCATTER_TRANSFORMS[(i % 5) + 1];
      if (transform) {
        gsap.to(el, {
          xPercent: parseFloat(transform.x),
          yPercent: parseFloat(transform.y),
          rotation: transform.rotate,
          duration: 0.3,
          ease: "power3.inOut",
        });
      }
    });
  };

  const handleLeave = () => {
    letterRefs.current.forEach((el) => {
      if (!el) return;
      gsap.killTweensOf(el);
      gsap.to(el, {
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        duration: 0.35,
        ease: "power3.inOut",
      });
    });
  };

  return (
    <>
      <button
        onClick={handleCopy}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="flex items-center gap-2 rounded-sm border border-cyan-500/20 bg-cyan-500/5 px-5 py-3 font-mono text-xs text-cyan-400 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]"
        aria-label="Copy email address"
      >
        <FiMail size={16} />
        <span className="inline-flex overflow-visible">
          {"Email".split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
              className="inline-block"
            >
              {char}
            </span>
          ))}
        </span>
      </button>
      <Toast
        message="Email copied to clipboard"
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
