import {
  DarkMode,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Stack,
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

import useCustomColorMode from '../hooks/useCustomColorMode';
import PhosphorIcon from './PhosphorIcon';

const PublicNavbar: React.FC = () => {
  const colorMode = useCustomColorMode();

  return (
    <DarkMode>
      <Flex w="full" bg="teal.600" px={{ base: 4, lg: 8 }} align="center">
        <Link href="/" passHref>
          <Stack spacing={-7}>
            <Heading
              fontSize="sm"
              fontWeight="light"
              letterSpacing="0.4rem"
              py={3}
              color="teal.100"
              cursor="pointer"
              mb={-1}
            >
              STREET
            </Heading>
            <Heading
              fontSize="3xl"
              py={3}
              color="teal.100"
              cursor="pointer"
              fontFamily="Maragsa"
              fontWeight="medium"
            >
              bridge
            </Heading>
          </Stack>
        </Link>
        <Spacer />
        <IconButton
          icon={<PhosphorIcon icon={colorMode.Icon} />}
          aria-label={colorMode.tooltip}
          variant="ghost"
          colorScheme="teal"
          onClick={colorMode.toggle}
        />
      </Flex>
    </DarkMode>
  );
};

export default PublicNavbar;
