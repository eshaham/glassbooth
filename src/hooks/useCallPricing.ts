'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  CallCostSummary,
  CountryPricing,
  NumberPricing,
} from '@/types/pricing';

import { CallStatus } from './useTwilioDevice';

interface UseCallPricingProps {
  countryCode: string;
  phoneNumber: string | null;
  callStatus: CallStatus;
  callSid: string | null;
}

export function useCallPricing({
  countryCode,
  phoneNumber,
  callStatus,
  callSid,
}: UseCallPricingProps) {
  const [countryPricing, setCountryPricing] = useState<CountryPricing | null>(
    null,
  );
  const [numberPricing, setNumberPricing] = useState<NumberPricing | null>(
    null,
  );
  const [callDuration, setCallDuration] = useState(0);
  const [finalCost, setFinalCost] = useState<CallCostSummary | null>(null);
  const [isCountryLoading, setIsCountryLoading] = useState(false);
  const [isNumberLoading, setIsNumberLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callStartTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCountryPricing() {
      setIsCountryLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/pricing/country/${countryCode}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setCountryPricing(data);
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;
        setError('Rate unavailable');
        setCountryPricing(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsCountryLoading(false);
        }
      }
    }

    fetchCountryPricing();
    return () => controller.abort();
  }, [countryCode]);

  useEffect(() => {
    if (!phoneNumber) {
      setNumberPricing(null);
      return;
    }

    const controller = new AbortController();
    const number = phoneNumber;

    async function fetchNumberPricing() {
      setIsNumberLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/pricing/number/${encodeURIComponent(number)}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setNumberPricing(data);
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;
        setError('Rate unavailable');
        setNumberPricing(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsNumberLoading(false);
        }
      }
    }

    fetchNumberPricing();
    return () => controller.abort();
  }, [phoneNumber]);

  const fetchFinalCost = useCallback(async (sid: string) => {
    try {
      const response = await fetch(`/api/pricing/call/${sid}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setFinalCost(data);
    } catch {
      setFinalCost(null);
    }
  }, []);

  useEffect(() => {
    if (callStatus === 'connected') {
      callStartTimeRef.current = Date.now();
      setCallDuration(0);
      setFinalCost(null);

      intervalRef.current = setInterval(() => {
        if (callStartTimeRef.current) {
          const elapsed = Math.floor(
            (Date.now() - callStartTimeRef.current) / 1000,
          );
          setCallDuration(elapsed);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (callStatus === 'disconnected' && callSid) {
        fetchFinalCost(callSid);
      }

      if (callStatus === 'idle') {
        callStartTimeRef.current = null;
        setCallDuration(0);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callStatus, callSid, fetchFinalCost]);

  const currentRate = numberPricing?.currentPrice || countryPricing?.maxPrice;
  const priceUnit =
    numberPricing?.priceUnit || countryPricing?.priceUnit || 'USD';

  const billedMinutes = Math.ceil(callDuration / 60) || 0;
  const currentCost =
    currentRate && callDuration > 0
      ? billedMinutes * parseFloat(currentRate)
      : null;

  const formatRate = (price: string | null | undefined): string | null => {
    if (!price) return null;
    return `$${parseFloat(price).toFixed(2)}/min`;
  };

  const formatRateRange = (): string | null => {
    if (!countryPricing?.minPrice || !countryPricing?.maxPrice) return null;
    const min = parseFloat(countryPricing.minPrice);
    const max = parseFloat(countryPricing.maxPrice);
    if (min === max) {
      return `$${min.toFixed(2)}/min`;
    }
    return `$${min.toFixed(2)}–$${max.toFixed(2)}/min`;
  };

  const formatCost = (cost: number | null): string | null => {
    if (cost === null) return null;
    const roundedUp = Math.ceil(cost * 100) / 100;
    return `$${roundedUp.toFixed(2)}`;
  };

  const formatFinalCost = (price: string | null): string | null => {
    if (!price) return null;
    const amount = Math.abs(parseFloat(price));
    const roundedUp = Math.ceil(amount * 100) / 100;
    return `$${roundedUp.toFixed(2)}`;
  };

  return {
    countryRate: formatRateRange(),
    countryName: countryPricing?.country || null,
    numberRate: formatRate(numberPricing?.currentPrice),
    currentCost: formatCost(currentCost),
    callDuration,
    finalCost: finalCost
      ? {
          ...finalCost,
          displayCost: formatFinalCost(finalCost.price),
        }
      : null,
    priceUnit,
    isLoading: isCountryLoading || isNumberLoading,
    error,
  };
}
