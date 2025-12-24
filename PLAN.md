# Spyke - A Skype Alternative

A web-based calling application built with Next.js (hosted on Vercel) and Twilio Voice SDK.

## Implementation Plan

### Phase 1: Twilio Setup

- [ ] Create a Twilio account
- [ ] Buy a phone number (acts as Caller ID)
- [ ] Create a TwiML App in Twilio Console
  - Configure Voice URL pointing to webhook handler
- [ ] Generate API Key and Secret for token generation

### Phase 2: Project Setup

- [ ] Initialize Next.js project with TypeScript
- [ ] Install dependencies:
  - `twilio` (Node.js SDK for backend)
  - `@twilio/voice-sdk` (Browser SDK for frontend)
- [ ] Set up environment variables:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_API_KEY`
  - `TWILIO_API_SECRET`
  - `TWILIO_TWIML_APP_SID`
  - `TWILIO_PHONE_NUMBER`

### Phase 3: Backend Implementation

- [ ] Create `/api/token/route.ts` - Access Token generator
  - Validate requests
  - Generate JWT using Twilio credentials
  - Return token to client
- [ ] Create `/api/voice/route.ts` - TwiML webhook handler
  - Receive call requests from Twilio
  - Return TwiML XML instructions
  - Handle outbound call routing

### Phase 4: Frontend Implementation

- [ ] Create Twilio Device hook (`useTwilioDevice`)
  - Fetch token from API
  - Initialize Device instance
  - Handle device events (ready, error, disconnect)
  - Use `useRef` to prevent double initialization in Strict Mode
- [ ] Build Call UI component
  - Phone number input
  - Call/Hangup buttons
  - Call status display
  - Microphone permissions handling
- [ ] Add call state management
  - Idle, Connecting, Connected, Disconnected states

### Phase 5: Production Deployment

- [ ] Deploy to Vercel
- [ ] Update Twilio webhook URLs to production endpoints
- [ ] Test end-to-end call flow

## File Structure

```
spyke/
├── app/
│   ├── api/
│   │   ├── token/
│   │   │   └── route.ts
│   │   └── voice/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── CallInterface.tsx
├── hooks/
│   └── useTwilioDevice.ts
├── .env.local
└── package.json
```

## Development Notes

### React Strict Mode

React renders components twice in development. Use `useRef` to ensure the Twilio Device is only created once.

### Local Development with ngrok

Twilio cannot reach `localhost`. During development:
1. Run `ngrok http 3000`
2. Use the ngrok URL in Twilio Dashboard for webhook configuration

### Browser Requirements

- HTTPS required in production (Vercel handles this)
- Microphone permission must be granted
- Modern browser with WebRTC support
