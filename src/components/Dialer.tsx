'use client';

import { Button, SimpleGrid } from '@mantine/core';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

interface DialerProps {
  onDigit: (digit: string) => void;
}

export function Dialer({ onDigit }: DialerProps) {
  return (
    <SimpleGrid cols={3} spacing="xs">
      {KEYS.map((key) => (
        <Button
          key={key}
          variant="default"
          size="lg"
          onClick={() => onDigit(key)}
        >
          {key}
        </Button>
      ))}
    </SimpleGrid>
  );
}
