# Spyke

A web-based VoIP dialer that lets you make phone calls directly from your browser using Twilio. Features real-time call pricing, international support for 250+ countries, and a modern glassmorphism UI.

## Features

- **Browser-Based Calling** - Make phone calls directly from your web browser
- **International Support** - Call 250+ countries with proper phone number formatting
- **Real-Time Pricing** - See call costs update live as you talk
- **Smart Number Input** - Global keyboard capture lets you type numbers without focusing the input field
- **Country-Specific Validation** - Phone numbers are validated based on the selected country's rules
- **Secure Access** - Password-protected with rate limiting to prevent brute force attacks
- **Modern UI** - Glassmorphism design with smooth animations

## Prerequisites

Before setting up Spyke, you'll need:

- **Node.js** 18.x or later
- **npm** 9.x or later
- **A Twilio account** with:
  - A verified phone number capable of making outbound calls
  - Voice capabilities enabled
  - Sufficient account balance for calls

## Twilio Setup

This is the most important part of the setup. Follow these steps carefully.

### 1. Create a Twilio Account

1. Go to [twilio.com](https://www.twilio.com) and sign up for an account
2. Verify your email and phone number
3. Complete the account setup wizard

### 2. Get Your Account Credentials

1. Go to the [Twilio Console](https://console.twilio.com)
2. On the main dashboard, find your **Account SID** and **Auth Token**
3. Save these values - you'll need them for your `.env` file

### 3. Get a Twilio Phone Number

You have two options:

#### Option A: Verify Your Own Number (Recommended)

1. Go to **Phone Numbers** → **Manage** → **Verified Caller IDs**
2. Click **Add a new Caller ID**
3. Enter your phone number and verify it via call or SMS
4. Your verified number will be used as the outbound caller ID

#### Option B: Use a Trial Number

1. During account setup, Twilio provides a free trial number
2. This number works for development and testing
3. Note down the phone number in E.164 format (e.g., `+14155551234`)

### 4. Create API Keys

1. Go to **Account** → **API keys & tokens**
2. Click **Create API Key**
3. Give it a friendly name (e.g., "Spyke")
4. Select **Standard** key type
5. Click **Create API Key**
6. **Important**: Copy the **SID** and **Secret** immediately - the secret won't be shown again!

### 5. Create a TwiML App

This is crucial for handling outbound calls. For local development, you'll first need to set up ngrok to expose your local server.

1. Install and start ngrok:

   ```bash
   # Install ngrok
   brew install ngrok  # macOS
   # or download from https://ngrok.com

   # Start ngrok (do this after running npm run dev)
   ngrok http 3000
   ```

2. Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`)
3. Go to **Voice** → **Manage** → **TwiML Apps** in the Twilio Console
4. Click **Create new TwiML App**
5. Give it a name (e.g., "Spyke Dialer")
6. For **Voice Configuration**:
   - **Request URL**: `https://your-ngrok-url.ngrok.io/api/voice`
   - **Request Method**: `POST`
7. Click **Create**
8. Note down the **TwiML App SID** (starts with `AP`)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/spyke.git
cd spyke
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.sample .env
```

Edit `.env` with your values:

```env
# Twilio Credentials (from Step 2)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here

# Twilio API Key (from Step 4)
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=your_api_secret_here

# TwiML App SID (from Step 5)
TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Your Twilio Phone Number (from Step 3)
TWILIO_PHONE_NUMBER=+14155551234

# Password for accessing the app
AUTH_PASSWORD=choose_a_strong_password
```

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

> **Note**: Make sure ngrok is running and your TwiML App's Voice URL matches your ngrok URL (see Step 5 in Twilio Setup).

## Usage

1. Open the app in your browser
2. Log in with your configured `AUTH_PASSWORD`
3. Select a country from the dropdown
4. Enter the phone number (it will be formatted automatically)
5. Click the green call button to initiate the call
6. During the call, you'll see the duration and running cost
7. Click the red button to hang up

**Tip**: You can type numbers on your keyboard even without clicking on the input field.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 16
- **UI Library**: [Mantine](https://mantine.dev) 8
- **Voice SDK**: [Twilio Voice SDK](https://www.twilio.com/docs/voice/sdks/javascript)
- **Phone Validation**: [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js)
- **Language**: TypeScript
- **Styling**: CSS with PostCSS

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run typecheck    # Run TypeScript type checking
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy
5. **Important**: Update your TwiML App's Voice Request URL in the Twilio Console:
   - Go to **Voice** → **Manage** → **TwiML Apps**
   - Click on your TwiML App
   - Change the **Request URL** from your ngrok URL to `https://your-app.vercel.app/api/voice`
   - Click **Save**

### Other Platforms

Spyke can be deployed to any platform that supports Node.js:

- AWS (Amplify, EC2, Lambda)
- Google Cloud (Cloud Run, App Engine)
- Docker containers
- Self-hosted servers

Ensure your platform:

- Supports Node.js 18+
- Has HTTPS enabled (required for secure cookies and Twilio webhooks)
- Can receive incoming HTTP requests from Twilio

## Security Considerations

- **Password Protection**: The app requires authentication to prevent unauthorized use
- **Rate Limiting**: Login attempts are limited to prevent brute force attacks (3 attempts, 24-hour lockout)
- **Webhook Validation**: Twilio webhook requests are validated using request signatures
- **Secure Cookies**: Authentication uses HTTP-only cookies
- **No Database**: No sensitive data is stored persistently

## Troubleshooting

### "Unable to connect" error

- Ensure your Twilio account has sufficient balance
- Verify your TwiML App's Voice URL is correct and accessible
- Check that ngrok is running if developing locally

### Calls not connecting

- Verify your Twilio phone number has voice capabilities
- Check the Twilio Console for error logs
- Ensure the destination number is valid and not blocked

### Authentication issues

- Clear your browser cookies and try again
- Verify your `AUTH_PASSWORD` environment variable is set
- Check for IP-based rate limiting (wait 24 hours or restart the server)

## Cost Information

Twilio charges for:

- **Phone Number**: Monthly fee for your Twilio number
- **Outbound Calls**: Per-minute rates vary by destination
- **Usage**: Standard Twilio usage charges apply

Check [Twilio's pricing page](https://www.twilio.com/voice/pricing) for current rates. The app displays real-time pricing during calls.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b my-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin my-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Twilio](https://www.twilio.com) for the Voice API
- [Mantine](https://mantine.dev) for the UI components
- [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js) for phone number validation
