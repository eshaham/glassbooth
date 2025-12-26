import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const AUTH_PASSWORD = process.env.AUTH_PASSWORD!;
const COOKIE_NAME = 'spyke-auth';

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 24 * 60 * 60 * 1000;

const failedAttempts = new Map<
  string,
  { count: number; lockedUntil: number }
>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const now = Date.now();

  const record = failedAttempts.get(ip);
  if (record && record.lockedUntil > now) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Try again later.' },
      { status: 429 },
    );
  }

  const { password } = await request.json();

  if (password === AUTH_PASSWORD) {
    failedAttempts.delete(ip);

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true });
  }

  const attempts = (record?.count || 0) + 1;
  failedAttempts.set(ip, {
    count: attempts,
    lockedUntil: attempts >= MAX_ATTEMPTS ? now + LOCKOUT_DURATION : 0,
  });

  if (attempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Try again later.' },
      { status: 429 },
    );
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
