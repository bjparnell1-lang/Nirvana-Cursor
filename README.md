# Nirvana Holistic Medicine

Premium luxury holistic medical marketing site for Dr. Shaundel Knights, College Park, MD.

## Run

- `npm install` — once after cloning
- `npm run dev` — Astro dev server at http://localhost:3000
- `npm run build` — production build to `dist/`
- `node serve.mjs` — serve the production build at http://localhost:3000 (used for screenshot QA)
- `node screenshot.mjs http://localhost:3000 <label> [viewportWidth]` — screenshot to `temporary screenshots/screenshot-N-<label>.png`

Default viewport is 1440px wide. Pass a third argument to use a different width:

```bash
node screenshot.mjs http://localhost:3000 home-pass-1 375
node screenshot.mjs http://localhost:3000 home-pass-1 1024
```

## Source of truth

- **Design spec:** [docs/superpowers/specs/2026-05-07-nirvana-design.md](docs/superpowers/specs/2026-05-07-nirvana-design.md) — locked architectural and design decisions.
- **Foundation plan (Phases 1-3):** [docs/superpowers/plans/2026-05-07-nirvana-foundation.md](docs/superpowers/plans/2026-05-07-nirvana-foundation.md) — the implementation plan that produced the current scaffold.
- **Frontend rules:** [Nates Claude.md](Nates%20Claude.md) — anti-generic guardrails, screenshot workflow, no-Inter mandate.
- **Brand brief:** [nirvana-project-plan.md](nirvana-project-plan.md) — the original project brief.
- **Source content (factual baseline):** [source-site/](source-site/) — 21 markdown files migrated into Astro content collections during Phase 1.

## Resuming work

Read the **foundation plan** (linked above) — its task list shows what's complete and what's next. The spec's **Decisions Log** (Section 9) tracks every locked design choice with date and propagation scope.

When a fresh chat picks this up:

1. Read `docs/superpowers/specs/2026-05-07-nirvana-design.md` (the spec).
2. Read `docs/superpowers/plans/2026-05-07-nirvana-foundation.md` (the foundation plan; identify the next pending task).
3. Per `Nates Claude.md`, invoke the `frontend-design` skill before writing any frontend code.
4. Phase 4 (Home page) is next after Phase 3 ships.

## Repository layout

```text
src/
├── content/        # Astro content collections — programs, services, IV protocols
├── data/           # nav data source (added in Phase 3)
├── styles/         # global.css with Tailwind + font-face + noise filter
├── layouts/        # BaseLayout (added in Phase 2)
├── components/
│   ├── system/     # Button, Container, Surface, Icon (added in Phase 2)
│   └── nav/        # Header, MegaMenu, MobileDrawer, Footer (added in Phase 3)
├── scripts/        # scoped client scripts (nav script added in Phase 3)
└── pages/          # routes — currently a placeholder; full route set lands in Phases 4-12

public/
├── fonts/          # self-hosted WOFF2: Fraunces + Plus Jakarta Sans
└── images/brand/   # runtime-served logo

brand_assets/       # canonical brand asset folder per Nates Claude.md
docs/               # spec + plans
source-site/        # factual baseline content (do not modify)
serve.mjs           # static server for production build screenshots
screenshot.mjs      # Puppeteer wrapper writing to temporary screenshots/
```

## Notes

- All page screenshots happen at `localhost:3000` — never `file:///`.
- Per `Nates Claude.md`, every UI change does at least two screenshot comparison passes.
- All Tailwind tokens (`nirvana.*` colors, `text-display`, `shadow-elevated`, `shadow-floating`, `ease-nirvana`, `duration-240`) are declared in `tailwind.config.mjs` (Phase 2).
- Content collections (`programs`, `services`, `iv-protocols`) have zod schemas in `src/content/config.ts`. Frontmatter validation runs on every dev/build.
