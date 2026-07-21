---
name: content-draft
description: Turn a content-research brief into a complete, publish-ready, SEO-optimized blog post (MDX) or a programmatic use-case entry for pdf-tool, then self-score and open a PR. Use after content-research has produced a brief. Output is a finished post, not an outline.
---

# Content draft

Write the **finished** piece from a brief (`content/briefs/<id>.md`) in the pdf-tool voice, wire in SEO + schema + internal links, self-score, and open a PR for human review. Never publish directly.

## Voice & positioning ("get it done")

- Lead with the reader's **outcome/task** (finish the job), answer-first in the first ~50 words.
- Proofs: **free, no sign-up, in your browser**. Privacy ("files never leave your browser") is a **trust cue** for client-side tools, never the headline.
- Plain, concrete, helpful — no marketing fluff. Short paragraphs (2–3 sentences). Answer the brief's questions directly.

## For a BLOG post

1. Create `content/blog/<slug>.mdx` (slug = kebab-case of the target query). Frontmatter:
   ```yaml
   ---
   title: "<= 60 chars, keyword-led>"
   description: "<= 155 chars, answer + benefit>"
   date: "<YYYY-MM-DD>"
   keywords: ["<targetQuery>", "<secondary>", ...]
   toolSlugs: ["<relevant tool slugs from lib/tools.ts>"]
   ---
   ```
2. Body (MDX, starts at `##` — the H1/date/description are rendered from frontmatter):
   - **Answer-first intro** (target keyword in the first sentence).
   - One `##` per question from the brief (use the real PAA/Reddit phrasing as headings).
   - A **how-to** list where relevant, and a `## Frequently asked questions` section with `###` questions.
   - **Internal links** to the relevant tool(s) and any matching use-case page — link the tool the first time it's mentioned, e.g. `[Compress PDF tool](/compress-pdf)`.
   - GFM tables/lists are supported (remark-gfm).
   - `BlogPosting` schema is emitted automatically by the route — no manual JSON-LD needed.

## For a PROGRAMMATIC use-case page

- Add an entry to `content/use-cases.ts` (`USE_CASES`): `tool`, `useCase` (url segment), `h1`, `title`, `description`, `intro`, `steps[]`, `faq[]`, `keywords[]`.
- The `tool` MUST be embeddable — one of the runners in `components/UseCaseTool.tsx` (compress-pdf, merge-pdf, jpg-to-pdf, pdf-to-jpg). To target another tool, add a runner there first (mirror its `app/<slug>/page.tsx` wiring) and update the `EMBEDDABLE` set in `lib/__tests__/use-cases.test.ts`.
- `SoftwareApplication`/`HowTo`/`FAQPage` schema is emitted automatically.

## Self-score (must pass before opening the PR)

- [ ] Target keyword in the title, the first heading/intro, and the first ~50 words.
- [ ] Every question from the brief is answered.
- [ ] At least one internal link to a relevant tool (and use-case page if one exists).
- [ ] Unique target query — not cannibalizing a published slug (`content/keyword-map.json`).
- [ ] Reads naturally to a human; no fluff, no repetition, accurate claims.
- [ ] `npm run build` succeeds and `npm test` passes.

## Ship

1. Update the topic `status` to `"drafted"` in `content/keyword-map.json` (add `url`).
2. Branch, commit, open a PR:
   ```bash
   git switch -c content/<slug>
   git add -A && git commit -m "content: <title>"
   gh pr create --fill
   ```
   In a scheduled routine, bundle the run's posts into ONE daily PR. Human reviews + merges → Vercel auto-deploys. No auto-publish.

## Guardrails

- One finished, distinct, genuinely useful post per topic — quality over volume. If the brief is thin or the topic overlaps an existing page, stop and flag rather than pad.
- End every commit message with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
