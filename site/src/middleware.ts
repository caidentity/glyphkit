import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle icon requests
  if (request.nextUrl.pathname.startsWith('/icons/')) {
    return NextResponse.rewrite(new URL(request.nextUrl.pathname.replace('/icons', '/api/icons'), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/icons/:category/:file*.svg'],
}; 