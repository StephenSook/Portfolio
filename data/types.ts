export type Outcome = { place?: string; event: string; note?: string };

export type Links = { live?: string; repo?: string; figma?: string; note?: string };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  tier: "featured" | "archive";
  role?: string;
  outcome?: Outcome;
  dates: string;
  stack: string[];
  links: Links;
  gallery: string[]; // /public paths (leave [] for now; screenshots added later)
  caseStudy?: { problem: string; build: string; result: string };
};

export type Role = {
  org: string;
  title: string;
  location: string;
  period: string;
  bullets: string[];
  kind: "work" | "founder" | "program" | "teaching";
};

export type Achievement = { label: string; detail: string; kind: "win" | "stat" | "cert" };

export type Fandom = { name: string; note: string; accent: string };
