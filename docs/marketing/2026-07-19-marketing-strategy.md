# pdf-tool — Marketing Strategy & Automation Plan

*Written 2026-07-19. Owner: solo founder. Horizon: 90 days, reviewed monthly.*

## TL;DR

`pdf-tool` is a **privacy-first PDF web app** — 22 tools that run entirely in the browser, so **files never leave the user's device**. It's live at https://pdf-tool-blue.vercel.app, 100% free, no signup, deployed on Vercel.

PDF tools are a **search-demand business**: Smallpdf and iLovePDF became billion-visit companies almost entirely on organic search, not ads or social. So this is fundamentally an **SEO plan** — with one wedge the incumbents structurally cannot copy: **privacy**. They upload every file; we don't.

**Near-term goal (3–6 months): organic traffic + free-tool usage.** There's no paid tier yet, so we build the audience first.
**Budget: bootstrap / near-zero.** Free tools + the Claude API for content automation, solo, a few hours/week. Automation multiplies the founder's time; it never replaces the quality gate.

The blog is one slice. The bigger levers are **programmatic SEO landing pages** and **backlinks/launch**. This doc lays out positioning, a keyword map, five prioritized channels, a phased AI content-automation roadmap, measurement, risks, and a 90-day sequence.

---

## 1. Positioning & messaging

**The wedge — privacy.** Every incumbent (Smallpdf, iLovePDF, Adobe, Sejda) uploads your files to their servers. `pdf-tool`'s core tools run 100% client-side: *files never leave your browser.* This is provably true, valuable, and impossible for the big players to claim without re-architecting. It's the spine of all messaging.

**Message hierarchy (in priority order):**
1. **Private** — files never leave your browser; nothing is uploaded or stored.
2. **Free** — no signup, no watermarks, no daily task limits on client-side tools.
3. **Fast** — client-side means instant; no upload/download round-trip.
4. **Complete** — a superset of the common tools people expect (merge, split, compress, convert, edit, sign, protect…).

**Tagline candidates (pick one, use consistently):**
- "PDF tools that never see your files."
- "Private, free PDF tools — your files stay in your browser."
- "The PDF toolkit that doesn't upload your files."

**Where the message lives:** homepage H1 + subhead, every tool page (a one-line privacy reassurance near the dropzone), meta descriptions, blog post intros/CTAs, Product Hunt tagline, Show HN title, social bios, directory listings. Consistency compounds into brand recognition.

**Proof/trust cues to surface:** "No upload — processed in your browser" badge on tool pages; a short "How your privacy works" explainer page (great for both trust and SEO on privacy-wedge keywords).

---

## 2. The core bet — SEO, framed by a 3-tier keyword map

A brand-new domain has ~zero authority and cannot out-rank DA90 incumbents on head terms in the short term. The winning move is to **own the long-tail and the privacy-wedge now**, scale with **programmatic pages**, and earn **authority + backlinks** over 6–12 months so the head terms become reachable later.

**Tier A — Head terms (long game, don't expect fast wins):**
`merge pdf`, `compress pdf`, `pdf to jpg`, `split pdf`, `edit pdf`. Enormous volume, brutal competition. Optimize the existing tool pages for these (they're the canonical target), but treat rankings here as a 12-month+ outcome, not a near-term KPI.

**Tier B — Privacy-wedge terms (OWN these now — highest ROI):**
`merge pdf without uploading`, `compress pdf offline`, `pdf editor no upload`, `private pdf tools`, `local pdf merger`, `pdf tool that doesn't store files`, `combine pdf without uploading to server`, `secure pdf tools no upload`. Lower competition, and we are *uniquely honest* for them — the incumbents can't credibly target these. This is where we should win first.

**Tier C — Long-tail how-to / modifier terms (blog + programmatic engine):**
`how to merge pdf on chromebook`, `compress pdf to 100kb`, `combine pdf on mac free`, `remove pdf password without acrobat`, `how to compress pdf for email`, `merge pdf on iphone`, `reduce pdf size without losing quality`. There are thousands of these; each has modest volume but they add up and convert well because intent is specific.

**Keyword sourcing (free):** Google Search Console (once live) for queries you already appear for; Google autocomplete + "People also ask" + "related searches"; AnswerThePublic (limited free); Bing Webmaster keyword tool; Reddit/forum questions; competitor tool-page URLs. Maintain a living `keyword-map.csv` (keyword, tier, target URL, intent, status).

---

## 3. Channel plan (prioritized for solo / bootstrap)

Ordered by leverage-per-hour for a solo founder. Do them roughly in this order; earlier channels compound and feed later ones.

### 3.1 Technical + on-page SEO foundation — *do this first*
The base everything compounds on. Concretely:
- **Custom domain** — move off `*.vercel.app` (see Risks). Highest-priority foundation item.
- **Per-tool metadata** — unique `<title>` + meta description + Open Graph/Twitter card per tool page and per programmatic page. (Already flagged as a TODO in the project notes.)
- **Structured data (JSON-LD)** — `SoftwareApplication` on the homepage, `HowTo` on how-to content, `FAQPage` on tool/programmatic pages. Improves rich results + click-through.
- **`sitemap.xml` + `robots.txt`** — auto-generated, submitted to GSC/Bing.
- **Canonicals** — every page self-canonical; programmatic variants never duplicate.
- **Search consoles** — Google Search Console + Bing Webmaster verified and monitored.
- Core Web Vitals are already strong (client-side, static) — a real advantage; keep it.

### 3.2 Programmatic SEO pages — *the scale lever*
Templated landing pages at the intersection of `{tool} × {modifier / platform / use-case}`:
- `/merge-pdf/without-uploading`, `/compress-pdf/for-email`, `/merge-pdf/on-mac`, `/remove-pdf-password/without-acrobat`, `/compress-pdf/to-100kb`.
- Each page **embeds the actual working tool** + tailored intro + a short how-to + a page-specific FAQ. This is what makes them genuinely useful rather than doorway spam.
- **Start curated (~30–50 highest-intent pages), not thousands.** Prove the template ranks, then expand. Every page must earn its place with unique value.

### 3.3 Blog / content marketing — *the founder's idea; positioned as support*
The blog builds topical authority, captures Tier-C how-to intent, and earns backlinks — it supports the tool/programmatic pages rather than standing alone. Post types:
- **How-to guides** — "How to compress a PDF for email (without uploading it)."
- **Comparison / alternatives** — "7 free PDF tools that don't upload your files," "Smallpdf alternatives that keep files private."
- **Problem → solution** — "Why won't my PDF attach to email? (and how to shrink it)."
- Every post **internal-links to the relevant tool + programmatic pages** and restates the privacy angle. This is where AI automation drafts at volume (Section 4).

### 3.4 Off-page / launch & backlinks — *critical for a new domain*
Backlinks are the #1 ranking factor a new domain lacks. Prioritized, mostly-free tactics:
- **Product Hunt launch** — lead with the privacy angle.
- **"Show HN"** — client-side + privacy + no-upload is Hacker News catnip; a strong candidate for early traffic and links.
- **Directories & listicles** — AlternativeTo (as a Smallpdf/iLovePDF alternative), SaaS/privacy-tool directories, "best free PDF tools" roundups (polite outreach to authors).
- **Communities** — genuine, non-spammy participation in r/pdf, r/privacy, r/software, relevant Discords/forums.
- **Dev-API directories** — later, once/if the API ships (Public APIs lists, RapidAPI).
- Free tools are natural link magnets — make them easy to cite and share.

### 3.5 Owned / light social — *optional, low-effort*
- **Build-in-public on X** — cheap distribution + backlinks-of-attention; only if the founder enjoys it.
- **Email capture** — a simple "PDF tips" opt-in to start an owned audience. Keep minimal given bootstrap; revisit when there's a paid tier to market.

---

## 4. Automation roadmap — the AI content engine

Automation is how a solo founder produces content at volume. But Google penalizes mass-produced, unhelpful AI content, so a **human quality gate is non-negotiable**. Build in two phases.

**Phase A — Semi-automated (validate quality first).**
Claude drafts blog posts and programmatic page copy from a structured keyword brief. Each draft includes: the privacy angle, correct internal links, SEO title + meta description, an FAQ block (for `FAQPage` schema), and a suggested slug. **The founder reviews/edits every piece before publish.** Goal: lock a template and a quality bar that actually ranks and reads well.

**Phase B — Scheduled automation (scale what works).**
Once the template is proven, automate generation + publishing on a cadence — Vercel Cron or a scheduled Claude cloud agent — **behind a review queue**, not straight-to-live. Throttle publishing pace (steady beats spiky) and keep the human gate for at least spot-checks.

**Tech (reuses the existing Next.js app):**
- Content as **MDX/Markdown in-repo** (`content/blog/…`) — git gives versioning; Vercel hosts it free.
- **Programmatic route** (e.g. `app/[tool]/[modifier]/page.tsx`) driven by a data file mapping tool × modifier → copy/FAQ.
- **Claude API** for generation — the one server-side/env piece; spend is small and fits the bootstrap budget.
- Hook into the existing per-tool SEO metadata work (already a project TODO).

**Guardrails:** human-in-the-loop; every page genuinely useful (embedded working tool + tailored copy, never thin doorway pages); unique copy + self-canonicals; throttled publishing; drop/prune pages that don't earn impressions.

---

## 5. Measurement (free tools)

- **Google Search Console** — the primary dashboard: impressions, clicks, average position, queries, indexed-page count. Watch impressions first (they move before clicks).
- **Bing Webmaster Tools** — second search engine + a free keyword tool.
- **Analytics** — GA4 or Vercel Analytics (both free) for tool-usage / completion events; add Plausible later if a small spend is acceptable and privacy-friendly analytics is on-brand.
- **Backlinks** — Ahrefs Webmaster Tools (free tier for your own verified site) to track referring domains.
- **North-star metrics:** organic impressions → clicks, indexed pages, tool-usage events, referring domains.
- **Cadence:** a weekly GSC glance (5 min), a monthly review — double down on what ranks, prune/rewrite what doesn't.

---

## 6. Risks & guardrails

- **`*.vercel.app` domain** — a shared subdomain limits brand and authority signals. **Move to a custom domain first** (~$10/yr — fits bootstrap). High priority; do it before heavy content investment so links point at the domain you'll keep.
- **AI-content quality** — human-in-the-loop, each page genuinely helpful, no spam. Thin/duplicative AI pages risk a helpful-content demotion that's slow to recover from.
- **SEO is slow** — realistic horizon is 6–12 months for meaningful head-term movement; Tier B/C and backlinks come sooner. Set expectations; don't abandon before the compounding kicks in.
- **Doorway-page risk** — every programmatic page must carry unique value (embedded tool + tailored copy + FAQ), or Google treats the set as doorway spam.
- **Solo bandwidth** — sequence ruthlessly (Section 7); lean on automation for drafting, not for judgment.

---

## 7. 90-day sequencing (solo, bootstrap)

**Weeks 1–2 — Foundation**
Custom domain live; Google Search Console + Bing verified; `sitemap.xml` + `robots.txt`; per-tool metadata + JSON-LD; privacy messaging on homepage + tool pages; seed the keyword map (Tiers A/B/C).

**Weeks 3–4 — Launch + first content**
Product Hunt + Show HN launch; submit to AlternativeTo + directories; publish 3–5 Claude-assisted cornerstone posts to validate quality and lock the template.

**Weeks 5–8 — Programmatic + engine**
Ship the programmatic page template + first 20–40 high-intent pages; stand up the Claude content pipeline (Phase A, human-reviewed); publish 2–3 posts/week.

**Weeks 9–12 — Automate + scale**
Move to Phase B scheduled publishing behind a review queue; ongoing backlink outreach (listicle authors, directories); measure, prune, and double down on what ranks.

---

## 8. Immediate next step

Turn **Weeks 1–2 Foundation** — custom domain, GSC/Bing, per-tool SEO metadata + JSON-LD, sitemap/robots — into the first implementation plan. That's the concrete, buildable start of the automation track, and it's the highest-leverage work regardless of what comes after.

---

*References: `docs/competitive-research.md` (positioning, keyword ideas, competitor gaps); project memory `pdf-tool-project.md` (product state, deferred per-tool SEO metadata TODO).*
