import { createConverter } from '../../../utils';
import Player from './Player';

const playerConverter = createConverter<Player>(
  ({ lobby }) => ({ lobby }),
  (snapshot, options) => {
    const { id, ref } = snapshot;
    const { lobby } = snapshot.data(options);

    return new Player(lobby, id, ref);
  }
);

export default playerConverter;
