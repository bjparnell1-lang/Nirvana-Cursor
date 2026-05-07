# Nirvana Holistic Medicine — Design Spec

- **Date:** 2026-05-07
- **Brand:** Nirvana Holistic Medicine
- **Practitioner:** Dr. Shaundel Knights
- **Location:** College Park, MD
- **Project:** Premium luxury holistic medical marketing website
- **Status:** Spec drafted; awaiting user approval before implementation
- **Related files:** `nirvana-project-plan.md`, `Nates Claude.md`, `source-site/` (factual baseline)

---

## 1. Locked Decisions Summary

These were arrived at via brainstorming on 2026-05-07. They are the canonical inputs to the build.

| Decision | Locked Value |
|---|---|
| Architecture | Astro static site with content collections + islands; `@astrojs/tailwind` integration (compiled, not CDN); self-hosted Fraunces + Plus Jakarta Sans; Phosphor outline icons. |
| Routes | 14: `/`, `/about`, `/programs`, 5 program detail pages, `/services`, `/services/iv-therapy` (consolidated), 8 service detail pages, `/foundation`, `/book-appointment`. |
| Aesthetic territory | Editorial-clinical hybrid (Aesop type discipline + Tia/Parsley warmth + medical seriousness). |
| Display typeface | **Fraunces** (variable: opsz, wght, soft axes). Self-hosted. |
| Body typeface | **Plus Jakarta Sans**. Self-hosted. Inter is forbidden per `Nates Claude.md`. |
| Color palette | Expanded Palette A (10 tokens; see Section 3). Five greens spanning ink → forest deep → sage deep → sage primary → celadon haze, paired with paper, mist, stone, clay, antique gold. |
| Imagery strategy | Hybrid V1: curated stock for emotional/human moments; typography-led layouts where appropriate; AI/still-life for non-people textural accents only; user replaces with real photos post-launch. Photo on every program AND every service. |
| Hero treatment | Split 55/45 layout, type-left + photo-right with `forestDeep` 0–40% top-down gradient + `stone` mix-blend-multiply 25% tint. |
| Navigation | Sticky header on scroll; mega-menu with 64×64 thumbnails for Programs (5) and Services (9); mobile drawer with collapsible accordion sections. |
| IV Therapy page | Editorial long-page with sticky anchor TOC; one `IVProtocolBlock` per protocol with `MetadataBlock` for ingredients/duration/price. |
| CTA strategy | Header CTA (persistent) + contextual intra-page CTA at end of every detail page. Foundation gets non-booking CTA path ("Support the Foundation"). |
| Booking integration | CharmHealth Web Embed Calendar (request-mode, pre-screening on, card-on-file optional per visit type). Single insertion point: `<div id="charm-embed-slot">` with `CHARM-EMBED:BEGIN/END` paste markers. Placeholder design active until snippet arrives. `ContactPanel` always visible as fallback. |
| Content scope | Full editorial latitude granted by user. Source markdown is factual baseline; voice, structure, and section count at editorial discretion. High-ROI sections (What Is X / Benefits / What to Expect / Common Questions / Who This Is For) added per-page where they serve visitors. |
| Voice principles | Calm, credible, root-focused. Vocabulary varies: underlying drivers, deeper patterns, whole-person assessment, restoring balance, contributing factors, upstream causes. No exclamation points. No wellness clichés. Patient-facing not provider-facing. |
| Build cadence | One page at a time with explicit checkpoints. Decisions propagate to remaining pages via Tailwind config tokens + content-collection templates + a maintained Decisions Log in this spec. |

---

## 2. Architecture & Project Structure

### 2.1 Stack

- **Astro** for static-site generation. Routes are `.astro` files in `src/pages/`. Repeatable detail pages (programs, services, IV protocols) use Astro content collections — one markdown file per page with structured frontmatter; `[slug].astro` dynamic routes generate the URLs at build time.
- **Tailwind CSS** via the `@astrojs/tailwind` integration. The Tailwind-CDN default in `Nates Claude.md` is for one-off prototypes; for a 14-route production site we use the integration so utilities are compiled and tree-shaken. All tokens (palette, type scale, spacing, shadows, motion) live in `tailwind.config.mjs`.
- **Fonts:** Fraunces and Plus Jakarta Sans self-hosted via `@fontsource-variable/fraunces` and `@fontsource-variable/plus-jakarta-sans` (or equivalent). Files served from `public/fonts/`. Google Fonts CDN is **not** used at runtime — visitor IPs never reach Google. Font subsets WOFF2 only; `font-display: swap` for performance.
- **Icons:** Phosphor Icons (outline weight, 1.5px stroke). Imported as static SVG via `@phosphor-icons/web` or hand-extracted to a sprite sheet, depending on what optimizes the bundle smallest. Default size 20px / small 16px / large 24px.
- **JS surface:** Astro outputs zero JavaScript by default. JS is added only where needed: the mega-menu interaction, the FAQ accordion, the IV-page TOC scroll-spy, an intersection-observer-driven section-reveal animation, and the CharmHealth iframe container. Each is small and scoped — no framework runtime.

### 2.2 Routes (14 locked)

| Route | Type | Driver |
|---|---|---|
| `/` | Home | `src/pages/index.astro` |
| `/about` | About | `src/pages/about.astro` |
| `/programs` | Programs hub | `src/pages/programs/index.astro` |
| `/programs/cancer-care` | Program detail | `src/pages/programs/[slug].astro` + `src/content/programs/cancer-care.md` |
| `/programs/diabetes-reversal` | Program detail | content collection |
| `/programs/hormone-harmony` | Program detail | content collection |
| `/programs/autoimmune-support` | Program detail | content collection |
| `/programs/gut-health` | Program detail | content collection |
| `/services` | Services hub | `src/pages/services/index.astro` |
| `/services/iv-therapy` | Consolidated long-page | `src/pages/services/iv-therapy.astro` (bespoke; iterates `src/content/iv-protocols/` collection) |
| `/services/colon-hydrotherapy` | Service detail | `src/pages/services/[slug].astro` + content collection |
| `/services/sauna-body-wrap` | Service detail | content collection |
| `/services/laser-lipo` | Service detail | content collection |
| `/services/foot-detox` | Service detail | content collection |
| `/services/fit-3d-body-scan` | Service detail | content collection |
| `/services/massage` | Service detail | content collection |
| `/services/acupuncture` | Service detail | content collection |
| `/services/wellness-consultation` | Service detail | content collection |
| `/foundation` | Dr Knights Foundation | `src/pages/foundation.astro` (slug normalized — directories with spaces are a build-time hazard) |
| `/book-appointment` | Book Appointment | `src/pages/book-appointment.astro` |

The bespoke IV Therapy page (`iv-therapy.astro`) intentionally bypasses the `[slug].astro` template — its layout is materially different from a standard service detail and warrants its own file.

### 2.3 Folder Structure

```text
nirvana-site/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── public/
│   ├── images/
│   │   ├── brand/
│   │   │   └── nirvana-logo-transparent.png
│   │   ├── programs/        # 5 hero + supporting images
│   │   ├── services/        # 9 hero + supporting images
│   │   └── iv/              # still-life thumbnails per protocol
│   └── fonts/               # Fraunces + Plus Jakarta Sans WOFF2 subsets
├── src/
│   ├── components/
│   │   ├── nav/             # Header, MegaMenu, MobileDrawer
│   │   ├── hero/            # SplitHero, IntraPageHero
│   │   ├── cards/           # ProgramCard, ServiceCard, IVProtocolBlock
│   │   ├── content/         # SectionEditorial, FAQAccordion, BenefitsList,
│   │   │                    # MetadataBlock, QuoteBlock, ImageBlock
│   │   ├── booking/         # CharmEmbedSlot, ContactPanel
│   │   └── system/          # Button, Container, Surface, Icon
│   ├── content/
│   │   ├── config.ts        # collection schemas (zod)
│   │   ├── programs/        # 5 .md files
│   │   ├── services/        # 8 .md files (excludes iv-therapy)
│   │   └── iv-protocols/    # N .md files, 1 per IV protocol
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── foundation.astro
│   │   ├── book-appointment.astro
│   │   ├── programs/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── services/
│   │       ├── index.astro
│   │       ├── iv-therapy.astro
│   │       └── [slug].astro
│   └── styles/
│       └── global.css       # font-face declarations, Tailwind base, prose styles, SVG noise filter
├── serve.mjs                # tiny static server binding localhost:3000 to dist/
├── screenshot.mjs           # Puppeteer wrapper using absolute global path per Nates Claude.md
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-07-nirvana-design.md
├── source-site/             # existing factual baseline (do not modify)
├── brand_assets/            # canonical brand asset folder (per Nates Claude.md)
│   └── nirvana-logo-transparent.png
└── README.md
```

The logo lives canonically in `brand_assets/` per `Nates Claude.md` and is **mirrored** to `public/images/brand/` for runtime serving. Mirroring rather than symlinking because Windows symlinks are flaky in some Astro tooling paths.

### 2.4 Content Collection Schemas (zod, declared in `src/content/config.ts`)

**`programs` collection:**

```ts
title: string
slug: string                 // matches filename
eyebrow: 'MEDICAL PROGRAM'
lede: string                 // 1-2 sentences for hero subhead
heroImage: string            // path under public/images/programs/
heroImageAlt: string
heroImageAspect: '4/3'|'3/4'|'1/1'|'16/9'  // default 4/3
icon?: string                // Phosphor icon name, used sparingly
sections: Array<SectionConfig>  // ordered list of section keys with optional overrides
metadata?: { duration?: string; commitmentLevel?: string; pairsWith?: string[] }
publishedAt: string          // ISO date
```

**`services` collection:**

```ts
title: string
slug: string
eyebrow: 'SERVICE'
lede: string
heroImage: string
heroImageAlt: string
heroImageAspect: '4/3'|'3/4'|'1/1'|'16/9'  // default 4/3
icon?: string
sections: Array<SectionConfig>
metadata?: { duration?: string; price?: string; pairsWith?: string[] }
publishedAt: string
```

**`iv-protocols` collection** (drives the consolidated `/services/iv-therapy` page):

```ts
title: string                // e.g., "Myers' Cocktail"
slug: string                 // anchor target on iv-therapy page (e.g., "myers-cocktail")
category: 'hydration'|'performance'|'wellness'|'beauty'|'detox'|'specialty'
shortDescription: string
ingredients: string[]
duration: string             // e.g., "30–45 min"
price?: string
goodFor: string[]
icon?: string                // Phosphor icon
thumbnailImage?: string
publishedAt: string
order?: number               // optional sort within category
```

Section bodies for programs and services live in the markdown body of each file. The `sections` frontmatter array provides ordering and per-page section selection.

### 2.5 Tooling Files (created in Phase 1)

- **`serve.mjs`** — minimal Node HTTP server using built-in `node:http` and `node:fs`. Serves `dist/` on `localhost:3000` with correct MIME types and SPA fallback. Used per `Nates Claude.md` for screenshotting against built output. **`astro dev` is configured to also use port 3000** (via `server.port` in `astro.config.mjs`), so the same `localhost:3000` URL works for both dev-time and production-build screenshots — `node screenshot.mjs http://localhost:3000` always hits whichever server is running.
- **`screenshot.mjs`** — Puppeteer wrapper. Imports Puppeteer using the absolute global path per `Nates Claude.md`: `import puppeteer from 'C:/Users/bjpar/AppData/Roaming/npm/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';`. Saves to `temporary screenshots/screenshot-N-<label>.png`. Accepts URL and optional label suffix from CLI args.

### 2.6 Deployment

Astro outputs pure static HTML/CSS/minimal JS to `dist/`. Host-agnostic. Deployment target is open and locked before Phase 15. Recommended targets in priority order:

1. **Cloudflare Pages** — free tier, fast global CDN, simple GitHub integration, generous free SSL.
2. **Netlify** — free tier, mature platform, great preview-deploy workflow.
3. **Vercel** — free tier, fast, but slightly Next.js-centric.
4. **GitHub Pages** — free, simple, no preview deploys.
5. **Self-hosted / S3** — viable but adds operational overhead.

---

## 3. Design System

### 3.1 Color Tokens (Tailwind extended palette under `nirvana.*`)

```js
nirvana: {
  ink:         '#1F2A24',  // deepest forest, body + heading text on cream
  forestDeep:  '#2F4233',  // dark surfaces, hero overlays, dark CTAs
  sageDeep:    '#4F5E47',  // hover/pressed states for primary CTAs
  sage:        '#7A8B6F',  // primary brand fill (CTAs, link underline accent)
  celadon:     '#C8D2BB',  // pale sage backgrounds, dividers, badge fills
  paper:       '#F6F1E8',  // canvas / page background
  mist:        '#E8E4DA',  // elevated card surfaces
  stone:       '#C9B89C',  // warm tan neutral, photo overlay tint
  clay:        '#A57C5A',  // emotional accent for program imagery
  goldAntique: '#B89968',  // restrained metallic accent (small caps labels, hairline borders)
}
```

**Usage rules:**

- Body text and headings on light surfaces: `nirvana-ink`. On dark surfaces: `nirvana-paper`.
- Primary CTA: `nirvana-sage` fill, `nirvana-paper` text, `nirvana-sageDeep` hover, `nirvana-goldAntique` 1px hairline border on `:focus-visible`.
- Inline links: text retains body color; underline is 1px `nirvana-goldAntique` with 2px under-baseline offset.
- Photographic overlays: `bg-gradient-to-t from-nirvana-forestDeep/60 via-transparent to-transparent` PLUS a `mix-blend-multiply` color layer in `nirvana-stone/25`. This unifies disparate stock photography into the palette.
- Dark surfaces (rare): `nirvana-forestDeep` background, `nirvana-paper` text. Used in hero overlays only.

### 3.2 Type Scale (fluid via `clamp()`)

```css
display:  clamp(3.25rem, 1.4rem + 5.5vw, 6rem)     /* Fraunces, opsz 144, wght 400, tracking -0.03em */
h1:       clamp(2.5rem,  1.5rem + 3vw,   4rem)     /* Fraunces, opsz 72,  wght 450, tracking -0.025em */
h2:       clamp(1.875rem,1.3rem + 1.8vw, 2.75rem)  /* Fraunces, opsz 48,  wght 500, tracking -0.02em */
h3:       clamp(1.375rem,1.1rem + 0.9vw, 1.75rem)  /* Plus Jakarta Sans, wght 600, tracking -0.01em */
lede:     clamp(1.125rem,1rem   + 0.4vw, 1.375rem) /* PJS wght 400, line-height 1.55 */
body-lg:  1.0625rem                                 /* PJS wght 400, line-height 1.7 */
body:     1rem                                      /* PJS wght 400, line-height 1.7 */
body-sm:  0.9375rem                                 /* PJS wght 400, line-height 1.6 */
caption:  0.8125rem                                 /* PJS wght 500, tracking 0.08em, uppercase */
```

**Notes:**

- Fraunces is variable. `font-variation-settings` is set per heading tier to dial opsz/wght/soft. The same family looks deliberately different at hero scale vs. sub-head.
- Plus Jakarta Sans body line-height 1.7 satisfies the `Nates Claude.md` "generous line-height (1.7) on body" guardrail.
- Hero display tracking `-0.03em` satisfies the "tight tracking on large headings" guardrail.
- The `caption` style (uppercase, letter-spaced) is reserved for antique-gold eyebrow labels and `MetadataBlock` field labels. Never used for body content.

### 3.3 Spacing Scale (8px base, intentional tokens)

```
2xs:  4px      lg:   24px     3xl:  64px
xs:   8px      xl:   32px     4xl:  96px
sm:   12px     2xl:  48px     5xl:  128px
md:   16px                    6xl:  192px
```

**Application rules:**

- Section vertical rhythm: `4xl` (96px) on desktop, `3xl` (64px) on mobile.
- Card internal padding: `xl` (32px) on desktop, `lg` (24px) on mobile.
- Inline label-to-content gap: `sm` (12px).
- Component-internal element gap: `md` (16px).
- Heading-to-body gap: `lg` (24px) for h2+, `md` (16px) for h3.

### 3.4 Layout Grid

- **Max content width:** 1280px. Luxury sites typically 1100–1320; 1280 gives Fraunces hero room without feeling cavernous.
- **Editorial reading column variant:** 720px. Used inside long-form sections of program/service pages — keeps line length readable (~70–80 chars).
- **Wide hero variant:** full-bleed. The split-hero photograph extends to the viewport right edge.
- **Gutters:** desktop 48px / tablet 32px / mobile 20px.
- **Breakpoints (Tailwind defaults):** `sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280. No customization.

### 3.5 Surface Depth Model

Per `Nates Claude.md` "base → elevated → floating" guardrail. Five tiers:

| Tier | Token | Used for |
|---|---|---|
| Base (z=0) | `paper` | Page body |
| Elevated (z=1) | `mist` | Neutral cards, FAQ rows, IV protocol blocks |
| Cream-on-cream tinted (z=2) | `paper` w/ sage hairline border | Featured program/service cards |
| Clay-tinted emotional (z=2 alt) | `clay/20` overlay on paper | Featured-program home cards, "Begin Your Journey" intra-page CTAs |
| Gold-floating (z=3) | `paper` + gold hairline + floating shadow | Booking card, end-of-page conversion CTAs |

### 3.6 Shadow Tokens (sage-tinted, never gray)

```css
/* shadow-elevated — for mist cards */
0 1px 2px rgba(31, 42, 36, 0.04),
0 4px 12px rgba(122, 139, 111, 0.08);

/* shadow-floating — for primary CTAs and featured cards */
0 2px 4px rgba(31, 42, 36, 0.06),
0 12px 28px rgba(79, 94, 71, 0.10),
0 24px 48px rgba(122, 139, 111, 0.06);
```

Layered, color-tinted, low-opacity per `Nates Claude.md` "never flat shadow-md" guardrail.

### 3.7 Border Radius Scale

```
none: 0     md: 6      xl:  20
sm:   2     lg: 12     2xl: 32
                       full: 9999
```

- Cards: `lg` (12).
- Buttons: `md` (6).
- Photographic frames: `lg` on the corner adjacent to text, `none` on the bleed edge — gives the editorial deliberate-asymmetry feel.

### 3.8 Motion Language

Per `Nates Claude.md` "only animate transform and opacity" guardrail.

- **Easing:** standard `cubic-bezier(0.25, 0.46, 0.45, 0.94)`; emphasis (CTAs, mega-menu open) `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **Section reveal on scroll:** intersection observer; opacity 0→1 + translateY 8px→0; 600ms; standard easing; 80ms stagger across siblings.
- **Hover:** buttons translateY -2px max; cards translateY -4px max + shadow tier upgrade.
- **Focus-visible:** 2px `nirvana-goldAntique` ring, 2px offset. No `outline: none` without a replacement focus state.
- **Active:** scale(0.99), instant.
- **Mega-menu open:** 240ms emphasis easing; opacity + scale 0.98→1.
- **Reduced motion:** all motion collapses to instant opacity changes. `@media (prefers-reduced-motion: reduce)` zeroes transition duration.
- **Forbidden:** `transition-all` (per `Nates Claude.md`), `transition: background-color` (causes paint thrashing), CSS keyframes that animate non-transform/opacity properties.

### 3.9 Iconography

Phosphor Icons, outline weight, 1.5px stroke. Sizes 16/20/24px. Used at:

- Service detail page section headings (one icon per top-level section).
- FAQ accordion (chevron-down indicator).
- Footer (phone, envelope, map-pin, clock).
- Mega-menu (small "→" suggesting "view all" link in panel footer).
- Program detail (single emotive icon — heart, sparkle, leaf — paired with imagery, max 1 per page).

**Forbidden:** icons in the home page hero; icons load-bearing for navigation (text labels always present); decorative icons that don't reinforce the section heading.

### 3.10 SVG Noise / Texture

Global low-opacity (~3%) SVG noise filter applied to large flat surfaces (hero backgrounds, footer, large clay-tinted blocks). Implementation: a single `<svg>` filter definition in `BaseLayout.astro`, referenced via CSS `filter: url(#nirvana-noise)` or as a backgound-image data URL. Barely perceptible but kills the flat-CSS digital feel — gives surfaces a paper-grain quality matching the editorial-clinical aesthetic.

---

## 4. Component Inventory

Roughly 22 components organized by category. All component props typed via Astro `interface Props`.

### 4.1 Navigation & Shell

- **`Header.astro`** — Sticky on scroll past 80px; gains a faint paper-on-paper background and 1px sage-deep hairline bottom border when stuck. Layout: logo (left) · Home / About / Medical Programs ▼ / Services ▼ / Foundation (center) · Book Appointment CTA (right). Mobile: collapses to logo + hamburger + Book CTA only.
- **`MegaMenu.astro`** — Renders inside Programs and Services nav slots.
  - Programs variant: 5-column row with thumbnail (64×64 sage-tinted cover), program name (Fraunces h3), one-line lede (PJS body-sm), antique-gold "→" hover indicator.
  - Services variant: 3×3 grid of 9 items, same card structure. IV Therapy is one card linking to the consolidated long-page.
  - Footer of each panel: gold-underlined "View all programs / services" link to the hub.
  - Open: 240ms emphasis-easing fade+scale 0.98→1.
  - Hover-out: 200ms with 150ms grace period (lets the visitor's mouse travel between trigger and panel without the panel closing).
  - Click-outside dismisses.
- **`MobileDrawer.astro`** — Full-height drawer slides from right. Two collapsible accordions (Medical Programs, Services) with thumbnail + name rows. Standalone links for Home, About, Foundation, Book Appointment.
- **`Footer.astro`** — Three-column on desktop: Contact (phone, email, address with Phosphor icons) · Hours (block of 7 days) · Quick Links (Programs, Services, About, Foundation, Book). Below columns: thin antique-gold hairline rule + caption-style line "© Nirvana Holistic Medicine · College Park, MD" and a sister line for Dr. Knights credentials. Single mobile column, stacked.

### 4.2 Heroes

- **`SplitHero.astro`** — Home page only. 55/45 split on `lg`+, stacked on mobile. Left column: paper background + Fraunces display headline + PJS lede + dual CTAs (sage primary "Book Appointment", text-link "Explore Programs" with antique-gold underline). Right column: full-bleed photograph extending to viewport right edge with `forestDeep` 0–40% top-down gradient + `stone` mix-blend-multiply 25% tint. Photograph has `lg` (12px) inner-corner radius only.
- **`IntraPageHero.astro`** — All non-home pages. Same DNA, ~60% the height of the home hero. Right-photo slot accepts an `aspectRatio` prop. Headline accepts an optional eyebrow caption (`MEDICAL PROGRAM` / `SERVICE` / `FOUNDATION` / `ABOUT NIRVANA` / `BOOK ONLINE`) above the Fraunces title. CTA pair below; intra-page heroes have one primary and an optional secondary text link.

### 4.3 Cards

- **`ProgramCard.astro`** — Two variants:
  - `default`: mist-tinted card, 4:3 photo top, Fraunces h3 + PJS body-sm lede + antique-gold "Learn More →".
  - `featured`: clay-tinted card with portrait 3:4 photo, larger headline, used for the Home page's "Programs at Nirvana" section.
- **`ServiceCard.astro`** — Single variant: mist-tinted card, square (1:1) photo top, small Phosphor icon next to service name, PJS body-sm one-line lede, antique-gold "Learn More →".
- **`IVProtocolBlock.astro`** — Used inside the IV Therapy editorial long-page. Each protocol is its own block (not a card). Layout: anchor target `id`, antique-gold caption category label, Fraunces h2, PJS lede, optional botanical icon or small still-life thumbnail in `lg`-radius frame, embedded `MetadataBlock` (ingredients/duration/price/goodFor), inline "Book This IV" CTA. Subtle celadon hairline divider above next protocol block.

### 4.4 Content Modules

- **`SectionEditorial.astro`** — Workhorse for program/service body content. Variants: `text-only` (max 720px reading column), `text + image-right`, `text + image-left`, `text + image-full-bleed-below`. Image variants accept alt text (required), aspect ratio, optional caption (PJS body-sm italic).
- **`FAQAccordion.astro`** — Each row: PJS h3 question + Phosphor chevron + PJS body answer that expands. Animates max-height + opacity (transform/opacity-only). Closed by default; first row optionally starts expanded if specified per page.
- **`BenefitsList.astro`** — Bulleted-but-not-bullets list pattern. Each row: small celadon-filled dot or sage Phosphor icon + Fraunces h3 short benefit + PJS body-sm explanation. Used for "Benefits of [Treatment]" sections.
- **`MetadataBlock.astro`** — Two-column on desktop, stacked on mobile. Label in antique-gold caption (uppercase letter-spaced), value in PJS body-lg. 1px celadon hairline rules between rows. Fields configurable: ingredients, duration, price, goodFor, frequency, etc.
- **`QuoteBlock.astro`** — Pull quote from Dr. Knights or testimonials. Fraunces italic display, oversized open-quote glyph in antique gold, attribution in caption small-caps below. Used 1–2× per page max.
- **`ImageBlock.astro`** — Standalone editorial photograph with optional caption. Always uses gradient-overlay + mix-blend-multiply treatment. Aspect ratio configurable.

### 4.5 Booking

- **`CharmEmbedSlot.astro`** — Renders the `<div id="charm-embed-slot">` with placeholder content. Placeholder: caption `BOOKING` label, PJS body explanation of the request-mode flow, faint celadon-tinted skeleton block indicating where the embed iframe will appear. Once the CharmHealth snippet is pasted in the file (between `CHARM-EMBED:BEGIN` / `CHARM-EMBED:END` markers), the placeholder auto-hides via CSS `:has(iframe)` selector.
- **`ContactPanel.astro`** — Phone (clickable `tel:`), email (clickable `mailto:`), business hours, Google Maps iframe (lazy-loaded), single still-life of clinic exterior or interior. Used at full size on `/book-appointment`; slim variant in the footer.

### 4.6 System Primitives

- **`Button.astro`** — Variants: `primary` (sage fill), `secondary` (paper fill, sage hairline border), `text` (antique-gold underlined link button). Sizes: `md` default, `lg` for hero CTAs. Always renders hover/focus-visible/active states.
- **`Container.astro`** — Wraps content in a max-width-1280 + responsive gutter shell. Variants: `default`, `narrow` (720px reading column), `wide` (full-bleed).
- **`Surface.astro`** — Wraps a content block in a depth-tier surface. Variants: `paper`, `mist`, `paperBordered`, `clay`, `gold`. Applies the matching shadow + border-radius automatically.
- **`Icon.astro`** — Wraps Phosphor icon imports with consistent sizing/stroke. Single source of truth for icon styling.

---

## 5. Page Templates

### 5.1 Home — `/`

1. `SplitHero` — headline drafted during Phase 4 voice calibration (intentionally placeholder until then). Lede about Dr. Knights' integrative approach. CTAs: Book Appointment / Explore Programs. Right photo: warm consultative moment.
2. **Trust strip** — slim band immediately under hero, paper-on-paper. Three credential items in a row with hairline antique-gold dividers.
3. **Programs at Nirvana** — section heading + lede + 5 `ProgramCard featured` in 5-up row on desktop (3+2 tablet, 1-up mobile).
4. **Services at Nirvana** — section heading + lede + 9 `ServiceCard` in 3×3 grid.
5. **The Nirvana Approach** — 3-column pillar block on clay-tinted surface tier (warm emotional moment of the page). Each pillar: Phosphor icon + Fraunces h3 + PJS body-sm.
6. **About Dr. Knights teaser** — `SectionEditorial text+image-left` with portrait photograph (right) + brief bio (left) + "Read More" antique-gold link to `/about`.
7. **Foundation teaser** — slim editorial band linking to `/foundation`. Restrained.
8. **Conversion CTA block** — gold-floating tier card. "Begin Your Consultation" + brief reassurance + Book Appointment CTA.
9. `Footer`.

### 5.2 About — `/about`

1. `IntraPageHero` eyebrow `ABOUT NIRVANA`.
2. **Dr. Knights' Story** — `SectionEditorial text-only` reading column.
3. **Credentials & Approach** — `BenefitsList`.
4. **The Clinic** — `SectionEditorial text + image-right` with photo of College Park space.
5. `QuoteBlock` from Dr. Knights.
6. **Conversion CTA block** — softer than home ("Connect With Us" with Book + Contact options).
7. `Footer`.

### 5.3 Programs Hub — `/programs`

1. `IntraPageHero` eyebrow `MEDICAL PROGRAMS` + emotional photograph.
2. **What Is a Nirvana Medical Program?** — short editorial section explaining the program model vs service model.
3. **All Programs** — 5 `ProgramCard featured` grid (3+2 desktop).
4. **What to Expect** — 4-step flow with Phosphor icons (Initial assessment → Plan creation → Active treatment → Maintenance).
5. `QuoteBlock` + **Conversion CTA block**.
6. `Footer`.

### 5.4 Program Detail (×5) — `/programs/[slug]`

Driven by Astro content collection. Sections selected per page (editorial latitude); template is a menu, not a fixed shape. Available sections, in canonical order when present:

1. `IntraPageHero` eyebrow `MEDICAL PROGRAM · [name]`.
2. **What Is [Program]?**
3. **Who This Is For** — `BenefitsList`.
4. **Our Approach** — long-form editorial with 1–2 supporting images.
5. **Benefits** — `BenefitsList`.
6. **What to Expect** — step flow.
7. **What's Included** — list of modalities; cross-links to relevant service detail pages.
8. **Common Questions** — `FAQAccordion`.
9. `QuoteBlock` from Dr. Knights.
10. **Contextual CTA block** — "Begin Your [Program] Consultation".
11. `Footer`.

Per-page editorial decision: select 6–8 of the 10 sections based on what serves the visitor and what high-ROI questions exist for that condition.

### 5.5 Services Hub — `/services`

1. `IntraPageHero` eyebrow `SERVICES`.
2. **Browsing the Services** — short lede explaining service model and how services compose into programs.
3. **All Services** — 9 `ServiceCard` grid (3×3). IV Therapy is one card.
4. **The Body, the Mind, the Whole** — short editorial closing band linking back to programs.
5. **Conversion CTA block**.
6. `Footer`.

### 5.6 Service Detail (×8 standard) — `/services/[slug]`

Same flexible section menu as program detail, tuned for service scope:

1. `IntraPageHero` eyebrow `SERVICE · [name]`.
2. **What Is [Service]?** — high-ROI per editorial latitude.
3. **Benefits of [Service]**.
4. **What to Expect During Your Session**.
5. **Who This Is Good For**.
6. **How It Pairs With Our Programs** — internal link block to relevant programs.
7. **Common Questions** — `FAQAccordion`.
8. `QuoteBlock` or testimonial.
9. **Contextual CTA** — "Book This Service".
10. `Footer`.

### 5.7 IV Therapy Consolidated — `/services/iv-therapy`

1. `IntraPageHero` eyebrow `SERVICE · IV THERAPY` + still-life of an IV bag in soft light.
2. **What Is IV Therapy?** — short editorial intro.
3. **Why IV?** — short editorial: bioavailability, intentionality.
4. **Sticky TOC + protocol list** — two-column layout on desktop. Left rail (sticky on scroll): categorized table of contents (Hydration / Performance / Wellness / Beauty / Detox / Specialty), with each protocol name beneath. Right rail: editorial scroll containing all `IVProtocolBlock`s in order. Mobile: TOC becomes a top-of-page drawer that collapses on scroll.
5. **How to Choose Your IV** — closing editorial; guides indecisive visitors toward Wellness Consultation.
6. **Common Questions** — `FAQAccordion` (frequency, safety, who shouldn't, drip duration).
7. **Contextual CTA** — "Book IV Therapy".
8. `Footer`.

### 5.8 Foundation — `/foundation`

Distinct visual treatment: same type, palette, components, but imagery is community-impact rather than treatment, surface tier leans clay (warmer/emotional), CTA says "Support the Foundation" not "Book Appointment".

1. `IntraPageHero` eyebrow `DR KNIGHTS FOUNDATION` + community-impact photograph.
2. **Mission** — long-form editorial.
3. **What We Do** — `BenefitsList`.
4. **Impact Numbers** (optional, only if real numbers provided) — typeset stat block in `MetadataBlock` style.
5. **How to Help** — three paths: Donate / Volunteer / Partner.
6. `QuoteBlock` from Dr. Knights or beneficiary.
7. Contact panel for Foundation specifically.
8. `Footer`.

### 5.9 Book Appointment — `/book-appointment`

1. `IntraPageHero` (smaller variant) eyebrow `BOOK ONLINE` + clinic-detail photograph.
2. **Booking card** (gold-floating tier). Inside: brief lede about the request-mode flow + `<CharmEmbedSlot>` placeholder until snippet arrives.
3. **Other ways to reach us** — `ContactPanel` with phone, email, hours, address with Google Maps embed (lazy-loaded), single clinic photo.
4. **Booking FAQ** — `FAQAccordion`: "What if I need urgent care?", "Do I need to fill out anything before my visit?", "Do you take my insurance?", "Where do I park?".
5. `Footer`.

---

## 6. Content Strategy & Voice

### 6.1 Brand Voice Principles

- **Calm, credible, medically thoughtful.** No exclamation points. No wellness clichés ("transform your life," "unlock your potential," "discover the secret"). Sentences are confident and complete. Rhythm is unhurried.
- **Root-focused with varied vocabulary.** Rotate among: *underlying drivers · deeper patterns · whole-person assessment · restoring balance · contributing factors · upstream causes · the systems beneath symptoms · the foundation of the issue · what's actually driving this*. Never use the same phrase twice on the same page.
- **Whole-person, integrative.** Frame conventional and integrative tools as complementary, not adversarial. We don't oppose Western medicine; we incorporate it.
- **Patient-facing, not provider-facing.** Address the visitor directly. *"If you're navigating cancer treatment"* rather than *"Patients undergoing oncological intervention."*
- **Clinical confidence without sterility.** *"Here's how we approach it"* rather than *"Our scientifically-validated protocols leverage."*

### 6.2 Editorial Latitude (User-Granted)

User explicitly authorized editorial latitude on 2026-05-07. Source markdown files in `source-site/` are the **factual baseline only**. Voice, structure, section count, and high-ROI additions are at editorial discretion. Latitude includes:

- Adding sections that aren't in source: "What Is X?", "Benefits of X", "What to Expect", "Who This Is For", "Common Questions", "How It Pairs With Our Programs", etc.
- Restructuring source content into clearer hierarchy (lots of source content reads as one long block; break into named sections).
- Cross-linking aggressively (cancer-care references IV therapy + sauna + acupuncture; service pages link back to relevant programs).
- Adding FAQ entries based on common pre-booking questions: safety, contraindications, cost, frequency, what-to-bring, what-to-expect, who-shouldn't, parking.
- Tuning length per page: service pages typically 600–1200 words; program pages 1000–1800 words; IV consolidated long-page 2500–4000 words.

### 6.3 Editorial Guardrails (What I Won't Do)

- Do not invent medical claims unsupported by source content. "Benefits" sections derive from source, or are framed as "why patients commonly seek this" rather than "this treats X."
- Flag any substantive medical claim in spec/draft for user review before publishing. User and Dr. Knights are the medical authority.
- Avoid FDA-claim land mines: "cure," "treat" (unqualified clinical sense), "guaranteed," "proven to." Replace with "may help support," "patients often experience," "clinical observation suggests," "frequently used as part of an integrative approach for."
- Do not invent testimonials, names, or quotes. `QuoteBlock` instances are sourced from real materials user provides, or are Dr. Knights herself with real attribution, or are left as placeholder for user to fill.

### 6.4 SEO & Metadata

- Each page has a unique `<title>` and meta description. Pattern: `[Page] | Nirvana Holistic Medicine | College Park, MD`. Descriptions are page-specific lede ~150 chars.
- Local SEO: NAP (Name / Address / Phone) consistent on every page in footer. JSON-LD schemas:
  - `MedicalOrganization` site-wide (in `BaseLayout`)
  - `LocalBusiness` site-wide
  - `MedicalProcedure` or `MedicalTherapy` on individual service detail pages
  - `MedicalCondition` references on relevant program pages where appropriate
- Open Graph + Twitter Card meta on every page using the page's hero photo.
- Footer links to social if accounts exist.

### 6.5 Voice Calibration Loop

Home page is written first with full brand-voice copy. User reviews. Voice is tuned (more clinical / warmer / more confident / different vocabulary). Locked voice from that round is applied to all 13 remaining routes during their respective build steps. Each page reviewed during implementation; voice tunes per-page if needed.

### 6.6 Per-Page Editorial Examples

Concrete examples of where I'll elaborate beyond source:

- `/services/colon-hydrotherapy` — add "What Is Colon Hydrotherapy?", "Benefits of Colon Hydrotherapy", "What to Expect During Your Session" (high-ROI: cushions a procedure visitors are nervous about), "Who Should Avoid It" (safety/contraindications builds trust), FAQ.
- `/programs/cancer-care` — add "Integrative Care During Active Treatment," "Supporting Long-Term Recovery," "Common Questions for Patients New to Integrative Oncology," cross-links to IV therapy specifically (Vitamin C, glutathione protocols).
- `/programs/diabetes-reversal` — add "What Reversal Means in This Context" (managing expectations is high-ROI for a charged term), "Lifestyle Components," "Lab Markers We Track."
- `/services/iv-therapy` — each protocol gets a "What's In It" `MetadataBlock`, a "Why People Choose This" line, a "How Often" guidance line. Page closes with "How to Choose Your IV" guidance + safety/frequency FAQ.

---

## 7. Booking & CharmHealth Integration

### 7.1 Decision Recap

CharmHealth Web Embed Calendar (Settings > Calendar > Web Embed in CharmHealth admin), configured: request-mode (no providers listed; staff triages), pre-screening questionnaire ON, card-on-file optional per visit type. Clinic admin generates and pastes the snippet later. Until then, site ships a styled placeholder.

### 7.2 Insertion Point

Single insertion point in `src/components/booking/CharmEmbedSlot.astro`:

```html
<div id="charm-embed-slot" class="charm-embed-slot">
  <!-- CHARM-EMBED:BEGIN — paste CharmHealth Web Embed snippet between these markers -->
  <div class="placeholder">
    {/* placeholder content rendered until snippet replaces it */}
  </div>
  <!-- CHARM-EMBED:END -->
</div>
```

When the snippet arrives, it goes between `CHARM-EMBED:BEGIN` and `CHARM-EMBED:END`, replacing the placeholder div. Zero other code changes site-wide.

### 7.3 Placeholder Design (Pre-Snippet Phase)

Inside the gold-floating booking card on `/book-appointment`, before snippet arrives:

- Caption label `BOOK ONLINE` (antique-gold, uppercase, letter-spaced).
- Fraunces h2: "Request an Appointment".
- PJS lede: *"After you submit your request, our team reviews and confirms a time within one business day. You'll receive an email and text confirmation when your appointment is held. For urgent same-day needs, please call us directly."* (Voice tunable per home calibration.)
- Faint celadon-tinted skeleton block (visual placeholder for where the embed iframe will appear) with quiet "Online booking system loading..." line. **Important:** the skeleton is clearly not-yet-active, so visitors don't try to use it.
- `ContactPanel` directly below the booking card, always visible. Stays visible after embed activates; demotes visually (smaller, secondary).

### 7.4 Post-Snippet Behavior

- Placeholder block hides automatically. Implementation: placeholder content sits inside `<div class="placeholder">`. Component CSS: `:has(iframe) .placeholder { display: none; }`. When CharmHealth renders an iframe inside the slot, placeholder hides without JavaScript. Fallback for browsers without `:has()`: small inline MutationObserver in component handles the same logic.
- CharmHealth iframe styles itself; we don't override its internals. We DO style the **container** to match the site (paper background, generous padding, sage hairline border) so the iframe sits inside a Nirvana-branded frame.
- Pre-snippet lede stays visible above the iframe — useful framing context.

### 7.5 Container Visual Spec

- Frame: `nirvana-paper` background, `xl` (32px) padding desktop / `lg` (24px) mobile, `lg` (12px) border-radius, 1px `nirvana-celadon` hairline border, layered sage-tinted shadow (`shadow-floating`).
- Min-height: 720px desktop / 640px mobile.
- Width: 100% of booking card.
- Iframe height: not constrained — let CharmHealth's auto-resize mechanism (via `postMessage`) drive it.

### 7.6 Privacy / HIPAA Stance

This is a marketing site, not a portal. We don't collect PHI. The CharmHealth iframe is on CharmHealth's domain; data submitted in the iframe goes directly to CharmHealth's HIPAA-compliant backend. The Astro site itself collects nothing — no analytics that touch PHI, no contact forms, no email submissions. Any future visitor-facing form would route through a HIPAA-compliant provider (separate decision; not in V1).

### 7.7 CTA Locations Site-Wide

- Header: "Book Appointment" persistent on every page. Links to `/book-appointment`. Sage primary fill.
- Contextual CTAs at end of each program detail and service detail page. Phrasing varies per page: "Begin Your Cancer Care Consultation," "Book This Service," "Book Your IV Therapy Session." Some pages may include `?from=cancer-care` query parameters for analytics later (CharmHealth embed itself doesn't use them).
- Foundation page CTA: "Support the Foundation" / "Get Involved" — **not** a booking CTA.
- Mobile: header CTA stays visible (compact icon + text). No sticky bottom bar.

### 7.8 Loading & Performance

- Google Maps iframe: lazy-loaded (`loading="lazy"`). Renders only when scrolled into view.
- CharmHealth embed: loads at page load (visitors who land on `/book-appointment` are likely there to book — pre-loading the iframe matters for conversion).
- All other pages stay JS-free except the small mega-menu interaction script.

---

## 8. Implementation Phasing

Building order designed to (1) validate voice and visual rhythm early, (2) lock per-template patterns once and reuse, (3) minimize rework. Each phase ends with a screenshot review per the `Nates Claude.md` workflow (`node screenshot.mjs http://localhost:3000 <label>-pass-N`).

| Phase | Work | Checkpoint |
|---|---|---|
| 1 | Project scaffold: Astro + Tailwind + fonts + folders + `serve.mjs` + `screenshot.mjs` + `brand_assets/` + logo placement | — |
| 2 | Design system foundation: `BaseLayout`, system primitives (`Button`, `Container`, `Surface`, `Icon`), global CSS, motion tokens | — |
| 3 | Header + MegaMenu + MobileDrawer + Footer | — |
| 4 | **Home page** with full brand-voice copy | **Checkpoint A — voice + visual rhythm calibration.** Locks brand voice + design tokens. |
| 5 | Cancer-care program detail | **Checkpoint B — program-detail template lock.** |
| 6 | Diabetes reversal, hormone harmony, autoimmune support, gut health | Light per-page review |
| 7 | Colon-hydrotherapy service detail | **Checkpoint C — service-detail template lock.** |
| 8 | Sauna body wrap, laser lipo, foot detox, fit 3D body scan, massage, acupuncture, wellness consultation | Light per-page review |
| 9 | IV Therapy consolidated long-page | **Checkpoint D — long-page pattern lock.** |
| 10 | About + Programs hub + Services hub | — |
| 11 | Foundation | Per-page review |
| 12 | Book Appointment + `CharmEmbedSlot` placeholder | Per-page review |
| 13 | SEO/metadata pass — per-page meta, JSON-LD schemas, Open Graph, sitemap.xml, robots.txt, favicon set | — |
| 14 | Cross-browser/responsive polish + final screenshot rounds at 375/414/768/1024/1280/1440/1920px (≥2 comparison rounds per `Nates Claude.md`) | **Final review.** |
| 15 | Deployment configuration (target locked before this phase) + final build verification | — |

### 8.1 Propagation Mechanism

After each checkpoint:

- Approved token changes (palette, type sizing, spacing, motion) update `tailwind.config.mjs` and propagate to all already-built pages automatically.
- Approved template changes (program-detail or service-detail patterns) update the `[slug].astro` template and content collection schemas — propagate to all pages built from those templates.
- Approved voice changes apply to subsequent pages going forward AND retroactively to already-written pages.
- After propagation, re-run screenshot pass on all built pages to confirm no regressions.

### 8.2 Decisions Log Maintenance

Section 9 of this spec is a running Decisions Log. Every checkpoint approval gets logged with date, page reviewed, decision made, scope of propagation. By Phase 12 we have a single document of every visual/voice rule applied site-wide.

---

## 9. Decisions Log

*Populated during implementation. Each entry: date, checkpoint, decision summary, scope of propagation.*

| Date | Phase / Checkpoint | Decision | Propagation Scope |
|---|---|---|---|
| 2026-05-07 | Brainstorming | Architecture: Astro static site | All pages |
| 2026-05-07 | Brainstorming | Aesthetic: editorial-clinical hybrid | Site-wide |
| 2026-05-07 | Brainstorming | Type pairing: Fraunces + Plus Jakarta Sans | Site-wide via Tailwind config |
| 2026-05-07 | Brainstorming | Color palette: Expanded Palette A (5 greens + warm neutrals + antique gold) | Site-wide via Tailwind config |
| 2026-05-07 | Brainstorming | Imagery strategy: hybrid, photo per program/service, icons used purposefully | All program + service pages |
| 2026-05-07 | Brainstorming | Hero: split 55/45 layout | Home page (intra-page hero is smaller variant) |
| 2026-05-07 | Brainstorming | Navigation: mega-menu with thumbnails for Programs and Services | Header site-wide |
| 2026-05-07 | Brainstorming | IV Therapy IA: editorial long-page with sticky anchor TOC | `/services/iv-therapy` |
| 2026-05-07 | Brainstorming | CTA strategy: header CTA + contextual intra-page CTAs | Site-wide |
| 2026-05-07 | Brainstorming | Content scope: full editorial latitude granted; high-ROI sections added per-page | All program + service pages |

---

## 10. Open Items (Not Blocking)

- **Deployment target.** Locked before Phase 15. Recommended: Cloudflare Pages.
- **Logo color compositing.** Verify `transparent logo for Nirvana.png` composites cleanly against `#F6F1E8` paper, `#7A8B6F` sage, `#1F2A24` ink during Phase 1. Flag any treatment needed per `Nates Claude.md` "logo placed seamlessly with no flaws."
- **`serve.mjs` and `screenshot.mjs`.** Don't exist in workspace yet — created during Phase 1.
- **CharmHealth snippet.** Pasted post-launch by clinic admin. Site ships with placeholder + `ContactPanel` fallback.
- **Real photography.** User adds photos post-launch — replaces curated stock placeholders one file at a time.
- **Foundation impact numbers.** Use only if user provides real numbers; no placeholders.
- **Testimonials / quotes.** Real material from user, or Dr. Knights herself with real attribution. No invention.
- **Insurance language on Booking FAQ.** Confirm with user what to say. Default to neutral framing ("We accept payment via [methods]; insurance reimbursement may be available — please call us to discuss") if unclear.

---

## 11. References

- `nirvana-project-plan.md` — original brand brief and route list
- `Nates Claude.md` — frontend workflow rules and anti-generic guardrails
- `source-site/` — factual baseline content (21 markdown files: 5 programs, 9 services, 6 core pages, 1 IV consolidated)
- Brainstorming transcript (this session, 2026-05-07)
