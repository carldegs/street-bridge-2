import { DarkMode, Flex, Heading, IconButton, Spacer } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useCustomColorMode from '../hooks/useCustomColorMode';
import PhosphorIcon from './PhosphorIcon';

const PublicNavbar: React.FC = () => {
  const router = useRouter();
  const colorMode = useCustomColorMode();

  return (
    <DarkMode>
      <Flex w="full" bg="teal.600" px={{ base: 4, lg: 8 }} align="center">
        <Heading
          fontWeight="black"
          fontSize="2xl"
          py={3}
          letterSpacing="tighter"
          color="teal.100"
          cursor="pointer"
          onClick={() => {
            router.push('/');
          }}
        >
          STREET BRIDGE
        </Heading>
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
