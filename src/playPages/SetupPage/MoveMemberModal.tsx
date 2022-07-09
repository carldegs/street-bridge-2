import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Select,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';

import { LobbyRole } from '../../constants';
import Lobby from '../../lib/api/lobby/Lobby';

interface Props extends Omit<ModalProps, 'children'> {
  onClick: (user: string, role: LobbyRole) => void;
  lobby: Lobby;
  userToMove: string;
}

const MoveMemberModal: React.FC<Props> = ({
  onClick,
  lobby,
  userToMove,
  ...props
}) => {
  const [selected, setSelected] = useState(
    userToMove ? lobby.getTeam(userToMove) : 'spectator'
  );
  const options = useMemo(
    () => [
      {
        label: lobby.teamNames[0],
        value: 0,
      },
      {
        label: lobby.teamNames[1],
        value: 1,
      },
      {
        label: 'Spectator',
        value: 'spectator',
      },
    ],
    [lobby.teamNames]
  );

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Host</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Select
            value={selected}
            onChange={(e) => {
              e.preventDefault();
              setSelected(
                (isNaN(+e.target.value)
                  ? e.target.value
                  : +e.target.value) as LobbyRole
              );
            }}
            size="lg"
            placeholder="Select New Host"
          >
            {options.map(({ value, label }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose} mr={4}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => {
              onClick(userToMove, selected);
              props.onClose();
            }}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MoveMemberModal;
