import { Box, Flex } from '@mantine/core';

import { CallInterface } from '@/components/CallInterface';

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

export default function Home() {
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
      <Box w="100%" maw={400}>
        <CallInterface />
      </Box>
    </Flex>
  );
}
