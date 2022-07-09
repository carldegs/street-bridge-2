import { createConverter } from '../../../utils';
import { Game } from './Game';

const gameConverter = createConverter<Game>(
  ({
    host,
    players,
    membersData,
    teamNames,
    lobbyId,
    hands = [],
    phase,
    currPlayer,
    bid,
    bidHistory = [],
    numPasses,
    round,
    plays = [],
    roundHistory = [],
  }) => {
    return {
      host,
      players,
      membersData,
      teamNames,
      lobbyId,
      hands: Object.fromEntries(
        Object.entries(hands).map(([key, value]) => [key, value.toObject()])
      ),
      phase,
      currPlayer,
      bid,
      bidHistory,
      numPasses,
      round,
      plays,
      roundHistory,
    };
  },
  (snapshot, options) => {
    const { id, ref } = snapshot;
    const {
      host,
      players,
      membersData,
      teamNames,
      lobbyId,
      hands,
      phase,
      currPlayer,
      bid,
      bidHistory,
      numPasses,
      round,
      plays,
      roundHistory,
    } = snapshot.data(options);

    return new Game(
      host,
      players,
      membersData,
      teamNames,
      lobbyId,
      hands,
      phase,
      currPlayer,
      bid,
      bidHistory,
      numPasses,
      round,
      plays,
      roundHistory,
      id,
      ref
    );
  }
);

export default gameConverter;
