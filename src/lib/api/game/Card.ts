import {
  CardSuit,
  CARD_FACES_END,
  CARD_FACES_START,
  CardFaceLabels,
  CardSuitLabels,
} from '../../../constants';
import { isValidCardValue } from '../../../utils';

export class Card {
  public value: number;
  public suit: CardSuit;

  constructor(value: number, suit: CardSuit);
  constructor(id: string);
  constructor(valueOrId: number | string, suit?: CardSuit) {
    let actualValue: number;
    let actualSuit: CardSuit;

    if (typeof valueOrId === 'string') {
      const parsedId = this.parseId(valueOrId);
      actualValue = parsedId.value;
      actualSuit = +parsedId.suit;
    } else if (typeof valueOrId === 'number' && !!suit) {
      actualSuit = suit;
      actualValue = valueOrId;
    }

    if (!isValidCardValue(actualValue)) {
      throw new Error(
        `${actualValue} is an invalid card value. Must be from 2 to ${CARD_FACES_END}`
      );
    }

    if (!actualSuit) {
      throw new Error(`Invalid suit.`);
    }

    this.value = actualValue;
    this.suit = actualSuit;
  }

  public get valueLabel() {
    if (this.value >= CARD_FACES_START) {
      return CardFaceLabels[this.value];
    }

    return `${this.value}`;
  }

  public get suitLabel() {
    return CardSuitLabels[this.suit];
  }

  public get cardLabel() {
    return `${this.valueLabel} of ${this.suitLabel}s`;
  }

  public get id() {
    return `${this.value}-${this.suit}`;
  }

  private parseId(id: string) {
    const [value, suit] = id.split('-');

    return {
      value: +value,
      suit: CardSuit[suit],
    };
  }
}
