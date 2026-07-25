import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/studio/constants'

export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL('/studio/login', request.url))
  res.cookies.delete(SESSION_COOKIE)
  return res
}
