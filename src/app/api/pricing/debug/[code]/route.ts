import { NextRequest, NextResponse } from 'next/server';

import { getCountryPricingDebug } from '@/lib/twilio-pricing';

const COUNTRY_CODE_REGEX = /^[A-Z]{2}$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse(null, { status: 404 });
  }

  const { code } = await params;

  if (!COUNTRY_CODE_REGEX.test(code)) {
    return NextResponse.json(
      { error: 'Invalid country code' },
      { status: 400 },
    );
  }

  try {
    const data = await getCountryPricingDebug(code);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch pricing' },
      { status: 500 },
    );
  }
}
