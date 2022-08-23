import { DocumentData, DocumentReference } from 'firebase/firestore';

import {
  PlayerPos,
  Phase,
  Team,
  BidSuit,
  TEAM_COLORS,
  CardSuit,
} from '../../../constants';
import { BidHistory, Bid, Members, GameUser } from '../../../types';
import { getRandInt } from '../../../utils';
import { Card } from '../_game/Card';
import { Deck } from '../_game/Deck';
import { Hand } from '../_game/Hand';

export class TurnMetadata {
  constructor(
    public playerId: string,
    public player: PlayerPos,
    public teamName: string,
    public team: Team
  ) {}
}
export class Play extends TurnMetadata {
  public card: Card;

  constructor(obj: { card: Card } & TurnMetadata) {
    super(obj.playerId, obj.player, obj.teamName, obj.team);
    this.card = new Card(obj.card.value, obj.card.suit);
  }

  public toObject() {
    return {
      playerId: this.playerId,
      player: this.player,
      teamName: this.teamName,
      team: this.team,
      card: this.card.toObject(),
    };
  }
}

export class Round extends TurnMetadata {
  public playerId: string;
  public player: PlayerPos;
  public teamName: string;
  public team: Team;
  public plays: Play[];

  constructor(obj: { plays: Play[] } & TurnMetadata) {
    super(obj.playerId, obj.player, obj.teamName, obj.team);
    this.plays = obj.plays.map((play) => new Play(play));
  }

  public toObject() {
    return {
      playerId: this.playerId,
      player: this.player,
      teamName: this.teamName,
      team: this.team,
      plays: this.plays.map((play) => play.toObject()),
    };
  }
}

export class Game {
  public get players(): string[] {
    return [...this._players];
  }
  public set players(value: string[]) {
    this._players = value;
  }

  constructor(
    public host: GameUser,
    private _players: string[],
    public membersData: Members,
    public teamNames: string[],
    public lobbyId: string,
    public hands: Record<number, Hand> = {},
    public phase: Phase = Phase.bidding,
    public currPlayer: PlayerPos = getRandInt(0, 3),
    public bid: BidHistory = null, // This is the winning bid. Not the latest bid.
    public bidHistory: BidHistory[] = [],
    public numPasses: number = 0,
    public round: number = 0,
    public plays: Play[] = [],
    public roundHistory: Round[] = [],
    public id: string = '',
    public ref: DocumentReference<DocumentData> = undefined
  ) {
    if (!Object.keys(hands)?.length) {
      const deck = new Deck();
      deck.shuffle();

      this.hands = deck.distribute();
    }
  }

  public get currTeam() {
    return this.getTeam(this.currPlayer);
  }

  public get currTeamName() {
    return this.teamNames[this.currTeam];
  }

  public get currPlayerId() {
    return this.players[this.currPlayer];
  }

  public get tricksNeeded() {
    if (!this.bid) {
      return [7, 7];
    }

    const { neededByLoser, neededByWinner } = this.computeTricksNeeded(
      this.bid.bid.value
    );

    return this.bid.team === Team.vertical
      ? [neededByWinner, neededByLoser]
      : [neededByLoser, neededByWinner];
  }

  public computeTricksNeeded(bidValue: number) {
    const neededByWinner = 6 + bidValue;
    const neededByLoser = 8 - bidValue;

    return {
      neededByWinner,
      neededByLoser,
    };
  }

  public get scores() {
    const verticalTeamScores = this.roundHistory.filter(
      ({ team }) => team === Team.vertical
    ).length;
    const horizontalTeamScores = this.roundHistory.filter(
      ({ team }) => team === Team.horizontal
    ).length;

    return [verticalTeamScores, horizontalTeamScores];
  }

  public get trumpSuit() {
    return this.bid?.bid?.suit;
  }

  public get turnMetadata(): TurnMetadata {
    return {
      playerId: this.currPlayerId,
      player: this.currPlayer,
      teamName: this.currTeamName,
      team: this.currTeam,
    };
  }

  public getPlayerPos(userId: string) {
    return this.players.indexOf(userId);
  }

  public getMemberData(userId: string) {
    if (!this.isMember(userId)) {
      throw new Error('User not a member');
    }

    return { ...this.membersData[userId] };
  }

  public getMemberName(userId: string) {
    if (!this.isMember(userId)) {
      throw new Error('User not a member');
    }

    return this.membersData[userId]?.displayName;
  }

  public getMemberRoleName(userId: string) {
    const team = this.getMemberData(userId).role;

    if (team !== 'spectator') {
      return this.teamNames[team];
    }

    return 'Spectator';
  }

  public setBid(bid: Bid | 'pass', player: PlayerPos = this.currPlayer) {
    this.isCorrectPhase(Phase.bidding);
    this.isCurrPlayer(player);

    if (bid === 'pass') {
      if (!this.bidHistory.length) {
        throw new Error('First player cannot pass.');
      }

      this.bidHistory = [...this.bidHistory, { ...this.turnMetadata }];
    } else {
      if (!this.isValidBid(bid)) {
        throw new Error('Bid must be higher than current bid.');
      }

      this.bid = {
        bid,
        ...this.turnMetadata,
      };
      this.bidHistory = [...this.bidHistory, this.bid];
    }

    const lastBids = this.bidHistory.slice(-3);

    if (
      lastBids.length === 3 &&
      lastBids.filter(({ bid }) => !bid?.value).length === 3
    ) {
      this.phase = Phase.battle;
      this.moveCurrPlayer();
    }

    this.moveCurrPlayer();
  }

  public get firstSuit() {
    return this.plays?.[0]?.card?.suit;
  }

  public playerHasFirstSuit(userId) {
    return !!this.getPlayerHand(userId).availableCards.find(
      (card) => card.card.suit === this.firstSuit
    );
  }

  public hasPlayedCorrectSuit(userId: string, cardId: string) {
    const playedCard = new Card(cardId);

    if (playedCard.suit === this.firstSuit) {
      return true;
    }

    return !this.playerHasFirstSuit(userId);
  }

  public getPlayerAllowedSuits(userId = this.currPlayerId) {
    return this.playerHasFirstSuit(userId)
      ? [this.firstSuit]
      : [CardSuit.club, CardSuit.diamond, CardSuit.heart, CardSuit.spade];
  }

  public getPlayerRestrictedSuits(userId = this.currPlayerId) {
    return this.playerHasFirstSuit(userId)
      ? [
          CardSuit.club,
          CardSuit.diamond,
          CardSuit.heart,
          CardSuit.spade,
        ].filter((suit) => suit !== this.firstSuit)
      : [];
  }

  public playCard(cardId: string, player: PlayerPos = this.currPlayer) {
    this.isCorrectPhase(Phase.battle);
    this.isCurrPlayer(player);

    const playerHand = this.hands[this.currPlayer];

    if (!playerHand.hasCard(cardId)) {
      throw new Error(`Card not in player's hand.`);
    }

    if (!this.hasPlayedCorrectSuit(this.players[player], cardId)) {
      throw new Error(`Card cannot be played.`);
    }

    const cardPlayed = playerHand.playCard(cardId, this.round);

    this.plays = [
      ...this.plays,
      new Play({
        card: cardPlayed,
        ...this.turnMetadata,
      }),
    ];

    if (this.plays.length === 4) {
      const playHasTrumpCard =
        this.trumpSuit === BidSuit.noTrump
          ? false
          : !!this.plays.filter(
              ({ card }) => (card.suit as unknown as BidSuit) === this.trumpSuit
            )?.length;

      const winningSuit = playHasTrumpCard
        ? this.trumpSuit
        : (this.plays[0].card.suit as unknown as BidSuit);

      const playsWithWinningSuit = this.plays.filter(
        ({ card }) => (card.suit as unknown as BidSuit) === winningSuit
      );

      let highestCard: Card | undefined;
      let winningPlayer: PlayerPos | undefined;

      playsWithWinningSuit.forEach((play) => {
        if (!highestCard?.value || play.card.value > highestCard?.value) {
          highestCard = play.card;
          winningPlayer = play.player;
        }
      });

      const winningTeam = this.getTeam(winningPlayer);

      const lastRound = {
        plays: this.plays.map((play) => new Play(play)),
        player: winningPlayer,
        playerId: this.players[winningPlayer],
        team: winningTeam,
        teamName: this.teamNames[winningTeam],
      };

      this.roundHistory = [
        ...this.roundHistory.map((round) => new Round(round)),
        new Round(lastRound),
      ];

      return lastRound;
    } else {
      this.moveCurrPlayer();
    }

    return false;
  }

  public moveToNextRound(winningPlayer: PlayerPos) {
    this.round += 1;
    this.plays = [];
    this.currPlayer = winningPlayer;

    if (
      this.scores[0] >= this.tricksNeeded[0] ||
      this.scores[1] >= this.tricksNeeded[1]
    ) {
      this.phase = Phase.postgame;
    }
  }

  private moveCurrPlayer() {
    this.currPlayer = (this.currPlayer + 1) % 4;
  }

  private isCorrectPhase(phase: Phase) {
    if (this.phase !== phase) {
      throw new Error('Invalid phase');
    }
  }

  public isMember(userId: string) {
    return !!this.membersData?.[userId];
  }

  public isPlayer(userId: string) {
    return this.players.indexOf(userId) >= 0;
  }

  private isCurrPlayer(player: PlayerPos) {
    if (player !== this.currPlayer) {
      throw new Error('Player cannot bid. Not their turn.');
    }
  }

  private isValidBid(bid: Bid) {
    if (!this.bid) {
      return true;
    }

    const bidWithinRange =
      bid.value >= 1 && bid.value <= 7 && !!BidSuit[bid.suit];
    const bidIsGreater =
      bid.value > this.bid.bid.value ||
      (bid.value === this.bid.bid.value && bid.suit > this.bid.bid.suit);

    return bidWithinRange && bidIsGreater;
  }

  public getMinimumBid(): Bid {
    if (!this.bid?.bid) {
      return {
        suit: BidSuit.club,
        value: 1,
      };
    }

    const isMaxBidForValue = this.bid.bid.suit === BidSuit.noTrump;
    return {
      suit: isMaxBidForValue ? BidSuit.club : this.bid.bid.suit + 1,
      value: isMaxBidForValue ? this.bid.bid.value + 1 : this.bid.bid.value,
    };
  }

  private getTeam(player: PlayerPos) {
    return [PlayerPos.north, PlayerPos.south].includes(player)
      ? Team.vertical
      : Team.horizontal;
  }

  public getPlayerHand(userId: string) {
    const playerPos = this.getPlayerPos(userId);

    if (playerPos < 0) {
      throw new Error('Not a player');
    }

    return this.hands[playerPos];
  }

  public addMember(user: GameUser) {
    this.membersData = {
      ...this.membersData,
      [user.uid]: {
        ...user,
        role: 'spectator',
      },
    };

    return this.membersData;
  }

  public cancelGame() {
    this.phase = Phase.cancelled;
  }

  public getPlayerPublicData(id: string = this.currPlayerId) {
    const memberData = this.membersData[id];

    return {
      ...memberData,
      teamName:
        memberData.role === 'spectator'
          ? 'Spectators'
          : this.teamNames[memberData.role],
      teamColor: TEAM_COLORS[memberData.role],
    };
  }

  public getPlayerBidData(id: string = this.currPlayerId) {
    const bids = this.bidHistory
      .filter(({ playerId }) => id === playerId)
      .map(({ bid }) => bid || 'pass');

    return {
      ...this.getPlayerPublicData(id),
      isCurrPlayer: this.currPlayerId === id,
      bids,
      lastBid: bids?.length ? bids[bids.length - 1] : undefined,
      isPass: bids.findIndex((bid) => bid === 'pass') >= 0,
    };
  }

  public getPlayersBidData() {
    return this.players.map((id: string) => this.getPlayerBidData(id));
  }
}
