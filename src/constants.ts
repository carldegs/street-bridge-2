import { ButtonProps } from '@chakra-ui/react';
import { Club, Diamond, Heart, Spade } from 'phosphor-react';

export enum CardSuit {
  club = 1,
  spade,
  heart,
  diamond,
}

export enum BidSuit {
  club = 1,
  spade,
  heart,
  diamond,
  noTrump,
}

export enum CardFace {
  jack = 11,
  queen,
  king,
  ace,
}

export enum PlayerPos {
  north = 0,
  east,
  south,
  west,
}

export enum Team {
  vertical = 0,
  horizontal,
}

export enum OverallPhase {
  start = 'start',
  setup = 'setup',
  game = 'game',
}

export enum Phase {
  bidding = 'bidding',
  battle = 'battle',
  postgame = 'postgame',
  cancelled = 'cancelled',
}

export const CardFaceLabels = {
  [CardFace.jack]: {
    short: 'J',
    long: 'Jack',
  },
  [CardFace.queen]: {
    short: 'Q',
    long: 'Queen',
  },
  [CardFace.king]: {
    short: 'K',
    long: 'King',
  },
  [CardFace.ace]: {
    short: 'A',
    long: 'Ace',
  },
};

export const CardSuitLabels = {
  [CardSuit.club]: 'Club',
  [CardSuit.diamond]: 'Diamond',
  [CardSuit.heart]: 'Heart',
  [CardSuit.spade]: 'Spade',
};

export const CardSuitIcons = {
  [CardSuit.club]: Club,
  [CardSuit.heart]: Heart,
  [CardSuit.spade]: Spade,
  [CardSuit.diamond]: Diamond,
};

export const BidSuitLabels = {
  [BidSuit.club]: 'Club',
  [BidSuit.diamond]: 'Diamond',
  [BidSuit.heart]: 'Heart',
  [BidSuit.spade]: 'Spade',
  [BidSuit.noTrump]: 'No Trump',
};

export const CARD_FACES_START = CardFace.jack;
export const CARD_FACES_END = CardFace.ace;
export const HAND_SIZE = 13;
export const MIN_CARD_VALUE = 2;
export const MAX_CARD_VALUE = CardFace.ace;

export const FIREBASE_COLLECTIONS = {
  lobbies: 'lobbies',
  chats: 'chats',
  games: 'games',
  players: 'players',
};

export type LobbyRole = Team | 'spectator';

export const TEAM_COLORS: Record<LobbyRole, ButtonProps['colorScheme']> = {
  0: 'green',
  1: 'purple',
  spectator: 'teal',
};

export const CARD_COLORS: Record<CardSuit, ButtonProps['colorScheme']> = {
  [CardSuit.club]: 'teal',
  [CardSuit.diamond]: 'orange',
  [CardSuit.heart]: 'red',
  [CardSuit.spade]: 'blue',
};

export const AUTO_LOOP = 'AUTO_LOOP';
