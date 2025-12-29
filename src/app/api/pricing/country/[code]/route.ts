import { NextRequest, NextResponse } from 'next/server';

import { getCountryPricing } from '@/lib/twilio-pricing';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  try {
    const data = await getCountryPricing(code);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch pricing' },
      { status: 500 },
    );
  }
}
