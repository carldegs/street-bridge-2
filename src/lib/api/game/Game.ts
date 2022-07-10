import { DocumentData, DocumentReference } from 'firebase/firestore';

import { PlayerPos, Phase, Team, BidSuit } from '../../../constants';
import {
  BidHistory,
  Play,
  RoundHistory,
  TurnMetadata,
  Bid,
  Members,
  GameUser,
} from '../../../types';
import { getRandInt } from '../../../utils';
import { Card } from '../_game/Card';
import { Deck } from '../_game/Deck';
import { Hand } from '../_game/Hand';

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
    public bid: BidHistory = null,
    public bidHistory: BidHistory[] = [],
    public numPasses: number = 0,
    public round: number = 0,
    public plays: Play[] = [],
    public roundHistory: RoundHistory[] = [],
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
    const winningBidTricksNeeded = 6 + this.bid.bid.value;
    const losingBidTricksNeeded = 8 - this.bid.bid.value;

    return this.bid.team === Team.vertical
      ? [winningBidTricksNeeded, losingBidTricksNeeded]
      : [losingBidTricksNeeded, winningBidTricksNeeded];
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

  public setBid(player: PlayerPos, bid: Bid | 'pass') {
    this.isCorrectPhase(Phase.bidding);
    this.isCurrPlayer(player);

    if (bid === 'pass') {
      if (!this.bidHistory.length) {
        throw new Error('First player cannot pass.');
      }

      this.numPasses += 1;
      this.bidHistory = [...this.bidHistory, { ...this.turnMetadata }];
    } else {
      if (!this.isValidBid(bid)) {
        throw new Error('Bid must be higher than current bid.');
      }

      this.numPasses = 0;
      this.bid = {
        bid,
        ...this.turnMetadata,
      };
      this.bidHistory = [...this.bidHistory, this.bid];
    }

    if (this.numPasses >= 3) {
      this.phase = Phase.battle;
    }

    this.moveCurrPlayer();
  }

  public playCard(player: PlayerPos, cardId: string) {
    this.isCorrectPhase(Phase.battle);
    this.isCurrPlayer(player);

    const playerHand = this.hands[this.currPlayer];

    if (!playerHand.hasCard(cardId)) {
      throw new Error(`Card not in player's hand.`);
    }

    const cardPlayed = playerHand.playCard(cardId, this.round);

    this.plays = [
      ...this.plays,
      {
        card: cardPlayed,
        ...this.turnMetadata,
      },
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

      this.roundHistory = [
        ...this.roundHistory,
        {
          plays: [...this.plays],
          player: winningPlayer,
          playerId: this.players[winningPlayer],
          team: winningTeam,
          teamName: this.teamNames[winningTeam],
        },
      ];

      this.round += 1;
      this.plays = [];

      this.currPlayer = winningPlayer;

      if (
        this.scores[0] >= this.tricksNeeded[0] ||
        this.scores[1] >= this.tricksNeeded[1]
      ) {
        this.phase = Phase.postgame;
      }
    } else {
      this.moveCurrPlayer();
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
}
