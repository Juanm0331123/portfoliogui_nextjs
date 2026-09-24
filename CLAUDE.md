# CLAUDE.md

# No borrar -> claude --resume cbc64180-91b4-4299-9c78-1cc25f495d4f

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`AGENTS.md` holds the project's working rules, in Spanish: the mandatory skills in `.agents/skills` (`impeccable` and `ui-ux-pro-max` for any UI work, `git-commit`, `grill-me`), the quality bar and the reversible-transition rule. Read it before changing anything. `README.md` is outdated: it still describes the previous Framer Motion and React Three Fiber stack.

## Commands

- `npm run dev`: dev server (Turbopack).
- `npm run build`: production build. `--turbopack` is required, because without it Next 15.5 fails on Node 24 with a WasmHash error.
- `npm run start`: serve the production build.
- `npm run lint`: ESLint (`next lint`).
- `npx tsc --noEmit`: type check.
- There is no test suite.
- Never run `build` while `dev` or `start` is running. They share `.next`, and the route manifest gets corrupted, which shows up as `/api/contact` returning 404 or `start` serving stale pages.
- `/api/contact` sends mail through Nodemailer and needs `EMAIL_USER` and `EMAIL_PASS` in `.env.local`. See `.env.example`.
- npm is the package manager. A `pnpm-lock.yaml` is also committed, so keep both lockfiles in step, or remove one deliberately.

## Architecture

The site is a single page of scrollytelling: Next.js 15 App Router, next-intl, a pure Three.js particle swarm behind the page, GSAP ScrollTrigger and Lenis. The code follows Feature-Sliced Design, with imports going downwards only: `app` → `app-shell` → `widgets` → `features` → `entities` → `shared`.

### Page composition

- `src/app/[locale]/layout.tsx` is the root layout and wraps the page in `AppShell`.
- `src/app/[locale]/page.tsx` renders the section widgets in order.
- `AppShell` mounts the fixed WebGL canvas behind the page, the `Loader` in front of it, and the `Navbar`. After the page content it mounts the headless features (`SmoothScroll`, `SwarmChoreography`, `ScrollReveal`), so their effects run once every section is in the DOM.
- Only `html` has a background. An opaque background on `body`, `main` or any section would cover the canvas.

### The swarm (`src/shared/three/swarm`)

- **One point cloud.** A single `THREE.Points` cloud holds every formation (hero ring, about halo, skills lattice, flow field, waves, vortex and footer cloud).
    - Each formation is a precomputed per-particle attribute, built asynchronously in `formations.ts`.
    - `engine.ts` owns the renderer, the postprocessing (bloom, grain and vignette) and a per-formation color temperature table (`LOOK`).
- **Driven by one scalar.** The whole cloud moves with the formation coordinate `uProgress = 1 + Σ bands`.
    - The CPU splits that coordinate into `uStageA`, `uStageB` and `uFrac`.
    - Do not index uniform arrays dynamically in the shader. That caused visible cuts on ANGLE/D3D11 (Windows), and swiftshader did not reproduce it.
- **Adding or reordering a stage** means keeping these in sync:
    - `shared/config/sections.ts` (`sectionStage`, `STAGE_COUNT`);
    - `features/swarm-choreography/model/bands.ts` (`SWARM_BANDS`: one scrubbed band per transition, ranges never overlap);
    - the formation order in `formations.ts` and `shaders.ts`;
    - `LOOK` in `engine.ts`.
- **Boot.**
    - `boot()` compiles with `compileAsync` against the composer's input render target and precompiles the postprocessing materials, so the loader never freezes.
    - `markSwarmReady()` fires after a few real frames.
    - The device pixel ratio is chosen once at boot, never adaptively.

### Linking the DOM and 3D (`store.ts`)

- **Anchors.** Sections place formations with `<SwarmAnchor name=…>` (hero, about, face, skills, contact), which calls `registerSwarmAnchor`. The engine reads their rects every frame.
- **Skill labels.** The engine projects the lattice nodes to screen space every frame and calls `emitSkillNodes`. `widgets/skills/ui/SkillsLattice.tsx` positions the HTML labels from that. `entities/skill` `skillNodes` must stay in lattice order: the centre node, then six sectors of three.
- **Intro handshake.**
    1. The `Loader` waits for web fonts and `onSwarmReady` (with a fallback timeout).
    2. It hands its wordmark to the swarm (`publishWordmarkDissolve` → `setSwarmWordmark`).
    3. It dismisses, which calls `markAppReady`.
    4. `SwarmChoreography` plays wordmark → singularity → burst. A reload below the hero skips straight to the current formation.

### Scroll rules (from AGENTS.md, enforced in code)

- Every scroll animation goes through `scrubbed()` in `shared/animation/scroll.ts`, which forces `scrub: 1` and `invalidateOnRefresh`.
- No `once`, `toggleActions`, or enter/leave callbacks that write state. Scrolling back must replay every transition in reverse. All randomness is seeded.
- `settleScrollTriggers()` refreshes and snaps every trigger without catch-up. It runs after load and after fonts are ready.
- Inside a scoped `gsap.context`, pass trigger elements, not selector strings, because selectors resolve within the scope.
- For staggered reveals, use `gsap.set` followed by `.to`, not `fromTo` inside a timeline, which only immediate-renders the first target.
- Lenis runs on the GSAP ticker with `lagSmoothing(0)`. In the browser, `window.__lenis` is a dev handle for scripted scrolling.

### Content and i18n

- Spanish is served at `/` and English at `/en` (`localePrefix: 'as-needed'`, no locale detection). The middleware matcher excludes `/api`.
- `src/entities/*` hold only locale-invariant facts: names, ISO dates, links, images with a `focus` object-position, and stacks.
- All visible copy lives in `messages/{es,en}.json`, keyed by entity id (for example `Projects.items.<id>`, `Experience.items.<id>`, `Skills.families.<family>`). Adding a project, experience entry or skill family means editing the entity and both message files.
- Section labels (About, Stack, Projects…) deliberately stay in English in both locales, in `shared/config/sections.ts`.
- `site.ts` holds brand, links and the CV path.

## Verification

- For visual or animation changes, use headless Chrome with the real GPU (`--use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist`). Swiftshader hides the ANGLE-specific bugs.
- Check each section by scrolling down, back up, and stopping mid-transition. Check both locales at 1440×900 and at 390×844.

## Git and deploy

- Vercel deploys `main` (project `juanmigueldev`). Its commit status is the only CI; there are no GitHub Actions.
- The remote has a branch literally named `feat`, so `feat/*` branches cannot be pushed. Use `feature/*`, `fix/*` or `chore/*` instead.
- Commit messages use the owner's format: `[FEAT] …`, `[FIX] …`, `[CHORE] …`, `[DOCS] …`, with a detailed body in Spanish and no co-author trailers.
