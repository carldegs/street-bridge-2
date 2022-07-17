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
} from '@chakra-ui/react';
import React from 'react';

import { Game } from '../../../lib/api/game/Game';
import HistoryTable from './HistoryTable';

interface HistoryModalProps extends Omit<ModalProps, 'children'> {
  game: Game;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ game, ...props }) => (
  <Modal size="lg" {...props}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Rounds</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <HistoryTable game={game} />
      </ModalBody>
      <ModalFooter>
        <Button onClick={props.onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default HistoryModal;
