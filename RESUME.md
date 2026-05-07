# Resumption Message — Copy / Paste Into a Fresh Chat

This file lives at the repo root so you can always find it. When you start a new chat session for this project, copy the entire fenced block below (everything between the triple backticks) and paste it as your first message. The agent will read the spec and resume cleanly without re-asking questions that have already been answered.

---

```text
Resume the Nirvana Holistic Medicine site build.

Context:
- Project root: c:\Users\bjpar\Documents\nirvana nate site
- GitHub repo: https://github.com/bjparnell1-lang/Nirvana-Cursor (HTTPS, main branch)
- Brand brief: nirvana-project-plan.md
- Frontend rules: Nates Claude.md (mandates brainstorming + frontend-design skills, screenshot workflow, anti-generic guardrails, NO Inter font)
- Source content: source-site/ (21 markdown files; factual baseline, full editorial latitude granted)

Locked design spec (READ THIS FIRST — canonical source of all decisions):
docs/superpowers/specs/2026-05-07-nirvana-design.md

Build plan + current todo status:
.cursor/plans/nirvana_site_design_+_build_295f322b.plan.md

State of progress (as of 2026-05-07 evening):
- Brainstorming: complete
- Spec: written, self-reviewed, user-approved, committed to GitHub
- Git/GitHub: initialized, initial commit pushed
- Next pending todo: invoke writing-plans skill to write Phase 1+2+3 implementation plan to docs/superpowers/plans/2026-05-07-nirvana-foundation.md
- After that: my review, then frontend-design skill, then Phase 1 (Astro scaffold)

Two locked external decisions (don't re-litigate):
- Booking: CharmHealth Web Embed (request-mode, pre-screening on, snippet pasted later, scaffold #charm-embed-slot placeholder for now)
- 14 routes per the spec (5 programs, 9 services with /services/iv-therapy consolidating ALL IVs)

Start by reading the design spec, then continue from the next pending todo. Don't re-ask questions that the spec has already answered. Use TodoWrite to track progress through the remaining todos.
```

---

## How to Use This File

1. Open a fresh chat in Cursor for this project.
2. Open `RESUME.md` (this file) and copy the fenced block above.
3. Paste it as your first message.
4. The agent will read the spec and continue from the next pending todo.

## When to Update This File

After each phase completes and is committed, the "State of progress" section above should be updated to reflect what's done and what's next. The spec's Decisions Log (Section 9 of `docs/superpowers/specs/2026-05-07-nirvana-design.md`) is the authoritative running history; this file just summarizes for resumption.

If the agent updates this file during or after a phase, it will commit the update with a message like `chore: update RESUME.md after Phase N`.

## Notes

- Skills (using-superpowers, brainstorming, writing-plans, frontend-design, etc.) are auto-loaded by the Cursor session hooks; you don't need to mention them in the resumption message.
- The brainstorming skill is *complete* for this project — do not re-invoke it. The terminal state was invoking writing-plans, which is what the next session should pick up.
- The `frontend-design` skill MUST be invoked before any frontend code is written, per `Nates Claude.md`.
