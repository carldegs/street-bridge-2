import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface Props extends Omit<ModalProps, 'children'> {
  onClick: (name: string) => void;
  value: string;
}

const EditTeamNameModal: React.FC<Props> = ({ onClick, value, ...props }) => {
  const [name, setName] = useState(value);

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Team Name</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            size="lg"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Set Team Name"
          />
        </ModalBody>

        <ModalFooter>
          <Button onClick={props.onClose} mr={4}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => {
              onClick(name);
              props.onClose();
            }}
            isDisabled={!name}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTeamNameModal;
