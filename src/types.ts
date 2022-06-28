import { BidSuit, PlayerPos, Team } from './constants';
import { Card } from './lib/api/game/Card';

export interface Bid {
  value: number;
  suit: BidSuit;
}

export interface TurnMetadata {
  playerName: string;
  player: PlayerPos;
  teamName: string;
  team: Team;
}

export interface BidHistory extends TurnMetadata {
  bid?: Bid;
}

export interface Play extends TurnMetadata {
  card: Card;
}

export interface RoundHistory extends TurnMetadata {
  plays: Play[];
}
