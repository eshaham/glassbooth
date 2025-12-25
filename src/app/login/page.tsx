'use client';

import {
  Alert,
  Button,
  Container,
  PasswordInput,
  Stack,
  Title,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      setError('Invalid password');
      setLoading(false);
    }
  };

  return (
    <Container size="xs" py="xl">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Title order={1}>Spyke</Title>

          {error && (
            <Alert color="red" title="Error">
              {error}
            </Alert>
          )}

          <PasswordInput
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" loading={loading}>
            Login
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
