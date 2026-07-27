import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { AUTHORS } from '@/lib/authors'

/**
 * The site must not route visitors to the maintainer's personal accounts.
 *
 * Links to documentation hosted on github.io (pdf.js, for example) are fine.
 * Links to github.com, which is where a personal profile or repository lives,
 * are not. The Studio dashboard talks to api.github.com server-side, which is
 * a private admin path and never rendered to a visitor.
 */

const ROOTS = ['app', 'components', 'content', 'public']
const ALLOWED = [/api\.github\.com/i, /[\w-]+\.github\.io/i]

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return /\.(tsx?|mdx|md|txt|json)$/.test(entry.name) ? [full] : []
  })
}

describe('no personal account links reach visitors', () => {
  it('no rendered file links to github.com', () => {
    const offenders: string[] = []
    for (const file of ROOTS.flatMap((r) => walk(path.join(process.cwd(), r)))) {
      // The Studio admin area is password-gated and calls the API server-side.
      if (file.includes(path.join('app', 'studio'))) continue
      for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
        const match = line.match(/https?:\/\/[^\s"'`)\]]*github[^\s"'`)\]]*/i)
        if (match && !ALLOWED.some((re) => re.test(match[0]))) {
          offenders.push(`${path.relative(process.cwd(), file)}: ${match[0]}`)
        }
      }
    }
    expect(offenders, `github.com links found:\n${offenders.join('\n')}`).toEqual([])
  })

  it('no author profile points at github.com', () => {
    const offenders = AUTHORS.flatMap((a) =>
      a.sameAs.filter((url) => /github\.com/i.test(url)).map((url) => `${a.slug}: ${url}`),
    )
    expect(offenders, `author sameAs with github.com: ${offenders.join(', ')}`).toEqual([])
  })
})
