import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const url = request.nextUrl

  // 👉 si es pasajeclub
  if (host.startsWith('pasajeclub.')) {
    const pathname = url.pathname

    // evitar doble prefijo
    if (!pathname.startsWith('/pasajeclub')) {
      return NextResponse.rewrite(
        new URL(`/pasajeclub${pathname}`, request.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}