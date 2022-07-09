import {
  CardSuit,
  MAX_CARD_VALUE,
  MIN_CARD_VALUE,
  HAND_SIZE,
} from '../../../constants';
import { Card } from './Card';
import { Hand } from './Hand';

export class Deck {
  public cards: Card[];

  constructor() {
    const cardsBySuit = Object.values(CardSuit)
      .filter((val) => typeof val === 'number')
      .map((suit) => {
        return Array.from(Array(MAX_CARD_VALUE - MIN_CARD_VALUE + 1)).map(
          (_, i) => new Card(i + 2, suit as CardSuit)
        );
      });

    this.cards = cardsBySuit.reduce((arr, curr) => [...arr, ...curr], []);
  }

  public shuffle() {
    const cards = [...this.cards];

    let currentIndex = cards.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [cards[currentIndex], cards[randomIndex]] = [
        cards[randomIndex],
        cards[currentIndex],
      ];
    }

    this.cards = [...cards];
  }

  public distribute(): Record<number, Hand> {
    return Array.from(Array(4))
      .map((_, i) => {
        const handCards = [
          ...this.cards.slice(i * HAND_SIZE, i * HAND_SIZE + HAND_SIZE),
        ];

        return new Hand(handCards);
      })
      .reduce((curr, prev, i) => {
        return {
          ...curr,
          [i]: prev,
        };
      }, {});
  }
}
