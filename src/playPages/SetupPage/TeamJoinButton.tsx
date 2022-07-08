import { Button, ButtonProps, Flex } from '@chakra-ui/react';
import React from 'react';

import { LobbyRole } from '../../constants';

interface TeamJoinButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: (selectedTeam: LobbyRole) => void;
  team: LobbyRole;
  userTeam: LobbyRole;
}

const TeamJoinButton: React.FC<TeamJoinButtonProps> = ({
  onClick,
  team,
  userTeam,
  ...buttonProps
}) => (
  <Flex alignItems="center" justifyContent="center" w="full" mt={8}>
    <Button
      onClick={(e) => {
        e.preventDefault();
        onClick(team);
      }}
      isDisabled={userTeam === team}
      {...buttonProps}
    >
      JOIN
    </Button>
  </Flex>
);

export default TeamJoinButton;
