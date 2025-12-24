import { Container, Title, Text } from '@mantine/core';

export default function Home() {
  return (
    <Container size="sm" py="xl">
      <Title order={1}>Spyke</Title>
      <Text c="dimmed">Make calls online</Text>
    </Container>
  );
}
