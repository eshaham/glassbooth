'use client';

import { Alert, Box, Flex, Text } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function GlassBoothLogo() {
  return (
    <Box
      component="img"
      src="/logo.webp"
      alt="GlassBooth"
      w={300}
      style={{ maxWidth: '80vw', height: 'auto' }}
    />
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
      justify="flex-start"
      px={20}
      pt={20}
      pos="relative"
      style={{ zIndex: 1 }}
    >
      <GlassBoothLogo />
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
                {showPassword ? (
                  <IconEyeOff size={20} />
                ) : (
                  <IconEye size={20} />
                )}
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
