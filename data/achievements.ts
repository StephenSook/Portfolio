import type { Achievement } from "./types";

export const achievements: Achievement[] = [
  // Podium wins
  { label: "1st of 22, Actian VectorAI Build Challenge", detail: "Trace, semantic forensic search", kind: "win" },
  { label: "1st, HMI Hackathon 2026 (KSU)", detail: "StepSafe, diabetic foot-ulcer detection", kind: "win" },
  {
    label: "2nd, Wells Fargo x Global Career Accelerator Early Talent Competition",
    detail: "SafeHaven, Top 2 of 4,700+ students",
    kind: "win",
  },
  {
    label: "2nd Assurant + 3rd Capgemini, KSU Social Good",
    detail: "PyroLens, prescribed-burn optimizer",
    kind: "win",
  },
  { label: "3rd, KSU FinTech Hackathon 2025", detail: "EchoPay, voice-native payments", kind: "win" },
  { label: "3rd, Vibra ATL 2026 (SHPE)", detail: "Saber, ELL diagnostic", kind: "win" },

  // Stats
  { label: "7 top-3 finishes across 6 events", detail: "Hackathon podium record", kind: "stat" },
  { label: "15+ hackathons entered", detail: "and counting", kind: "stat" },
  { label: "4x Dean's List", detail: "Kennesaw State University", kind: "stat" },
  { label: "GPA 3.8 / 4.0", detail: "B.S. Computer Science, AI & ML", kind: "stat" },

  // Certifications
  { label: "CodePath WEB101", detail: "Intro to Web Development, Spring 2026", kind: "cert" },
  {
    label: "Wells Fargo x The Global Career Accelerator",
    detail: "Early Talent Competition",
    kind: "cert",
  },
  { label: "AT&T Technology Academy 2025", detail: "Networking, 5G strategy, cloud fundamentals", kind: "cert" },
  { label: "Anthropic Academy 2026", detail: "AI Fluency, Claude API, MCP, Agent Skills", kind: "cert" },
  { label: "Udacity x AWS AI Practitioner", detail: "AI Practitioner Challenge, 2026", kind: "cert" },
];
