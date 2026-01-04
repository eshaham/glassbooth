import { NextRequest, NextResponse } from 'next/server';

import { getNumberPricing } from '@/lib/twilio-pricing';

const PHONE_NUMBER_REGEX = /^\+[1-9]\d{6,14}$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ number: string }> },
) {
  const { number } = await params;
  const decodedNumber = decodeURIComponent(number);

  if (!PHONE_NUMBER_REGEX.test(decodedNumber)) {
    return NextResponse.json(
      { error: 'Invalid phone number' },
      { status: 400 },
    );
  }

  try {
    const data = await getNumberPricing(decodedNumber);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch pricing' },
      { status: 500 },
    );
  }
}
