import { Box, BoxProps, HStack, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';

export const LobbyCodeCard: React.FC<BoxProps & { code: string }> = ({
  code,
  ...props
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Box
      bg={isDark ? 'gray.700' : 'gray.200'}
      px={4}
      py={3}
      borderRadius="lg"
      cursor="pointer"
      w="fit-content"
      transition="250ms cubic-bezier(.29,.91,.32,.96)"
      _hover={{
        bg: 'teal.300',
        transform: 'scale(1.04)',
      }}
      {...props}
    >
      <Text
        textAlign="center"
        fontSize={{
          base: 'xs',
          md: 'sm',
        }}
        letterSpacing="widest"
        mb={-1}
      >
        ROOM CODE
      </Text>
      <HStack>
        <Text
          fontSize={{
            base: 'lg',
            md: '2xl',
          }}
          fontWeight="bold"
        >
          {code.substring(0, 4)}
        </Text>
        <Text
          fontSize={{
            base: 'lg',
            md: '2xl',
          }}
          fontWeight="bold"
        >
          {code.substring(4, 8)}
        </Text>
      </HStack>
    </Box>
  );
};
