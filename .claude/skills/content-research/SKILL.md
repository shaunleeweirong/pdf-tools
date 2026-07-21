---
name: content-research
description: Research a content topic for the pdf-tool blog/site BEFORE drafting — mine real questions (PAA, autocomplete, Reddit, Quora, LinkedIn), study competitor pages/blogs, and produce a research brief. Use when picking the next topic to write or when asked to research a keyword. Research-first is mandatory: never draft without a brief.
---

# Content research

Turn a topic (or the next backlog item) into a **research brief** that a draft is written from. No draft happens without a brief — research quality is what makes the content rank and get cited by AI answer engines.

## Inputs

- A specific `targetQuery`, OR pick the highest-`priority` topic with `status: "idea"` from `content/keyword-map.json`.
- Tooling: `WebSearch` + `WebFetch` (no keys needed). Google Search Console query data if a `content/gsc-queries.*` export exists (highest-signal — prefer it).

## Steps

1. **Dedup.** Confirm the `targetQuery` is not already covered by a published topic in `content/keyword-map.json` (one unique target query per page — no cannibalization). If it overlaps a published page, pick a different angle or a different topic.

2. **Mine the real questions** (this is the point — write what people actually ask):
   - `WebSearch "{targetQuery}"` → capture the "People also ask" questions and related searches.
   - `WebSearch "how to {targetQuery}"`, `"{targetQuery} vs"`, `"best {targetQuery}"` for procedural/comparison angles.
   - `WebSearch "site:reddit.com {targetQuery}"` and `"site:quora.com {targetQuery}"` → real-language questions, pain points, and what answers get upvoted.
   - `WebSearch "site:linkedin.com {targetQuery}"` → public posts/Pulse articles for professional angle + pain points (LinkedIn gates full text; use the headlines/snippets search returns).

3. **Study the competition:**
   - `WebFetch` the top 2–3 pages currently ranking for `{targetQuery}` → note the questions they answer, their structure/headings, and the **gaps** (what they miss, over-complicate, or where our privacy/free/in-browser angle wins).
   - `WebFetch` a relevant competitor/related-company blog when useful (smallpdf.com/blog, ilovepdf.com/blog, adobe.com/acrobat, sejda.com/blog, tools.pdf24.org, pdfa.org) to spot angles worth covering or topics they ignore.

4. **Decide surface + internal links.** Blog (how-to / comparison / problem→solution) or programmatic (`tool × use-case`). Choose the tool(s) to link to from `lib/tools.ts` (and the matching use-case page if one exists).

5. **Write the brief** to `content/briefs/<id>.md` with:
   - `targetQuery`, secondary keywords, search intent
   - **The exact questions to answer** (deduped, ordered) from PAA/Reddit/Quora/LinkedIn — each becomes an H2 or an FAQ item
   - Competitor angles + the specific gap we beat
   - Recommended format + rough length + the surface
   - Internal-link targets (tool slugs / use-case URLs)
   - The "get it done" angle: what task the reader is trying to finish

6. **Update the backlog.** Set the topic's `status` to `"briefed"` in `content/keyword-map.json` (add the topic first if it was ad-hoc).

## Guardrails

- Research-first: a brief must exist before `content-draft` runs.
- Distinct topics only — dedup against published slugs; one target query per page.
- Prefer GSC query data when available (real demand + our current positions) over inferred signals.
- If a topic has no real question volume (nothing surfaces in mining), drop it rather than pad — note why in the backlog.

## Related

- Draft from the brief with the `content-draft` skill.
- Backlog: `content/keyword-map.json`. Surfaces: `content/blog/*.mdx`, `content/use-cases.ts`.
