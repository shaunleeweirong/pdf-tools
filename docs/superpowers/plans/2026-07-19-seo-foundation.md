# SEO Foundation (Weeks 1–2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every page unique, outcome-framed SEO metadata + JSON-LD, add a sitemap and robots file, reframe the homepage to the "get it done" wedge, and document the custom-domain / Search Console setup — the compounding base the whole marketing plan depends on.

**Architecture:** All SEO logic lives in a pure, unit-tested `lib/seo.ts` (+ a `lib/seo-content.ts` copy map). Because the 22 tool pages are Client Components (`'use client'`), they cannot export `metadata`; instead each tool route gets a tiny **server** `layout.tsx` that pulls `metadata` + JSON-LD from `lib/seo.ts`. `app/sitemap.ts` and `app/robots.ts` are thin wrappers over `lib/seo.ts` (kept in `lib` so Vitest — which only includes `lib/**` — can test them). The homepage and root layout are already Server Components and are edited directly.

**Tech Stack:** Next.js 16 (App Router), TypeScript, React 19, Vitest. No new runtime dependencies.

## Global Constraints

- **Next.js 16 metadata rule:** `metadata` / `generateMetadata` exports work **only in Server Components**. Tool pages are `'use client'` → per-tool metadata comes from a server `layout.tsx`, never the page. (Confirmed in `node_modules/next/dist/docs/.../14-metadata-and-og-images.md`.)
- **Test location:** Vitest `include` is `lib/**/*.test.ts` and `lib/**/__tests__/**/*.test.ts` only (see `vitest.config.ts`). All tests go under `lib/__tests__/`. Testable logic must live in `lib/`, not `app/`.
- **Positioning wedge (copy rule):** Lead with **"get it done"** (outcome) + **free** + **fast**; privacy is a **trust cue only** (a trailing line on in-browser tools), never the headline. No "your files never leave your browser" as a primary claim (Phase 2 server tools will upload).
- **Canonical base:** `SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pdf-tool-blue.vercel.app'` (trailing slash stripped). All absolute URLs derive from it. No hard-coded domain elsewhere.
- **No new deps** (bootstrap budget). **Commit after every task**, conventional-commit style matching the repo (`feat(seo): …`, `docs(marketing): …`). End each commit message with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- **Do not push** (push to `main` auto-deploys on Vercel). The founder pushes when ready.

---

## File Structure

- `lib/seo-content.ts` — **create.** Per-tool SEO copy map (bespoke title/description/FAQ for top tools). Data only.
- `lib/seo.ts` — **create.** `SITE_URL`, `getToolSeo`, `buildToolMetadata`, `toolJsonLd`, `siteJsonLd`, `buildRootMetadata`, `buildSitemap`, `buildRobots`. Logic only; no Next runtime imports (types only).
- `lib/__tests__/seo.test.ts` — **create.** Unit tests for every builder.
- `lib/__tests__/seo-coverage.test.ts` — **create.** Guard: every tool slug has a `layout.tsx`.
- `app/sitemap.ts`, `app/robots.ts` — **create.** Thin default-export wrappers.
- `app/<slug>/layout.tsx` × 22 — **create.** Server layout: `metadata` + JSON-LD per tool.
- `app/layout.tsx` — **modify.** `metadataBase`, title template/default, default OG/Twitter/robots, env-driven verification.
- `app/page.tsx` — **modify.** Reframe H1/eyebrow/subhead to the wedge; add canonical + site JSON-LD.
- `docs/marketing/seo-setup.md` — **create.** Manual runbook: custom domain, Vercel env, Google Search Console, Bing.

---

## Task 1: SEO core — content map, tool metadata & JSON-LD

**Files:**
- Create: `lib/seo-content.ts`
- Create: `lib/seo.ts`
- Test: `lib/__tests__/seo.test.ts`

**Interfaces:**
- Produces: `SITE_URL: string`, `SITE_NAME: string`, `getToolSeo(slug: string): { title: string; description: string; faq: {q:string;a:string}[] }`, `buildToolMetadata(slug: string): Metadata`, `toolJsonLd(slug: string): Record<string, unknown>[]`, `siteJsonLd(): Record<string, unknown>[]`.
- Consumes: `TOOLS`, `TOOL_SLUGS`, `getTool` from `lib/tools.ts`.

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/seo.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { TOOL_SLUGS } from '@/lib/tools'
import {
  SITE_URL,
  getToolSeo,
  buildToolMetadata,
  toolJsonLd,
  siteJsonLd,
} from '@/lib/seo'

describe('getToolSeo', () => {
  it('returns a non-empty title and description for every tool', () => {
    for (const slug of TOOL_SLUGS) {
      const seo = getToolSeo(slug)
      expect(seo.title.length).toBeGreaterThan(10)
      expect(seo.description.length).toBeGreaterThan(30)
    }
  })

  it('throws on an unknown slug', () => {
    expect(() => getToolSeo('does-not-exist')).toThrow()
  })
})

describe('buildToolMetadata', () => {
  it('sets a slug-relative canonical and title', () => {
    const m = buildToolMetadata('merge-pdf')
    expect(m.alternates?.canonical).toBe('/merge-pdf')
    expect(typeof m.title).toBe('string')
    expect(m.openGraph?.url).toBe('/merge-pdf')
  })
})

describe('toolJsonLd', () => {
  it('includes a free SoftwareApplication with an absolute url', () => {
    const g = toolJsonLd('merge-pdf')
    const app = g.find((n) => n['@type'] === 'SoftwareApplication') as any
    expect(app).toBeTruthy()
    expect(app.offers.price).toBe('0')
    expect(app.url).toBe(`${SITE_URL}/merge-pdf`)
  })

  it('adds an FAQPage when the tool has FAQ content', () => {
    const g = toolJsonLd('merge-pdf')
    expect(g.some((n) => n['@type'] === 'FAQPage')).toBe(true)
  })
})

describe('siteJsonLd', () => {
  it('includes WebSite and SoftwareApplication nodes', () => {
    const g = siteJsonLd()
    expect(g.some((n) => n['@type'] === 'WebSite')).toBe(true)
    expect(g.some((n) => n['@type'] === 'SoftwareApplication')).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- seo`
Expected: FAIL — `Cannot find module '@/lib/seo'`.

- [ ] **Step 3: Create the content map**

Create `lib/seo-content.ts`:

```ts
export interface FaqItem {
  q: string
  a: string
}

export interface ToolSeoOverride {
  title?: string
  description?: string
  faq?: FaqItem[]
}

// Bespoke, outcome-framed copy for the highest-value tools.
// Tools without an entry fall back to registry-derived copy (see lib/seo.ts).
// Adding more entries is ongoing content work (Weeks 3+).
export const SEO_CONTENT: Record<string, ToolSeoOverride> = {
  'merge-pdf': {
    title: 'Merge PDF free — combine PDF files in your browser',
    description:
      'Combine several PDFs into one file in seconds. Free, no sign-up and no watermark — merged right in your browser.',
    faq: [
      { q: 'Is merging PDFs free?', a: 'Yes — no sign-up, no watermark and no daily limit.' },
      { q: 'Are my files uploaded?', a: 'No. Merge PDF runs in your browser, so your files stay on your device.' },
    ],
  },
  'split-pdf': {
    title: 'Split PDF free — extract pages into separate files',
    description:
      'Split a PDF into separate files or page ranges in seconds. Free, no sign-up, done right in your browser.',
    faq: [
      { q: 'Can I pick specific pages?', a: 'Yes — choose the page ranges you want and download them as new PDFs.' },
    ],
  },
  'compress-pdf': {
    title: 'Compress PDF free — shrink a PDF to email it',
    description:
      'Reduce PDF file size so it will finally attach to an email. Free, no sign-up, compressed in your browser.',
    faq: [
      { q: 'How small can it get?', a: 'This light in-browser compressor works best on image-heavy PDFs; results vary by file.' },
    ],
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG free — convert PDF pages to images',
    description:
      'Turn every page of a PDF into a JPG image in seconds. Free, no sign-up, converted in your browser.',
    faq: [],
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF free — turn images into a PDF',
    description:
      'Combine JPG and PNG images into a single PDF, one image per page. Free, no sign-up, made in your browser.',
    faq: [],
  },
  'rotate-pdf': {
    title: 'Rotate PDF free — fix sideways pages online',
    description:
      'Rotate PDF pages 90°, 180° or 270° and save. Free, no sign-up, rotated right in your browser.',
    faq: [],
  },
  'protect-pdf': {
    title: 'Password protect a PDF free — encrypt in your browser',
    description:
      'Add a password and encrypt a PDF in seconds. Free, no sign-up — the file is encrypted in your browser.',
    faq: [],
  },
  'edit-pdf': {
    title: 'Edit PDF free — change text and add notes online',
    description:
      'Edit existing text, or add text and boxes to any page. Free, no sign-up, edited right in your browser.',
    faq: [],
  },
}
```

- [ ] **Step 4: Create the SEO library (tool metadata + JSON-LD)**

Create `lib/seo.ts`:

```ts
import type { Metadata } from 'next'
import { getTool } from '@/lib/tools'
import { SEO_CONTENT, type FaqItem } from '@/lib/seo-content'

export const SITE_NAME = 'pdf-tool'
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pdf-tool-blue.vercel.app'
).replace(/\/$/, '')
export const TAGLINE =
  'Every PDF tool you need — get it done in seconds, free and in your browser.'

export interface ToolSeo {
  title: string
  description: string
  faq: FaqItem[]
}

export function getToolSeo(slug: string): ToolSeo {
  const tool = getTool(slug)
  if (!tool) throw new Error(`Unknown tool slug: ${slug}`)
  const override = SEO_CONTENT[slug]
  return {
    title: override?.title ?? `${tool.name} online — free, in your browser`,
    description:
      override?.description ??
      `${tool.description} 100% free, no sign-up — processed right in your browser.`,
    faq: override?.faq ?? [],
  }
}

export function buildToolMetadata(slug: string): Metadata {
  const { title, description } = getToolSeo(slug)
  const path = `/${slug}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export function toolJsonLd(slug: string): Record<string, unknown>[] {
  const tool = getTool(slug)!
  const { description, faq } = getToolSeo(slug)
  const graph: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `${tool.name} — ${SITE_NAME}`,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      url: `${SITE_URL}/${slug}`,
      description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ]
  if (faq.length > 0) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  return graph
}

export function siteJsonLd(): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: TAGLINE,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      url: SITE_URL,
      description: TAGLINE,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ]
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- seo`
Expected: PASS (all describe blocks green).

- [ ] **Step 6: Commit**

```bash
git add lib/seo.ts lib/seo-content.ts lib/__tests__/seo.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): tool metadata + JSON-LD builders with content map

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Sitemap & robots

**Files:**
- Modify: `lib/seo.ts` (append `buildSitemap`, `buildRobots`)
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Test: `lib/__tests__/seo.test.ts` (append)

**Interfaces:**
- Produces: `buildSitemap(): MetadataRoute.Sitemap`, `buildRobots(): MetadataRoute.Robots`.

- [ ] **Step 1: Append the failing tests**

Append to `lib/__tests__/seo.test.ts`:

```ts
import { buildSitemap, buildRobots } from '@/lib/seo'

describe('buildSitemap', () => {
  it('lists the homepage and every tool with absolute URLs', () => {
    const s = buildSitemap()
    expect(s[0].url).toBe(SITE_URL)
    for (const slug of TOOL_SLUGS) {
      expect(s.some((e) => e.url === `${SITE_URL}/${slug}`)).toBe(true)
    }
    expect(s).toHaveLength(TOOL_SLUGS.length + 1)
  })
})

describe('buildRobots', () => {
  it('allows all crawlers and points at the sitemap', () => {
    const r = buildRobots()
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules
    expect(rule.allow).toBe('/')
    expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- seo`
Expected: FAIL — `buildSitemap is not a function` / import error.

- [ ] **Step 3: Append the builders to `lib/seo.ts`**

Add to the top import and bottom of `lib/seo.ts`:

```ts
import type { Metadata, MetadataRoute } from 'next'
import { getTool, TOOL_SLUGS } from '@/lib/tools'
```

(Replace the existing `import type { Metadata } from 'next'` and `import { getTool } from '@/lib/tools'` lines with the two lines above.) Then append:

```ts
export function buildSitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: SITE_URL, lastModified, changeFrequency: 'weekly', priority: 1 },
    ...TOOL_SLUGS.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}

export function buildRobots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

- [ ] **Step 4: Create the route wrappers**

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next'
import { buildSitemap } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap()
}
```

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from 'next'
import { buildRobots } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return buildRobots()
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- seo`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/seo.ts app/sitemap.ts app/robots.ts lib/__tests__/seo.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): sitemap.xml and robots.txt

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Root layout metadata

**Files:**
- Modify: `lib/seo.ts` (append `buildRootMetadata`)
- Modify: `app/layout.tsx:24-28` (replace the `metadata` object)
- Test: `lib/__tests__/seo.test.ts` (append)

**Interfaces:**
- Produces: `buildRootMetadata(): Metadata` — sets `metadataBase`, `title.template`, defaults, and env-driven `verification`.

- [ ] **Step 1: Append the failing test**

Append to `lib/__tests__/seo.test.ts`:

```ts
import { buildRootMetadata } from '@/lib/seo'

describe('buildRootMetadata', () => {
  it('sets metadataBase and a title template', () => {
    const m = buildRootMetadata()
    expect(m.metadataBase?.toString()).toContain('http')
    expect((m.title as { template?: string }).template).toContain('%s')
    expect(m.robots).toEqual({ index: true, follow: true })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- seo`
Expected: FAIL — `buildRootMetadata is not a function`.

- [ ] **Step 3: Append `buildRootMetadata` to `lib/seo.ts`**

```ts
export function buildRootMetadata(): Metadata {
  const title = 'Free PDF tools — get it done in your browser'
  const description =
    'Merge, split, compress, convert, edit and sign PDFs. Free, no sign-up, and processed right in your browser.'
  const verification: NonNullable<Metadata['verification']> = {}
  if (process.env.GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.GOOGLE_SITE_VERIFICATION
  }
  if (process.env.BING_SITE_VERIFICATION) {
    verification.other = { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
  }
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${SITE_NAME}` },
    description,
    applicationName: SITE_NAME,
    openGraph: { type: 'website', siteName: SITE_NAME, title, description },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
    ...(Object.keys(verification).length ? { verification } : {}),
  }
}
```

- [ ] **Step 4: Wire the root layout**

In `app/layout.tsx`, replace the current metadata block (lines 24-28):

```ts
export const metadata: Metadata = {
  title: 'pdf-tool — Free & private PDF tools',
  description:
    'Merge, split, convert, edit, sign and more. Every tool runs in your browser — your files never leave your device.',
};
```

with:

```ts
import { buildRootMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRootMetadata();
```

(Add the `import` next to the other imports at the top of the file, and leave the existing `import type { Metadata } from "next";` in place.)

- [ ] **Step 5: Run tests + typecheck the build compiles**

Run: `npm test -- seo`
Expected: PASS.
Run: `npm run build`
Expected: build succeeds; no metadata type errors.

- [ ] **Step 6: Commit**

```bash
git add lib/seo.ts app/layout.tsx lib/__tests__/seo.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): root metadata — metadataBase, title template, verification

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Per-tool metadata layouts (22 routes)

**Files:**
- Create: `app/<slug>/layout.tsx` for each of the 22 slugs (list below)
- Test: `lib/__tests__/seo-coverage.test.ts`

**Interfaces:**
- Consumes: `buildToolMetadata`, `toolJsonLd` from `lib/seo.ts`.

The 22 slugs (from `TOOL_SLUGS` in `lib/tools.ts`): `merge-pdf`, `split-pdf`, `rotate-pdf`, `delete-pages`, `extract-pages`, `organize-pdf`, `watermark-pdf`, `add-page-numbers`, `crop-pdf`, `n-up-pdf`, `flatten-pdf`, `edit-metadata`, `jpg-to-pdf`, `pdf-to-jpg`, `fill-form`, `sign-pdf`, `extract-images`, `compare-pdf`, `edit-pdf`, `compress-pdf`, `protect-pdf`, `unlock-pdf`.

- [ ] **Step 1: Write the failing coverage test**

Create `lib/__tests__/seo-coverage.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { TOOL_SLUGS } from '@/lib/tools'

describe('per-tool SEO layouts', () => {
  it('every tool route has a server layout.tsx', () => {
    const missing = TOOL_SLUGS.filter(
      (slug) => !existsSync(path.resolve(process.cwd(), 'app', slug, 'layout.tsx'))
    )
    expect(missing, `missing layouts: ${missing.join(', ')}`).toEqual([])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- seo-coverage`
Expected: FAIL — `missing layouts: merge-pdf, split-pdf, …` (all 22).

- [ ] **Step 3: Create one `layout.tsx` per slug**

For **each** slug in the list above, create `app/<slug>/layout.tsx` with this exact content, substituting `<slug>` in the `SLUG` constant (this is the only thing that changes between files):

```tsx
import type { Metadata } from 'next'
import { buildToolMetadata, toolJsonLd } from '@/lib/seo'

const SLUG = '<slug>'

export const metadata: Metadata = buildToolMetadata(SLUG)

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {toolJsonLd(SLUG).map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
      {children}
    </>
  )
}
```

Example — `app/merge-pdf/layout.tsx` has `const SLUG = 'merge-pdf'`; `app/compress-pdf/layout.tsx` has `const SLUG = 'compress-pdf'`; and so on for all 22.

- [ ] **Step 4: Run the coverage test to verify it passes**

Run: `npm test -- seo-coverage`
Expected: PASS (missing layouts: none).

- [ ] **Step 5: Verify the build and a rendered head**

Run: `npm run build`
Expected: succeeds; 22 tool routes still build.
Run: `npm run start` (in a background shell), then:
`curl -s localhost:3000/merge-pdf | grep -o '<title>[^<]*</title>'`
Expected: `<title>Merge PDF free — combine PDF files in your browser · pdf-tool</title>`
`curl -s localhost:3000/merge-pdf | grep -c 'application/ld+json'`
Expected: `2` (SoftwareApplication + FAQPage). Stop the server afterward.

- [ ] **Step 6: Commit**

```bash
git add app/*/layout.tsx lib/__tests__/seo-coverage.test.ts
git commit -m "$(cat <<'EOF'
feat(seo): per-tool metadata + JSON-LD via route layouts

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Homepage — reframe copy + canonical + site JSON-LD

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `siteJsonLd` from `lib/seo.ts`.

- [ ] **Step 1: Add metadata + JSON-LD to the homepage**

At the top of `app/page.tsx`, add imports and a metadata export:

```tsx
import type { Metadata } from 'next'
import { siteJsonLd } from '@/lib/seo'

export const metadata: Metadata = { alternates: { canonical: '/' } }
```

Immediately inside the returned `<main …>` (before the first `<div aria-hidden …>`), add:

```tsx
      {siteJsonLd().map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
```

- [ ] **Step 2: Reframe the hero copy to the wedge**

In `app/page.tsx`, replace the eyebrow text:

```
22 tools · 100% in your browser
```

with:

```
22 tools · free · no sign-up
```

Replace the H1 block:

```tsx
            Every PDF tool you need,{' '}
            <span className="font-display pr-[0.18em] text-[1.1em] font-normal italic text-brand">
              free
            </span>{' '}
            &amp; private
```

with:

```tsx
            Get it done — every PDF tool you need,{' '}
            <span className="font-display pr-[0.18em] text-[1.1em] font-normal italic text-brand">
              free
            </span>
```

Replace the subhead:

```
            Merge, split, convert, edit, sign and more. Nothing is uploaded — every file is processed
            right on your device.
```

with:

```
            Merge, split, compress, convert, edit and sign in seconds. No account, no watermarks, no
            waiting — and the in-browser tools never upload your files.
```

(If you chose a different tagline in the strategy doc, use it here instead — keep the outcome-first, privacy-as-trailing-cue order.)

- [ ] **Step 3: Verify build + rendered homepage**

Run: `npm run build`
Expected: succeeds.
Run: `npm run start` (background), then:
`curl -s localhost:3000/ | grep -o 'Get it done'` → Expected: `Get it done`
`curl -s localhost:3000/ | grep -c 'application/ld+json'` → Expected: `2`
`curl -s localhost:3000/ | grep -o '<link rel="canonical"[^>]*>'` → Expected: canonical to `SITE_URL/`. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "$(cat <<'EOF'
feat(seo): reframe homepage to "get it done" + site JSON-LD

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: SEO setup runbook (custom domain, Search Console, env)

**Files:**
- Create: `docs/marketing/seo-setup.md`

This task is mostly **manual ops** for the founder; the deliverable is a clear runbook + the env vars wired in Task 3. No app code.

- [ ] **Step 1: Write the runbook**

Create `docs/marketing/seo-setup.md`:

```markdown
# SEO setup runbook

## 1. Custom domain (do first)
1. Buy a domain (~$10/yr) at any registrar.
2. Vercel dashboard → project `pdf-tool` → Settings → Domains → add the domain; follow the DNS records Vercel shows (A / CNAME).
3. Wait for "Valid Configuration".
4. Set the canonical base so all metadata/sitemap use the new domain:
   `vercel env add NEXT_PUBLIC_SITE_URL production` → enter `https://yourdomain.com`
   (Repeat for `preview` if desired.) Redeploy.

## 2. Google Search Console
1. https://search.google.com/search-console → add a **Domain** property (DNS TXT) — preferred; covers all subpaths/protocols.
   - Alternative: URL-prefix property verified by meta tag → set `vercel env add GOOGLE_SITE_VERIFICATION production` to the token; the tag is emitted by `buildRootMetadata()`.
2. After verifying, Sitemaps → submit `https://yourdomain.com/sitemap.xml`.
3. Use URL Inspection to request indexing of the homepage + top tool pages.

## 3. Bing Webmaster Tools
1. https://www.bing.com/webmasters → **Import from Google Search Console** (fastest).
   - Or verify via meta tag → `vercel env add BING_SITE_VERIFICATION production` (the `msvalidate.01` token).
2. Submit the same sitemap URL.

## 4. Verify
- `https://yourdomain.com/robots.txt` lists the sitemap.
- `https://yourdomain.com/sitemap.xml` lists the homepage + 22 tools.
- View-source a tool page: unique `<title>`, `<link rel="canonical">`, and `application/ld+json`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/marketing/seo-setup.md
git commit -m "$(cat <<'EOF'
docs(marketing): SEO setup runbook — domain, GSC, Bing, env

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Full verification

**Files:** none (verification only).

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all suites pass (existing 29 tests + the new seo / seo-coverage tests).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: succeeds; route list now includes `/sitemap.xml` and `/robots.txt`.

- [ ] **Step 3: Smoke-check the generated SEO surface**

Run `npm run start` (background), then:
- `curl -s localhost:3000/robots.txt` → contains `Sitemap: …/sitemap.xml`.
- `curl -s localhost:3000/sitemap.xml | grep -c '<url>'` → `23` (home + 22 tools).
- `curl -s localhost:3000/compress-pdf | grep -o '<title>[^<]*</title>'` → the bespoke compress title.
- Confirm no duplicate/incorrect canonicals (each tool canonical = its own path). Stop the server.

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no new errors.

---

## Self-Review notes (already reconciled)

- **Spec coverage:** custom domain (Task 6), GSC + Bing (Task 6), sitemap/robots (Task 2), per-tool metadata + JSON-LD (Tasks 1+4), homepage wedge messaging (Task 5), env `NEXT_PUBLIC_SITE_URL` (Tasks 1/6). Seed keyword map from the strategy doc is content work, tracked separately (not code).
- **Type consistency:** `buildToolMetadata` / `toolJsonLd` / `siteJsonLd` / `buildRootMetadata` / `buildSitemap` / `buildRobots` / `getToolSeo` / `SITE_URL` names are identical across `lib/seo.ts`, the tests, the 22 layouts, `app/page.tsx`, and `app/sitemap.ts` / `app/robots.ts`.
- **No placeholders:** the 8 bespoke `SEO_CONTENT` entries + the registry-derived fallback fully cover all 22 tools; the coverage test enforces a layout per slug.
```
