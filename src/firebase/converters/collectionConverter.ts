import type { FirestoreDataConverter } from 'firebase/firestore';

export function getCollectionConverter<T>() {
  const collectionConverter: FirestoreDataConverter<T> = {
    fromFirestore(snapshot) {
      return snapshot.data() as T;
    },
    toFirestore(data: T) {
      return data;
    },
  };

  return collectionConverter;
}

