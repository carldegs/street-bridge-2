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

export enum Phase {
  bidding = 'bidding',
  battle = 'battle',
  postgame = 'postgame',
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

export type LobbyRole = `${Team}` | 'spectator';
