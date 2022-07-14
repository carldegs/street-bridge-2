import {
  FlexProps,
  Flex,
  HStack,
  Text,
  useColorMode,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

export const LobbyCodeCard: React.FC<
  FlexProps & { code: string; variant?: 'flat' }
> = ({ code, variant, ...props }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const codeClipboard = useClipboard(code);
  const toast = useToast();

  useEffect(() => {
    if (codeClipboard.hasCopied) {
      toast({
        status: 'success',
        description: 'Code copied',
        duration: 1500,
      });
    }
  }, [codeClipboard.hasCopied, toast]);

  return (
    <Flex
      flexDir={variant === 'flat' ? { base: 'row', md: 'column' } : 'column'}
      bg={isDark ? 'gray.700' : 'gray.200'}
      px={variant === 'flat' ? { base: 2, md: 4 } : 4}
      py={variant === 'flat' ? { base: 1, md: 3 } : 3}
      align="center"
      justify={
        variant === 'flat' ? { base: 'space-between', md: 'center' } : 'center'
      }
      borderRadius="lg"
      cursor="pointer"
      w={
        variant === 'flat' ? { base: 'full', md: 'fit-content' } : 'fit-content'
      }
      transition="250ms cubic-bezier(.29,.91,.32,.96)"
      _hover={{
        bg: 'teal.300',
        transform: 'scale(1.04)',
      }}
      onClick={codeClipboard.onCopy}
      {...props}
    >
      <Text
        textAlign="center"
        fontSize={{
          base: 'xs',
          md: 'sm',
        }}
        letterSpacing={
          variant === 'flat' ? { base: 'wide', md: 'widest' } : 'widest'
        }
        mb={variant === 'flat' ? { md: -1 } : -1}
      >
        ROOM CODE
      </Text>
      <HStack
        fontSize={{
          base: variant === 'flat' ? 'sm' : 'lg',
          md: '2xl',
        }}
        fontWeight="bold"
      >
        <Text>{code.substring(0, 4)}</Text>
        <Text>{code.substring(4, 8)}</Text>
      </HStack>
    </Flex>
  );
};
