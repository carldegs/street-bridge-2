import { runTransaction, setDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { useAuthState, useUpdateProfile } from 'react-firebase-hooks/auth';

import { usePlay } from '../../hooks/PlayContext';
import { auth, firestore } from '../../lib/api/firebase';
import { gameDoc } from '../../lib/api/game/firebaseRef';
import Lobby from '../../lib/api/lobby/Lobby';
import lobbyConverter from '../../lib/api/lobby/converter';
import { lobbyDoc } from '../../lib/api/lobby/firebaseRef';
import Player from '../../lib/api/player/Player';
import playerConverter from '../../lib/api/player/converter';
import { playerDoc } from '../../lib/api/player/firebaseRef';
import { createRoomCode, getUserInfo } from '../../utils';

const useLobbyPage = () => {
  const [updateProfile, isUpdatingProfile] = useUpdateProfile(auth);
  const [user, isLoadingUser] = useAuthState(auth);
  const { fetch } = usePlay();

  const setPlayerLobby = useCallback(
    async (code: string) => {
      await setDoc(
        playerDoc(user.uid),
        playerConverter.toFirestore(new Player(code))
      );
      fetch(user);
    },
    [fetch, user]
  );

  const handleCreateLobby = useCallback(
    async (hostName: string) => {
      if (!user) {
        throw new Error('An account must be signed in');
      }

      await updateProfile({ displayName: hostName });

      const code = createRoomCode();
      const lobby = new Lobby(code, getUserInfo(user), code);

      await setDoc(lobbyDoc(code), lobbyConverter.toFirestore(lobby));

      await setPlayerLobby(code);

      fetch(user);
    },
    [fetch, setPlayerLobby, updateProfile, user]
  );

  const handleJoinLobby = useCallback(
    async (code: string, hostName: string) => {
      if (!user) {
        throw new Error('An account must be signed in');
      }

      await updateProfile({ displayName: hostName });

      const lobbyRef = lobbyDoc(code);
      const playerRef = playerDoc(user.uid);

      await runTransaction(firestore, async (transaction) => {
        const playerSnap = await transaction.get(playerRef);

        const lobbySnap = await transaction.get(lobbyRef);

        if (!lobbySnap.exists()) {
          throw new Error(`Lobby ${code} not found`);
        }

        const lobby = lobbySnap.data();

        if (!lobby.isMember(user.uid)) {
          lobby.addMember({ uid: user.uid, displayName: hostName });
        } else {
          lobby.updateMember(user.uid, { displayName: hostName });
        }

        const gameRef = gameDoc(lobby.currGame);

        if (lobby.currGame) {
          const gameSnap = await transaction.get(gameRef);

          if (!gameSnap.exists()) {
            throw new Error(`Game ${lobby.currGame} not found`);
          }

          const game = gameSnap.data();

          game.addMember({ uid: user.uid, displayName: hostName });

          transaction.update(gameRef, { membersData: game.membersData });
        }

        transaction.update(lobbyRef, {
          members: lobby.members,
        });

        if (!playerSnap.exists()) {
          transaction.set(
            playerRef,
            playerConverter.toFirestore(new Player(code))
          );
        } else {
          transaction.update(
            playerRef,
            playerConverter.toFirestore(new Player(code))
          );
        }
      });

      fetch(user);
    },
    [fetch, updateProfile, user]
  );

  return {
    updateProfile,
    user,
    isUpdatingProfile,
    isLoadingUser,
    handleCreateLobby,
    handleJoinLobby,
  };
};

export default useLobbyPage;
