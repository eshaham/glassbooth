'use client';

import { Loader, Text } from '@mantine/core';

import { CallStatus } from '@/hooks/useTwilioDevice';
import { CallCostSummary } from '@/types/pricing';

interface CallCostDisplayProps {
  countryRate: string | null;
  countryName: string | null;
  numberRate: string | null;
  currentCost: string | null;
  callDuration: number;
  finalCost: (CallCostSummary & { displayCost: string | null }) | null;
  callStatus: CallStatus;
  isLoading: boolean;
  error: string | null;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function CallCostDisplay({
  countryRate,
  countryName,
  numberRate,
  currentCost,
  callDuration,
  finalCost,
  callStatus,
  isLoading,
  error,
}: CallCostDisplayProps) {
  if (isLoading) {
    return (
      <Text ta="center" mt={8} c="var(--text-secondary)" fz="0.75rem">
        <Loader size={12} color="var(--text-secondary)" />
      </Text>
    );
  }

  if (error) {
    return (
      <Text ta="center" mt={8} c="var(--text-secondary)" fz="0.75rem">
        {error}
      </Text>
    );
  }

  if (callStatus === 'disconnected' && finalCost) {
    return (
      <Text ta="center" mt={12} c="var(--accent-cyan)" fz="0.875rem" fw={500}>
        {formatDuration(finalCost.duration)} •{' '}
        {finalCost.displayCost || 'Cost pending'}
      </Text>
    );
  }

  if (callStatus === 'connected') {
    return (
      <Text ta="center" mt={12} c="var(--accent-cyan)" fz="1rem" fw={500}>
        {formatDuration(callDuration)} • {currentCost || 'Calculating...'}
      </Text>
    );
  }

  if (callStatus === 'connecting') {
    return (
      <Text
        ta="center"
        mt={8}
        c="var(--text-secondary)"
        fz="0.75rem"
        fs="italic"
        opacity={0.7}
      >
        {numberRate || countryRate || 'Rate unavailable'}
      </Text>
    );
  }

  if (numberRate) {
    return (
      <Text
        ta="center"
        mt={8}
        c="var(--text-secondary)"
        fz="0.75rem"
        fs="italic"
        opacity={0.7}
      >
        {numberRate}
      </Text>
    );
  }

  if (countryRate && countryName) {
    return (
      <Text
        ta="center"
        mt={8}
        c="var(--text-secondary)"
        fz="0.7rem"
        fs="italic"
        opacity={0.6}
      >
        {countryRate} to {countryName}
      </Text>
    );
  }

  return null;
}
