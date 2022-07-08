import { createConverter } from '../../../utils';
import Lobby from './Lobby';

const lobbyConverter = createConverter<Lobby>(
  ({ members, teamNames, currGame = '', prevGames, name, host, code }) => ({
    members,
    teamNames,
    currGame,
    prevGames,
    name,
    host,
    code,
  }),
  (snapshot, options) => {
    const { id, ref } = snapshot;
    const { name, host, members, teamNames, prevGames, currGame, code } =
      snapshot.data(options);

    return new Lobby(
      name,
      host,
      code,
      members,
      teamNames,
      prevGames,
      currGame,
      id,
      ref
    );
  }
);

export default lobbyConverter;
