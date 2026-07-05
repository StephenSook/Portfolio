# Player One Portfolio Revamp — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild stephensookra.com as a dark cinematic Halo-campaign "operating system" whose every section is themed in a fandom's native UI, with per-project case studies and a `/lab` playground.

**Architecture:** Next.js 16 App Router, single-page cinematic home + `/work/[slug]` case studies + `/work` archive + `/lab`. A HUD "shell" (nav, cursor, scanline, audio, toast, alt-theme) wraps route content. Content lives in typed `data/*` modules; every project link is verified live. GSAP+ScrollTrigger+Lenis drive scroll motion; R3F drives the hero 3D. Every motion has a reduced-motion fallback.

**Tech Stack:** Next 16, React 19, Tailwind 4, TypeScript 5, `three`/`@react-three/fiber`/`drei`, `gsap`+ScrollTrigger, `lenis`, `framer-motion`, `next/font`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-05-portfolio-revamp-design.md` (authoritative; section refs below point to it).
- Branch: `revamp/player-one`. Atomic commits, push after each, PR to `main` when a milestone is deployable. Watch post-merge main CI.
- Base palette void black `#05070A`; Halo primary Spartan green + Forerunner gold/amber; UNSC blue; per-section `--accent` custom property. Alt-theme "LEGENDARY" red/amber (Konami-unlocked).
- Content is REAL and verified: use `data/*` modules; every featured/archive link must curl 200 before it ships (FastAPI backends check `/docs`). No award claims on VARSITY or cm-devvit (results unknown). Headline stat exactly: `7 top-3 finishes across 6 events (15+ entered)`.
- SafeHaven = text-only award (no link). Nest = featured founding initiative (live = team site nest-portfolio-pi.vercel.app; app repo private → "private beta", no code link).
- AI-tone: no em-dashes, none of the global blocklist words, in any site copy or commit message. Real screenshots are primary media; generated art is chrome only.
- Accessibility non-negotiable: skip-link, keyboard nav, focus-visible, `aria-hidden` on decorative split-letters with real text present, full `prefers-reduced-motion` fallbacks, no audio autoplay.
- Never commit: `cortiz code`, `dave code`, `.playwright-mcp/`, recon `*.jpeg`, `*-snapshot.md` (already gitignored).
- Per-task verification for this visual build = (a) `npx tsc --noEmit` clean, (b) `npm run lint` clean, (c) `npm run build` green, (d) Playwright screenshot at 1440 + 390 shows the intended result, (e) reduced-motion still renders content. Unit tests only where there is real logic (data validators, link-checker, utils).

---

## Milestone 0 — Foundation (design system + data + shell)

Ships: a building, deployable app with new tokens, fonts, verified content model, SEO, and core primitives, but old sections temporarily rendered. Keep `main` deployable by keeping the current page working until Milestone 1 swaps sections.

### Task 0.1: Dependencies & fonts

**Files:**
- Modify: `package.json`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: font CSS variables `--font-display`, `--font-hud`, `--font-sans`, `--font-mono` on `<body>`.

- [ ] Add deps: `npm i lenis` and confirm `gsap` present. (`@react-three/postprocessing` optional for bloom, add only if hero uses it.)
- [ ] In `app/layout.tsx` load via `next/font/google`: display `Archivo` (wght 400..900, variable `--font-display`), HUD `Chakra_Petch` (400/600/700, `--font-hud`), body keep `Geist` (`--font-sans`), mono `Geist_Mono` (`--font-mono`). Apply all variables to `<body>`.
- [ ] Verify: `npm run build` green; `curl`-free — just confirm fonts referenced.
- [ ] Commit: `chore: add lenis, wire display + HUD fonts`.

### Task 0.2: Design tokens (globals.css + Tailwind theme)

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: CSS vars `--bg`, `--panel`, `--line`, `--energy` (green), `--forerunner` (gold), `--hud` (blue), `--ice`, `--text`, `--muted`, and a settable `--accent` (defaults to `--energy`); utility classes `.hud-frame` (corner brackets), `.hud-label` (mono uppercase tracked micro-label), `.kinetic` base. Alt-theme via `:root[data-theme="legendary"]` overrides.

- [ ] Replace the cyan/#060e1a tokens with the palette above. Keep `prefers-reduced-motion` block; keep `cursor:none` only on `@media (hover:hover) and (pointer:fine)`.
- [ ] Add `.hud-frame` corner-bracket helper (pseudo-elements, uses `--accent`), `.hud-label`, focus-visible using `--accent`, scrollbar/selection using `--energy`.
- [ ] Add `[data-theme="legendary"]` overriding `--energy`/`--accent` to red/amber.
- [ ] Verify: build green; Playwright load home, screenshot shows black base (old sections still there, recolored).
- [ ] Commit: `feat: replace stock cyan tokens with Halo energy design system`.

### Task 0.3: Typed content model (verified data)

**Files:**
- Create: `data/profile.ts`, `data/projects.ts`, `data/experience.ts`, `data/achievements.ts`, `data/fandoms.ts`, `data/types.ts`
- Delete (later, in 1.11): `data/siteContent.ts`

**Interfaces:**
- Produces:
```ts
// data/types.ts
export type Outcome = { place?: string; event: string; note?: string };
export type Links = { live?: string; repo?: string; figma?: string; note?: string };
export type Project = {
  slug: string; name: string; tagline: string;
  tier: "featured" | "archive"; role?: string;
  outcome?: Outcome; dates: string; stack: string[]; links: Links;
  gallery: string[]; // /public paths, real screenshots
  caseStudy?: { problem: string; build: string; result: string };
};
export type Role = { org: string; title: string; location: string; period: string; bullets: string[]; kind: "work"|"founder"|"program"|"teaching" };
export type Achievement = { label: string; detail: string; kind: "win"|"stat"|"cert" };
export type Fandom = { name: string; note: string; accent: string };
```
- Populate `projects.ts` from the verified inventory (spec §4). Featured (with `caseStudy`): Trace, StepSafe, PyroLens, Saber, Nest. Archive: Rooted, VARSITY (no award), CornerCheck, Custody, Compass-0G, cm-devvit (no award), GravitonKV, APEX, ReWear-Fused, Hometown Pathway Atlas, GroundVault, SafePassage, Compass-VibeATL. EchoPay = archive card w/ figma link. SafeHaven = achievement only (in `achievements.ts`, not projects).
- `profile.ts`: name, handle "SPARTAN-SOOKRA" flavor, taglines, rewritten bio (AI-tone clean, no em-dashes), education, contacts (github StephenSook, linkedin, email), headline stat string.
- `experience.ts`: XR Dojo (work), Nest (founder), JPMorganChase (program), SMASH (teaching) — bullets from resume.
- `achievements.ts`: podium wins + SafeHaven + "15+ hackathons entered" + "4x Dean's List" + GPA + certs (CodePath, Wells Fargo×GCA, AT&T, Anthropic Academy, Udacity×AWS).
- `fandoms.ts`: Halo, Xbox 360, Call of Duty, Mortal Kombat, Marvel, DC, Game of Thrones, boxing, Knicks, Giants with accents.

- [ ] Write modules with real content.
- [ ] Create `scripts/check-links.mjs`: reads `projects.ts` (+ live URLs), curls each, prints non-200 (treats FastAPI `/docs` 200 as live; flags Render cold-start). Add npm script `links`.
- [ ] Run `node scripts/check-links.mjs`; record any non-200 and fix data (drop/adjust dead links). Expected: all featured live URLs 200.
- [ ] Verify: `npx tsc --noEmit` clean.
- [ ] Commit: `feat: typed verified content model + link checker`.

### Task 0.4: App shell, SEO, providers

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` (or static), `components/providers/SmoothScroll.tsx`, `components/providers/JsonLd.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `data/profile.ts`, `data/projects.ts`.
- Produces: `<SmoothScroll>` (Lenis, disabled under reduced-motion) wrapping children; per-page metadata helpers; Person JSON-LD.

- [ ] `SmoothScroll.tsx`: init Lenis in effect, rAF loop, respect `prefers-reduced-motion` (skip). Sync ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.
- [ ] `layout.tsx`: fix metadata (remove 5x/4x; use headline stat), add OG image, keywords, canonical, wrap `<SmoothScroll>`, add skip-link `<a href="#main">`, `JsonLd`.
- [ ] `sitemap.ts` lists `/`, `/work`, each `/work/[slug]`, `/lab`. `robots.ts` allows all + sitemap.
- [ ] Verify: build green; `curl localhost` after `next build && next start` returns sitemap/robots 200; Playwright confirms skip-link focus.
- [ ] Commit: `feat: SEO (sitemap/robots/OG/JSON-LD) + Lenis smooth scroll`.

### Task 0.5: Core HUD primitives

**Files:**
- Create: `components/hud/HudFrame.tsx`, `components/hud/KineticText.tsx`, `components/hud/MagneticButton.tsx`, `components/hud/SectionHeading.tsx`, `components/hud/AchievementToast.tsx` (+ `lib/toast.ts` store), `components/audio/AudioManager.tsx` (+ `lib/audio.ts`), `lib/motion.ts` (reduced-motion hook, gsap helpers)
- Evolve/replace: `components/ui/ShutterText.tsx`, `GooeyText.tsx` → fold into `KineticText`.

**Interfaces:**
- Produces:
  - `KineticText({ text, as, splitBy: "char"|"word", className })` — animated split with real accessible text (`aria-label={text}`, spans `aria-hidden`).
  - `MagneticButton({ children, href?, onClick })` — magnetic hover, respects reduced-motion.
  - `HudFrame({ children, label?, accent? })` — bracketed panel using `--accent`.
  - `useReducedMotion(): boolean`, `useGsapContext(scope)` helpers.
  - `toast.unlock({ title, detail })` + `<AchievementToaster/>` mount.
  - `<AudioToggle/>` + `audio.enable()/toggle()` — off by default, no autoplay, persists choice in `localStorage`.

- [ ] Implement each primitive; unit-test `lib/toast.ts` (enqueue/dedupe) and `useReducedMotion`.
- [ ] Verify: tsc + lint + build green; Playwright story: mount a test page rendering each primitive, screenshot.
- [ ] Commit: `feat: HUD primitives (kinetic text, magnetic button, frame, toast, audio)`.

---

## Milestone 1 — Home spine (themed sections)

Each section is one task: build component, wire real data, verify desktop+mobile+reduced-motion. Sections mount into `app/page.tsx`. Accent per spec §2. After 1.11, delete old `components/sections/*` + `siteContent.ts`.

### Task 1.1: Boot preloader + audio consent
**Files:** Create `components/sections/Boot.tsx`. **Theme:** Halo boot sequence. Progress %, "SYSTEM ONLINE // SPARTAN SOOKRA", audio-consent (Enable/Continue muted) wired to `audio.enable()`. Dismiss once per session (sessionStorage). Reduced-motion: instant. Verify + commit `feat: boot preloader + audio consent`.

### Task 1.2: Hero — Campaign Menu
**Files:** Create `components/sections/Hero.tsx`; evolve `components/three/*` into a dark Halo-ring/Forerunner artifact scene (reuse Ringworld/Starfield, drop astronaut/space kitsch; add subtle bloom). Giant `KineticText` name, HUD frame, rotating role line, generated player-card slot (`public/personal/player-card.png`, placeholder until Milestone 4), CTAs MagneticButton → `#missions` / `/resume`, audio toggle, scroll cue. Mobile + reduced-motion: static gradient + still art. Verify + commit.

### Task 1.3: About — Tale of the Tape (boxing)
**Files:** Create `components/sections/About.tsx`. Real headshot (`public/personal/headshot.jpg`) in a fight-card frame; stat rows (Class: AI/ML, Reach: Full-Stack, Record: 7-0 podium, Base: Atlanta GA, League: KSU CS '28) from `profile.ts`; bio as fighter story. Accent MK amber-red. Verify + commit.

### Task 1.4: Arsenal — Loadout (Xbox/CoD)
**Files:** Create `components/sections/Arsenal.tsx`. Skills from `profile.ts` as weapon-slot cards (Primary: languages, Secondary: frameworks, Tactical: tools), concepts as PERKS. Xbox-blade hover. Verify + commit.

### Task 1.5: Missions — Selected Work (Halo mission-select)
**Files:** Create `components/sections/Missions.tsx`, `components/work/MissionRow.tsx`. Numbered featured list from `projects.ts` (tier featured), award = difficulty medal, hover preview (gallery[0] real screenshot), buttons DEPLOY (links.live) + INTEL (`/work/[slug]`). Link to `/work` ("VIEW ALL WORK"). Verify + commit.

### Task 1.6: Service Record — Achievements (Xbox achievements) + Nest
**Files:** Create `components/sections/ServiceRecord.tsx`. Timeline from `experience.ts` (Nest founder featured first or highlighted), trophy case from `achievements.ts`; achievement toasts fire on scroll-in (IntersectionObserver → `toast.unlock`). Certs as unlockables. Verify + commit.

### Task 1.7: The Bench — Influences (trading cards)
**Files:** Create `components/sections/Bench.tsx`. Card row from `fandoms.ts` (Knicks, Giants, Marvel, DC, GoT, MK, Halo, Xbox, CoD). Flip/tilt hover. Keep tasteful. Verify + commit.

### Task 1.8: Dossier — Resume (UNSC file)
**Files:** Create `components/sections/Dossier.tsx`. Embedded PDF (`public/resume/Stephen_Sookra_Resume.pdf` — replace with NEW resume from iCloud in Milestone 4) + "EXFIL DOSSIER" download. Mobile: thumbnail + download (no iframe). Verify + commit.

### Task 1.9: Comms — Contact (terminal)
**Files:** Create `components/sections/Comms.tsx`. Email scramble-copy (evolve `CopyEmailButton`), GitHub, LinkedIn, footer with © + Konami hint. Verify + commit.

### Task 1.10: Persistent chrome + Konami alt-theme
**Files:** Create `components/hud/NavDock.tsx` (evolve, drop tubelight identity), `components/hud/CustomCursor.tsx` (evolve energy-sword), `components/hud/Scanline.tsx`, `components/hud/KonamiTheme.tsx` (keydown sequence → toggle `data-theme="legendary"` + toast). Verify + commit.

### Task 1.11: Assemble page + retire old sections
**Files:** Rewrite `app/page.tsx` to mount Boot + all sections + chrome in order. Delete `components/sections/{Hero,About,Projects,Experience,Resume,Contact}Section.tsx` (old), `data/siteContent.ts`, unused `lib/constants.ts`. Full Playwright pass desktop 1440 + mobile 390 + reduced-motion; fix layout. Commit `feat: assemble Player One home spine`. Open PR to main; verify CI + deploy preview.

---

## Milestone 2 — Case studies + archive

### Task 2.1: Case-study route + template
**Files:** Create `app/work/[slug]/page.tsx` (+ `generateStaticParams`, `generateMetadata`), `components/work/CaseStudy.tsx`. Renders hero (name/outcome/stack), problem/build/result from `Project.caseStudy`, gallery (real screenshots), live+repo buttons, prev/next. 404 for unknown slug. Verify + commit.

### Task 2.2: Case-study content + screenshots
**Files:** Populate `caseStudy` + `gallery` for Trace, StepSafe, PyroLens, Saber, Nest. Capture real screenshots of each live site via Playwright into `public/projects/<slug>/`. (Nest: team-site screenshot; note private beta.) Verify links 200, screenshots present. Commit.

### Task 2.3: All Work archive
**Files:** Create `app/work/page.tsx`, `components/work/ArchiveGrid.tsx`. Grid of every project (featured + archive) with outcome, stack, live/repo links; featured link to case study. Filter by outcome/stack (client). Verify + commit. PR milestone to main; CI + deploy.

---

## Milestone 3 — Lab playground

### Task 3.1: Lab index + real experiments
**Files:** Create `app/lab/page.tsx`, `components/lab/*`. Ship 1-2 REAL experiments: (a) Halo-ring / Forerunner shader toy (R3F, interactive), (b) optional small canvas mini-game or the hero-scene sandbox. No placeholders. Cards link to each. Reduced-motion: static preview + note. Verify + commit. PR to main.

---

## Milestone 4 — Assets, audio, polish, ship

### Task 4.1: Generated brand assets
**Files:** `public/personal/player-card.png`, `public/brand/logo.svg|png`, `public/brand/medals/*`, `app/opengraph-image` real art, `app/favicon.ico` (replace default). Generate via kie.ai Nano Banana (player-card from headshot; SS Halo monogram; medal icons). Wire into Hero/nav/OG/favicon. Verify visually; commit.

### Task 4.2: New resume + audio track
**Files:** Copy new resume from `~/Library/Mobile Documents/com~apple~CloudDocs/Stephen_Sookra_Resume.pdf` → `public/resume/`. Add ambient loop `public/audio/ambient.mp3` (kie.ai Suno or licensed CC, credited), wire AudioManager (off by default, loop, low gain). Verify + commit.

### Task 4.3: A11y + performance + copy sweep
**Files:** cross-cutting. Run: axe/Playwright a11y checks (focus order, contrast, alt text, aria); Lighthouse; AI-tone grep over `data/*` + components for em-dashes + blocklist; `node scripts/check-links.mjs` final. Fix findings. Verify reduced-motion across all pages. Commit.

### Task 4.4: Deploy
**Files:** none. Confirm `.vercel/project.json` = `portfolio` (do NOT clobber another project). Merge branch → main via PR; capture merged SHA; watch main CI to green (per-job); `vercel --prod` from repo root or let Git integration deploy; verify stephensookra.com serves new site (`curl | grep` title). Commit any deploy config. Report live.

---

## Self-review (spec coverage)

- Fusion visual / Halo-evolve / maximal theming → Milestones 0-1 (tokens + 9 themed sections). ✓
- Structure spine + case studies + lab → M1/M2/M3. ✓
- Palette Halo spine + per-section accent → 0.2 + each section. ✓
- Player-card + real photo → 1.2 (slot) + 4.1 (asset) + 1.3 (photo). ✓
- Audio off-by-default + toggle → 0.5 + 1.1 + 4.2. ✓
- Featured case studies + archive + headline stat → 0.3 + 1.5 + 2.x. ✓
- Nest featured / SafeHaven text-only / no VARSITY-cm-devvit awards → 0.3. ✓
- SEO, a11y, reduced-motion, AI-tone, link-verify, repo hygiene → 0.2/0.4/0.5/4.3 + Global Constraints. ✓
- Generated assets, new resume → 4.1/4.2. ✓

**Placeholder scan:** foundation tasks carry real code/interfaces; section tasks carry files + theme + data source + verification. Visual JSX intentionally specified by theme+data+accent (executor writes markup) rather than pre-written pixel-by-pixel — acceptable for a design build; each is independently testable via Playshot.

**Risk:** big scope — mitigated by milestone PRs keeping main deployable; can pause after any milestone.
