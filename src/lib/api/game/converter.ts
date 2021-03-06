import { CardSuit } from '../../../constants';
import { createConverter } from '../../../utils';
import { Card } from '../_game/Card';
import { Hand, HandCard } from '../_game/Hand';
import { Game, Play, Round } from './Game';

const gameConverter = createConverter<Game>(
  ({
    host,
    players,
    membersData,
    teamNames,
    lobbyId,
    hands = {},
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
      plays: plays.map((play) => play.toObject()),
      roundHistory: roundHistory.map((round) => round.toObject()),
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
    } = snapshot.data(options) as Record<string, any> & {
      hands: {
        [k: string]: {
          card: {
            value: number;
            suit: CardSuit;
          };
          roundPlayed: number;
        }[];
      };
    };

    return new Game(
      host,
      players,
      membersData,
      teamNames,
      lobbyId,
      Object.fromEntries(
        Object.entries(hands).map(([key, value]) => [
          key,
          new Hand(
            value.map(({ card, roundPlayed }) => {
              // TODO: Debug
              if (!card?.value && !card?.suit) {
                return new HandCard(
                  new Card(
                    (card as unknown as HandCard).card.value,
                    (card as unknown as HandCard).card.suit
                  ),
                  roundPlayed
                );
              }

              return new HandCard(new Card(card.value, card.suit), roundPlayed);
            })
          ),
        ])
      ),
      phase,
      currPlayer,
      bid,
      bidHistory,
      numPasses,
      round,
      plays.map((play) => new Play(play)),
      roundHistory.map((round) => new Round(round)),
      id,
      ref
    );
  }
);

export default gameConverter;
