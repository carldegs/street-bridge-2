import { HAND_SIZE } from '../../../constants';
import { Card } from './Card';

class HandCard {
  constructor(public card: Card, public roundPlayed: number = -1) {}

  public toObject() {
    return {
      card: this.card.toObject(),
      roundPlayed: this.roundPlayed,
    };
  }

  public get isPlayed() {
    return this.roundPlayed >= 0;
  }

  public playCard(roundPlayed: number) {
    this.roundPlayed = roundPlayed;
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

  public toObject = () => {
    return this.cards.map((card) => card.toObject());
  };

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
