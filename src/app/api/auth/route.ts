import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const AUTH_PASSWORD = process.env.AUTH_PASSWORD!;
const COOKIE_NAME = 'spyke-auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === AUTH_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
