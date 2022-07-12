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

import { Game } from '../../lib/api/game/Game';
import { BidChat } from './BidChat';

interface BidsModalProps extends Omit<ModalProps, 'children'> {
  game: Game;
}

const BidsModal: React.FC<BidsModalProps> = ({ game, ...props }) => (
  <Modal {...props}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader></ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <BidChat game={game} />
      </ModalBody>
      <ModalFooter>
        <Button onClick={props.onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default BidsModal;
