# CLAUDE.md — Frontend Website Rules

## Always Do First
For every UI change or new feature — no exceptions, no rationalizing — follow this sequence:

1. **`superpowers:brainstorming`** — explore intent, requirements, and design before touching any code
2. **`frontend-design`** — apply design system and craft guidelines before writing frontend code
3. **`superpowers:writing-plans`** — create a concrete implementation plan
4. **`superpowers:executing-plans`** — follow the plan step by step during implementation
5. **`superpowers:verification-before-completion`** — verify everything works before calling it done

This applies to: new pages, new sections, new components, layout changes, styling changes, interactive behavior, and any feature addition or modification. "Small" changes still go through the full sequence.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed globally at `C:/Users/bjpar/AppData/Roaming/npm/node_modules/puppeteer/`. Chrome cache is at `C:/Users/bjpar/.cache/puppeteer/chrome/`.
- *(Note: If `screenshot.mjs` throws a module not found error, ensure it imports Puppeteer using the absolute global path: `import puppeteer from 'C:/Users/bjpar/AppData/Roaming/npm/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';`)*
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- **Naming Convention:** NEVER use generic names like "screenshot-1.png". ALWAYS use the optional label suffix to describe exactly what is being screenshotted and the iteration number (e.g., `node screenshot.mjs http://localhost:3000 hero-section-pass-1` → saves as `screenshot-N-hero-section-pass-1.png`).
- **Cleanup:** Before starting a completely new design or clone, delete old screenshots from the `temporary screenshots/` folder to avoid clutter.
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color