import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  SimpleGrid,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';

import { LobbyRole, TEAM_COLORS } from '../../constants';
import { Members } from '../../types';

interface PlayerListModalProps extends Omit<ModalProps, 'children'> {
  members: Members;
  teamNames: string[];
}

const PlayerListModal: React.FC<PlayerListModalProps> = ({
  members,
  teamNames,
  ...props
}) => {
  const { colorMode } = useColorMode();

  const teamBox = (team: LobbyRole) => {
    const teamMembers = Object.values(members).filter(
      (member) => member.role === team
    );

    if (!teamMembers?.length) {
      return null;
    }

    return (
      <Flex
        align="center"
        bg={`${TEAM_COLORS[team]}.${colorMode === 'dark' ? 400 : 200}`}
        flexDir="column"
        borderRadius="md"
        p={4}
        gridColumn={team === 'spectator' && '1 / -1'}
      >
        <Heading
          colorScheme={TEAM_COLORS[team]}
          fontSize="2xl"
          textAlign="center"
          mb={4}
        >
          {team === 'spectator' ? 'Spectators' : teamNames[team]}
        </Heading>
        {teamMembers.map(({ displayName, uid }) => (
          <Text fontSize="xl" key={`player-list-modal/${uid}`}>
            {displayName}
          </Text>
        ))}
      </Flex>
    );
  };

  return (
    <Modal {...props} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Players</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
            {teamBox(0)}
            {teamBox(1)}
            {teamBox('spectator')}
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PlayerListModal;
