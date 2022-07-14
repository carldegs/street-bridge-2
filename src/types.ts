import React, { PropsWithChildren } from 'react';

import { BidSuit, LobbyRole } from './constants';
import { TurnMetadata } from './lib/api/game/Game';

export type WithChildren<T> = PropsWithChildren<T>;
export type OmitChildren<T> = Omit<T, 'children'>;
export type RFCC<T = unknown> = React.FC<WithChildren<T>>;

export interface Bid {
  value: number;
  suit: BidSuit;
}

export interface BidHistory extends TurnMetadata {
  bid?: Bid;
}

export interface GameUser {
  uid: string;
  displayName: string;
}

export type LobbyMember = GameUser & {
  role: LobbyRole;
};

export type Members = Record<string, LobbyMember>;

export type SortOrder = '' | 'asc' | 'desc';
