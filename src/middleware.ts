import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'spyke-auth';

export function middleware(request: NextRequest) {
  const isAuthenticated =
    request.cookies.get(COOKIE_NAME)?.value === 'authenticated';
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isAuthApi = request.nextUrl.pathname === '/api/auth';
  const isTwilioWebhook = request.nextUrl.pathname.startsWith('/api/voice');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');

  if (isAuthApi || isTwilioWebhook) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
