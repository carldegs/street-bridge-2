import { collection, doc } from 'firebase/firestore';

import { FIREBASE_COLLECTIONS } from '../../../constants';
import { firestore } from '../firebase';
import gameConverter from './converter';

export const gameCollection = collection(
  firestore,
  FIREBASE_COLLECTIONS.games
).withConverter(gameConverter);

export const gameDoc = (docId?: string) =>
  docId
    ? doc(firestore, FIREBASE_COLLECTIONS.games, docId).withConverter(
        gameConverter
      )
    : undefined;
