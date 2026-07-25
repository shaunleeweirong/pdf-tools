import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE } from '@/lib/studio/constants'
import { verifySessionToken } from '@/lib/studio/auth'

export async function hasValidStudioSession(): Promise<boolean> {
  const secret = process.env.AUTH_SECRET
  if (!secret) return false
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  return verifySessionToken(token, secret, Date.now())
}

export async function requireStudioSession(): Promise<void> {
  if (!(await hasValidStudioSession())) redirect('/studio/login')
}
