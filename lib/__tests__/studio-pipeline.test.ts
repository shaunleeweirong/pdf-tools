import { describe, it, expect } from 'vitest'
import { groupPipeline, type Topic } from '@/lib/studio/github'

const topics: Topic[] = [
  { id: 'a', surface: 'blog', targetQuery: 'a', status: 'idea' },
  { id: 'b', surface: 'blog', targetQuery: 'b', status: 'briefed' },
  { id: 'c', surface: 'blog', targetQuery: 'c', status: 'changes-requested' },
  { id: 'd', surface: 'blog', targetQuery: 'd', status: 'pending' },
  { id: 'e', surface: 'blog', targetQuery: 'e', status: 'published', url: '/blog/e' },
  { id: 'f', surface: 'blog', targetQuery: 'f', status: 'rejected' },
]

describe('groupPipeline', () => {
  it('buckets topics by pipeline stage', () => {
    const b = groupPipeline(topics)
    expect(b.backlog.map((t) => t.id)).toEqual(['a'])
    expect(b.inProgress.map((t) => t.id).sort()).toEqual(['b', 'c'])
    expect(b.needsApproval.map((t) => t.id)).toEqual(['d'])
    expect(b.published.map((t) => t.id)).toEqual(['e'])
    expect(b.rejected.map((t) => t.id)).toEqual(['f'])
  })
})
