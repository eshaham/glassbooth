export interface CountryPricing {
  country: string;
  isoCountry: string;
  currentPrice: string;
  priceUnit: string;
}

export interface NumberPricing {
  number: string;
  country: string;
  isoCountry: string;
  currentPrice: string;
  priceUnit: string;
}

export interface CallCostSummary {
  callSid: string;
  duration: number;
  price: string;
  priceUnit: string;
}
