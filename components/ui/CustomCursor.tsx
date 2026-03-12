"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const swordRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const sword = swordRef.current;
    const glow = glowRef.current;
    if (!sword || !glow) return;

    sword.style.display = "block";
    glow.style.display = "block";

    let clicking = false;

    const onMove = (e: MouseEvent) => {
      const s = clicking ? 0.82 : 1;
      sword.style.transform = `translate3d(${e.clientX - 3}px,${e.clientY - 1}px,0) scale(${s})`;
      glow.style.transform = `translate3d(${e.clientX - 2}px,${e.clientY - 2}px,0)`;
    };

    const onDown = () => {
      clicking = true;
      sword.style.transform = sword.style.transform.replace(
        /scale\([^)]*\)/,
        "scale(0.82)"
      );
    };

    const onUp = () => {
      clicking = false;
      sword.style.transform = sword.style.transform.replace(
        /scale\([^)]*\)/,
        "scale(1)"
      );
    };

    const onLeave = () => {
      sword.style.transform = "translate3d(-100px,-100px,0)";
      glow.style.transform = "translate3d(-100px,-100px,0)";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      {/* Energy Sword cursor */}
      <div
        ref={swordRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ display: "none", willChange: "transform" }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter:
              "drop-shadow(0 0 4px rgba(100,180,255,0.7)) drop-shadow(0 0 10px rgba(50,140,255,0.4))",
          }}
        >
          <path
            d="M2 1 C4 3, 12 14, 18 24 C19 26, 19.5 27, 20 28"
            stroke="url(#blade1)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M3 2 C5 5, 13 15, 18.5 24.5"
            stroke="rgba(180,220,255,0.5)"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M5 0 C8 4, 15 14, 20.5 24 C21 26, 21 27, 21 28"
            stroke="url(#blade2)"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M6 1 C9 5, 15.5 14.5, 21 24.5"
            stroke="rgba(180,220,255,0.4)"
            strokeWidth="0.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M16 27 C18 30, 24 32, 26 30"
            stroke="#5588aa"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M17.5 28 C19 30, 23 31, 24.5 29.5"
            stroke="#334466"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="20.5" cy="28.5" r="1.5" fill="#00aaff" opacity="0.6" />
          <circle cx="20.5" cy="28.5" r="0.7" fill="#ccedff" opacity="0.9" />
          <path
            d="M8 8 L9 10 L7.5 12"
            stroke="rgba(200,235,255,0.6)"
            strokeWidth="0.4"
            fill="none"
          />
          <path
            d="M13 16 L14.5 17.5 L13 19"
            stroke="rgba(200,235,255,0.5)"
            strokeWidth="0.3"
            fill="none"
          />
          <defs>
            <linearGradient id="blade1" x1="2" y1="1" x2="20" y2="28">
              <stop offset="0%" stopColor="#e0f0ff" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#60b0ff" />
              <stop offset="70%" stopColor="#3080dd" />
              <stop offset="100%" stopColor="#204888" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="blade2" x1="5" y1="0" x2="21" y2="28">
              <stop offset="0%" stopColor="#d0e8ff" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#5098ee" />
              <stop offset="70%" stopColor="#2870cc" />
              <stop offset="100%" stopColor="#1a4080" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Trailing glow */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full"
        style={{
          display: "none",
          width: 4,
          height: 4,
          willChange: "transform",
          background: "rgba(100, 180, 255, 0.5)",
          boxShadow: "0 0 8px 2px rgba(80, 160, 255, 0.3)",
          transition: "transform 0.12s ease-out",
        }}
      />
    </>
  );
}
