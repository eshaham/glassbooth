import { NextRequest, NextResponse } from 'next/server';

import { getCallDetails } from '@/lib/twilio-pricing';

const CALL_SID_REGEX = /^CA[a-f0-9]{32}$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ callSid: string }> },
) {
  const { callSid } = await params;

  if (!CALL_SID_REGEX.test(callSid)) {
    return NextResponse.json({ error: 'Invalid call SID' }, { status: 400 });
  }

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
