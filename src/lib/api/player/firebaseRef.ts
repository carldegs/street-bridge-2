import { collection, doc } from 'firebase/firestore';

import { FIREBASE_COLLECTIONS } from '../../../constants';
import { firestore } from '../firebase';
import playerConverter from './converter';

export const playerCollection = collection(
  firestore,
  FIREBASE_COLLECTIONS.players
).withConverter(playerConverter);

export const playerDoc = (docId?: string) =>
  docId
    ? doc(firestore, FIREBASE_COLLECTIONS.players, docId).withConverter(
        playerConverter
      )
    : undefined;
