import { Container, Stack, Text, Title } from '@mantine/core';

import { CallInterface } from '@/components/CallInterface';

export default function Home() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1}>Spyke</Title>
          <Text c="dimmed">Make calls online</Text>
        </div>
        <CallInterface />
      </Stack>
    </Container>
  );
}
