# Portfolio Revamp — Design Spec ("Player One")

- **Date:** 2026-07-05
- **Owner:** Stephen Sookra
- **Repo:** github.com/StephenSook/Portfolio (main) → Vercel project `portfolio` → stephensookra.com
- **Status:** Design approved 2026-07-05. Spec under review, then implementation plan.

## 1. Goal & non-goals

**Goal.** Replace the current portfolio (Next.js 16 Halo site that reads as generic sci-fi glassmorphism) with a distinctive, cinematic, personality-maximal site that fuses the two reference portfolios and is grounded in Stephen's real identity and verified work.

- Reference A — **cortiz.dev**: dark cinematic premium. Preloader + audio consent, kinetic letter-split typography, 3D/WebGL, synthwave ambient audio, numbered editorial "selected works" with hover previews + award badges, magnetic buttons, per-project detail pages (`/work/[slug]`), a `/labs` playground. Awwwards-tier polish.
- Reference B — **daveholloway.uk**: electric brutalist. Giant condensed extruded display type, thick black frames, bold flat illustration, and the signature device: **each section is themed in the native UI of a real-life passion** (football scoreboard "HOME 0 – AWAY 0", client "ROSTER", stadium pitch, guitar). A "GOLD" alt-theme toggle. Playful, high-energy. Has a `/lab` article index.

**Approved direction (locked 2026-07-05):**
1. **Visual:** Fusion — Cortiz cinematic dark shell as the premium spine + Dave's themed-section device.
2. **Halo:** Evolve — keep Halo DNA as one signature thread, discard the stock cyan-glass + generic space scene.
3. **Personality:** Maximal — every section fully themed from Stephen's fandoms.
4. **Structure:** Home spine + per-project case-study pages + a `/lab` playground.
5. **Palette:** Halo spine (Spartan green + Forerunner gold/amber) + per-section fandom accents.
6. **Avatar:** Generated player-card gamerpic (hero) + real headshot (About).
7. **Audio:** Ambient loop, OFF by default, with a toggle.
8. **Projects:** Featured case studies + full "All Work" archive; headline stat "7 top-3 finishes across 6 events." Expand featured set as new wins land.

**Fandom anchors:** Halo (primary), video games generally, Xbox 360, Call of Duty, Mortal Kombat, Marvel, DC, Game of Thrones, boxing, New York Knicks, New York Giants.

**Non-goals.** No blog/CMS. No backend/DB (static content modules). No e-commerce. No login. No live third-party data feeds. Not a hackathon submission (but the same evidence discipline applies: every featured link live, real screenshots, no fictional data, `/lab` ships real experiments).

## 2. Design language

**Palette (final hex tuned in build):**
- Base: `#05070A` void black; panel `#0B0F14`; hairline `rgba(255,255,255,0.08)`.
- Primary energy — Halo: Spartan green `~#8CFF5A`, Forerunner gold/amber `~#F5B33C`; UNSC HUD blue `~#4CC2FF`; ice/steel `~#AEE7FF`.
- Text: bone `#EAF2F5`; muted `#8FA0AA`.
- Per-section secondary accents: Mortal Kombat amber-red `#FF5A1F`; NY Giants royal `#0B2265` / red `#A71930`; NY Knicks orange `#F58426` / blue `#006BB6`; Marvel red `#ED1D24`; DC blue `#0476F2`; GoT ice-steel `#9FB6C3`. Applied as a per-section CSS custom property (`--accent`) so a section reads as its own room without breaking the spine.
- Alt-theme ("LEGENDARY", Konami-unlocked): swaps the spine to a red/amber danger palette (Dave's GOLD analog).

**Typography:**
- Display (giant Dave-scale headers): heavy wide grotesque — candidate free faces: `Archivo` (Expanded weights) or `Anton`; final pick during build, loaded via `next/font`.
- HUD / techno labels (Halo feel): `Chakra Petch` or `Rajdhani`.
- Body: clean grotesque — keep `Geist` or move to `Inter`.
- Mono micro-labels: `Geist Mono` / `JetBrains Mono`.
- Kinetic type: Cortiz-style per-character split reveals, shutter, scramble (evolve existing `ShutterText` / `GooeyText`). Decorative split spans get `aria-hidden`; an accessible text node is always present.

**Motion & tech stack:**
- Keep: Next.js 16 App Router, React 19, Tailwind 4, `@react-three/fiber` + `drei` + `three`, `framer-motion`.
- Add: `gsap` + `ScrollTrigger` (already a dep, wire it), `lenis` smooth-scroll, `@studio-freight`-style scroll approach.
- Every animation and 3D scene has a `prefers-reduced-motion` static fallback. Mobile gets lighter 3D (reuse `isMobile`).

**Persistent UI:** HUD nav dock (evolve `NavDock`, drop the lifted "tubelight" identity), custom energy cursor (evolve energy-sword, respect coarse pointers), scanline/CRT overlay (evolve), audio toggle, achievement-toast system, Konami-code alt-theme.

## 3. Information architecture

**Routes**
- `/` — home spine (sections below).
- `/work` — All Work archive: full grid of ~16 shipped projects, filterable by outcome/stack.
- `/work/[slug]` — case-study pages for featured projects.
- `/lab` — playground index; ships **1–2 real experiments** (e.g. a Halo-ring shader toy and/or a small playable canvas game). No empty/placeholder lab.
- Optional `/lab/[slug]` if an experiment needs its own page.

**Home sections (section → native-UI theme):**
0. **Boot** — Halo boot sequence preloader + audio-consent modal. "SYSTEM ONLINE // SPARTAN SOOKRA", progress %.
1. **Hero — Campaign Menu** (Halo main menu) — giant kinetic "STEPHEN SOOKRA", HUD frame corners, generated **player-card gamerpic**, dark 3D Halo-ring/Forerunner artifact, rotating role line, CTAs "▸ VIEW MISSIONS / ▸ DOSSIER", audio toggle, scroll cue.
2. **About — Tale of the Tape** (boxing fight card) — **real headshot**, stats as a tale-of-the-tape (e.g. Class: AI/ML; Reach: full-stack; Record: 7-0 podium), bio rewritten as the fighter story (no em-dashes).
3. **Arsenal — Loadout** (Xbox/CoD loadout) — skills as weapon-slot cards (languages, frameworks, tools), concepts (ML/NLP/CV) as "PERKS".
4. **Missions — Selected Work** (Halo mission-select) — numbered list, award = difficulty medal, hover preview (real screenshot/video), "DEPLOY" (live) + "INTEL" (→ `/work/[slug]`).
5. **Service Record** (Xbox Achievements) — experience timeline (XR Dojo, **Nest — Founder**, JPMorganChase, SMASH) + trophy case of achievements (podium wins, "15+ hackathons entered", "4× Dean's List", certifications as unlockables). Achievement toasts fire on scroll into view.
6. **The Bench — Influences** (trading-card roster) — Easter-egg cards nodding to Knicks, Giants, Marvel, DC, GoT, Mortal Kombat (Dave's "favourite things" analog).
7. **Dossier — Resume** (UNSC classified file) — embedded **new** resume PDF + "EXFIL DOSSIER" download.
8. **Comms — Contact** (comms terminal) — email (letter-scramble copy button), GitHub, LinkedIn; footer + Konami hint.

## 4. Content model (typed, replaces stale `data/siteContent.ts`)

Split into typed modules under `data/`:
- `profile.ts` — name, handle, taglines, bio (rewritten, AI-tone-clean), education, contacts, headline stat.
- `projects.ts` — `Project { slug, name, tagline, tier: 'featured'|'archive', outcome, award?, dates, stack[], role, links: {live?, repo?, note?}, gallery[], caseStudy?: {problem, build, result, media[]} }`.
- `experience.ts` — roles incl. Nest (Founder), XR Dojo, JPMorganChase, SMASH.
- `achievements.ts` — trophy-case entries + certifications.
- `fandoms.ts` — influence cards.

**Featured projects (case-study pages)** — real deployed app + strong narrative:
- **Trace** — 1st of 22, Actian VectorAI Build Challenge. Live: trace-forensic-search-ssookra-7703s-projects.vercel.app. Repo: /trace-forensic-search.
- **StepSafe** — 1st, HMI Hackathon 2026. Live: stepsafe-web.vercel.app. Repo: /StepSafe.
- **PyroLens** — 2nd Assurant + 3rd Capgemini, KSU Social Good. Live: pyrolens.vercel.app. Repo: /PyroLens.
- **Saber** — 3rd, Vibra ATL 2026 (SHPE). Live: saber-web-oz35.onrender.com (Render cold-start; show a "warming up" affordance). Repo: /Saber.
- **Nest** — Founder & Project Lead (foster-youth AI navigator; KSU ASCEND; C-Day UC-151-197). Live: nest-portfolio-pi.vercel.app (team site). App repo **private** → framed "private beta", no public code link. Not a hackathon result; framed as a founding initiative.

**Awards / archive-only (no case study):**
- **EchoPay** — 3rd, KSU FinTech 2025. Figma prototype only (no code repo, no deployed app) → card with Figma link, labeled "prototype".
- **SafeHaven** — 2nd, Wells Fargo × Global Career Accelerator Early Talent Competition (Top 2 of 4,700+). **Pitch competition, slides only; deck not recovered from disk → text-only award, no link.**
- **All Work archive** (`/work`): Rooted, VARSITY, CornerCheck, Custody, Compass (0G), cm-devvit, GravitonKV, APEX, ReWear-Fused, Hometown Pathway Atlas, GroundVault, SafePassage, Compass (Vibe ATL), etc. Each links to repo + live where they exist (all curl-verified).

**Content integrity rules:**
- Single source of truth for the headline stat: **"7 top-3 finishes across 6 events (15+ entered)"** (resume-authoritative). Fix the layout metadata "5×/4×" inconsistency.
- **No award claims** on results-unknown projects (VARSITY, cm-devvit).
- Every link curl-verified 200 before ship (FastAPI backends: check `/docs`). Prefer Vercel URLs; Render links get a cold-start affordance.
- Real project **screenshots** are primary media; generated art is decorative chrome only (Demo-Evidence rule).

## 5. Generated assets (kie.ai / Nano Banana; Higgsfield only if quality demands)

- Player-card gamerpic (Spartan-visor / stylized treatment of the real headshot).
- Personal monogram/logo "SS" (Halo/Forerunner-inspired) → nav, favicon, OG.
- Achievement/medal icon set.
- `opengraph-image` (currently missing).
- Ambient audio: royalty-free synthwave/Halo-esque loop (or Suno via kie.ai), OFF by default. If no suitable MCP asset, use a licensed/CC track and credit it.

## 6. Cross-cutting concerns

**Accessibility:** skip-to-content link; keyboard-navigable HUD nav + focus-visible states; `aria-hidden` on decorative split-letters with real text underneath; full `prefers-reduced-motion` fallbacks (kill WebGL → static art); audio never autoplays; color-contrast AA on text; alt text on all imagery.

**SEO (all currently missing):** per-page `metadata`, `sitemap.ts`, `robots.ts`, `opengraph-image`, JSON-LD `Person`. Correct hackathon-count copy.

**Performance:** lazy-load 3D + heavy sections; mobile lighter scenes; image optimization via `next/image`; audio lazy-loaded; target good Core Web Vitals.

**Error/edge handling:** reduced-motion, no-JS graceful text, coarse-pointer (no custom cursor), cold-start API links, external links `rel="noopener"`.

**AI-tone:** every string swept — no em-dashes (current bio has two), none of the blocklist words. Copy in Stephen's voice.

**Repo hygiene (fix as part of this work):** gitignore + delete `cortiz code` (16MB) and `dave code` (30MB); gitignore `.playwright-mcp/`, `*.jpeg` recon shots, `dave-lab-snapshot.md`, scratchpad artifacts; remove or wire unused `lib/constants.ts`; ensure `.env`-class files ignored (none present today).

## 7. Verification & delivery

- **Playwright** screenshot verification per section, desktop (1440) + mobile (390), light on reduced-motion.
- **Link-check** script: every featured/archive URL returns 200 (or documented cold-start).
- **Build gate** per commit: `tsc` + `eslint` + `next build` green.
- **AI-tone sweep** on all copy before commit.
- **Atomic commits**, push after each; watch post-merge main CI.
- Deploy to the existing `portfolio` Vercel project (verify `.vercel/project.json` before `--prod`; do not clobber another project).

## 8. Open items / decisions still needed

- SafeHaven → text-only award (resolved: no deck on disk). ✓
- Final font pick (display + HUD face) — decide in build, show Stephen a sample.
- Exact featured-project count is data-driven; starts at 5 case studies (Trace, StepSafe, PyroLens, Saber, Nest), expands as new wins land.
- Ambient track source (generated vs licensed) — decide when building audio.

## 9. Risks

- Scope is large (multi-page + maximal theming + 3D + audio + generated assets). Mitigate: build the home spine section-by-section behind atomic commits; case-study pages + `/lab` as later milestones; ship incrementally, keep main deployable.
- Maximal theming risk of feeling gimmicky → hold a consistent HUD spine + real polish so it reads intentional, not busy.
- Render cold starts make a live link feel broken → cold-start affordance or prefer Vercel.
- Generated-asset quality → real screenshots stay primary; regenerate or cut chrome that looks off.
