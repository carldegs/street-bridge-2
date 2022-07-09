import { User } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import React, { useCallback, useMemo, useState } from 'react';

import { OverallPhase } from '../constants';
import { lobbyDoc } from '../lib/api/lobby/firebaseRef';
import { playerDoc } from '../lib/api/player/firebaseRef';
import { RFCC } from '../types';

const PlayContext = React.createContext<{
  isFetching: boolean;
  overallPhase?: OverallPhase;
  lobbyId?: string;
  gameId?: string;
  fetch: (user: User) => void;
}>({
  isFetching: false,
  overallPhase: undefined,
  lobbyId: '',
  gameId: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  fetch: () => {},
});

const PlayProvider: RFCC = ({ children }) => {
  const [isFetching, setFetching] = useState(false);
  const [overallPhase, setOverallPhase] = useState<OverallPhase | undefined>();
  const [lobbyId, setLobbyId] = useState('');
  const [gameId, setGameId] = useState('');

  const fetch = useCallback(async (user: User) => {
    if (!user?.uid) {
      throw new Error('User not found');
    }

    setFetching(true);
    const player = (await getDoc(playerDoc(user.uid)))?.data();
    const lobbyId = player?.lobby;

    if (!lobbyId) {
      setOverallPhase(OverallPhase.start);
      setFetching(false);
      return;
    }

    const lobby = (await getDoc(lobbyDoc(lobbyId)))?.data();

    if (!lobby) {
      setOverallPhase(OverallPhase.start);
      setFetching(false);
      return;
    }

    if (!lobby?.currGame) {
      setOverallPhase(OverallPhase.setup);
      setGameId('');
    } else {
      setOverallPhase(OverallPhase.game);
      setGameId(lobby.currGame);
    }

    setLobbyId(lobbyId);
    setFetching(false);

    return {
      player,
      lobby,
    };
  }, []);

  const value = useMemo(
    () => ({
      isFetching,
      overallPhase,
      lobbyId,
      gameId,
      fetch,
    }),
    [fetch, gameId, isFetching, lobbyId, overallPhase]
  );

  return <PlayContext.Provider value={value}>{children}</PlayContext.Provider>;
};

const usePlay = () => {
  const context = React.useContext(PlayContext);

  if (!context) {
    throw new Error('hook must be used inside PlayProvider');
  }

  return context;
};

export { usePlay, PlayProvider };
