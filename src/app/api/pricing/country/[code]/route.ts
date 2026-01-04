import { NextRequest, NextResponse } from 'next/server';

import { getCountryPricing } from '@/lib/twilio-pricing';

const COUNTRY_CODE_REGEX = /^[A-Z]{2}$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  if (!COUNTRY_CODE_REGEX.test(code)) {
    return NextResponse.json(
      { error: 'Invalid country code' },
      { status: 400 },
    );
  }

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
