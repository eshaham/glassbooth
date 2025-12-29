import { NextRequest, NextResponse } from 'next/server';

import { getNumberPricing } from '@/lib/twilio-pricing';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ number: string }> },
) {
  const { number } = await params;

  try {
    const data = await getNumberPricing(decodeURIComponent(number));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch pricing' },
      { status: 500 },
    );
  }
}
