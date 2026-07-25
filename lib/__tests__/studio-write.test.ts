import { describe, it, expect } from 'vitest'
import { applyTopicStatus, type Topic } from '@/lib/studio/github'

const base: Topic[] = [
  { id: 't1', surface: 'blog', targetQuery: 'q1', status: 'pending', slug: 'post-a' },
  { id: 't2', surface: 'blog', targetQuery: 'q2', status: 'idea' },
]

describe('applyTopicStatus', () => {
  it('updates status + extras for the topic matching the slug, leaves others untouched', () => {
    const out = applyTopicStatus(base, 'post-a', 'published', { url: '/blog/post-a' })
    const t1 = out.find((t) => t.id === 't1')!
    expect(t1.status).toBe('published')
    expect(t1.url).toBe('/blog/post-a')
    expect(out.find((t) => t.id === 't2')!.status).toBe('idea')
  })
  it('records feedback for changes-requested', () => {
    const out = applyTopicStatus(base, 'post-a', 'changes-requested', { feedback: 'shorter' })
    expect(out.find((t) => t.id === 't1')!.feedback).toBe('shorter')
  })
  it('returns topics unchanged when no slug matches (never throws)', () => {
    expect(applyTopicStatus(base, 'missing', 'published')).toEqual(base)
  })
  it('does not mutate the input array', () => {
    const copy = structuredClone(base)
    applyTopicStatus(base, 'post-a', 'rejected')
    expect(base).toEqual(copy)
  })
})
