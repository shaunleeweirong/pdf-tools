# Content automation engine — runbook

The engine is a pipeline: **research → brief → draft → self-score → PR → (human merge) → deploy**. Research is mandatory and comes first; nothing publishes without a human merging the PR.

## Pieces

- **Backlog:** `content/keyword-map.json` — topics with `status` (idea → briefed → drafted → published), `surface` (blog | programmatic), `priority`, target query.
- **Research skill:** `.claude/skills/content-research` — mines real questions (PAA, autocomplete, Reddit, Quora, LinkedIn) + studies competitor pages/blogs → writes a brief to `content/briefs/<id>.md`. Uses built-in `WebSearch`/`WebFetch`; prefers Google Search Console query data when available.
- **Draft skill:** `.claude/skills/content-draft` — turns a brief into a finished MDX blog post (`content/blog/*.mdx`) or a programmatic entry (`content/use-cases.ts`), self-scores, opens a PR.
- **Surfaces:** blog at `/blog`, programmatic pages at `/{tool}/{use-case}` (both already built + SEO/schema wired).

## Phase A — manual (do this first, ~1–2 weeks)

Run the loop by hand to lock the quality bar before automating:

1. `/content-research` — researches the top backlog topic (or a query you name) → a brief.
2. Review the brief; adjust the angle if needed.
3. `/content-draft` — writes the finished post from the brief, self-scores, opens a PR.
4. Review the PR (does it answer real questions? natural? correct? on-brand?), then merge → Vercel auto-deploys.

Aim to validate ~5–10 posts this way. If a draft is thin, send it back — the point is a high, distinct quality bar.

## Phase B — scheduled (turn on once quality holds)

Use the `/schedule` skill to create a recurring cloud routine that runs the loop and opens a **daily bundled PR** (still human-merged):

- **Cadence:** 2 posts/day for the first 60 days (~120 posts), then 1/day.
- Keep **research ahead of drafting** — the routine should refresh the backlog (mining + GSC) so there are always ≥~2 weeks of briefed topics buffered.
- Still PR-gated: nothing auto-publishes.

Example intent to give `/schedule`: *"Twice daily, run content-research then content-draft for the top 2 briefed blog topics, bundle into one PR titled 'content: daily drop <date>', and stop if fewer than 2 distinct researched topics are available."*

## Guardrails (non-negotiable)

- **Research-first:** no draft without a brief.
- **Distinct topics only:** one unique target query per page; dedup against published slugs. A flood of thin/similar AI posts is exactly what Google's helpful-content system demotes.
- **Throttle, don't pad:** if the supply of distinct, well-researched topics dips, slow down rather than publish filler.
- **Watch GSC** after ~2–3 weeks and tune the pace to what actually earns impressions.

## Signals to add

- Finish Google Search Console setup (`docs/marketing/seo-setup.md`), then drop a query export at `content/gsc-queries.*` (or wire the API) — it becomes the top research signal (real demand + where you already rank).
