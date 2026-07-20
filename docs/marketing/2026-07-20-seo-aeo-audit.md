# pdf-tool — SEO / AEO audit

*2026-07-20. Code-grounded audit of the merged SEO foundation (branch merged to `main`, not yet pushed/deployed). Live SERP / AI-visibility mining is deferred until the site is deployed on a custom domain — see "Deferred" at the end.*

## Verdict

**Technical SEO foundation: strong.** **On-page AEO/content readiness: low — by design** (it's the next phase). The foundation gives crawlers/AI a clean, well-labelled site; it does not yet give them *answer content* to extract or *entity authority* to trust. One item shipped with a latent policy risk (FAQ schema without visible FAQ) — that's the only true defect; everything else is "not built yet," matching the 90-day plan.

Representative per-page AEO score (skill's 100-pt checklist), `/merge-pdf` as-is: **~27/100 (F)**; tools without FAQ schema ~17. This is expected after Weeks 1–2 and rises sharply once the content layer (P1) lands.

## What's solid (keep)

- Unique, keyword-led `<title>` + meta description per tool (8 bespoke, 14 derived) and homepage.
- Self-referential canonicals resolve via `metadataBase`; title template `%s · pdf-tool`.
- `sitemap.xml` (23 URLs) + `robots.txt` pointing to it; GSC/Bing verification hooks (env).
- `SoftwareApplication` JSON-LD with a free `Offer` on every tool; `WebSite` + `SoftwareApplication` on home.
- Fast static delivery, client-side (good Core Web Vitals), `html lang="en"`, mobile-first.
- Homepage leads with the "get it done" wedge; privacy present as a trust cue, not the headline.

## Gaps (prioritized)

### P0 — fix before/at deploy
1. **FAQPage schema with no visible FAQ** (`merge-pdf`, `split-pdf`, `compress-pdf`). Google's structured-data policy requires FAQ markup to reflect Q&A *visible on the page*; ours is schema-only (`ToolLayout` renders no FAQ). Risk: ignored, or a manual action. **Fix:** render a visible FAQ section from the same `lib/seo-content.ts` data (best — makes schema valid *and* adds extractable content), or drop the FAQPage nodes until content exists.
2. **`NEXT_PUBLIC_SITE_URL`** still falls back to `pdf-tool-blue.vercel.app`. Set it to the real domain at deploy so canonicals/OG/sitemap don't lock to the vercel.app host.

### P1 — the content + schema layer (the actual AEO unlock; Weeks 3–8)
3. **Add visible answer content to tool pages.** Each tool needs: a 2–3 sentence intro that directly answers "how do I {task}" in the first 50 words; a short **How-to steps** list; and a 3–5 item **FAQ**. This is the single biggest lever for both ranking *and* AI-Overview/Perplexity citation — right now there is nothing to extract. (Also feeds the planned programmatic `/{tool}/{use-case}` pages.)
4. **HowTo JSON-LD** on tool pages (steps) — tool pages are the canonical "how to X" query target; high AEO value, currently missing.
5. **Extend FAQ + keyword-led titles to all 22 tools** (only 3 have FAQ; 14 have generic derived titles).
6. **Organization schema + logo + `sameAs`** for entity recognition (ChatGPT/Bing lean on this). Needs owned profiles to link — create/claim X, LinkedIn, GitHub, Product Hunt, Crunchbase, then wire `sameAs`.
7. **OG / Twitter image** — `summary_large_image` is declared but no image exists, so shares render blank. Add a default, ideally per-tool via `next/og` `ImageResponse`.

### P2 — polish + authority (ongoing)
8. **BreadcrumbList** schema + contextual internal links (related tools) on tool pages; the H1 is the bare tool name — align it with the outcome phrasing.
9. Author byline + visible "updated" date (matters most for the blog).
10. `Speakable` / `DefinedTerm` schema (voice / glossary) — low priority.
11. Off-page entity/authority: Product Hunt + Show HN launch, "best free PDF tools" listicles/directories, and eventually Wikidata/Wikipedia when notable.
12. Consider an `llms.txt` (emerging AI-crawler convention) — experimental.

## Deferred — requires the deployed live site (firecrawl)
Once pushed + on a domain: PAA / autocomplete / Reddit / Quora question mining; an AI-visibility scorecard (are we cited in AI Overviews/Perplexity, and who is?); competitor citation reverse-engineering; and a brand-SERP audit. These need the real URL live with the new markup, so they come after deploy.

## Recommendation
Ship the foundation (it's a strict improvement over the current live site), do **P0** at deploy, then make **P1 #3 (visible tool-page content + FAQ/How-to)** the first content sprint — it closes the biggest AEO gap and is the natural bridge into the programmatic-pages + content-automation phase.
