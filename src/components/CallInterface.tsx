'use client';

import { Alert } from '@mantine/core';
import { useState } from 'react';

import { useTwilioDevice } from '@/hooks/useTwilioDevice';

import { Dialer } from './Dialer';

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
      makeCall(phoneNumber);
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
    if (!isInCall) {
      setPhoneNumber((prev) => prev.slice(0, -1));
    }
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

  return (
    <div className="glass-card" style={{ padding: '32px 24px' }}>
      {error && (
        <Alert
          color="red"
          title="Error"
          style={{ marginBottom: '16px', background: 'rgba(239, 68, 68, 0.2)' }}
        >
          {error}
        </Alert>
      )}

      <div
        onClick={handleBackspace}
        style={{
          minHeight: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          cursor: phoneNumber && !isInCall ? 'pointer' : 'default',
        }}
      >
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => !isInCall && setPhoneNumber(e.target.value)}
          placeholder="+1234567890"
          disabled={isInCall}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '2rem',
            fontWeight: 300,
            color: 'var(--text-primary)',
            textAlign: 'center',
            width: '100%',
            letterSpacing: '0.05em',
          }}
        />
      </div>

      <Dialer onDigit={handleDigit} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '24px',
        }}
      >
        {!isInCall ? (
          <button
            className="call-button"
            onClick={handleCall}
            disabled={!isReady || !phoneNumber}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isReady && phoneNumber ? 'pointer' : 'not-allowed',
              opacity: isReady && phoneNumber ? 1 : 0.5,
            }}
          >
            <PhoneIcon />
          </button>
        ) : (
          <button
            className="hangup-button"
            onClick={hangUp}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <HangUpIcon />
          </button>
        )}
      </div>

      <div
        style={{
          textAlign: 'center',
          marginTop: '24px',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
        }}
      >
        Status: {getStatusText()}
      </div>
    </div>
  );
}
