# Nirvana Foundation Implementation Plan (Phases 1-3)

> **For agentic workers:** Implement task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. After each task, screenshot per [Nates Claude.md](../../../Nates%20Claude.md) and commit.

**Goal:** Stand up the Astro project, establish design-system tokens and primitives, and ship working global navigation/footer chrome — leaving the site ready for the Home page (Phase 4 / Checkpoint A).

**Architecture:** Astro static site, content collections for repeatable detail pages, `@astrojs/tailwind` integration with all tokens declared in `tailwind.config.mjs`, self-hosted Fraunces + Plus Jakarta Sans (no Google CDN at runtime), Phosphor outline icons, scoped per-feature scripts (no framework runtime).

**Tech Stack:** Astro 4.x · Tailwind CSS 3.x · `@fontsource-variable/fraunces` · `@fontsource-variable/plus-jakarta-sans` · `@phosphor-icons/core` · Puppeteer (already global) · Node 18+.

**Source of truth:** [docs/superpowers/specs/2026-05-07-nirvana-design.md](../specs/2026-05-07-nirvana-design.md). All design decisions are locked there; this plan does not relitigate them.

---

## File Structure

Phase 1 lays the entire scaffold; Phase 2 fills the design tokens and primitives; Phase 3 adds the global chrome. The file map below is the **end-of-Phase-3** state.

```text
nirvana nate site/
├── astro.config.mjs                          [Phase 1]
├── tailwind.config.mjs                       [Phase 1 stub → Phase 2 fill]
├── package.json                              [Phase 1]
├── package-lock.json                         [Phase 1, auto]
├── README.md                                 [Phase 1]
├── serve.mjs                                 [Phase 1]
├── screenshot.mjs                            [Phase 1]
├── .gitignore                                [Phase 1, updated]
├── brand_assets/
│   └── nirvana-logo-transparent.png          [Phase 1, copied + renamed]
├── public/
│   ├── images/
│   │   └── brand/
│   │       └── nirvana-logo-transparent.png  [Phase 1, mirror of brand_assets]
│   └── fonts/                                [Phase 1, populated from npm]
├── src/
│   ├── content/
│   │   ├── config.ts                         [Phase 1]
│   │   ├── programs/                         [Phase 1, 5 .md files]
│   │   ├── services/                         [Phase 1, 8 .md files]
│   │   └── iv-protocols/                     [Phase 1, 14 .md files]
│   ├── data/
│   │   └── nav.ts                            [Phase 3]
│   ├── styles/
│   │   └── global.css                        [Phase 1 stub → Phase 2 fill]
│   ├── layouts/
│   │   └── BaseLayout.astro                  [Phase 2]
│   ├── components/
│   │   ├── system/
│   │   │   ├── Button.astro                  [Phase 2]
│   │   │   ├── Container.astro               [Phase 2]
│   │   │   ├── Surface.astro                 [Phase 2]
│   │   │   └── Icon.astro                    [Phase 2]
│   │   └── nav/
│   │       ├── Header.astro                  [Phase 3]
│   │       ├── MegaMenu.astro                [Phase 3]
│   │       ├── MobileDrawer.astro            [Phase 3]
│   │       └── Footer.astro                  [Phase 3]
│   ├── scripts/
│   │   └── nav.ts                            [Phase 3]
│   └── pages/
│       └── index.astro                       [Phase 1 placeholder → Phase 2 smoke test → Phase 3 nav-validation page]
└── temporary screenshots/
    └── .gitkeep                              [Phase 1]
```

---

## Phase 1 — Project Scaffold

**Phase goal:** `npm run dev` boots Astro on `http://localhost:3000` with Tailwind compiling, fonts self-hosted, content collections loadable.

### Task 1.1: Initialize Astro and Tailwind

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `src/pages/index.astro`

- [ ] **Step 1.1.1: Run Astro init non-interactively**

```bash
npm create astro@latest -- --template minimal --typescript strict --install --no-git --skip-houston --yes .
```

If the directory is non-empty (it is — we have `assets/`, `docs/`, `source-site/`, `Nates Claude.md`, `RESUME.md`, `nirvana-project-plan.md`), Astro will prompt. Use `--yes` plus `--force` if prompted, or fall back to manual creation:

```bash
npm init -y
npm install astro@^4 @astrojs/tailwind tailwindcss @astrojs/check typescript
```

- [ ] **Step 1.1.2: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false })],
  server: { port: 3000, host: 'localhost' },
});
```

`applyBaseStyles: false` is intentional — we ship our own `global.css` with `@tailwind` directives so we control the cascade order with font-face and SVG noise.

- [ ] **Step 1.1.3: Write `tailwind.config.mjs` (Phase 1 stub — real tokens land in Phase 2)**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
```

- [ ] **Step 1.1.4: Write `src/styles/global.css` (Phase 1 stub)**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 1.1.5: Write `src/pages/index.astro` placeholder**

```astro
---
import '../styles/global.css';
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Nirvana Holistic Medicine — scaffold</title>
  </head>
  <body>
    <main>
      <h1>Nirvana — scaffold up</h1>
      <p>Phase 1 verified. Continue to Phase 2 for design system tokens.</p>
    </main>
  </body>
</html>
```

- [ ] **Step 1.1.6: Verify dev server boots**

Run: `npm run dev`. Expected: Astro logs `Local http://localhost:3000`. Visit in browser; confirm "scaffold up" renders. Stop the server.

### Task 1.2: Add Self-Hosted Fonts

**Files:**
- Modify: `package.json` (deps)
- Create/Populate: `public/fonts/` with WOFF2 files

- [ ] **Step 1.2.1: Install fontsource packages**

```bash
npm install @fontsource-variable/fraunces @fontsource-variable/plus-jakarta-sans
```

- [ ] **Step 1.2.2: Copy WOFF2 files to `public/fonts/`**

The `@fontsource-variable` packages publish their WOFF2 files inside `node_modules/@fontsource-variable/<family>/files/`. Copy the latin-only variable files (we don't need cyrillic/vietnamese subsets) into `public/fonts/`:

```powershell
New-Item -ItemType Directory -Force -Path public/fonts
Copy-Item node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2 public/fonts/
Copy-Item node_modules/@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2 public/fonts/ -ErrorAction SilentlyContinue
Copy-Item node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2 public/fonts/
```

If any specific filename differs from the npm package version published, list `node_modules/@fontsource-variable/fraunces/files/` and pick the latin-only variable WOFF2(s); same for plus-jakarta-sans.

`@font-face` declarations land in `global.css` during Phase 2.

### Task 1.3: Place the Logo

**Files:**
- Create: `brand_assets/nirvana-logo-transparent.png`, `public/images/brand/nirvana-logo-transparent.png`

- [ ] **Step 1.3.1: Copy and rename**

```powershell
New-Item -ItemType Directory -Force -Path brand_assets, public/images/brand
Copy-Item "assets/transparent logo for Nirvana.png" "brand_assets/nirvana-logo-transparent.png"
Copy-Item "brand_assets/nirvana-logo-transparent.png" "public/images/brand/nirvana-logo-transparent.png"
```

The original `assets/transparent logo for Nirvana.png` stays in place as historical record; the canonical and runtime copies use the spec-compliant filename.

### Task 1.4: Content Collection Schemas

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1.4.1: Write `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const sectionConfig = z.object({
  key: z.string(),
  title: z.string().optional(),
  variant: z.string().optional(),
}).passthrough();

const programs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    eyebrow: z.literal('MEDICAL PROGRAM'),
    lede: z.string(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    heroImageAspect: z.enum(['4/3', '3/4', '1/1', '16/9']).default('4/3'),
    icon: z.string().optional(),
    sections: z.array(sectionConfig).default([]),
    metadata: z.object({
      duration: z.string().optional(),
      commitmentLevel: z.string().optional(),
      pairsWith: z.array(z.string()).optional(),
    }).optional(),
    publishedAt: z.string(),
  }),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    eyebrow: z.literal('SERVICE'),
    lede: z.string(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    heroImageAspect: z.enum(['4/3', '3/4', '1/1', '16/9']).default('4/3'),
    icon: z.string().optional(),
    sections: z.array(sectionConfig).default([]),
    metadata: z.object({
      duration: z.string().optional(),
      price: z.string().optional(),
      pairsWith: z.array(z.string()).optional(),
    }).optional(),
    publishedAt: z.string(),
  }),
});

const ivProtocols = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['hydration', 'performance', 'wellness', 'beauty', 'detox', 'specialty']),
    shortDescription: z.string(),
    ingredients: z.array(z.string()).default([]),
    duration: z.string(),
    price: z.string().optional(),
    goodFor: z.array(z.string()).default([]),
    icon: z.string().optional(),
    thumbnailImage: z.string().optional(),
    publishedAt: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = {
  programs,
  services,
  'iv-protocols': ivProtocols,
};
```

### Task 1.5: Migrate Source Content into Collections

**Files (create all of these):**

Programs (5):
- `src/content/programs/cancer-care.md` ← `source-site/programs/cancer-care.md`
- `src/content/programs/diabetes-reversal.md` ← `source-site/programs/diabetes-reversal.md`
- `src/content/programs/hormone-harmony.md` ← `source-site/programs/hormone-harmony.md`
- `src/content/programs/autoimmune-support.md` ← `source-site/programs/autoimmune-support.md`
- `src/content/programs/gut-health.md` ← `source-site/programs/gut-health.md`

Services (8, IV Therapy excluded — its consolidated page is bespoke):
- `src/content/services/colon-hydrotherapy.md` ← `source-site/services/colon-hydrotherapy.md` (or `colonics.md`, whichever has more content; copy both into one body if they're complementary)
- `src/content/services/sauna-body-wrap.md` ← `source-site/services/sauna-massage.md`
- `src/content/services/laser-lipo.md` ← (no direct source; placeholder body, marked TODO in body comment)
- `src/content/services/foot-detox.md` ← `source-site/services/foot-detox.md`
- `src/content/services/fit-3d-body-scan.md` ← `source-site/services/fit-3d.md`
- `src/content/services/massage.md` ← `source-site/services/massage.md`
- `src/content/services/acupuncture.md` ← `source-site/services/acupuncture.md`
- `src/content/services/wellness-consultation.md` ← `source-site/services/consultation.md`

IV protocols (extracted from `source-site/services/iv-infusion.md`, 14 protocols across 4 source categories mapped to spec categories):

| File | Source category | Spec category |
|---|---|---|
| `high-dose-vitamin-c.md` | Cancer Care | specialty |
| `poly-mva.md` | Cancer Care | specialty |
| `iv-amino-acid.md` | Cancer Care | performance |
| `mistletoe.md` | Cancer Care | specialty |
| `iv-ala.md` | Cell Rejuvenation & Energy | performance |
| `nad-plus.md` | Cell Rejuvenation & Energy | performance |
| `iv-glutathione.md` | Cell Rejuvenation & Energy | detox |
| `iv-glutamine.md` | Cell Rejuvenation & Energy | wellness |
| `high-dose-ozone.md` | Anti-Viral & Fibromyalgia | specialty |
| `lysine-vitamin-c.md` | Anti-Viral & Fibromyalgia | wellness |
| `low-dose-ozone.md` | Anti-Viral & Fibromyalgia | wellness |
| `low-dose-vitamin-c.md` | Anti-Viral & Fibromyalgia | wellness |
| `cinderella-iv.md` | Beauty and Skin Care | beauty |
| `myers-nutrient-iv.md` | Beauty and Skin Care | beauty |

- [ ] **Step 1.5.1: Migrate one program file (cancer-care) to validate pattern**

Read `source-site/programs/cancer-care.md`. Write `src/content/programs/cancer-care.md` with the following frontmatter shape and the source body (stripped of "top of page" / "bottom of page" / "Skip to Main Content" boilerplate, kept otherwise unchanged):

```md
---
title: "Integrative Cancer Care"
slug: "cancer-care"
eyebrow: "MEDICAL PROGRAM"
lede: "Whole-person support during chemotherapy, radiation, post-surgery recovery, and survivorship — designed to work alongside your oncology team."
heroImage: "/images/programs/cancer-care-hero.jpg"
heroImageAlt: "Warm consultative moment between a practitioner and a patient in soft natural light."
heroImageAspect: "4/3"
sections:
  - { key: "what-is" }
  - { key: "who-this-is-for" }
  - { key: "approach" }
  - { key: "benefits" }
  - { key: "what-to-expect" }
  - { key: "whats-included" }
  - { key: "common-questions" }
  - { key: "quote" }
  - { key: "cta" }
metadata:
  pairsWith: ["iv-therapy", "acupuncture", "colon-hydrotherapy"]
publishedAt: "2026-05-07"
---

<!-- Body migrated from source-site/programs/cancer-care.md. Editorial pass scheduled for Phase 5. -->

[paste cleaned source body here]
```

`heroImage` paths are placeholders that resolve against `public/images/programs/`. The directory will be empty until real photography is sourced; until then, components fall back to `https://placehold.co/...` URLs.

Lede copy is short and editorial — written here from project knowledge, not invented from medical claims. Phase 5 will refine.

- [ ] **Step 1.5.2: Migrate the remaining 4 program files using the same pattern**

For each: appropriate `title`, `slug` matches filename, `lede` is one editorial sentence summarizing the program from the source body, `heroImage` follows the `/images/programs/<slug>-hero.jpg` convention, sections array reuses the canonical 9-key list above. `metadata.pairsWith` populated with cross-link slugs that make sense for each program.

- [ ] **Step 1.5.3: Migrate the 8 service files**

Same pattern, frontmatter `eyebrow: "SERVICE"`, `heroImage: /images/services/<slug>-hero.jpg`. For `laser-lipo.md` (no source), use a brief placeholder body and a `<!-- TODO: copy from clinic -->` comment so it's flagged.

Sections array for services (canonical):

```yaml
sections:
  - { key: "what-is" }
  - { key: "benefits" }
  - { key: "what-to-expect" }
  - { key: "who-this-is-good-for" }
  - { key: "pairs-with-programs" }
  - { key: "common-questions" }
  - { key: "quote" }
  - { key: "cta" }
```

- [ ] **Step 1.5.4: Extract 14 IV protocol files from `source-site/services/iv-infusion.md`**

For each protocol, frontmatter shape:

```md
---
title: "High-Dose Vitamin C"
slug: "high-dose-vitamin-c"
category: "specialty"
shortDescription: "High-concentration ascorbate infusion delivered intravenously to bypass the gut and reach therapeutic plasma levels."
ingredients: ["Ascorbic acid (50–100g)", "Sterile water for injection"]
duration: "2–3 hours"
price: "$225"
goodFor:
  - "Patients pursuing integrative oncology support alongside conventional care"
  - "Severe chronic infections"
  - "Acute immune support"
icon: "drop"
thumbnailImage: "/images/iv/high-dose-vitamin-c.jpg"
publishedAt: "2026-05-07"
order: 1
---

[short editorial body — 2-3 paragraphs paraphrased from source description, no medical claims invented]
```

Body content is paraphrased from source `iv-infusion.md`, with FDA-claim language replaced (no "treats," "cures," "guaranteed"). When source text uses charged phrasing, soften to "may support," "frequently used as part of an integrative approach for," etc. Per spec section 6.3.

`order` numbers within each category sequentially: 1, 2, 3... (controls display order on `/services/iv-therapy`).

- [ ] **Step 1.5.5: Verify content collections compile**

Run: `npm run dev`. Watch for Astro content-collection warnings/errors in the console. Expected: clean boot. If any frontmatter validation fails (most likely culprit: missing required field, or `category` value outside the enum), fix the offending file. Re-run.

### Task 1.6: Tooling Files

**Files:**
- Create: `serve.mjs`, `screenshot.mjs`, `temporary screenshots/.gitkeep`

- [ ] **Step 1.6.1: Write `serve.mjs`**

```js
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.join(__dirname, 'dist');
const port = 3000;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

http.createServer((req, res) => {
  let pathname = decodeURIComponent(req.url.split('?')[0]);
  if (pathname.endsWith('/')) pathname += 'index.html';
  let filePath = path.join(root, pathname);
  if (!filePath.startsWith(root)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      const fallback = path.join(root, '404.html');
      fs.readFile(fallback, (e, data) => {
        if (e) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(data);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
}).listen(port, 'localhost', () => {
  console.log(`serve.mjs · http://localhost:${port} · serving ${root}`);
});
```

- [ ] **Step 1.6.2: Write `screenshot.mjs`**

```js
import puppeteer from 'C:/Users/bjpar/AppData/Roaming/npm/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2];
const label = process.argv[3] || 'untitled';
if (!url) { console.error('Usage: node screenshot.mjs <url> [label]'); process.exit(1); }

const outDir = 'temporary screenshots';
fs.mkdirSync(outDir, { recursive: true });
const existing = fs.readdirSync(outDir).filter((f) => f.startsWith('screenshot-')).length;
const n = existing + 1;
const outPath = path.join(outDir, `screenshot-${n}-${label}.png`);

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();
console.log(`Saved ${outPath}`);
```

- [ ] **Step 1.6.3: Create `temporary screenshots/.gitkeep`**

Empty file. Allows git to track the folder.

### Task 1.7: README and `.gitignore`

**Files:**
- Create: `README.md`
- Modify: `.gitignore`

- [ ] **Step 1.7.1: Read existing `.gitignore`** and add these lines if missing:

```text
node_modules/
dist/
.astro/
temporary screenshots/*.png
!temporary screenshots/.gitkeep
.DS_Store
```

- [ ] **Step 1.7.2: Write `README.md`**

```markdown
# Nirvana Holistic Medicine

Premium luxury holistic medical marketing site for Dr. Shaundel Knights · College Park, MD.

## Run

- `npm install` once after cloning
- `npm run dev` — Astro dev server at http://localhost:3000
- `npm run build` — production build to `dist/`
- `node serve.mjs` — serve the production build at http://localhost:3000 (used for screenshot QA)
- `node screenshot.mjs http://localhost:3000 <label>` — screenshot to `temporary screenshots/screenshot-N-<label>.png`

## Source of truth

- **Design spec:** [docs/superpowers/specs/2026-05-07-nirvana-design.md](docs/superpowers/specs/2026-05-07-nirvana-design.md)
- **Foundation plan (Phases 1-3):** [docs/superpowers/plans/2026-05-07-nirvana-foundation.md](docs/superpowers/plans/2026-05-07-nirvana-foundation.md)
- **Frontend rules:** [Nates Claude.md](Nates%20Claude.md)
- **Brand brief:** [nirvana-project-plan.md](nirvana-project-plan.md)
- **Source content (factual baseline):** `source-site/`

## Resuming work

Read the plan markdown above. Its task list shows completed and pending phases. The spec's Decisions Log (Section 9) tracks every locked design choice.
```

### Task 1.8: Phase 1 Verification and Commit

- [ ] **Step 1.8.1: Boot dev server, screenshot, verify**

```bash
npm run dev
```

In a separate shell:

```bash
node screenshot.mjs http://localhost:3000 phase-1-scaffold-pass-1
```

Read the resulting PNG with the Read tool. Confirm: page renders, no Astro/Tailwind errors in console, fonts not yet visible (we haven't declared `@font-face` yet — that's Phase 2).

Stop the dev server.

- [ ] **Step 1.8.2: Commit Phase 1**

```bash
git add .
git commit -m "Phase 1: Astro scaffold, content collections, fonts, tooling"
git push origin main
```

---

## Phase 2 — Design System Foundation

**Phase goal:** every Tailwind utility a future component needs is reachable from `tailwind.config.mjs`. `BaseLayout.astro` and four system primitives (`Button`, `Container`, `Surface`, `Icon`) exist and pass a smoke-test page.

### Task 2.1: Tailwind Tokens (full design system)

**Files:**
- Modify: `tailwind.config.mjs`

- [ ] **Step 2.1.1: Replace stub `tailwind.config.mjs` with full token set**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nirvana: {
          ink: '#1F2A24',
          forestDeep: '#2F4233',
          sageDeep: '#4F5E47',
          sage: '#7A8B6F',
          celadon: '#C8D2BB',
          paper: '#F6F1E8',
          mist: '#E8E4DA',
          stone: '#C9B89C',
          clay: '#A57C5A',
          goldAntique: '#B89968',
        },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display:  ['clamp(3.25rem, 1.4rem + 5.5vw, 6rem)',   { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        h1:       ['clamp(2.5rem, 1.5rem + 3vw, 4rem)',       { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        h2:       ['clamp(1.875rem, 1.3rem + 1.8vw, 2.75rem)',{ lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h3:       ['clamp(1.375rem, 1.1rem + 0.9vw, 1.75rem)',{ lineHeight: '1.25', letterSpacing: '-0.01em' }],
        lede:     ['clamp(1.125rem, 1rem + 0.4vw, 1.375rem)', { lineHeight: '1.55' }],
        'body-lg':['1.0625rem', { lineHeight: '1.7' }],
        body:     ['1rem',      { lineHeight: '1.7' }],
        'body-sm':['0.9375rem', { lineHeight: '1.6' }],
        caption:  ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      spacing: {
        '2xs': '0.25rem',
        'xs':  '0.5rem',
        'sm':  '0.75rem',
        'md':  '1rem',
        'lg':  '1.5rem',
        'xl':  '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
        '5xl': '8rem',
        '6xl': '12rem',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        md: '6px',
        lg: '12px',
        xl: '20px',
        '2xl': '32px',
        full: '9999px',
      },
      boxShadow: {
        elevated:
          '0 1px 2px rgba(31, 42, 36, 0.04), 0 4px 12px rgba(122, 139, 111, 0.08)',
        floating:
          '0 2px 4px rgba(31, 42, 36, 0.06), 0 12px 28px rgba(79, 94, 71, 0.10), 0 24px 48px rgba(122, 139, 111, 0.06)',
      },
      transitionTimingFunction: {
        nirvana: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'nirvana-emphasis': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '240': '240ms',
        '600': '600ms',
      },
      maxWidth: {
        nirvana: '1280px',
        reading: '720px',
      },
    },
  },
  plugins: [],
};
```

### Task 2.2: Global CSS — Fonts, Noise Filter, Reduced Motion

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 2.2.1: Replace stub `global.css` with full file**

```css
/* Self-hosted variable fonts (no Google CDN at runtime) */
@font-face {
  font-family: 'Fraunces Variable';
  src: url('/fonts/fraunces-latin-wght-normal.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Plus Jakarta Sans Variable';
  src: url('/fonts/plus-jakarta-sans-latin-wght-normal.woff2') format('woff2-variations');
  font-weight: 200 800;
  font-style: normal;
  font-display: swap;
}

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    background-color: theme('colors.nirvana.paper');
    color: theme('colors.nirvana.ink');
    font-family: theme('fontFamily.body');
    font-size: theme('fontSize.body[0]');
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  body {
    min-height: 100vh;
  }
  h1, h2, h3, .display {
    font-family: theme('fontFamily.display');
    color: theme('colors.nirvana.ink');
  }
  ::selection {
    background-color: theme('colors.nirvana.celadon');
    color: theme('colors.nirvana.ink');
  }
  :focus-visible {
    outline: 2px solid theme('colors.nirvana.goldAntique');
    outline-offset: 2px;
    border-radius: 2px;
  }
}

@layer utilities {
  .nirvana-noise {
    position: relative;
  }
  .nirvana-noise::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.03;
    mix-blend-mode: multiply;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0ms !important;
    scroll-behavior: auto !important;
  }
}
```

The SVG noise data URL is embedded so we don't need a separate `<svg>` definition in the layout — any element with class `nirvana-noise` gets the texture. The 0.03 opacity satisfies the spec's "barely perceptible paper-grain" goal.

### Task 2.3: BaseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 2.3.1: Write `BaseLayout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const { title, description = 'Nirvana Holistic Medicine — College Park, MD', ogImage = '/images/brand/nirvana-logo-transparent.png' } = Astro.props;
const fullTitle = title === 'Nirvana Holistic Medicine' ? title : `${title} | Nirvana Holistic Medicine | College Park, MD`;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preload" href="/fonts/fraunces-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/plus-jakarta-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="icon" href="/images/brand/nirvana-logo-transparent.png" />
    <title>{fullTitle}</title>
  </head>
  <body class="bg-nirvana-paper text-nirvana-ink antialiased">
    <slot name="header" />
    <main>
      <slot />
    </main>
    <slot name="footer" />
  </body>
</html>
```

### Task 2.4: System Primitives

**Files:**
- Create: `src/components/system/Button.astro`, `Container.astro`, `Surface.astro`, `Icon.astro`

- [ ] **Step 2.4.1: Write `Button.astro`**

```astro
---
interface Props {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'md' | 'lg';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
}
const { variant = 'primary', size = 'md', href, type = 'button', class: cls = '' } = Astro.props;

const base = 'inline-flex items-center justify-center font-medium tracking-tight rounded-md duration-240 ease-nirvana motion-safe:transition-[transform,opacity,background-color,border-color,color,box-shadow] hover:-translate-y-[2px] active:scale-[0.99]';
const sizes = {
  md: 'text-body px-lg py-sm',
  lg: 'text-body-lg px-xl py-md',
};
const variants = {
  primary: 'bg-nirvana-sage text-nirvana-paper hover:bg-nirvana-sageDeep shadow-elevated hover:shadow-floating',
  secondary: 'bg-nirvana-paper text-nirvana-ink border border-nirvana-sage hover:bg-nirvana-mist',
  text: 'text-nirvana-ink underline decoration-nirvana-goldAntique decoration-1 underline-offset-[6px] hover:decoration-2',
};
const Tag = href ? 'a' : 'button';
---
<Tag class={`${base} ${sizes[size]} ${variants[variant]} ${cls}`} href={href} type={!href ? type : undefined}>
  <slot />
</Tag>
```

- [ ] **Step 2.4.2: Write `Container.astro`**

```astro
---
interface Props {
  variant?: 'default' | 'narrow' | 'wide';
  class?: string;
  as?: string;
}
const { variant = 'default', class: cls = '', as: Tag = 'div' } = Astro.props;
const variants = {
  default: 'max-w-nirvana mx-auto px-lg md:px-xl lg:px-[3rem]',
  narrow: 'max-w-reading mx-auto px-lg md:px-xl',
  wide: 'w-full',
};
---
<Tag class={`${variants[variant]} ${cls}`}>
  <slot />
</Tag>
```

- [ ] **Step 2.4.3: Write `Surface.astro`**

```astro
---
interface Props {
  variant?: 'paper' | 'mist' | 'paperBordered' | 'clay' | 'gold';
  class?: string;
  as?: string;
}
const { variant = 'paper', class: cls = '', as: Tag = 'div' } = Astro.props;
const variants = {
  paper: 'bg-nirvana-paper rounded-lg',
  mist: 'bg-nirvana-mist rounded-lg shadow-elevated',
  paperBordered: 'bg-nirvana-paper rounded-lg border border-nirvana-sage/40',
  clay: 'bg-nirvana-clay/15 rounded-lg',
  gold: 'bg-nirvana-paper rounded-lg border border-nirvana-goldAntique/60 shadow-floating',
};
---
<Tag class={`${variants[variant]} ${cls}`}>
  <slot />
</Tag>
```

- [ ] **Step 2.4.4: Write `Icon.astro`**

Phosphor outline icons are available as raw SVGs from `@phosphor-icons/core`. Install:

```bash
npm install @phosphor-icons/core
```

Then:

```astro
---
import fs from 'node:fs';
import path from 'node:path';

interface Props {
  name: string;
  size?: 16 | 20 | 24;
  class?: string;
  ariaLabel?: string;
}
const { name, size = 20, class: cls = '', ariaLabel } = Astro.props;

const svgPath = path.join(process.cwd(), 'node_modules/@phosphor-icons/core/assets/regular', `${name}.svg`);
let svg = '';
try {
  svg = fs.readFileSync(svgPath, 'utf8');
  svg = svg
    .replace('<svg', `<svg width="${size}" height="${size}" stroke-width="1.5" aria-hidden="${ariaLabel ? 'false' : 'true'}"${ariaLabel ? ` aria-label="${ariaLabel}"` : ''} class="${cls}"`)
    .replace(/\sfill="[^"]*"/g, ' fill="currentColor"');
} catch {
  console.warn(`Icon not found: ${name}`);
}
---
<Fragment set:html={svg} />
```

This reads the icon SVG at build time, so no runtime fetch and no JS overhead. Default size 20px, stroke 1.5px per spec section 3.9.

### Task 2.5: Smoke Test Page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 2.5.1: Replace placeholder with primitive smoke test**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Container from '../components/system/Container.astro';
import Button from '../components/system/Button.astro';
import Surface from '../components/system/Surface.astro';
import Icon from '../components/system/Icon.astro';
---
<BaseLayout title="Design System Smoke Test">
  <Container>
    <section class="py-3xl">
      <p class="text-caption uppercase text-nirvana-goldAntique mb-md">DESIGN SYSTEM</p>
      <h1 class="font-display text-display mb-lg">Nirvana primitives</h1>
      <p class="text-lede max-w-reading mb-2xl">A throwaway page to verify Tailwind tokens, primitives, and motion. Replaced in Phase 4 with the home hero.</p>

      <h2 class="font-display text-h2 mb-lg">Buttons</h2>
      <div class="flex flex-wrap gap-md mb-2xl">
        <Button variant="primary">Book Appointment</Button>
        <Button variant="primary" size="lg">Begin Consultation</Button>
        <Button variant="secondary">Explore Programs</Button>
        <Button variant="text">Read more</Button>
      </div>

      <h2 class="font-display text-h2 mb-lg">Surface tiers</h2>
      <div class="grid md:grid-cols-3 gap-lg mb-2xl">
        <Surface variant="paper" class="p-xl"><p class="text-body-sm">Paper · z=0</p></Surface>
        <Surface variant="mist" class="p-xl"><p class="text-body-sm">Mist · z=1</p></Surface>
        <Surface variant="paperBordered" class="p-xl"><p class="text-body-sm">Paper bordered · z=2</p></Surface>
        <Surface variant="clay" class="p-xl"><p class="text-body-sm">Clay · z=2 alt</p></Surface>
        <Surface variant="gold" class="p-xl"><p class="text-body-sm">Gold floating · z=3</p></Surface>
      </div>

      <h2 class="font-display text-h2 mb-lg">Type scale</h2>
      <div class="space-y-md mb-2xl">
        <p class="font-display text-display">Display fraunces</p>
        <p class="font-display text-h1">Heading 1</p>
        <p class="font-display text-h2">Heading 2</p>
        <p class="font-display text-h3">Heading 3</p>
        <p class="text-lede">Lede paragraph in Plus Jakarta Sans, line-height 1.55, slightly oversized for editorial intros.</p>
        <p class="text-body">Body copy at 1rem with line-height 1.7. The quick brown fox jumps over the lazy dog.</p>
        <p class="text-body-sm">Body small at 0.9375rem with line-height 1.6.</p>
        <p class="text-caption uppercase text-nirvana-goldAntique">CAPTION · ANTIQUE GOLD</p>
      </div>

      <h2 class="font-display text-h2 mb-lg">Icons</h2>
      <div class="flex items-center gap-md text-nirvana-sage">
        <Icon name="leaf" size={24} ariaLabel="Leaf" />
        <Icon name="heart" size={24} ariaLabel="Heart" />
        <Icon name="sparkle" size={24} ariaLabel="Sparkle" />
        <Icon name="drop" size={24} ariaLabel="Drop" />
      </div>
    </section>
  </Container>
</BaseLayout>
```

### Task 2.6: Phase 2 Verification and Commit

- [ ] **Step 2.6.1: Boot dev server, screenshot two passes**

```bash
npm run dev
```

Separate shell:

```bash
node screenshot.mjs http://localhost:3000 phase-2-primitives-pass-1
```

Read the PNG. Verify:
- Fraunces renders for headings, Plus Jakarta Sans for body (visible character shape difference).
- Each surface tier visually distinct (paper, mist with sage shadow, bordered paper, clay tint, gold-bordered floating).
- Buttons hover-translate without layout shift.
- Caption is uppercase, letter-spaced, `nirvana-goldAntique`.
- All four Phosphor icons render at 24px stroke 1.5px.
- No browser console errors.

If anything is off, fix and re-screenshot:

```bash
node screenshot.mjs http://localhost:3000 phase-2-primitives-pass-2
```

Stop dev server.

- [ ] **Step 2.6.2: Commit Phase 2**

```bash
git add .
git commit -m "Phase 2: design system tokens, BaseLayout, system primitives"
git push origin main
```

---

## Phase 3 — Global Chrome (Header / MegaMenu / MobileDrawer / Footer)

**Phase goal:** every page from this point inherits a working sticky header with mega-menu navigation, mobile drawer, and footer. Validated against responsive breakpoints with two screenshot passes.

### Task 3.1: Nav Data Source

**Files:**
- Create: `src/data/nav.ts`

- [ ] **Step 3.1.1: Write `src/data/nav.ts`**

```ts
export interface NavLink {
  label: string;
  href: string;
}

export interface NavCard {
  slug: string;
  name: string;
  href: string;
  thumbnail: string;
  thumbnailAlt: string;
  lede: string;
}

export const topLevel: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Foundation', href: '/foundation' },
];

export const programs: NavCard[] = [
  { slug: 'cancer-care', name: 'Integrative Cancer Care', href: '/programs/cancer-care', thumbnail: '/images/programs/cancer-care-hero.jpg', thumbnailAlt: 'Cancer care program', lede: 'Whole-person support during and after oncology treatment.' },
  { slug: 'diabetes-reversal', name: 'Diabetes Reversal', href: '/programs/diabetes-reversal', thumbnail: '/images/programs/diabetes-reversal-hero.jpg', thumbnailAlt: 'Diabetes reversal program', lede: 'Reset metabolic health through nutrition, lab work, and lifestyle.' },
  { slug: 'hormone-harmony', name: 'Hormone Harmony', href: '/programs/hormone-harmony', thumbnail: '/images/programs/hormone-harmony-hero.jpg', thumbnailAlt: 'Hormone harmony program', lede: 'Restore balance across thyroid, adrenal, and reproductive hormones.' },
  { slug: 'autoimmune-support', name: 'Autoimmune Support', href: '/programs/autoimmune-support', thumbnail: '/images/programs/autoimmune-support-hero.jpg', thumbnailAlt: 'Autoimmune support program', lede: 'Calm the immune response by addressing underlying drivers.' },
  { slug: 'gut-health', name: 'Gut Health', href: '/programs/gut-health', thumbnail: '/images/programs/gut-health-hero.jpg', thumbnailAlt: 'Gut health program', lede: 'Repair the gut to restore systemic resilience.' },
];

export const services: NavCard[] = [
  { slug: 'iv-therapy', name: 'IV Therapy', href: '/services/iv-therapy', thumbnail: '/images/services/iv-therapy-hero.jpg', thumbnailAlt: 'IV therapy', lede: 'Targeted infusions for hydration, performance, wellness, beauty, and detox.' },
  { slug: 'colon-hydrotherapy', name: 'Colon Hydrotherapy', href: '/services/colon-hydrotherapy', thumbnail: '/images/services/colon-hydrotherapy-hero.jpg', thumbnailAlt: 'Colon hydrotherapy', lede: 'Gentle, supervised colonic irrigation for digestive support.' },
  { slug: 'sauna-body-wrap', name: 'Sauna & Body Wrap', href: '/services/sauna-body-wrap', thumbnail: '/images/services/sauna-body-wrap-hero.jpg', thumbnailAlt: 'Sauna and body wrap', lede: 'Infrared heat plus mineral-rich body treatments.' },
  { slug: 'laser-lipo', name: 'Laser Lipo', href: '/services/laser-lipo', thumbnail: '/images/services/laser-lipo-hero.jpg', thumbnailAlt: 'Laser lipo', lede: 'Non-invasive body contouring via low-level laser therapy.' },
  { slug: 'foot-detox', name: 'Foot Detox', href: '/services/foot-detox', thumbnail: '/images/services/foot-detox-hero.jpg', thumbnailAlt: 'Foot detox', lede: 'Ionic foot bath as part of a broader detox protocol.' },
  { slug: 'fit-3d-body-scan', name: 'Fit3D Body Scan', href: '/services/fit-3d-body-scan', thumbnail: '/images/services/fit-3d-body-scan-hero.jpg', thumbnailAlt: 'Fit3D body scan', lede: 'Precise body composition tracking for measurable progress.' },
  { slug: 'massage', name: 'Massage', href: '/services/massage', thumbnail: '/images/services/massage-hero.jpg', thumbnailAlt: 'Massage therapy', lede: 'Therapeutic and relaxation modalities tailored to your needs.' },
  { slug: 'acupuncture', name: 'Acupuncture', href: '/services/acupuncture', thumbnail: '/images/services/acupuncture-hero.jpg', thumbnailAlt: 'Acupuncture', lede: 'Traditional Chinese medicine for pain, stress, and recovery.' },
  { slug: 'wellness-consultation', name: 'Wellness Consultation', href: '/services/wellness-consultation', thumbnail: '/images/services/wellness-consultation-hero.jpg', thumbnailAlt: 'Wellness consultation', lede: 'A thorough first conversation to map your care plan.' },
];

export const bookCta: NavLink = { label: 'Book Appointment', href: '/book-appointment' };
```

### Task 3.2: Header

**Files:**
- Create: `src/components/nav/Header.astro`

- [ ] **Step 3.2.1: Write `Header.astro`**

```astro
---
import { topLevel, bookCta } from '../../data/nav';
import Button from '../system/Button.astro';
---
<header
  data-nirvana-header
  class="sticky top-0 z-40 w-full bg-nirvana-paper/0 backdrop-blur-0 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-240 ease-nirvana data-[stuck=true]:bg-nirvana-paper/85 data-[stuck=true]:backdrop-blur-md data-[stuck=true]:border-nirvana-sageDeep/15"
>
  <div class="max-w-nirvana mx-auto px-lg md:px-xl lg:px-[3rem] flex items-center justify-between h-[80px]">
    <a href="/" class="flex items-center gap-sm" aria-label="Nirvana Holistic Medicine — home">
      <img src="/images/brand/nirvana-logo-transparent.png" alt="Nirvana Holistic Medicine" class="h-10 w-auto" />
    </a>

    <nav class="hidden lg:flex items-center gap-xl" aria-label="Primary">
      <a href="/" class="text-body-sm tracking-tight hover:text-nirvana-sageDeep">Home</a>
      <a href="/about" class="text-body-sm tracking-tight hover:text-nirvana-sageDeep">About</a>
      <button type="button" data-mega-trigger="programs" aria-haspopup="true" aria-expanded="false" class="text-body-sm tracking-tight hover:text-nirvana-sageDeep flex items-center gap-2xs">
        Medical Programs
        <span aria-hidden="true">▾</span>
      </button>
      <button type="button" data-mega-trigger="services" aria-haspopup="true" aria-expanded="false" class="text-body-sm tracking-tight hover:text-nirvana-sageDeep flex items-center gap-2xs">
        Services
        <span aria-hidden="true">▾</span>
      </button>
      <a href="/foundation" class="text-body-sm tracking-tight hover:text-nirvana-sageDeep">Foundation</a>
    </nav>

    <div class="flex items-center gap-md">
      <Button variant="primary" size="md" href={bookCta.href} class="hidden sm:inline-flex">{bookCta.label}</Button>
      <button type="button" data-drawer-trigger aria-label="Open menu" aria-controls="mobile-drawer" aria-expanded="false" class="lg:hidden inline-flex items-center justify-center p-sm rounded-md hover:bg-nirvana-mist">
        <span aria-hidden="true" class="block w-5 h-[2px] bg-nirvana-ink relative before:content-[''] before:absolute before:left-0 before:-top-[6px] before:w-5 before:h-[2px] before:bg-nirvana-ink after:content-[''] after:absolute after:left-0 after:top-[6px] after:w-5 after:h-[2px] after:bg-nirvana-ink"></span>
      </button>
    </div>
  </div>

  <slot name="mega-menus" />
</header>
```

`data-stuck` is the attribute the nav script toggles when scroll passes 80px. The CSS variants `data-[stuck=true]:...` give us a CSS-only sticky-state visual.

### Task 3.3: MegaMenu

**Files:**
- Create: `src/components/nav/MegaMenu.astro`

- [ ] **Step 3.3.1: Write `MegaMenu.astro`**

```astro
---
import { programs, services } from '../../data/nav';

interface Props {
  variant: 'programs' | 'services';
}
const { variant } = Astro.props;
const items = variant === 'programs' ? programs : services;
const hubHref = variant === 'programs' ? '/programs' : '/services';
const hubLabel = variant === 'programs' ? 'View all programs' : 'View all services';
const gridCols = variant === 'programs' ? 'lg:grid-cols-5' : 'lg:grid-cols-3';
---
<div
  data-mega-panel={variant}
  hidden
  class="absolute left-0 right-0 top-full bg-nirvana-paper border-t border-nirvana-celadon shadow-floating opacity-0 scale-[0.98] transition-[opacity,transform] duration-240 ease-nirvana-emphasis data-[open=true]:opacity-100 data-[open=true]:scale-100"
  role="region"
  aria-label={`${variant} menu`}
>
  <div class="max-w-nirvana mx-auto px-lg md:px-xl lg:px-[3rem] py-2xl">
    <ul class={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-lg`}>
      {items.map((item) => (
        <li>
          <a href={item.href} class="group flex flex-col gap-sm rounded-lg p-md hover:bg-nirvana-mist transition-colors duration-240 ease-nirvana">
            <div class="aspect-square w-16 rounded-md bg-nirvana-celadon overflow-hidden">
              <img src={item.thumbnail} alt={item.thumbnailAlt} loading="lazy" class="h-full w-full object-cover mix-blend-multiply" />
            </div>
            <div>
              <p class="font-display text-h3 leading-tight">{item.name}</p>
              <p class="text-body-sm text-nirvana-ink/75 mt-2xs">{item.lede}</p>
            </div>
            <span class="text-caption uppercase text-nirvana-goldAntique opacity-0 group-hover:opacity-100 transition-opacity duration-240 ease-nirvana">→</span>
          </a>
        </li>
      ))}
    </ul>
    <div class="mt-xl pt-lg border-t border-nirvana-celadon flex justify-end">
      <a href={hubHref} class="text-body-sm underline decoration-nirvana-goldAntique decoration-1 underline-offset-[6px] hover:decoration-2">{hubLabel} →</a>
    </div>
  </div>
</div>
```

### Task 3.4: MobileDrawer

**Files:**
- Create: `src/components/nav/MobileDrawer.astro`

- [ ] **Step 3.4.1: Write `MobileDrawer.astro`**

```astro
---
import { programs, services, bookCta } from '../../data/nav';
---
<div
  id="mobile-drawer"
  data-drawer
  hidden
  class="fixed inset-0 z-50 lg:hidden"
  role="dialog"
  aria-modal="true"
  aria-label="Site navigation"
>
  <div data-drawer-backdrop class="absolute inset-0 bg-nirvana-ink/40 opacity-0 transition-opacity duration-240 ease-nirvana data-[open=true]:opacity-100"></div>
  <aside data-drawer-panel class="absolute right-0 top-0 h-full w-[min(420px,90vw)] bg-nirvana-paper translate-x-full transition-transform duration-240 ease-nirvana data-[open=true]:translate-x-0 flex flex-col">
    <div class="flex items-center justify-between h-[80px] px-lg border-b border-nirvana-celadon">
      <span class="font-display text-h3">Menu</span>
      <button type="button" data-drawer-close aria-label="Close menu" class="p-sm rounded-md hover:bg-nirvana-mist">
        <span aria-hidden="true">✕</span>
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto px-lg py-lg space-y-md" aria-label="Mobile primary">
      <a href="/" class="block py-sm text-body">Home</a>
      <a href="/about" class="block py-sm text-body">About</a>

      <details class="group">
        <summary class="cursor-pointer list-none flex items-center justify-between py-sm text-body">
          <span>Medical Programs</span>
          <span aria-hidden="true" class="transition-transform duration-240 ease-nirvana group-open:rotate-180">▾</span>
        </summary>
        <ul class="mt-xs pl-md space-y-xs">
          {programs.map((p) => (
            <li><a href={p.href} class="flex items-center gap-md py-xs">
              <span class="block w-12 h-12 rounded-md bg-nirvana-celadon overflow-hidden"><img src={p.thumbnail} alt={p.thumbnailAlt} loading="lazy" class="h-full w-full object-cover mix-blend-multiply" /></span>
              <span class="text-body-sm">{p.name}</span>
            </a></li>
          ))}
        </ul>
      </details>

      <details class="group">
        <summary class="cursor-pointer list-none flex items-center justify-between py-sm text-body">
          <span>Services</span>
          <span aria-hidden="true" class="transition-transform duration-240 ease-nirvana group-open:rotate-180">▾</span>
        </summary>
        <ul class="mt-xs pl-md space-y-xs">
          {services.map((s) => (
            <li><a href={s.href} class="flex items-center gap-md py-xs">
              <span class="block w-12 h-12 rounded-md bg-nirvana-celadon overflow-hidden"><img src={s.thumbnail} alt={s.thumbnailAlt} loading="lazy" class="h-full w-full object-cover mix-blend-multiply" /></span>
              <span class="text-body-sm">{s.name}</span>
            </a></li>
          ))}
        </ul>
      </details>

      <a href="/foundation" class="block py-sm text-body">Foundation</a>
    </nav>

    <div class="p-lg border-t border-nirvana-celadon">
      <a href={bookCta.href} class="inline-flex w-full items-center justify-center bg-nirvana-sage text-nirvana-paper rounded-md px-xl py-md text-body-lg shadow-elevated hover:bg-nirvana-sageDeep">{bookCta.label}</a>
    </div>
  </aside>
</div>
```

`<details>` gives us native accessible accordions with no JS needed for the open/close mechanics. The drawer-level open/close still needs JS.

### Task 3.5: Footer

**Files:**
- Create: `src/components/nav/Footer.astro`

- [ ] **Step 3.5.1: Write `Footer.astro`**

```astro
---
import Container from '../system/Container.astro';
import Icon from '../system/Icon.astro';
---
<footer class="mt-5xl pt-3xl pb-xl bg-nirvana-paper border-t border-nirvana-celadon">
  <Container>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2xl">
      <div>
        <p class="text-caption uppercase text-nirvana-goldAntique mb-md">CONTACT</p>
        <ul class="space-y-sm text-body-sm">
          <li class="flex items-center gap-sm"><span class="text-nirvana-sageDeep"><Icon name="phone" size={20} ariaLabel="Phone" /></span><a href="tel:+13013229000" class="hover:underline decoration-nirvana-goldAntique underline-offset-[4px]">(301) 322-9000</a></li>
          <li class="flex items-center gap-sm"><span class="text-nirvana-sageDeep"><Icon name="envelope" size={20} ariaLabel="Email" /></span><a href="mailto:info@nirvanahealthy.com" class="hover:underline decoration-nirvana-goldAntique underline-offset-[4px]">info@nirvanahealthy.com</a></li>
          <li class="flex items-start gap-sm"><span class="text-nirvana-sageDeep mt-2xs"><Icon name="map-pin" size={20} ariaLabel="Address" /></span><span>College Park, MD</span></li>
        </ul>
      </div>
      <div>
        <p class="text-caption uppercase text-nirvana-goldAntique mb-md">HOURS</p>
        <ul class="space-y-2xs text-body-sm">
          <li class="flex items-center gap-sm"><span class="text-nirvana-sageDeep"><Icon name="clock" size={20} ariaLabel="Clock" /></span><span>Mon–Fri · 9:00 – 6:00</span></li>
          <li class="pl-[28px]">Sat · By appointment</li>
          <li class="pl-[28px]">Sun · Closed</li>
        </ul>
      </div>
      <div>
        <p class="text-caption uppercase text-nirvana-goldAntique mb-md">QUICK LINKS</p>
        <ul class="space-y-2xs text-body-sm">
          <li><a href="/programs" class="hover:underline decoration-nirvana-goldAntique underline-offset-[4px]">Medical Programs</a></li>
          <li><a href="/services" class="hover:underline decoration-nirvana-goldAntique underline-offset-[4px]">Services</a></li>
          <li><a href="/about" class="hover:underline decoration-nirvana-goldAntique underline-offset-[4px]">About</a></li>
          <li><a href="/foundation" class="hover:underline decoration-nirvana-goldAntique underline-offset-[4px]">Dr. Knights Foundation</a></li>
          <li><a href="/book-appointment" class="hover:underline decoration-nirvana-goldAntique underline-offset-[4px]">Book Appointment</a></li>
        </ul>
      </div>
    </div>

    <hr class="my-2xl border-0 border-t border-nirvana-goldAntique/40" />

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-sm">
      <p class="text-caption uppercase tracking-[0.08em] text-nirvana-ink/65">© {new Date().getFullYear()} NIRVANA HOLISTIC MEDICINE · COLLEGE PARK, MD</p>
      <p class="text-caption uppercase tracking-[0.08em] text-nirvana-ink/65">DR. SHAUNDEL KNIGHTS · INTEGRATIVE & FUNCTIONAL MEDICINE</p>
    </div>
  </Container>
</footer>
```

Phone, email, hours can be updated later if the clinic provides different values; placeholders here are derived from the source-site domain (`nirvanahealthy.com`).

### Task 3.6: Nav Script

**Files:**
- Create: `src/scripts/nav.ts`

- [ ] **Step 3.6.1: Write `src/scripts/nav.ts`**

```ts
const STICK_AT = 80;
const HOVER_CLOSE_DELAY = 150;

function initStickyHeader() {
  const header = document.querySelector<HTMLElement>('[data-nirvana-header]');
  if (!header) return;
  const onScroll = () => {
    header.dataset.stuck = window.scrollY > STICK_AT ? 'true' : 'false';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMegaMenus() {
  const triggers = document.querySelectorAll<HTMLButtonElement>('[data-mega-trigger]');
  const panels = document.querySelectorAll<HTMLElement>('[data-mega-panel]');
  let openVariant: string | null = null;
  let closeTimer: number | null = null;

  const open = (variant: string) => {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    if (openVariant && openVariant !== variant) closeAll(true);
    openVariant = variant;
    triggers.forEach((t) => t.setAttribute('aria-expanded', t.dataset.megaTrigger === variant ? 'true' : 'false'));
    panels.forEach((p) => {
      if (p.dataset.megaPanel === variant) {
        p.hidden = false;
        requestAnimationFrame(() => p.dataset.open = 'true');
      } else {
        p.dataset.open = 'false';
      }
    });
  };
  const closeAll = (immediate = false) => {
    openVariant = null;
    triggers.forEach((t) => t.setAttribute('aria-expanded', 'false'));
    panels.forEach((p) => {
      p.dataset.open = 'false';
      if (immediate) p.hidden = true;
      else setTimeout(() => { if (p.dataset.open === 'false') p.hidden = true; }, 240);
    });
  };
  const scheduleClose = () => {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => closeAll(), HOVER_CLOSE_DELAY);
  };

  triggers.forEach((t) => {
    const variant = t.dataset.megaTrigger!;
    t.addEventListener('mouseenter', () => open(variant));
    t.addEventListener('focus', () => open(variant));
    t.addEventListener('click', () => (openVariant === variant ? closeAll() : open(variant)));
    t.addEventListener('mouseleave', scheduleClose);
  });
  panels.forEach((p) => {
    p.addEventListener('mouseenter', () => { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } });
    p.addEventListener('mouseleave', scheduleClose);
  });
  document.addEventListener('click', (e) => {
    if (!openVariant) return;
    const target = e.target as Node;
    const insideTrigger = Array.from(triggers).some((t) => t.contains(target));
    const insidePanel = Array.from(panels).some((p) => p.contains(target));
    if (!insideTrigger && !insidePanel) closeAll();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
}

function initDrawer() {
  const trigger = document.querySelector<HTMLButtonElement>('[data-drawer-trigger]');
  const drawer = document.querySelector<HTMLElement>('[data-drawer]');
  if (!trigger || !drawer) return;
  const backdrop = drawer.querySelector<HTMLElement>('[data-drawer-backdrop]');
  const panel = drawer.querySelector<HTMLElement>('[data-drawer-panel]');
  const closeBtn = drawer.querySelector<HTMLButtonElement>('[data-drawer-close]');
  if (!backdrop || !panel) return;

  const open = () => {
    drawer.hidden = false;
    requestAnimationFrame(() => {
      backdrop.dataset.open = 'true';
      panel.dataset.open = 'true';
    });
    trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    (panel.querySelector('a, button') as HTMLElement | null)?.focus();
  };
  const close = () => {
    backdrop.dataset.open = 'false';
    panel.dataset.open = 'false';
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { drawer.hidden = true; trigger.focus(); }, 240);
  };

  trigger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) close();
  });
}

initStickyHeader();
initMegaMenus();
initDrawer();
```

### Task 3.7: Wire BaseLayout to Render Header + Footer

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 3.7.1: Update `BaseLayout.astro` to render Header, mega-menu panels, drawer, and Footer by default**

Replace the body markup of `BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import Header from '../components/nav/Header.astro';
import MegaMenu from '../components/nav/MegaMenu.astro';
import MobileDrawer from '../components/nav/MobileDrawer.astro';
import Footer from '../components/nav/Footer.astro';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}
const { title, description = 'Nirvana Holistic Medicine — College Park, MD', ogImage = '/images/brand/nirvana-logo-transparent.png' } = Astro.props;
const fullTitle = title === 'Nirvana Holistic Medicine' ? title : `${title} | Nirvana Holistic Medicine | College Park, MD`;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preload" href="/fonts/fraunces-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/plus-jakarta-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="icon" href="/images/brand/nirvana-logo-transparent.png" />
    <title>{fullTitle}</title>
  </head>
  <body class="bg-nirvana-paper text-nirvana-ink antialiased">
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-nirvana-paper px-md py-sm rounded-md">Skip to content</a>
    <Header>
      <Fragment slot="mega-menus">
        <div class="relative">
          <MegaMenu variant="programs" />
          <MegaMenu variant="services" />
        </div>
      </Fragment>
    </Header>
    <MobileDrawer />
    <main id="main">
      <slot />
    </main>
    <Footer />
    <script>
      import('../scripts/nav.ts');
    </script>
  </body>
</html>
```

Inline `<script>` with a dynamic import lets Astro bundle the script with tree-shaking + lazy parse, while still inlining the import call so it runs immediately.

- [ ] **Step 3.7.2: Update `src/pages/index.astro` to a nav-validation layout (placeholder for the real Phase 4 home page)**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Container from '../components/system/Container.astro';
---
<BaseLayout title="Nirvana Holistic Medicine">
  <Container>
    <section class="py-5xl">
      <p class="text-caption uppercase text-nirvana-goldAntique mb-md">PHASE 3 · NAV VALIDATION</p>
      <h1 class="font-display text-display mb-lg">Nirvana navigation</h1>
      <p class="text-lede max-w-reading mb-2xl">Scroll to verify sticky header. Hover the desktop nav to test mega-menus. Resize below 1024px to see the mobile drawer.</p>
    </section>
    <section class="space-y-lg pb-5xl">
      {Array.from({ length: 8 }).map((_, i) => (
        <p class="text-body-lg max-w-reading">
          Filler paragraph {i + 1}. The Aesop type discipline meets Tia/Parsley warmth meets medical seriousness — restored balance, deeper patterns, whole-person assessment, contributing factors, upstream causes. The home page replaces this content in Phase 4 with full brand-voice copy.
        </p>
      ))}
    </section>
  </Container>
</BaseLayout>
```

### Task 3.8: Phase 3 Verification

- [ ] **Step 3.8.1: Boot dev server and screenshot at five viewports**

Update `screenshot.mjs` to accept a `--viewport` flag, OR just create a small ad-hoc script. Easiest: keep `screenshot.mjs` as-is (1440 default) and run a one-off node command for the other widths:

For pass 1, run from a separate shell:

```bash
node screenshot.mjs http://localhost:3000 phase-3-nav-1440-pass-1
```

Then for the other widths, modify `screenshot.mjs` temporarily — or open a Node REPL:

```bash
node -e "import('puppeteer').then(async({default:p})=>{const widths=[375,768,1024,1280];for(const w of widths){const b=await p.launch({headless:'new'});const pg=await b.newPage();await pg.setViewport({width:w,height:900});await pg.goto('http://localhost:3000',{waitUntil:'networkidle0'});await pg.screenshot({path:`temporary screenshots/screenshot-phase-3-nav-${w}-pass-1.png`,fullPage:true});await b.close();}})"
```

(Use the absolute Puppeteer import path inside this if the global one doesn't resolve from the project's `node_modules`. If npm-installed Puppeteer is a hassle, reuse the absolute path — but then this one-liner needs adjustment to use the file URL form.)

Read each PNG. Verify:

- **375 (mobile):** logo + hamburger + sage Book CTA visible. Tapping hamburger opens drawer (test in dev tools touch mode).
- **768 (tablet):** mobile layout still active (lg breakpoint is 1024).
- **1024 (lg):** desktop nav appears. Logo · nav · Book CTA. No hamburger.
- **1280:** desktop nav gutters expand.
- **1440 default:** full layout, generous gutters.
- Scroll past 80px on any size: header gains paper background + faint border. No layout shift.
- Hover Programs/Services on desktop: panel opens 240ms with thumbnails + names + ledes.
- Footer shows three columns desktop / single column mobile.
- Focus visible: tab through nav. `nirvana-goldAntique` ring shows.

- [ ] **Step 3.8.2: Fix any visual issues, screenshot pass 2**

Re-run the screenshot suite with `pass-2` labels. Two passes minimum per Nates Claude.md.

- [ ] **Step 3.8.3: Stop dev server and commit**

```bash
git add .
git commit -m "Phase 3: Header, MegaMenu, MobileDrawer, Footer with scoped nav script"
git push origin main
```

### Task 3.9: Delete RESUME.md and update README

- [ ] **Step 3.9.1: Delete RESUME.md**

```bash
git rm RESUME.md
```

- [ ] **Step 3.9.2: Update README "Resuming work" section** so future sessions point at the plan markdown + spec rather than RESUME.md. The Phase 1 README already does this; verify and tweak as needed.

- [ ] **Step 3.9.3: Commit**

```bash
git add README.md
git commit -m "Remove RESUME.md; plan markdown + README are now the resume mechanism"
git push origin main
```

---

## Self-Review Checklist (run before handoff)

**1. Spec coverage:**
- Section 2.1 stack — covered (Phase 1.1, 1.2; Phase 2.1).
- Section 2.2 routes — collections + nav data align with the 14 routes; actual page files for routes other than `/` are deferred to Phases 4-12 per the spec phasing table.
- Section 2.3 folder structure — matches the file map in this plan.
- Section 2.4 schemas — mirrored exactly in `src/content/config.ts`.
- Section 2.5 tooling — `serve.mjs` + `screenshot.mjs` covered in Task 1.6.
- Section 3 design system — every token (color, type, spacing, radius, shadow, motion) lands in `tailwind.config.mjs` Task 2.1.
- Section 4 components — system primitives (Phase 2) + nav chrome (Phase 3) covered. Heroes, cards, content modules, booking primitives are deferred to later phases per the phasing table.
- Section 5 page templates — only `/` placeholder is in scope here; rest deferred.
- Sections 6, 7, 8, 9, 10, 11 — informational; downstream phases reference them.

**2. Placeholder scan:** No "TBD" or "TODO" steps. The `laser-lipo.md` body is explicitly flagged with a content TODO comment because no source content exists; this is acknowledged scope, not a plan placeholder.

**3. Type consistency:**
- `data-nirvana-header`, `data-mega-trigger`, `data-mega-panel`, `data-drawer`, `data-drawer-trigger`, `data-drawer-backdrop`, `data-drawer-panel`, `data-drawer-close` — names match between Header.astro / MegaMenu.astro / MobileDrawer.astro (Tasks 3.2, 3.3, 3.4) and the script handlers (Task 3.6).
- `tailwind.config.mjs` token names (`nirvana.sage`, `nirvana.celadon`, `text-display`, `shadow-elevated`, `shadow-floating`, `duration-240`, `ease-nirvana`, etc.) match utilities used in components.
- Phosphor icon names referenced (`leaf`, `heart`, `sparkle`, `drop`, `phone`, `envelope`, `map-pin`, `clock`) are valid `@phosphor-icons/core` regular asset slugs.

---

## Phase 4 Pre-Read

Once Phase 3 ships and RESUME.md is gone, the next session opens with:
1. `frontend-design` skill (mandatory per Nates Claude.md every session writing frontend code).
2. Phase 4 = Home page with full brand-voice copy. Checkpoint A: voice + visual rhythm calibration. Locks tokens for the remaining 12 routes.

A new plan markdown will be written for Phase 4 at that point.
