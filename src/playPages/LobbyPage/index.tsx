import { Box, Button, Center } from '@chakra-ui/react';
import React, { useState } from 'react';

import CreateLobbyPanel from './components/CreateLobbyPanel';
import JoinLobbyPanel from './components/JoinLobbyPanel';

const LobbyPage: React.FC = () => {
  const [tab, setTab] = useState<'join' | 'create'>('join');

  return (
    <Box w="full" h="100vh" bg="gray.100">
      <Center h="full" flexDir="column">
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
    </Box>
  );
};

export default LobbyPage;
