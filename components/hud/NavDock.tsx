"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: "top", label: "Home" },
  { id: "about", label: "Tape" },
  { id: "arsenal", label: "Arsenal" },
  { id: "work", label: "Missions" },
  { id: "service-record", label: "Record" },
  { id: "bench", label: "Bench" },
  { id: "resume", label: "Dossier" },
  { id: "contact", label: "Comms" },
];

/** Fixed HUD nav. Fades in after the hero, highlights the active section. */
export function NavDock() {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = ITEMS.map((i) => document.getElementById(i.id)).filter(
      Boolean
    ) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className={cn(
        "fixed left-1/2 top-4 z-[100] -translate-x-1/2 transition-all duration-500",
        shown ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0 pointer-events-none"
      )}
    >
      <ul className="hud-frame flex items-center gap-1 rounded-full px-2 py-1.5">
        {ITEMS.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "true" : undefined}
              className={cn(
                "font-hud block rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] transition-colors",
                active === i.id
                  ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              )}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
