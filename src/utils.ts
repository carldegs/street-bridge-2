import { MIN_CARD_VALUE, MAX_CARD_VALUE } from './constants';

export const isValidCardValue = (value: number) =>
  value >= MIN_CARD_VALUE && value <= MAX_CARD_VALUE;

export const getRandInt = (a: number, b: number) =>
  Math.floor(Math.random() * (b - a + 1)) + a;
