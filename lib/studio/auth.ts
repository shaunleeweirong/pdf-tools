import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000

function sign(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('base64url')
}

export function createSessionToken(secret: string, nowMs: number, ttlMs: number = DEFAULT_TTL_MS): string {
  const exp = String(nowMs + ttlMs)
  return `${exp}.${sign(exp, secret)}`
}

export function verifySessionToken(token: string | undefined, secret: string, nowMs: number): boolean {
  if (!token) return false
  const dot = token.indexOf('.')
  if (dot < 1) return false
  const exp = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = sign(exp, secret)
  const aHash = createHash('sha256').update(sig).digest()
  const bHash = createHash('sha256').update(expected).digest()
  if (!timingSafeEqual(aHash, bHash)) return false
  return Number(exp) > nowMs
}
