import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  // 🔥 si entra por subdominio pasajeclub
  if (host.startsWith('pasajeclub.')) {
    return NextResponse.rewrite(new URL('/pasajeclub', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}