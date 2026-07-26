---
name: content-pipeline
description: One run of the automated content pipeline for pdf-tool — redraft any changes-requested posts from their feedback, then research + draft the top backlog topics into content/pending/ for Studio approval. Use when a scheduled routine fires, or to manually advance the queue. Never publishes — humans approve in /studio.
---

# Content pipeline (one run)

The job a scheduled Claude Code routine runs each firing. It keeps the `/studio` "Needs approval" queue filled with researched, ≥800-word drafts. **Nothing is ever published here** — drafts land in `content/pending/` and a human approves them in the dashboard.

## Per-run steps

1. **Process feedback first.** For each topic in `content/keyword-map.json` with `status: "changes-requested"`: read its `feedback` + the existing `content/pending/<slug>.mdx`, redraft it with the `content-draft` skill addressing the feedback, overwrite the pending file, and set the topic back to `status: "pending"` (clear `feedback`). This closes the review loop.
2. **Keep the backlog full (refill when low).** Count topics with `status: "idea"`. If fewer than ~6 remain, mine new ones (WebSearch: People-Also-Ask, autocomplete, `site:reddit.com`/`quora.com`/`linkedin.com`, competitor blogs; plus the tool × use-case matrix from `lib/tools.ts`) and add 6 to 10 new, distinct `idea` topics to `content/keyword-map.json` (unique `targetQuery`, not already published or queued). Do this BEFORE drafting so the queue never runs dry.
3. **Draft new topics.** Pick the top 1 to 2 `status: "idea"` topics by `priority` not covered by a published slug. For each: run `content-research` to a brief, then `content-draft` to a finished `content/pending/<slug>.mdx` (≥800 words; follow content-draft's style rules: no em-dashes, no AI-tell words, 1 to 3 credible outbound links) with the topic set to `pending` + `slug`. Research-first: no draft without a brief.
4. **Commit + push** all the run's changes to `main` in one commit (`content: pipeline run`). The push lands the drafts in the repo; `/studio` reads them live for approval. It does not publish them.

## Cadence & scaling

- Testing: every 30 minutes (system test — watch it flow end-to-end, then dial back).
- Real: 2 posts/day for the first 60 days, then 1/day.
- **Throttle, don't pad:** if there are no distinct, well-researched `idea` topics left, do a research-only run to refill the backlog (mining PAA/Reddit/Quora/LinkedIn + competitor blogs) or produce nothing — never publish filler. Log what was skipped.

## Guardrails

- **Never publish.** `pending` → published happens ONLY via a human Approve in `/studio`.
- Distinct topics only (one unique target query per post; dedup vs published slugs). ≥800 words. Every draft carries `slug` on its topic (the Studio matches on it).
- Keep research ahead of drafting so the queue never runs on padded topics.

## Related
- Research: `content-research`. Draft: `content-draft` (writes to `content/pending/`). Approve: the `/studio` dashboard. Backlog: `content/keyword-map.json`. Runbook: `docs/marketing/content-engine.md`.
