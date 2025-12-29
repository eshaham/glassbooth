const TWILIO_API_KEY = process.env.TWILIO_API_KEY!;
const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET!;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;

const PRICING_BASE_URL = 'https://pricing.twilio.com/v1/Voice';
const API_BASE_URL = 'https://api.twilio.com/2010-04-01';

const CACHE_TTL_MS = 3600000;

interface CountryPricingCache {
  data: {
    country: string;
    isoCountry: string;
    currentPrice: string | null;
    priceUnit: string;
  };
  expires: number;
}

const countryPricingCache = new Map<string, CountryPricingCache>();

function getAuthHeader() {
  const auth = Buffer.from(`${TWILIO_API_KEY}:${TWILIO_API_SECRET}`).toString(
    'base64',
  );
  return `Basic ${auth}`;
}

function getAccountAuthHeader() {
  const auth = Buffer.from(
    `${TWILIO_ACCOUNT_SID}:${TWILIO_API_SECRET}`,
  ).toString('base64');
  return `Basic ${auth}`;
}

export async function getCountryPricing(countryCode: string) {
  const cached = countryPricingCache.get(countryCode);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  const response = await fetch(`${PRICING_BASE_URL}/Countries/${countryCode}`, {
    headers: { Authorization: getAuthHeader() },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch pricing: ${response.status}`);
  }

  const twilioData = await response.json();

  const mobilePrice = twilioData.outbound_prefix_prices?.find(
    (p: { friendly_name: string }) =>
      p.friendly_name.toLowerCase().includes('mobile'),
  );
  const fallbackPrice = twilioData.outbound_prefix_prices?.[0];
  const priceInfo = mobilePrice || fallbackPrice;

  const data = {
    country: twilioData.country,
    isoCountry: twilioData.iso_country,
    currentPrice: priceInfo?.current_price || null,
    priceUnit: twilioData.price_unit,
  };

  countryPricingCache.set(countryCode, {
    data,
    expires: Date.now() + CACHE_TTL_MS,
  });

  return data;
}

export async function getNumberPricing(phoneNumber: string) {
  const response = await fetch(
    `${PRICING_BASE_URL}/Numbers/${encodeURIComponent(phoneNumber)}`,
    {
      headers: { Authorization: getAuthHeader() },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch number pricing: ${response.status}`);
  }

  const twilioData = await response.json();

  return {
    number: twilioData.number,
    country: twilioData.country,
    isoCountry: twilioData.iso_country,
    currentPrice: twilioData.outbound_call_price?.current_price || null,
    priceUnit: twilioData.price_unit,
  };
}

export async function getCallDetails(callSid: string) {
  const response = await fetch(
    `${API_BASE_URL}/Accounts/${TWILIO_ACCOUNT_SID}/Calls/${callSid}.json`,
    {
      headers: { Authorization: getAccountAuthHeader() },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch call details: ${response.status}`);
  }

  const twilioData = await response.json();

  return {
    callSid: twilioData.sid,
    duration: parseInt(twilioData.duration, 10),
    price: twilioData.price,
    priceUnit: twilioData.price_unit,
  };
}
