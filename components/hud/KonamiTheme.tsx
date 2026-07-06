"use client";

import { useEffect } from "react";
import { toast } from "@/lib/toast";

const SEQ = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Konami code toggles the LEGENDARY alt-theme (data-theme on <html>). */
export function KonamiTheme() {
  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQ[idx]) {
        idx += 1;
        if (idx === SEQ.length) {
          idx = 0;
          const root = document.documentElement;
          const on = root.getAttribute("data-theme") === "legendary";
          if (on) {
            root.removeAttribute("data-theme");
          } else {
            root.setAttribute("data-theme", "legendary");
            toast.unlock({
              title: "LEGENDARY difficulty",
              detail: "You found the Konami code.",
            });
          }
        }
      } else {
        idx = key === SEQ[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
