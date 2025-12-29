'use client';

import { Alert, Box, Flex, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function SpykeLogo() {
  return (
    <Flex align="center" gap={12}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 4L6 14v10c0 11 7.2 21.3 18 24 10.8-2.7 18-13 18-24V14L24 4z"
          fill="url(#shield-gradient)"
          stroke="url(#shield-stroke)"
          strokeWidth="1.5"
        />
        <path
          d="M24 16c-4.4 0-8 1.8-8 4v2c0 1.1.9 2 2 2h1c.6 0 1-.4 1-1v-1c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v1c0 .6.4 1 1 1h1c1.1 0 2-.9 2-2v-2c0-2.2-3.6-4-8-4z"
          fill="#00d9ff"
        />
        <path
          d="M16 26c0 0 2 8 8 8s8-8 8-8"
          stroke="#00d9ff"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="20" cy="28" r="1.5" fill="#00d9ff" />
        <circle cx="28" cy="28" r="1.5" fill="#00d9ff" />
        <circle cx="24" cy="31" r="1.5" fill="#00d9ff" />
        <defs>
          <linearGradient
            id="shield-gradient"
            x1="6"
            y1="4"
            x2="42"
            y2="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4f46e5" stopOpacity="0.3" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient
            id="shield-stroke"
            x1="6"
            y1="4"
            x2="42"
            y2="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00d9ff" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <Text
        component="span"
        fz="2rem"
        fw={700}
        style={{
          letterSpacing: '0.1em',
          background: 'linear-gradient(135deg, #00d9ff 0%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        SPYKE
      </Text>
    </Flex>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.push('/');
      router.refresh();
    } else {
      const data = await response.json();
      setError(data.error || 'Invalid password');
      setLoading(false);
    }
  };

  return (
    <Flex
      mih="100vh"
      direction="column"
      align="center"
      justify="center"
      px={20}
      py={40}
      pos="relative"
      style={{ zIndex: 1 }}
    >
      <SpykeLogo />
      <Box className="glass-card" mt={40} w="100%" maw={360} px={24} py={32}>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert
              color="red"
              title="Error"
              mb={24}
              bg="rgba(239, 68, 68, 0.2)"
            >
              {error}
            </Alert>
          )}

          <Box mb={24}>
            <Text
              component="label"
              display="block"
              mb={8}
              c="var(--text-secondary)"
              fz="0.875rem"
            >
              Password
            </Text>
            <Box pos="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(100, 150, 255, 0.3)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <Flex
                component="button"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                pos="absolute"
                right={12}
                top="50%"
                align="center"
                justify="center"
                p={4}
                style={{
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <EyeIcon visible={showPassword} />
              </Flex>
            </Box>
          </Box>

          <Flex
            component="button"
            type="submit"
            className="call-button"
            disabled={loading}
            w="100%"
            p={14}
            fz="1rem"
            fw={600}
            c="white"
            justify="center"
            style={{
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}
