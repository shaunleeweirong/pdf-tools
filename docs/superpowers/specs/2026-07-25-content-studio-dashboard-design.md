# Content Studio dashboard — design spec

*2026-07-25. An internal, private dashboard to review the automated content pipeline and approve/reject/request-changes on posts, with approvals auto-publishing to the blog.*

## Context & goal

The content engine (research → draft → publish) exists as skills + an MDX-in-repo blog. Publishing today is chat-based (Claude presents a draft, user says publish). The user wants a **private internal dashboard** ("Content Studio") that:
- shows the whole pipeline at a glance — what's researched, not yet researched, in progress, awaiting approval, published;
- lets the user **read a finished post and Approve / Reject / Request changes** (with feedback that goes back to the AI to redraft);
- **auto-publishes on Approve** — no GitHub, no terminal;
- stays **continuously filled** by an automated, scheduled pipeline.

## Architecture: git as the database

No new database. Content already lives in git; the dashboard is a thin private UI over the repo, reading/writing through the **GitHub API**. GitHub is the shared bus between the automated pipeline and the dashboard.

```
Scheduled Claude Code routine (cloud, every 30 min in testing)
   → content-research + content-draft skills
   → writes draft to content/pending/<slug>.mdx  +  updates content/keyword-map.json
   → pushes to GitHub repo (shaunleeweirong/pdf-tools)  ── the "database"
                                                         ▲          │
   /studio dashboard READS backlog + pending via GitHub API ────────┘
   user Approve  → dashboard commits pending/<slug> → blog/<slug> (GitHub API)
                                                         → Vercel auto-deploys → live
   user Request changes + note → status=changes-requested + feedback (commit)
                                                         → routine redrafts next run → pending
```

The public PDF site stays exactly as-is (static, no auth). Only `/studio` + its server actions are dynamic and protected.

## Components (each with one clear responsibility)

1. **`/studio` dashboard route** (dynamic/server-rendered, auth-gated). Renders the pipeline board from live GitHub state. Read-only in Phase 1.
2. **Auth** — a single password (`STUDIO_PASSWORD`). A login form posts the password; on match, set a signed httpOnly cookie (signed with `AUTH_SECRET`). Middleware protects `/studio/**` and the server actions. One internal user; no accounts.
3. **`lib/github.ts`** (server-only) — the one integration point. Reads `keyword-map.json` + lists/reads `content/pending/*`; writes files (create/move/delete) via the GitHub Contents API using `GITHUB_TOKEN`. Each write is a commit to `main`.
4. **Server actions** — `approve(slug)`, `reject(slug)`, `requestChanges(slug, feedback)`. Each does one GitHub commit (below). Auth-checked.
5. **Preview renderer** — reuses `next-mdx-remote/rsc` `compileMDX` to render a pending draft's body so the user reads the real post, plus its word count.
6. **Pipeline (Phase 3)** — the `content-draft` skill writes finished drafts to `content/pending/` (instead of a branch); the scheduled routine runs research→draft, handles `changes-requested` items, and pushes.

## Data model

Pipeline state lives in `content/keyword-map.json` (each topic has a `status`) + draft files in `content/pending/<slug>.mdx`.

**Statuses:** `idea` → `researching` → `briefed` → `drafting` → `pending` (needs approval) → `published`; plus `changes-requested` (with a `feedback` string) and `rejected`.

**Dashboard board groups:**
- **Backlog** — `idea` (with priority)
- **In progress** — `researching` / `briefed` / `drafting` / `changes-requested`
- **Needs your approval** — `pending` (each: title, target query, word count, rendered preview, Approve / Reject / Request-changes)
- **Published** — `published` (with live links); **Rejected** shown collapsed

**Action → commit (via GitHub API):**
- **Approve:** create `content/blog/<slug>.mdx` (from the pending file), delete `content/pending/<slug>.mdx`, set status `published` → push → deploy → live.
- **Reject:** delete `content/pending/<slug>.mdx`, set status `rejected`.
- **Request changes:** set status `changes-requested` + `feedback` (draft stays in `content/pending/`, hidden from "Needs approval"). The routine redrafts it using the feedback next run and flips it back to `pending`.

## Content quality rules (enforced by content-draft self-score)

- **≥ 800 words** per post (hard floor; dashboard shows the count).
- Research-first (a brief exists), answer-first intro, target keyword in title/H1/first-50-words, ≥1 internal tool link, unique target query (no cannibalization vs published), `BlogPosting`/`FAQPage` schema, reads naturally.

## Automation

- **Engine:** a **Claude Code scheduled routine** (via the `/schedule` skill) — a cron cloud agent on the user's subscription (no API key). Each run: (1) redraft any `changes-requested` items using their feedback; (2) research + draft the top-priority `idea` topics; (3) commit/push to GitHub.
- **Cadence:** **every 30 minutes (:00/:30) for testing** — validates the loop fast (draft appears → approve → publish). Then **dial back to 2/day for 60 days → 1/day**. (30 min ≈ 48 runs/day: it will exhaust the ~11-topic backlog in ~5–6 h and use notable Claude usage — a system test, not the real pace; seed extra test topics.)
- **GitHub link / honest caveat:** the routine pushes to the same repo Vercel deploys from. The one unproven detail is how a *cloud* routine authenticates to push; if it can't push directly, the fallback is committing via the same GitHub API/token the dashboard uses. This is why Phase 3 comes last.

## Secrets / config (Vercel env)

- `STUDIO_PASSWORD` — the dashboard login.
- `AUTH_SECRET` — signs the session cookie.
- `GITHUB_TOKEN` — fine-grained PAT, contents read/write on this repo only; server-side, behind auth. This is what lets Approve publish.
- `GITHUB_REPO` / owner + `main` branch — config for `lib/github.ts`.

## Build order (3 shippable phases)

1. **Read-only dashboard** — `/studio` + password auth + `lib/github.ts` (read) + the board (backlog + pending preview + published), reading live from GitHub. Ship + verify visibility.
2. **Approve / Reject / Request-changes → auto-publish** — the three server actions (GitHub commits) + the buttons + the feedback box + the changes→pending status handling. The core value.
3. **Wire the pipeline + schedule** — `content-draft` writes to `content/pending/` (≥800 words); create the `/schedule` routine at 30-min (testing) that fills the queue and processes feedback. Validate end-to-end, then dial cadence back.

## Verification

- **Phase 1:** log in at `/studio` (wrong password blocked); board shows current backlog + any `content/pending/` drafts with previews + word counts, pulled live from GitHub; unauthed access to `/studio` and the actions is rejected.
- **Phase 2:** seed a test draft in `content/pending/`; Approve → it appears in `content/blog/`, disappears from pending, deploys, and is live at `/blog/<slug>`; Reject removes it; Request-changes sets status + feedback. Public site unaffected.
- **Phase 3:** the routine run creates a `pending` draft ≥800 words from a backlog topic; a `changes-requested` item is redrafted per feedback; end-to-end (routine → dashboard → approve → live) works; then cadence set to the real schedule.

## Risks & guardrails

- **First backend + a write-scoped secret.** `GITHUB_TOKEN` can write the repo — used only server-side behind the password; scope it to this one repo; never expose to the client.
- **Auto-publish is real publishing.** Approve deploys to prod. That's intended (approval = the gate). Reject/request-changes never publish.
- **Cloud-routine push auth** is the least-proven piece (fallback: GitHub API/token). Prove the dashboard (Phases 1–2) before automating (Phase 3).
- **Volume vs quality.** 30-min is testing only. At real cadence, the ≥800-word + research-first + unique-topic gates + human approval protect against Google's helpful-content demotion. Throttle, don't pad.
- **Backlog exhaustion during testing** — seed extra topics or expect idle runs.
