import { User } from 'firebase/auth';
import { DocumentData, FirestoreDataConverter } from 'firebase/firestore';
import { customAlphabet } from 'nanoid';

import { MIN_CARD_VALUE, MAX_CARD_VALUE } from './constants';

export const isValidCardValue = (value: number) =>
  value >= MIN_CARD_VALUE && value <= MAX_CARD_VALUE;

export const getRandInt = (a: number, b: number) =>
  Math.floor(Math.random() * (b - a + 1)) + a;

export const createConverter = <T>(
  toFirestore: (data: T) => DocumentData,
  fromFirestore: FirestoreDataConverter<T>['fromFirestore']
) => ({
  toFirestore,
  fromFirestore,
});

export const getUserInfo = (user: User) => ({
  uid: user.uid,
  displayName: user.displayName,
});

export const createRoomCode = () => {
  const alphabet = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
  const nanoid = customAlphabet(alphabet, 8);

  return nanoid();
};
