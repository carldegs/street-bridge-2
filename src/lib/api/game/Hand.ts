import { HAND_SIZE } from '../../../constants';
import { Card } from './Card';

class HandCard {
  private _roundPlayed: number | undefined;

  constructor(public card: Card) {}

  public get isPlayed() {
    return this.roundPlayed !== undefined;
  }

  public get roundPlayed(): number | undefined {
    return this._roundPlayed;
  }

  public playCard(roundPlayed: number) {
    this._roundPlayed = roundPlayed;
  }
}

export class Hand {
  public cards: HandCard[];

  constructor(cards: Card[]) {
    if (cards.length !== HAND_SIZE) {
      throw new Error('Invalid Hand Size');
    }

    this.cards = cards.map((card) => new HandCard(card));
  }

  public addCard(card: Card) {
    this.cards = [...this.cards, new HandCard(card)];
  }

  public playCard(cardId: string, round: number) {
    const cardToBeUsed = this.getCardFromId(cardId);

    if (!cardToBeUsed) {
      throw new Error('Card not found.');
    }

    if (cardToBeUsed.isPlayed) {
      throw new Error('Card already used.');
    }

    cardToBeUsed.playCard(round);

    return cardToBeUsed.card;
  }

  public hasCard(id: string) {
    return !!this.getCardFromId(id);
  }

  private getCardFromId(id: string) {
    return this.cards.find((card) => card.card.id === id);
  }
}
