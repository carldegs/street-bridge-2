import { addDoc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useCallback, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { PlayerPos } from '../../constants';
import { usePlay } from '../../hooks/PlayContext';
import { auth } from '../../lib/api/firebase';
import { Game } from '../../lib/api/game/Game';
import gameConverter from '../../lib/api/game/converter';
import { gameCollection, gameDoc } from '../../lib/api/game/firebaseRef';
import lobbyConverter from '../../lib/api/lobby/converter';
import { lobbyDoc } from '../../lib/api/lobby/firebaseRef';
import { playerDoc } from '../../lib/api/player/firebaseRef';
import { Bid } from '../../types';

const useGamePage = () => {
  const [user, isLoadingUser] = useAuthState(auth);
  const { fetch, gameId } = usePlay();
  const docQuery = useMemo(() => gameDoc(gameId), [gameId]);
  const [game, isLoadingGame, gameError] = useDocumentData(docQuery);
  const isLoading = useMemo(
    () => isLoadingUser || isLoadingGame,
    [isLoadingGame, isLoadingUser]
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const updateGame = useCallback(
    async (game: Game) => updateDoc(docQuery, gameConverter.toFirestore(game)),
    [docQuery]
  );

  const handleEndGame = useCallback(
    async (createNewGame = false) => {
      setIsUpdating(true);
      const lobbySnap = await getDoc(lobbyDoc(game.lobbyId));

      if (!lobbySnap.exists()) {
        throw new Error(`Lobby ${game.lobbyId} not found`);
      }

      const lobby = lobbySnap.data();
      lobby.cancelCurrGame();

      if (createNewGame) {
        const { host, players, membersData, teamNames, lobbyId } =
          lobby.getGameProps();
        const newGame = new Game(
          host,
          players,
          membersData,
          teamNames,
          lobbyId
        );

        const { id: newGameId } = await addDoc(gameCollection, newGame);

        lobby.setGame(newGameId);
      }

      game.cancelGame();

      await updateDoc(
        lobbyDoc(game.lobbyId),
        lobbyConverter.toFirestore(lobby)
      );
      await updateGame(game);
      setIsUpdating(false);
    },
    [game, updateGame]
  );

  const handleDeleteRoom = useCallback(async () => {
    const lobbySnap = await getDoc(lobbyDoc(game.lobbyId));

    if (!lobbySnap.exists()) {
      throw new Error(`Lobby ${game.lobbyId} not found`);
    }

    const lobby = lobbySnap.data();

    await Promise.all(
      lobby.memberIdList.map(async (memberId) => {
        await updateDoc(playerDoc(memberId), { lobby: '' });
      })
    );

    await Promise.all(
      lobby.prevGames.map(async (gameId) => {
        await deleteDoc(gameDoc(gameId));
      })
    );

    await deleteDoc(docQuery);
  }, [docQuery, game?.lobbyId]);

  const handleBid = useCallback(
    async (bid: Bid | 'pass', player?: PlayerPos) => {
      game.setBid(bid, player);

      await updateGame(game);
    },
    [game, updateGame]
  );

  // TODO: Possible issue when one who called handlePlayCard closed
  // the browser during the 3 second timeout
  const handlePlayCard = useCallback(
    async (card: string, player?: PlayerPos) => {
      setIsUpdating(true);

      const round = game.playCard(card, player);

      await updateGame(game);

      if (round) {
        await new Promise((r) => setTimeout(r, 3000));

        game.moveToNextRound(round.player);

        await updateGame(game);
      }

      setIsUpdating(false);
    },
    [game, updateGame]
  );

  return {
    user,
    fetch,
    game,
    isLoadingGame,
    isLoading,
    isUpdating,
    gameError,
    handleEndGame,
    handleBid,
    handlePlayCard,
    handleDeleteRoom,
  };
};

export default useGamePage;
