import { NextRequest, NextResponse } from 'next/server';
import twilio, { validateRequest } from 'twilio';

const callerNumber = process.env.TWILIO_PHONE_NUMBER!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-twilio-signature') || '';
  const url = request.url;
  const formData = await request.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = value.toString();
  });

  const isValid = validateRequest(authToken, signature, url, params);
  if (!isValid) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const to = params['To'];

  const twiml = new twilio.twiml.VoiceResponse();

  if (to) {
    const dial = twiml.dial({ callerId: callerNumber });
    dial.number(to);
  } else {
    twiml.say('No destination number provided.');
  }

  return new NextResponse(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}
