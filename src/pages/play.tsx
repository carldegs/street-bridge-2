import { Center, Spinner, useToast } from '@chakra-ui/react';
import { signInAnonymously } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { OverallPhase } from '../constants';
import { usePlay } from '../hooks/PlayContext';
import { auth } from '../lib/api/firebase';
import LobbyPage from '../playPages/LobbyPage';
import SetupPage from '../playPages/SetupPage';

const PlayRouterPage: React.FC = () => {
  const toast = useToast();
  const router = useRouter();
  const [user, isLoadingUser, userError] = useAuthState(auth);
  const { isFetching, fetch, overallPhase } = usePlay();

  useEffect(() => {
    if (!isLoadingUser && !user) {
      signInAnonymously(auth);
    }
  }, [isLoadingUser, user]);

  useEffect(() => {
    if (userError) {
      toast({
        status: 'error',
        title: 'Cannot initialize',
        description: userError.message,
      });
      router.push('/');
    }
  }, [userError, router, toast]);

  useEffect(() => {
    if (!isLoadingUser && user) {
      fetch(user);
    }
  }, [fetch, isLoadingUser, user]);

  if (isFetching || !overallPhase) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }

  if (overallPhase === OverallPhase.start) {
    return <LobbyPage />;
  }

  return <SetupPage />;
};

export default PlayRouterPage;
