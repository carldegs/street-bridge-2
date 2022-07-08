import { deleteDoc, updateDoc } from 'firebase/firestore';
import { useCallback, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { LobbyRole, Team } from '../../constants';
import { usePlay } from '../../hooks/PlayContext';
import { auth } from '../../lib/api/firebase';
import Lobby from '../../lib/api/lobby/Lobby';
import lobbyConverter from '../../lib/api/lobby/converter';
import { lobbyDoc } from '../../lib/api/lobby/firebaseRef';
import { playerDoc } from '../../lib/api/player/firebaseRef';

const useSetupPage = () => {
  const [user, isLoadingUser] = useAuthState(auth);
  const { fetch, lobbyId } = usePlay();
  const docQuery = useMemo(() => lobbyDoc(lobbyId), [lobbyId]);
  const [lobby, isLoadingLobby, lobbyError] = useDocumentData(docQuery);
  const isLoading = useMemo(
    () => isLoadingUser || isLoadingLobby,
    [isLoadingLobby, isLoadingUser]
  );

  const updateLobby = useCallback(
    (lobby: Lobby) => updateDoc(docQuery, lobbyConverter.toFirestore(lobby)),
    [docQuery]
  );

  const changeTeam = useCallback(
    async (newTeam: LobbyRole) => {
      lobby.updateMember(user.uid, { role: newTeam });
      await updateLobby(lobby);
    },
    [lobby, updateLobby, user.uid]
  );

  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      lobby.removeMember(memberId);

      await updateDoc(playerDoc(memberId), { lobby: '' });
      await updateLobby(lobby);
    },
    [lobby, updateLobby]
  );

  const handleMoveMember = useCallback(
    async (memberId: string, team: LobbyRole) => {
      lobby.updateMember(memberId, { role: team });

      await updateLobby(lobby);
    },
    [lobby, updateLobby]
  );

  const handleChangeHost = useCallback(
    async (newHostId: string) => {
      if (!lobby.isHost(user.uid)) {
        throw new Error(`User is not the room's host.`);
      }

      lobby.changeHost(newHostId);

      await updateLobby(lobby);
    },
    [lobby, updateLobby, user]
  );

  const handleLeaveRoom = useCallback(
    async (newHostId?: string) => {
      await updateDoc(playerDoc(user.uid), { lobby: '' });

      lobby.removeMember(user.uid, newHostId);

      await updateLobby(lobby);
    },
    [lobby, updateLobby, user]
  );

  const handleDeleteRoom = useCallback(async () => {
    await Promise.all(
      lobby.memberIdList.map(async (memberId) => {
        await updateDoc(playerDoc(memberId), { lobby: '' });
      })
    );

    await deleteDoc(docQuery);
  }, [docQuery, lobby]);

  const handleChangeTeamName = useCallback(
    async (team: Team, name: string) => {
      lobby.changeTeamName(team, name);

      await updateLobby(lobby);
    },
    [lobby, updateLobby]
  );

  return {
    user,
    isLoading,
    fetch,
    lobby,
    lobbyError,
    changeTeam,
    handleMoveMember,
    handleRemoveMember,
    handleChangeHost,
    handleLeaveRoom,
    handleDeleteRoom,
    handleChangeTeamName,
  };
};

export default useSetupPage;
