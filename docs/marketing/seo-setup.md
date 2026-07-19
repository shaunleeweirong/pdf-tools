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
