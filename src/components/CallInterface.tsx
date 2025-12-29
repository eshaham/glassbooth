'use client';

import { Alert, Box, Flex, Text } from '@mantine/core';
import { IconBackspace, IconPhone, IconPhoneOff } from '@tabler/icons-react';
import {
  AsYouType,
  CountryCode,
  isValidPhoneNumber,
  validatePhoneNumberLength,
} from 'libphonenumber-js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useCallPricing } from '@/hooks/useCallPricing';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTwilioDevice } from '@/hooks/useTwilioDevice';

import { CallCostDisplay } from './CallCostDisplay';
import { Country, CountrySelector, defaultCountry } from './CountrySelector';
import { Dialer } from './Dialer';

export function CallInterface() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry, isCountryHydrated] =
    useLocalStorage<Country>('selectedCountry', defaultCountry);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    callStatus,
    callSid,
    deviceStatus,
    isReady,
    error,
    makeCall,
    hangUp,
    sendDigit,
  } = useTwilioDevice();

  const fullNumber = '+' + selectedCountry.dialCode + phoneNumber;

  const isValidNumber = useMemo(() => {
    if (!phoneNumber) return false;
    return isValidPhoneNumber(fullNumber, selectedCountry.code as CountryCode);
  }, [phoneNumber, selectedCountry, fullNumber]);

  const pricing = useCallPricing({
    countryCode: selectedCountry.code,
    phoneNumber: isValidNumber ? fullNumber : null,
    callStatus,
    callSid,
  });

  const isTooLong = useCallback(
    (value: string) => {
      if (!value) return false;
      const fullNumber = '+' + selectedCountry.dialCode + value;
      return (
        validatePhoneNumberLength(
          fullNumber,
          selectedCountry.code as CountryCode,
        ) === 'TOO_LONG'
      );
    },
    [selectedCountry],
  );

  const isInCall = callStatus === 'connecting' || callStatus === 'connected';

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isInCall) return;
      if (e.target instanceof HTMLInputElement) return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        inputRef.current?.focus();
        setPhoneNumber((prev) => {
          const newValue = prev + e.key;
          const fullNumber = '+' + selectedCountry.dialCode + newValue;
          if (
            validatePhoneNumberLength(
              fullNumber,
              selectedCountry.code as CountryCode,
            ) === 'TOO_LONG'
          ) {
            return prev;
          }
          return newValue;
        });
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        inputRef.current?.focus();
        setPhoneNumber((prev) => prev.slice(0, -1));
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isInCall, selectedCountry]);

  const handleCall = () => {
    if (isValidNumber) {
      makeCall('+' + selectedCountry.dialCode + phoneNumber);
    }
  };

  const handleDigit = (digit: string) => {
    if (callStatus === 'connected') {
      sendDigit(digit);
    } else {
      const newValue = phoneNumber + digit;
      if (!isTooLong(newValue)) {
        setPhoneNumber(newValue);
      }
    }
  };

  const handleBackspace = () => {
    if (!isInCall && phoneNumber.length > 0) {
      setPhoneNumber((prev) => prev.slice(0, -1));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isInCall) return;
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      handleBackspace();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isInCall) return;
    const newDigits = e.target.value.replace(/[^0-9]/g, '');
    if (newDigits.length > phoneNumber.length && !isTooLong(newDigits)) {
      setPhoneNumber(newDigits);
    }
  };

  const getStatusText = () => {
    if (deviceStatus === 'disconnected') return 'Reconnecting...';
    if (deviceStatus === 'connecting') return 'Connecting...';
    if (deviceStatus === 'error') return 'Connection failed';
    if (!isReady) return 'Initializing...';
    switch (callStatus) {
      case 'idle':
        return 'Ready for call';
      case 'connecting':
        return 'Calling...';
      case 'connected':
        return 'Call in progress';
      case 'disconnected':
        return 'Call ended';
      default:
        return 'Ready for call';
    }
  };

  const displayNumber = useMemo(() => {
    if (!phoneNumber) return '';
    return new AsYouType(selectedCountry.code as CountryCode).input(
      phoneNumber,
    );
  }, [phoneNumber, selectedCountry]);

  return (
    <Box className="glass-card" px={24} py={32}>
      {error && (
        <Alert
          color="red"
          title="Error"
          mb="md"
          bg="rgba(239, 68, 68, 0.15)"
          styles={{
            title: { color: '#fca5a5' },
            message: { color: 'white' },
          }}
        >
          {error}
        </Alert>
      )}

      <Flex mih={60} align="center" justify="center" mb={24} pos="relative">
        <Flex align="center" opacity={isCountryHydrated ? 1 : 0}>
          <CountrySelector
            value={selectedCountry}
            onChange={setSelectedCountry}
            disabled={isInCall}
          />
          <Box
            ref={inputRef}
            component="input"
            type="tel"
            inputMode="tel"
            value={displayNumber}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Phone number"
            disabled={isInCall}
            bg="transparent"
            bd="none"
            fz="clamp(1.25rem, 4vw, 1.5rem)"
            fw={300}
            c="var(--text-primary)"
            w={180}
            style={{ outline: 'none' }}
          />
        </Flex>
        {phoneNumber.length > 0 && !isInCall && (
          <Flex
            component="button"
            onClick={handleBackspace}
            align="center"
            justify="center"
            pos="absolute"
            right={0}
            top="50%"
            bg="transparent"
            bd="none"
            c="var(--text-secondary)"
            style={{
              transform: 'translateY(-50%)',
              cursor: 'pointer',
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
            disabled={!isReady || !isValidNumber || deviceStatus !== 'ready'}
            w={64}
            h={64}
            align="center"
            justify="center"
            style={{
              borderRadius: '50%',
              cursor:
                isReady && isValidNumber && deviceStatus === 'ready'
                  ? 'pointer'
                  : 'not-allowed',
              opacity:
                isReady && isValidNumber && deviceStatus === 'ready' ? 1 : 0.5,
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
            style={{ borderRadius: '50%' }}
          >
            <IconPhoneOff size={28} color="white" />
          </Flex>
        )}
      </Flex>

      <Text ta="center" mt={24} c="var(--text-secondary)" fz="0.875rem">
        Status: {getStatusText()}
      </Text>
      <CallCostDisplay {...pricing} callStatus={callStatus} />
    </Box>
  );
}
