'use client';

import { Alert, Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';

import { useTwilioDevice } from '@/hooks/useTwilioDevice';

export function CallInterface() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { callStatus, isReady, error, makeCall, hangUp } = useTwilioDevice();

  const handleCall = () => {
    if (phoneNumber) {
      makeCall(phoneNumber);
    }
  };

  const isInCall = callStatus === 'connecting' || callStatus === 'connected';

  return (
    <Stack gap="md">
      {error && (
        <Alert color="red" title="Error">
          {error}
        </Alert>
      )}

      <TextInput
        label="Phone Number"
        placeholder="+1234567890"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        disabled={isInCall}
      />

      <Group>
        {!isInCall ? (
          <Button onClick={handleCall} disabled={!isReady || !phoneNumber}>
            {isReady ? 'Call' : 'Initializing...'}
          </Button>
        ) : (
          <Button color="red" onClick={hangUp}>
            Hang Up
          </Button>
        )}
      </Group>

      <Text size="sm" c="dimmed">
        Status: {callStatus}
      </Text>
    </Stack>
  );
}
