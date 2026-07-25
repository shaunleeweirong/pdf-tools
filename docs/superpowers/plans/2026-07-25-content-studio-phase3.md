# Content Studio — Phase 3 (automated pipeline + schedule) Plan

> **For agentic workers:** this phase is pipeline wiring (Claude Code skills + a scheduled routine + the runbook), not app code — no TDD/tests. Build directly, verify by producing one real pending draft, and turn the schedule on last.

**Goal:** Make the "Needs approval" queue fill itself. The `content-draft` skill writes finished drafts to `content/pending/<slug>.mdx` and marks the topic `pending` **with a `slug` field** (closing Phase-2 finding I1); a scheduled Claude Code routine runs research → draft → pending on the cadence and redrafts `changes-requested` items from their feedback. Approvals happen in the `/studio` dashboard (Phase 2), not via PR.

**Architecture:** GitHub is the bus. Pipeline writes drafts + updates `keyword-map.json` → pushes to `main`. The Studio reads `content/pending/` live via the GitHub API and Approve moves the file to `content/blog/` (deploys). No new app code.

## Global Constraints

- **Closes I1:** whenever a topic reaches `pending`, its keyword-map entry MUST carry `slug: <filename>` (the Studio matches on `slug`). `content/pending/<slug>.mdx` ⇄ topic with `slug === <slug>`.
- **Drafts go to `content/pending/`, never straight to `content/blog/`.** Publishing is only via the Studio Approve (or a human). `content-publish` (the old PR/branch flow) is **superseded** by the dashboard for the Studio flow.
- **≥ 800 words**, research-first, unique target query — unchanged quality gates.
- **Cadence: every 30 minutes for testing** (user's explicit choice), then dial back to 2/day (60 days) → 1/day. Drafts to `pending` never auto-publish — the human approves in `/studio`.
- Pipeline commits/pushes to `main` (repo `shaunleeweirong/pdf-tools`); each push triggers a Vercel build (a pending draft is in the repo but is NOT a blog post until approved). At 30-min this is frequent — watch Vercel Hobby deploy limits; dial cadence back after testing.
- Work on the `content-studio-p1` branch. Do NOT push. Conventional commits + Co-Authored-By trailer.

## Files

- **Modify:** `.claude/skills/content-draft/SKILL.md` — output to `content/pending/<slug>.mdx`; set topic `status: pending` + `slug`; hand to the Studio dashboard (not a PR). 
- **Modify:** `docs/marketing/content-engine.md` — the workflow is now research → draft → **pending** → Studio Approve; the schedule fills the queue.
- **Create:** `.claude/skills/content-pipeline/SKILL.md` — the per-run orchestration the routine executes: (1) redraft `changes-requested` topics from feedback → `pending`; (2) research+draft top `idea` topics → `pending`; (3) commit + push; guardrails (distinct topics, throttle-not-pad).
- **Create (demo):** one `content/pending/<slug>.mdx` + its `keyword-map.json` topic set to `pending` with `slug`, produced through the flow — proves the pipeline output + I1 linkage with real data.
- **Deprecate note:** `.claude/skills/content-publish/SKILL.md` — mark superseded by `/studio` for the automated flow (kept for manual one-off publishes).

## Steps

1. Rewire `content-draft`: finished MDX → `content/pending/<slug>.mdx`; update the matching keyword-map topic to `status:"pending"` + `slug:"<slug>"` (add the topic if ad-hoc); commit `content: draft <slug> (pending)`; hand to `/studio` for approval. Remove the branch/PR/`content-publish` handoff.
2. Write `content-pipeline` skill (the routine's per-run job) + guardrails.
3. Update `docs/marketing/content-engine.md` to the Studio-based workflow + the schedule.
4. **Demo run:** take a top backlog `idea`, run research→draft, land it in `content/pending/` + flip its topic to `pending` + `slug`. Commit. (This is what the Studio will show; verify the file + keyword-map entry.)
5. **Schedule (last, needs user + validation):** use the `/schedule` skill to create a routine every 30 min that runs `content-pipeline`. **Before turning it on, validate the one unproven thing:** can a scheduled cloud routine push to this GitHub repo? If not, the routine commits via the same GitHub API/token the Studio uses (fallback). Confirm with the user before the live cron starts (it runs autonomously on their Claude subscription).

## Verification

- `content/pending/<demo-slug>.mdx` exists on the branch; its keyword-map topic has `status:"pending"` + `slug` — so once deployed with a token, `/studio` "Needs approval" shows it and Approve would publish it (updating board status, since `slug` now matches — I1 closed).
- `content-draft` + `content-pipeline` + runbook describe the pending→Studio flow with no PR step.
- Schedule: a dry run of `content-pipeline` produces a pending draft and pushes; nothing publishes without a `/studio` Approve.

## Guardrails

- Nothing auto-publishes — `pending` requires a human Approve in `/studio`.
- Distinct, researched topics only; one target query per post; ≥800 words; throttle rather than pad.
- 30-min is a system test — dial back to 2/day → 1/day once proven; watch deploy limits.
