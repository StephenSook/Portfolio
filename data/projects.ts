import type { Project } from "./types";

export const projects: Project[] = [
  // ---------------------------------------------------------------------------
  // FEATURED: podium wins plus a founding initiative, each with a case study.
  // ---------------------------------------------------------------------------
  {
    slug: "trace",
    name: "Trace",
    tagline: "Semantic forensic search that bridges family descriptions and unidentified-remains records.",
    tier: "featured",
    outcome: { place: "1st of 22", event: "Actian VectorAI Build Challenge" },
    dates: "April 2026",
    stack: ["Python", "SapBERT", "Actian VectorAI DB", "Named Vectors", "NamUs", "Next.js"],
    links: {
      live: "https://trace-forensic-search-ssookra-7703s-projects.vercel.app",
      repo: "https://github.com/StephenSook/trace-forensic-search",
    },
    gallery: [],
    caseStudy: {
      problem:
        "Missing-persons cases stall because the way a family describes someone almost never matches the clinical language in a forensic record. A mom says 'eagle tattoo on his left arm' and the case file says 'avian motif dermagraphic.' Keyword search misses that link every time, so real matches sit buried in the federal NamUs database.",
      build:
        "I built a search engine that bridges the two vocabularies. It runs SapBERT medical embeddings and named vectors over 40,000+ NamUs records, then fuses structured filters with vector similarity so a plain-English description surfaces the right forensic record. The whole thing runs on Actian's VectorAI database.",
      result:
        "Trace took 1st place out of 22 teams at the Actian VectorAI Build Challenge, announced at AI Dev '26 in San Francisco. It is live and public, and a family member can search it in the language they actually use.",
    },
  },
  {
    slug: "stepsafe",
    name: "StepSafe",
    tagline: "Upload a wound photo, get an instant diabetic foot-ulcer severity read with a confidence score.",
    tier: "featured",
    outcome: { place: "1st", event: "HMI Hackathon 2026 (KSU)", note: "Open Innovation track" },
    dates: "2026",
    stack: ["TensorFlow", "MobileNetV2", "FastAPI", "React", "Vite", "Tailwind"],
    links: {
      live: "https://stepsafe-web.vercel.app",
      repo: "https://github.com/StephenSook/StepSafe",
    },
    gallery: [],
    caseStudy: {
      problem:
        "Diabetic foot ulcers are a leading path to lower-limb amputation, and clinicians misjudge wound severity a large share of the time. People in rural or under-resourced areas often cannot get a fast read on whether a wound needs urgent care.",
      build:
        "I built a web app where you upload a photo of a wound and get back a severity classification with a confidence score and a recommended clinical action. The model is a MobileNetV2 network I trained and fine-tuned on roughly 20,000 annotated foot-ulcer images. A FastAPI backend serves the model, and a React and Vite frontend handles the upload flow and the report.",
      result:
        "StepSafe won 1st place at the HMI Hackathon 2026 at Kennesaw State. The frontend and the API are both deployed and live, so anyone can run a photo through it.",
    },
  },
  {
    slug: "pyrolens",
    name: "PyroLens",
    tagline: "A real-time dashboard that scores prescribed-burn readiness from live sensors and satellite data.",
    tier: "featured",
    outcome: {
      place: "2nd + 3rd",
      event: "KSU Hackathon for Social Good",
      note: "2nd Assurant Challenge, 3rd Capgemini Net Positive AI",
    },
    dates: "May 2026",
    stack: ["React", "FastAPI", "scikit-learn", "ESP32", "NOAA", "Sentinel NDVI", "Supabase"],
    links: {
      live: "https://pyrolens.vercel.app",
      repo: "https://github.com/StephenSook/PyroLens",
    },
    gallery: [],
    caseStudy: {
      problem:
        "Prescribed burns keep wildfire risk down, but deciding when a burn is safe means juggling weather, soil moisture, fuel dryness, and satellite data by hand. Get the window wrong and a controlled burn becomes a real fire.",
      build:
        "I built a real-time dashboard that scores burn readiness and predicts safe burn windows. It pulls live readings from an ESP32 sensor rig I wired up (temperature, humidity, soil moisture), then combines that with NOAA forecasts, Sentinel Hub NDVI imagery, and NASA FIRMS fire data. A scikit-learn model turns all of it into a go or no-go call, served through a FastAPI backend with Supabase behind it.",
      result:
        "PyroLens earned 2nd place in the Assurant Challenge and 3rd in Capgemini Net Positive AI at the KSU Hackathon for Social Good. The dashboard and the API are deployed and live.",
    },
  },
  {
    slug: "saber",
    name: "Saber",
    tagline: "A diagnostic that tells a language barrier apart from a real knowledge gap for English Language Learners.",
    tier: "featured",
    role: "Frontend Lead",
    outcome: { place: "3rd", event: "Vibra ATL 2026 (SHPE, GSU)" },
    dates: "April 2026",
    stack: ["Next.js 16", "React 19", "Web Speech API", "JWT", "SQLite", "OpenAI"],
    links: {
      live: "https://saber-web-oz35.onrender.com",
      repo: "https://github.com/StephenSook/Saber",
      note: "May take ~30s to wake",
    },
    gallery: [],
    caseStudy: {
      problem:
        "When an English Language Learner misses a question, a teacher cannot tell whether the student did not understand the concept or just did not understand the English. Those two problems need opposite fixes, and lumping them together holds kids back.",
      build:
        "I led the frontend on a diagnostic that separates the language barrier from the knowledge gap. A teacher uploads scores, and the student retakes missed questions in Spanish. Get it right in their first language and it was a language issue; still miss it and it is a real knowledge gap. I built it in Next.js 16 and React 19 with Web Speech API voice input and JWT auth, over an OpenAI-backed classify and translate layer.",
      result:
        "Saber placed 3rd at Vibra ATL 2026, the SHPE hackathon at Georgia State. It is deployed on Render's free tier, so the live link takes about 30 seconds to wake from a cold start.",
    },
  },
  {
    slug: "nest",
    name: "Nest",
    tagline: "An AI transition navigator that builds 90-day plans for aging-out Georgia foster youth.",
    tier: "featured",
    role: "Founder & Project Lead",
    dates: "Jan 2026 to present",
    stack: ["RAG", "LLM", "Next.js"],
    links: {
      live: "https://nest-portfolio-pi.vercel.app",
      note: "App in private beta",
    },
    gallery: [],
    caseStudy: {
      problem:
        "Every year young people age out of the Georgia foster system with almost no plan for what comes next. Benefits, housing, and school each live in separate systems with their own deadlines, and the 90-day gap right after aging out can decide whether someone lands on their feet.",
      build:
        "I founded Nest and lead the project. It is a retrieval-augmented AI navigator that generates a personalized 90-day plan across benefits, housing, and education for youth aging out of care. I partnered with KSU ASCEND for institutional backing and lived-experience usability testing, and Dr. Richard Gesick advises the work.",
      result:
        "Nest was selected for the KSU Spring 2026 Computing Showcase as project UC-151-197. The app is in private beta while we test it with real users, so there is no public code link yet. This is a founding initiative, not a hackathon entry.",
    },
  },

  // ---------------------------------------------------------------------------
  // ARCHIVE: full body of work. No case studies. Award only where confirmed.
  // ---------------------------------------------------------------------------
  {
    slug: "rooted",
    name: "Rooted",
    tagline: "Vendor-neutral C2PA provenance server that recovers stripped content credentials.",
    tier: "archive",
    outcome: { event: "Backblaze Generative Media Hackathon", note: "Submitted July 2026, judging through Aug 2026" },
    dates: "July 2026",
    stack: ["C2PA", "Backblaze B2", "MCP", "TypeScript", "Next.js"],
    links: {
      live: "https://rooted-web-phi.vercel.app",
      repo: "https://github.com/StephenSook/rooted",
    },
    gallery: [],
  },
  {
    slug: "varsity",
    name: "VARSITY",
    tagline: "Screen-reader-native AI explainer for VAR and offside calls, built for blind soccer fans.",
    tier: "archive",
    dates: "June 2026",
    stack: ["PWA", "React", "IFAB rules", "Accessibility"],
    links: {
      live: "https://web-chi-wine-13.vercel.app",
      repo: "https://github.com/StephenSook/varsity",
    },
    gallery: [],
  },
  {
    slug: "cornercheck",
    name: "CornerCheck",
    tagline: "Fail-closed Slack agent that clears combat-sports fighters against medical suspensions.",
    tier: "archive",
    outcome: { event: "Slack Agent Builder Challenge", note: "Agent for Good track; judging through Aug 2026" },
    dates: "July 2026",
    stack: ["Slack Bolt", "Python", "Claude Agent SDK", "FastMCP", "HMAC"],
    links: {
      live: "https://cornercheck.onrender.com",
      repo: "https://github.com/StephenSook/cornercheck",
    },
    gallery: [],
  },
  {
    slug: "custody",
    name: "Custody",
    tagline: "Globally consistent parental-consent and minor-spend ledger on Aurora DSQL.",
    tier: "archive",
    outcome: { event: "H0 Hackathon" },
    dates: "June 2026",
    stack: ["Aurora DSQL", "Next.js 16", "deck.gl", "AWS"],
    links: {
      live: "https://custody-zeta.vercel.app",
      repo: "https://github.com/StephenSook/custody",
    },
    gallery: [],
  },
  {
    slug: "compass-0g",
    name: "Compass (0G)",
    tagline: "A private eligibility firewall: prove you qualify without revealing who you are.",
    tier: "archive",
    outcome: { event: "0G APAC Hackathon" },
    dates: "May 2026",
    stack: ["0G Network", "Phala TEE", "Next.js", "Solidity"],
    links: {
      live: "https://app-psi-pied.vercel.app",
      repo: "https://github.com/StephenSook/Compass-OG-",
    },
    gallery: [],
  },
  {
    slug: "cm-devvit",
    name: "cm-devvit",
    tagline: "Devvit Web port of ContextMod: Reddit moderation rules with a live action dashboard.",
    tier: "archive",
    dates: "May 2026",
    stack: ["Devvit", "TypeScript", "React", "JSON5"],
    links: {
      live: "https://developers.reddit.com/apps/cm-devvit",
      repo: "https://github.com/StephenSook/context-mod-devvit",
    },
    gallery: [],
  },
  {
    slug: "gravitonkv",
    name: "GravitonKV",
    tagline: "First reproducible KV-cache quantization study on AWS Graviton4, with PMU-level analysis.",
    tier: "archive",
    outcome: { event: "Arm Create AI Optimization Challenge", note: "In progress" },
    dates: "July 2026",
    stack: ["AWS Graviton4", "C++", "PMU", "Quantization"],
    links: {
      repo: "https://github.com/StephenSook/gravitonkv",
    },
    gallery: [],
  },
  {
    slug: "apex",
    name: "APEX",
    tagline: "An AI race engineer for adaptive and grassroots racers, built on IBM Granite.",
    tier: "archive",
    role: "Frontend, deck, and narrative",
    outcome: { event: "IBM SkillsBuild May Challenge" },
    dates: "May 2026",
    stack: ["IBM Granite", "Granite TTM", "Watson TTS", "Next.js"],
    links: {
      live: "https://apex-one-black.vercel.app",
      repo: "https://github.com/StephenSook/apex",
    },
    gallery: [],
  },
  {
    slug: "rewear-fused",
    name: "ReWear-Fused",
    tagline: "A computational co-design loop for textile-to-textile recycling of kids' stretch apparel.",
    tier: "archive",
    outcome: { event: "Cox Play With Purpose Sustainability Hackathon" },
    dates: "June 2026",
    stack: ["Next.js", "Digital Passport", "Bioinformatics"],
    links: {
      live: "https://rewear-fused.vercel.app",
      repo: "https://github.com/StephenSook/rewear-fused",
    },
    gallery: [],
  },
  {
    slug: "hometown-pathway-atlas",
    name: "Hometown Pathway Atlas",
    tagline: "County-level Team USA pathway analytics with Olympic and Paralympic parity.",
    tier: "archive",
    outcome: { event: "Team USA x Google Cloud Vibe Code for Gold" },
    dates: "May 2026",
    stack: ["Gemini", "Google Cloud", "Data Analytics"],
    links: {
      repo: "https://github.com/StephenSook/Hometown-Pathway-Atlas",
    },
    gallery: [],
  },
  {
    slug: "groundvault",
    name: "GroundVault",
    tagline: "A confidential impact-lending vault for Community Land Trusts on iExec.",
    tier: "archive",
    outcome: { event: "iExec Vibe Coding Challenge" },
    dates: "April 2026",
    stack: ["ERC-7984", "ERC-3643", "iExec", "Arbitrum Sepolia"],
    links: {
      repo: "https://github.com/StephenSook/GroundVault",
    },
    gallery: [],
  },
  {
    slug: "safepassage",
    name: "SafePassage",
    tagline: "Privacy-preserving emergency disbursement for abuse survivors on the Midnight network.",
    tier: "archive",
    outcome: { event: "MLH Midnight Hackathon" },
    dates: "May 2026",
    stack: ["Midnight Network", "Zero-Knowledge", "Compact"],
    links: {
      repo: "https://github.com/StephenSook/SafePassage",
    },
    gallery: [],
  },
  {
    slug: "compass-vibeatl",
    name: "Compass (Vibe ATL)",
    tagline: "An AI guide for navigating US government processes, built at Vibe ATL 2026.",
    tier: "archive",
    outcome: { event: "Vibe ATL 2026" },
    dates: "March 2026",
    stack: ["AI", "Next.js"],
    links: {
      repo: "https://github.com/StephenSook/Compass",
    },
    gallery: [],
  },
  {
    slug: "echopay",
    name: "EchoPay",
    tagline: "Voice-native financial identity for low-literacy users.",
    tier: "archive",
    outcome: { place: "3rd", event: "KSU FinTech Hackathon 2025" },
    dates: "2025",
    stack: ["Figma", "Voice UI"],
    links: {
      figma: "https://www.figma.com/community/file/1563976388477525736/voice-native-financial-identity",
      note: "Figma prototype",
    },
    gallery: [],
  },
];
