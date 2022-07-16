import {
  Flex,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { Game, Play } from '../../lib/api/game/Game';
import PlayingCard from './PlayingCard';

interface Props {
  game: Game;
  userId: string;
}

const PlayerText: React.FC<{
  game: Game;
  playerId: string;
  placement?: 'tb' | 'lr';
}> = ({ game, playerId, placement = 'tb' }) => {
  const { displayName, teamColor } = game.getPlayerPublicData(playerId);
  return (
    <Text
      textAlign="center"
      p={{ base: 1.5, md: 2 }}
      fontWeight="semibold"
      fontSize={'lg'}
      color={`${teamColor}.400`}
      sx={
        placement === 'lr' && {
          writingMode: 'vertical-lr',
          textOrientation: 'mixed',
        }
      }
    >
      {displayName}
    </Text>
  );
};
const transforms = [
  'translate(-20px, 80px) rotate(-30deg)',
  'translate(-80px, -20px) rotate(-120deg)',
  'translate(20px, -80px) rotate(-210deg)',
  'translate(80px, 20px) rotate(150deg)',
];

const TablePlayingCard: React.FC<{
  plays: {
    playerId: string;
    play: Play;
    playOrder: number;
  }[];
  playId: number;
}> = ({ plays, playId }) => {
  const size = useBreakpointValue({
    base: 'xs',
    md: 'sm',
    lg: 'md',
  } as const);

  const { play, playOrder = 0 } = plays[playId] || {};

  return (
    <PlayingCard
      card={play?.card}
      size={size}
      zIndex={10 + playOrder}
      transform={!play?.card ? transforms[playId] : 'translate(0, 0) rotate(0)'}
      opacity={!play?.card && 0}
      transition="250ms cubic-bezier(.29,.91,.32,.96)"
    />
  );
};

const PlayingTable: React.FC<Props> = ({ userId, game }) => {
  const sortOrder = useMemo(() => {
    const players = [...game.players];

    const userIndex = players.indexOf(userId);
    const toMove = players.splice(0, userIndex);

    return [...players, ...toMove];
  }, [game.players, userId]);

  const sortedPlays = useMemo(
    () =>
      sortOrder.map((playerId) => {
        const playIndex = game.plays.findIndex(
          ({ playerId: pid }) => playerId === pid
        );

        return {
          playerId,
          play: playIndex >= 0 ? game.plays[playIndex] : undefined,
          playOrder: playIndex,
        };
      }),
    [game.plays, sortOrder]
  );

  return (
    <Flex
      flexDir="column"
      mt={{ base: 4, md: 8 }}
      w="full"
      maxW="550px"
      align="center"
      justify="center"
      h="full"
      mb={24}
    >
      <PlayerText game={game} playerId={sortOrder[2]} />

      <Flex w="full">
        <PlayerText game={game} playerId={sortOrder[1]} placement="lr" />
        <Flex
          flexDir="column"
          p={{ base: 4, md: 8 }}
          bg="blackAlpha.400"
          borderRadius="xl"
          flexGrow={1}
          maxW="500px"
          w="full"
        >
          <Flex align="center" justify="center">
            <TablePlayingCard plays={sortedPlays} playId={2} />
          </Flex>
          <Flex
            align="center"
            justify="space-between"
            my={{ base: -12, md: -12 }}
          >
            <TablePlayingCard plays={sortedPlays} playId={1} />
            <TablePlayingCard plays={sortedPlays} playId={3} />
          </Flex>
          <Flex align="center" justify="center">
            <TablePlayingCard plays={sortedPlays} playId={0} />
          </Flex>
        </Flex>

        <PlayerText game={game} playerId={sortOrder[3]} placement="lr" />
      </Flex>

      <PlayerText game={game} playerId={sortOrder[0]} />
    </Flex>
  );

  return (
    <>
      <SimpleGrid columns={4} w="full">
        {sortedPlays.map(({ play, playerId }) => (
          <Stack key={`table-${playerId}`} mx="auto">
            {play && <PlayingCard card={play.card} />}

            <Text textAlign="center">
              {game.getPlayerPublicData(playerId).displayName}
            </Text>
          </Stack>
        ))}
      </SimpleGrid>
    </>
  );
};

export default PlayingTable;
