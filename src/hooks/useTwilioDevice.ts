'use client';

import { Call, Device } from '@twilio/voice-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

export type CallStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';

export function useTwilioDevice() {
  const deviceRef = useRef<Device | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (deviceRef.current) return;

    const initDevice = async () => {
      const response = await fetch('/api/token', { method: 'POST' });
      const { token } = await response.json();

      const device = new Device(token, {
        codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
      });

      device.on('registered', () => setIsReady(true));
      device.on('error', (err) => setError(err.message));

      await device.register();
      deviceRef.current = device;
    };

    initDevice().catch((err) => setError(err.message));

    return () => {
      deviceRef.current?.destroy();
      deviceRef.current = null;
    };
  }, []);

  const makeCall = useCallback(
    async (phoneNumber: string) => {
      if (!deviceRef.current || !isReady) return;

      setCallStatus('connecting');
      setError(null);

      const call = await deviceRef.current.connect({
        params: { To: phoneNumber },
      });

      call.on('accept', () => setCallStatus('connected'));
      call.on('disconnect', () => {
        setCallStatus('disconnected');
        setActiveCall(null);
      });
      call.on('error', (err) => {
        setError(err.message);
        setCallStatus('idle');
      });

      setActiveCall(call);
    },
    [isReady],
  );

  const hangUp = useCallback(() => {
    activeCall?.disconnect();
    setActiveCall(null);
    setCallStatus('idle');
  }, [activeCall]);

  return { callStatus, isReady, error, makeCall, hangUp };
}
