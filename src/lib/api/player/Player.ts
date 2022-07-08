import { DocumentReference, DocumentData } from 'firebase/firestore';

class Player {
  constructor(
    public lobby: string,
    public id: string = '',
    public ref: DocumentReference<DocumentData> = undefined
  ) {}
}

export default Player;
