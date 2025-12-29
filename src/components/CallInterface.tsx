'use client';

import { Alert, Box, Flex, Text } from '@mantine/core';
import { useState } from 'react';

import { useTwilioDevice } from '@/hooks/useTwilioDevice';

import { Dialer } from './Dialer';

function BackspaceIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
      <line x1="18" y1="9" x2="12" y2="15" />
      <line x1="12" y1="9" x2="18" y2="15" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
        fill="white"
      />
    </svg>
  );
}

function HangUpIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23 16.01l-3.48-3.48a2 2 0 00-2.83 0l-1.34 1.34a16.06 16.06 0 01-6.22-6.22l1.34-1.34a2 2 0 000-2.83L7 .01a2 2 0 00-2.83 0L1.52 2.66A4 4 0 00.71 6.5c1.29 6.37 5.93 11.01 12.3 12.3a4 4 0 003.84-.81l2.65-2.65a2 2 0 000-2.83z"
        fill="white"
        transform="rotate(135 12 12)"
      />
    </svg>
  );
}

export function CallInterface() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { callStatus, isReady, error, makeCall, hangUp, sendDigit } =
    useTwilioDevice();

  const handleCall = () => {
    if (phoneNumber) {
      makeCall('+' + phoneNumber);
    }
  };

  const handleDigit = (digit: string) => {
    if (callStatus === 'connected') {
      sendDigit(digit);
    } else {
      setPhoneNumber((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    if (!isInCall && phoneNumber.length > 0) {
      setPhoneNumber((prev) => prev.slice(0, -1));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isInCall) return;
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(value);
  };

  const isInCall = callStatus === 'connecting' || callStatus === 'connected';

  const getStatusText = () => {
    if (!isReady) return 'Initializing...';
    switch (callStatus) {
      case 'idle':
        return 'Ready for call';
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Call in progress';
      case 'disconnected':
        return 'Call ended';
      default:
        return 'Ready for call';
    }
  };

  const displayNumber = phoneNumber ? '+' + phoneNumber : '';

  return (
    <Box className="glass-card" px={24} py={32}>
      {error && (
        <Alert color="red" title="Error" mb="md" bg="rgba(239, 68, 68, 0.2)">
          {error}
        </Alert>
      )}

      <Flex mih={60} align="center" justify="center" mb={24} pos="relative">
        <input
          type="tel"
          inputMode="tel"
          value={displayNumber}
          onChange={handleInputChange}
          placeholder="+1234567890"
          disabled={isInCall}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: 300,
            color: 'var(--text-primary)',
            textAlign: 'center',
            width: '100%',
            letterSpacing: '0.05em',
          }}
        />
        {phoneNumber.length > 0 && !isInCall && (
          <Flex
            component="button"
            onClick={handleBackspace}
            pos="absolute"
            right={0}
            top="50%"
            align="center"
            justify="center"
            p={8}
            style={{
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
          >
            <BackspaceIcon />
          </Flex>
        )}
      </Flex>

      <Dialer onDigit={handleDigit} />

      <Flex justify="center" mt={24}>
        {!isInCall ? (
          <Flex
            component="button"
            className="call-button"
            onClick={handleCall}
            disabled={!isReady || !phoneNumber}
            w={64}
            h={64}
            align="center"
            justify="center"
            style={{
              borderRadius: '50%',
              cursor: isReady && phoneNumber ? 'pointer' : 'not-allowed',
              opacity: isReady && phoneNumber ? 1 : 0.5,
            }}
          >
            <PhoneIcon />
          </Flex>
        ) : (
          <Flex
            component="button"
            className="hangup-button"
            onClick={hangUp}
            w={64}
            h={64}
            align="center"
            justify="center"
            style={{
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            <HangUpIcon />
          </Flex>
        )}
      </Flex>

      <Text ta="center" mt={24} c="var(--text-secondary)" fz="0.875rem">
        Status: {getStatusText()}
      </Text>
    </Box>
  );
}
