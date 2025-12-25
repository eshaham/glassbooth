import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const callerNumber = process.env.TWILIO_PHONE_NUMBER!;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const to = formData.get('To') as string;

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
