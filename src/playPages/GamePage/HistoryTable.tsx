import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableContainerProps,
} from '@chakra-ui/react';
import React from 'react';

import { TEAM_COLORS } from '../../constants';
import { Game } from '../../lib/api/game/Game';
import CardMini from './CardMini';

interface Props extends TableContainerProps {
  game: Game;
}

const HistoryTable: React.FC<Props> = ({ game, ...props }) => (
  <TableContainer {...props}>
    <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
      <Thead>
        <Tr>
          {game.players.map((player) => (
            <Th
              key={`header-${player}`}
              color={`${TEAM_COLORS[game.getMemberData(player).role]}.400`}
            >
              {game.getMemberName(player)}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {game.roundHistory
          .map((round, i) => ({ ...round, roundNum: i }))
          .map((round) => (
            <Tr key={`round-${JSON.stringify(round.plays)}`}>
              {game.players.map((player) => {
                const play = round.plays.find((p) => p.playerId === player);

                return (
                  <Td
                    key={`card-${play.playerId}-${round.roundNum}`}
                    opacity={round.playerId === player ? 1 : 0.5}
                  >
                    <CardMini
                      card={play.card}
                      size={{ base: 'sm', md: 'md' }}
                    />
                  </Td>
                );
              })}
            </Tr>
          ))}
      </Tbody>
    </Table>
  </TableContainer>
);

export default HistoryTable;
