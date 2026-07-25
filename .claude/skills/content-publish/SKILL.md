---
name: content-publish
description: Publish a drafted content post to production — ONLY after the user explicitly approves. Presents the finished post for review, then on approval merges the content branch to main and pushes (Vercel auto-deploys). Never publishes without a clear go-ahead.
---

# Content publish (approval-gated)

The final step of the content workflow. A draft is finished on a `content/<slug>` branch; this step gets the human's sign-off and ships it. **Publishing is never automatic — it requires the user's explicit approval each time.**

## Preconditions

- A finished post exists on a `content/<slug>` branch (from `content-draft`), committed, `npm run build` + `npm test` green.
- The post passed the `content-draft` self-score.

## Steps

1. **Present for approval.** Show the user:
   - The title, target query, and where it will live (`/blog/<slug>` or `/{tool}/{use-case}`).
   - A short summary + the key claims, and a link to read the full draft (the `.mdx` file or a preview).
   - Ask plainly: **"Approve to publish, or want changes?"**
2. **Wait for an explicit yes.** Do not proceed on silence, a topic change, or an ambiguous reply. "Publish" / "ship it" / "yes, go" = go. Anything else = treat as not approved.
   - If changes are requested: edit the draft, re-run the self-score + build, and present again.
3. **Publish (only after approval):**
   ```bash
   git checkout main
   git merge <content-branch>      # fast-forward
   git push origin main            # Vercel auto-deploys prod
   git branch -d <content-branch>
   ```
4. **Confirm live.** Set the topic `status` to `"published"` in `content/keyword-map.json`, then poll production until the new URL serves the post, and report the live link.

## Guardrails

- **No approval, no publish.** Pushing to `main` deploys to production immediately — treat it as outward-facing and irreversible-ish.
- One post (or one daily bundle) per approval. Don't batch-publish across topics on a single "yes" unless the user said so.
- End the merge/publish commit (if any) with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
