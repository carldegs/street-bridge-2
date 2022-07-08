/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { signInAnonymously } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState, useUpdateProfile } from 'react-firebase-hooks/auth';

import useInput from '../hooks/useInput';
import Layout from '../layouts/Layout';
import { auth } from '../lib/api/firebase';
import { RFCC } from '../types';

const AuthWrapper: RFCC = ({ children }) => {
  const router = useRouter();
  const [user, authLoading, authError] = useAuthState(auth);
  const [updateProfile, isUpdatingProfile, updateProfileError] =
    useUpdateProfile(auth);
  const displayNameInput = useInput();
  const toast = useToast();
  const initialRef = React.useRef(null);

  useEffect(() => {
    if (!authLoading && !user) {
      signInAnonymously(auth);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (authError) {
      toast({
        status: 'error',
        title: 'Cannot login',
        description: authError.message,
      });
      router.push('/');
    }

    if (updateProfileError) {
      toast({
        status: 'error',
        title: 'Cannot set username',
        description: authError.message,
      });
      router.push('/');
    }
  }, [authError, router, toast, updateProfileError]);

  return (
    <>
      {!!(!user?.displayName && !authLoading) && (
        <Modal
          isOpen
          onClose={() => {}}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          initialFocusRef={initialRef}
        >
          <ModalOverlay />
          {authLoading && (
            <ModalContent>
              <ModalBody>
                <Spinner size="xl" />
              </ModalBody>
            </ModalContent>
          )}
          {!!(!authLoading && !user?.displayName) && (
            <ModalContent>
              <ModalHeader>Give yourself a name</ModalHeader>
              <ModalBody>
                <Input
                  ref={initialRef}
                  variant="flushed"
                  size="lg"
                  {...displayNameInput}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={isUpdatingProfile}
                  onClick={(e) => {
                    e.preventDefault();
                    updateProfile({ displayName: displayNameInput.value });
                  }}
                  disabled={!displayNameInput.value}
                >
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          )}
        </Modal>
      )}
      <Layout fullHeight>{!!user?.displayName && children}</Layout>
    </>
  );
};

export default AuthWrapper;
