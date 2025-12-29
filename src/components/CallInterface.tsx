'use client';

import { Alert, Box, Flex, Text } from '@mantine/core';
import { IconBackspace, IconPhone, IconPhoneOff } from '@tabler/icons-react';
import { useState } from 'react';

import { useTwilioDevice } from '@/hooks/useTwilioDevice';

import { Dialer } from './Dialer';

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
            <IconBackspace size={24} />
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
            <IconPhone size={28} color="white" fill="white" />
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
            <IconPhoneOff size={28} color="white" />
          </Flex>
        )}
      </Flex>

      <Text ta="center" mt={24} c="var(--text-secondary)" fz="0.875rem">
        Status: {getStatusText()}
      </Text>
    </Box>
  );
}
