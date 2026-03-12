export const SECTION_IDS = {
  hero: "hero",
  about: "about",
  projects: "projects",
  experience: "experience",
  resume: "resume",
  contact: "contact",
} as const;

export const NAV_ITEMS = [
  { label: "Waypoint", href: `#${SECTION_IDS.about}` },
  { label: "Projects", href: `#${SECTION_IDS.projects}` },
  { label: "Service Record", href: `#${SECTION_IDS.experience}` },
  { label: "Dossier", href: `#${SECTION_IDS.resume}` },
  { label: "Contact", href: `#${SECTION_IDS.contact}` },
];

export const COLORS = {
  cyan: "#00f0ff",
  cyanDim: "rgba(0, 240, 255, 0.15)",
  cyanGlow: "rgba(0, 240, 255, 0.4)",
  navy: "#0a1628",
  navyLight: "#0f2140",
  steel: "#1a2a44",
  white: "#e8f0fe",
  gray: "#8899aa",
};
