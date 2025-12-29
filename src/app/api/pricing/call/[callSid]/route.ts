import { NextRequest, NextResponse } from 'next/server';

import { getCallDetails } from '@/lib/twilio-pricing';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ callSid: string }> },
) {
  const { callSid } = await params;

  try {
    const data = await getCallDetails(callSid);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch call details' },
      { status: 500 },
    );
  }
}
