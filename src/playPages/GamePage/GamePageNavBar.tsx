import { Flex, Heading, Spacer } from '@chakra-ui/react';
import React from 'react';

import { LobbyRole, TEAM_COLORS } from '../../constants';

interface Props {
  roleId: LobbyRole;
  teamName: string;
  displayName: string;
}

export const GamePageNavBar: React.FC<Props> = ({
  roleId,
  teamName,
  displayName,
}) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      bg={`${TEAM_COLORS[roleId]}.500`}
      py={2}
      px={6}
    >
      <Heading fontSize="md" color={`${TEAM_COLORS[roleId]}.50`}>
        STREET BRIDGE
      </Heading>
      <Spacer />
      <Heading fontSize="md" color={`${TEAM_COLORS[roleId]}.200`}>
        {`${displayName} | ${teamName}`}
      </Heading>
    </Flex>
  );
};
