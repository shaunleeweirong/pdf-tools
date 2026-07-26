---
name: content-draft
description: Turn a content-research brief into a complete, publish-ready, SEO-optimized blog post (MDX) or a programmatic use-case entry for pdf-tool, then self-score and open a PR. Use after content-research has produced a brief. Output is a finished post, not an outline.
---

# Content draft

Write the **finished** piece from a brief (`content/briefs/<id>.md`) in the pdf-tool voice, wire in SEO + schema + internal links, self-score, and open a PR for human review. Never publish directly.

## Voice & positioning ("get it done")

- Lead with the reader's **outcome/task** (finish the job), answer-first in the first ~50 words.
- Proofs: **free, no sign-up, in your browser**. Privacy ("files never leave your browser") is a **trust cue** for client-side tools, never the headline.
- Plain, concrete, helpful, no marketing fluff. Short paragraphs (2 to 3 sentences). Answer the brief's questions directly.

## Writing style: read like a knowledgeable human, not AI

The reader must not be able to tell a post is AI-generated. Hard rules:

- **Never use em-dashes (—) or en-dashes (–).** Use a comma, a period, parentheses, or "to" for ranges. For number ranges write "20 to 25 MB" or "20-25 MB", never "20–25".
- **Avoid AI-tell words and phrases.** Do not use: delve, dive into, unleash, unlock, elevate, seamless, robust, leverage, harness, navigate/navigating, landscape, realm, tapestry, testament, moreover, furthermore, additionally, "in conclusion", "it's worth noting", "in today's digital world/age", "whether you're a … or a …", "look no further", game-changer, supercharge, effortless, empower, streamline, cutting-edge, "at the end of the day", "that being said", "when it comes to".
- Vary sentence length, use contractions, cut filler and hedging. Write like a helpful person explaining something to a friend.

## Link out to credible sources

When you state a fact or explain a concept (a file-size limit, a standard like PDF/A or ISO 32000, how encryption works, an email provider's rules), **link to a high-authority external source** with a normal markdown link: official docs, a standards body, Wikipedia, a .gov/.edu page, or a well-known publication. 1 to 3 outbound links per post, only where they genuinely help. It reads naturally and is good SEO.

## For a BLOG post

1. Create `content/pending/<slug>.mdx` (slug = kebab-case of the target query) — the draft waits here for approval in the `/studio` dashboard; it is NOT a live blog post until approved. Frontmatter:
   ```yaml
   ---
   title: "<= 60 chars, keyword-led>"
   description: "<= 155 chars, answer + benefit>"
   date: "<YYYY-MM-DD (today)>"
   keywords: ["<targetQuery>", "<secondary>", ...]
   toolSlugs: ["<relevant tool slugs from lib/tools.ts>"]
   faq:
     - q: "<question in the reader's words>"
       a: "<direct answer>"
   ---
   ```
   (`faq` is rendered as a visible FAQ section AND emitted as `FAQPage` schema automatically. Optional `updated: "<YYYY-MM-DD>"` sets the "Last updated" date. Do NOT credit an author in frontmatter, do NOT add a manual FAQ section in the body, and do NOT hand-write JSON-LD; the byline (Chris P.), Person/Breadcrumb/BlogPosting schema, and the OG image are all added by the route.)
2. Body (MDX, starts at `##` — the H1/date/description are rendered from frontmatter):
   - **Answer-first intro** (target keyword in the first sentence).
   - One `##` per question from the brief (use the real PAA/Reddit phrasing as headings).
   - A **how-to** list where relevant. Put the FAQ in the `faq` frontmatter (above), NOT a body `## Frequently asked questions` section, so it renders + schemas once (no duplication).
   - **Internal links** to the relevant tool(s) and any matching use-case page — link the tool the first time it's mentioned, e.g. `[Compress PDF tool](/compress-pdf)`.
   - GFM tables/lists are supported (remark-gfm).
   - `BlogPosting` schema is emitted automatically by the route — no manual JSON-LD needed.

## For a PROGRAMMATIC use-case page

- Add an entry to `content/use-cases.ts` (`USE_CASES`): `tool`, `useCase` (url segment), `h1`, `title`, `description`, `intro`, `steps[]`, `faq[]`, `keywords[]`.
- The `tool` MUST be embeddable — one of the runners in `components/UseCaseTool.tsx` (compress-pdf, merge-pdf, jpg-to-pdf, pdf-to-jpg). To target another tool, add a runner there first (mirror its `app/<slug>/page.tsx` wiring) and update the `EMBEDDABLE` set in `lib/__tests__/use-cases.test.ts`.
- `SoftwareApplication`/`HowTo`/`FAQPage` schema is emitted automatically.

## Self-score (must pass before queuing for approval)

- [ ] Target keyword in the title, the first heading/intro, and the first ~50 words.
- [ ] Every question from the brief is answered.
- [ ] At least one internal link to a relevant tool (and use-case page if one exists).
- [ ] 1 to 3 outbound links to credible high-authority sources where facts/concepts are explained.
- [ ] **Zero em-dashes / en-dashes, and none of the banned AI-tell words** (search the file to confirm).
- [ ] Unique target query, not cannibalizing a published slug (`content/keyword-map.json`).
- [ ] Reads naturally to a human; no fluff, no repetition, accurate claims. ≥ 800 words.

## Queue for approval (do NOT publish here)

Drafts land in `content/pending/` and are approved in the `/studio` dashboard — never merged straight to `content/blog/` and never auto-published.

1. Verify `npm run build` passes (the pending `.mdx` compiles).
2. In `content/keyword-map.json`, set the matching topic (by `id`/`targetQuery`, or add one if ad-hoc) to `status: "pending"` and add **`slug: "<slug>"`** (MUST match the pending filename — the Studio matches drafts to topics by `slug`).
3. Commit + push to `main`:
   ```bash
   git add content/pending/<slug>.mdx content/keyword-map.json
   git commit -m "content: draft <slug> (pending review)"
   git push origin main
   ```
   The push puts the draft in the repo (still NOT a blog post). The `/studio` "Needs approval" column reads it live; the human clicks **Approve** (→ moves to `content/blog/`, deploys) / **Reject** / **Request changes**. The old `content-publish` PR flow is superseded by the dashboard. (Programmatic use-case pages are not queued through pending — they go in `content/use-cases.ts` as before.)

## Guardrails

- One finished, distinct, genuinely useful post per topic — quality over volume. If the brief is thin or the topic overlaps an existing page, stop and flag rather than pad.
- End every commit message with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
