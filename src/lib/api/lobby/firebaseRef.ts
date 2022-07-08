import { collection, doc } from 'firebase/firestore';

import { FIREBASE_COLLECTIONS } from '../../../constants';
import { firestore } from '../firebase';
import lobbyConverter from './converter';

export const lobbyCollection = collection(
  firestore,
  FIREBASE_COLLECTIONS.lobbies
).withConverter(lobbyConverter);

export const lobbyDoc = (docId?: string) =>
  docId
    ? doc(firestore, FIREBASE_COLLECTIONS.lobbies, docId).withConverter(
        lobbyConverter
      )
    : undefined;
