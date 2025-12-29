'use client';

import { Call, Device } from '@twilio/voice-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

export type CallStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';
export type DeviceStatus = 'connecting' | 'ready' | 'disconnected' | 'error';

const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 1000;

async function fetchToken(): Promise<string> {
  const response = await fetch('/api/token', { method: 'POST' });
  const { token } = await response.json();
  return token;
}

export function useTwilioDevice() {
  const deviceRef = useRef<Device | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>('connecting');

  useEffect(() => {
    if (deviceRef.current) return;

    const clearReconnectTimeout = () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    const attemptReconnect = () => {
      if (!deviceRef.current) return;

      if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        setError(
          'Unable to reconnect after multiple attempts. Please refresh the page.',
        );
        setDeviceStatus('error');
        return;
      }

      const delay =
        INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current);
      reconnectAttemptsRef.current += 1;

      reconnectTimeoutRef.current = setTimeout(async () => {
        try {
          const token = await fetchToken();
          deviceRef.current?.updateToken(token);
          await deviceRef.current?.register();
        } catch {
          attemptReconnect();
        }
      }, delay);
    };

    const initDevice = async () => {
      const token = await fetchToken();

      const device = new Device(token, {
        codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
        tokenRefreshMs: 30000,
        maxCallSignalingTimeoutMs: 10000,
      });

      device.on('registered', () => {
        setIsReady(true);
        setDeviceStatus('ready');
        setError(null);
        reconnectAttemptsRef.current = 0;
        clearReconnectTimeout();
      });

      device.on('registering', () => {
        setDeviceStatus('connecting');
      });

      device.on('unregistered', () => {
        setIsReady(false);
        setDeviceStatus('disconnected');
        attemptReconnect();
      });

      device.on('tokenWillExpire', async () => {
        try {
          const newToken = await fetchToken();
          device.updateToken(newToken);
        } catch {
          setError('Failed to refresh token');
        }
      });

      device.on('error', (err) => {
        setError(err.message);
        if (err.code === 31205 || err.code === 20101) {
          attemptReconnect();
        }
      });

      await device.register();
      deviceRef.current = device;
    };

    initDevice().catch((err) => {
      setError(err.message);
      setDeviceStatus('error');
    });

    return () => {
      clearReconnectTimeout();
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

  const sendDigit = useCallback(
    (digit: string) => {
      activeCall?.sendDigits(digit);
    },
    [activeCall],
  );

  return {
    callStatus,
    deviceStatus,
    isReady,
    error,
    makeCall,
    hangUp,
    sendDigit,
  };
}
