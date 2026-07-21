import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

// Server-only blog loader. Posts are MDX files with YAML frontmatter in
// content/blog/. Do NOT import this from a client component (uses `fs`).

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  keywords: string[]
  toolSlugs: string[]
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getPost(slug: string): { meta: PostMeta; body: string } {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf8')
  const { data, content } = matter(raw)
  return {
    meta: {
      slug,
      title: String(data.title ?? slug),
      description: String(data.description ?? ''),
      date: String(data.date ?? ''),
      keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
      toolSlugs: Array.isArray(data.toolSlugs) ? data.toolSlugs.map(String) : [],
    },
    body: content,
  }
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => getPost(slug).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function formatPostDate(date: string): string {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return date
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
