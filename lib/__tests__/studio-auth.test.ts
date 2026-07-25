import { describe, it, expect } from 'vitest'
import { createSessionToken, verifySessionToken } from '@/lib/studio/auth'

const SECRET = 'test-secret'
const NOW = 1_000_000

describe('session token', () => {
  it('verifies a token signed with the same secret', () => {
    const t = createSessionToken(SECRET, NOW)
    expect(verifySessionToken(t, SECRET, NOW + 1000)).toBe(true)
  })
  it('rejects a token signed with a different secret', () => {
    const t = createSessionToken(SECRET, NOW)
    expect(verifySessionToken(t, 'other', NOW + 1000)).toBe(false)
  })
  it('rejects an expired token', () => {
    const t = createSessionToken(SECRET, NOW, 1000)
    expect(verifySessionToken(t, SECRET, NOW + 2000)).toBe(false)
  })
  it('rejects a tampered or missing token', () => {
    const t = createSessionToken(SECRET, NOW)
    expect(verifySessionToken(t.slice(0, -2) + 'xx', SECRET, NOW + 1)).toBe(false)
    expect(verifySessionToken(undefined, SECRET, NOW)).toBe(false)
  })
})
