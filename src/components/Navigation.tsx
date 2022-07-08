import { Avatar } from '@chakra-ui/avatar';
import { Divider, Flex, Heading, Spacer, Text } from '@chakra-ui/layout';
import { Menu, MenuItem, MenuList } from '@chakra-ui/menu';
import { Box, Button, MenuButton, Spinner } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../lib/api/firebase';

const NAVBAR_HEIGHT = '60px';

const Navigation: React.FC = () => {
  const router = useRouter();
  const [user, authLoading] = useAuthState(auth);

  return (
    <Flex
      as="header"
      alignItems="center"
      justifyContent="center"
      h={NAVBAR_HEIGHT}
      w="full"
      position="sticky"
      bg="gray.900"
    >
      <Heading
        color="white"
        fontSize="2xl"
        ml={4}
        onClick={() => router.push('/')}
        cursor="pointer"
        letterSpacing="tighter"
      >
        site.
      </Heading>

      <Spacer />

      <Divider orientation="vertical" h={NAVBAR_HEIGHT} />
      {authLoading ? (
        <Box w="15px">
          <Spinner />
        </Box>
      ) : !user?.displayName ? (
        <Button
          onClick={() => {
            router.push('/lobby');
          }}
          mx={4}
          px={8}
        >
          Play
        </Button>
      ) : (
        <Menu>
          <MenuButton>
            <Flex mx={4} cursor="pointer" alignItems="center">
              <Avatar size="sm" name={user.displayName} mr={2} bg="blue.800" />
              <Text
                color="white"
                lineHeight="32px"
                verticalAlign="middle"
                mr={4}
              >
                {user.displayName}
              </Text>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                signOut(auth);
                router.push('/');
              }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};

export default Navigation;
