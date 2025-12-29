'use client';

import { Box, Flex } from '@mantine/core';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

interface DialerProps {
  onDigit: (digit: string) => void;
}

export function Dialer({ onDigit }: DialerProps) {
  return (
    <Box
      display="grid"
      w="100%"
      maw={256}
      mx="auto"
      style={{
        gridTemplateColumns: 'repeat(3, minmax(56px, 64px))',
        gap: 'clamp(8px, 3vw, 16px)',
        justifyContent: 'center',
      }}
    >
      {KEYS.map((key) => (
        <Flex
          component="button"
          key={key}
          className="glass-button"
          onClick={() => onDigit(key)}
          w="100%"
          fz="1.5rem"
          fw={400}
          align="center"
          justify="center"
          style={{
            aspectRatio: '1',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        >
          {key}
        </Flex>
      ))}
    </Box>
  );
}
