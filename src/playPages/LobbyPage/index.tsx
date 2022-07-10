import { Button, Center, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';

import PublicNavbar from '../../components/PublicNavbar';
import useCustomColorMode from '../../hooks/useCustomColorMode';
import CreateLobbyPanel from './components/CreateLobbyPanel';
import JoinLobbyPanel from './components/JoinLobbyPanel';

const LobbyPage: React.FC = () => {
  const [tab, setTab] = useState<'join' | 'create'>('join');
  const colorMode = useCustomColorMode();

  return (
    <Flex
      w="full"
      h="100vh"
      bg={!colorMode.isDark && 'gray.100'}
      flexDir="column"
    >
      <PublicNavbar />
      <Center flexDir="column" flexGrow={1}>
        {tab === 'join' ? <JoinLobbyPanel /> : <CreateLobbyPanel />}
        <Button
          variant="ghost"
          colorScheme="teal"
          mt={4}
          onClick={() => {
            setTab((curr) => (curr === 'join' ? 'create' : 'join'));
          }}
        >
          {tab === 'join'
            ? 'OR CREATE A NEW ROOM INSTEAD'
            : 'OR JOIN A ROOM INSTEAD'}
        </Button>
      </Center>
    </Flex>
  );
};

export default LobbyPage;
