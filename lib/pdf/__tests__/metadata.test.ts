import { describe, it, expect } from 'vitest'
import { writeMetadata, readMetadata } from '@/lib/pdf/metadata'
import { readFixture } from './helpers'

describe('metadata', () => {
  it('writes then reads back title/author', async () => {
    const out = await writeMetadata(readFixture('blank-1p.pdf'), {
      title: 'My Doc', author: 'Sam', subject: 'Test', keywords: 'a, b',
    })
    const meta = await readMetadata(out)
    expect(meta.title).toBe('My Doc')
    expect(meta.author).toBe('Sam')
  })
})
