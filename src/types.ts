import React, { PropsWithChildren } from 'react';

import { BidSuit, LobbyRole, PlayerPos, Team } from './constants';
import { Card } from './lib/api/_game/Card';

export type WithChildren<T> = PropsWithChildren<T>;
export type OmitChildren<T> = Omit<T, 'children'>;
export type RFCC<T = unknown> = React.FC<WithChildren<T>>;

export interface Bid {
  value: number;
  suit: BidSuit;
}

export interface TurnMetadata {
  playerId: string;
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

export interface GameUser {
  uid: string;
  displayName: string;
}

export type LobbyMember = GameUser & {
  role: LobbyRole;
};

export type Members = Record<string, LobbyMember>;
