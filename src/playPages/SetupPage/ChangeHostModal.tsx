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
import React, { useState } from 'react';

interface Props extends Omit<ModalProps, 'children'> {
  onClick: (host: string) => void;
  options: { value: string; label: string }[];
}

const ChangeHostModal: React.FC<Props> = ({
  onClick,
  options = [],
  ...props
}) => {
  const [selected, setSelected] = useState('');

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
              setSelected(e.target.value);
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
              onClick(selected);
              props.onClose();
            }}
            isDisabled={!selected}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeHostModal;
