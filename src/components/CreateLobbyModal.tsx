import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  Input,
  ModalFooter,
  Button,
  ModalProps,
  useToast,
} from '@chakra-ui/react';
import { addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import useInput from '../hooks/useInput';
import { auth } from '../lib/api/firebase';
import Lobby from '../lib/api/lobby/Lobby';
import lobbyConverter from '../lib/api/lobby/converter';
import { lobbyCollection } from '../lib/api/lobby/firebaseRef';
import { OmitChildren } from '../types';
import { getUserInfo } from '../utils';

const CreateLobbyModal: React.FC<OmitChildren<ModalProps>> = ({
  isOpen,
  onClose,
}) => {
  const [user, isLoadingUser] = useAuthState(auth);
  const lobbyNameInput = useInput();
  const router = useRouter();
  const toast = useToast();

  if (isLoadingUser) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Lobby</ModalHeader>
        <ModalBody>
          <FormControl label="Lobby Name">
            <Input {...lobbyNameInput} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={async (e) => {
              e.preventDefault();
              try {
                const doc = await addDoc(
                  lobbyCollection,
                  lobbyConverter.toFirestore(
                    new Lobby(
                      lobbyNameInput.value,
                      getUserInfo(user),
                      lobbyNameInput.value
                    )
                  )
                );

                router.push(`/lobby/${doc.id}`);
              } catch (err) {
                toast({
                  status: 'error',
                  title: 'Cannot create lobby',
                  description: err?.message,
                });
              }
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateLobbyModal;
