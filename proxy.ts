import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/studio/constants'

// Optimistic gate only (Next 16 guidance): presence check here, real verify in the page.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === '/studio/login'
  if (pathname.startsWith('/studio') && !isLogin) {
    if (!request.cookies.get(SESSION_COOKIE)) {
      return NextResponse.redirect(new URL('/studio/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = { matcher: '/studio/:path*' }
