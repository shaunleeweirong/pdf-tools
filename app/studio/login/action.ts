'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE } from '@/lib/studio/constants'
import { createSessionToken } from '@/lib/studio/auth'

export async function login(_prev: { error?: string } | null, formData: FormData) {
  const password = String(formData.get('password') ?? '')
  const expected = process.env.STUDIO_PASSWORD
  const secret = process.env.AUTH_SECRET
  if (!expected || !secret) return { error: 'Studio is not configured (missing env).' }
  if (password !== expected) return { error: 'Wrong password.' }
  const store = await cookies()
  store.set(SESSION_COOKIE, createSessionToken(secret, Date.now()), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  redirect('/studio')
}
