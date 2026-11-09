import type { Dispatch, SetStateAction } from 'react';

import { collection, type FirestoreDataConverter, getDocs, limit, orderBy, query, QueryDocumentSnapshot } from 'firebase/firestore';

import { db } from '../firebase';

// Initializes the data of a table page on first mount. Should only be called when isLoading is true
// in the component
export async function getInitialData<T>(
  collectionString: string,
  converter: FirestoreDataConverter<T>,
  itemsPerPage: number,
  orderByString: string = 'createdAt',
  setData: Dispatch<SetStateAction<(T & { docId: string })[]>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  initPagination: (
    startDoc: QueryDocumentSnapshot,
    endDoc: QueryDocumentSnapshot,
    nextPageExists: boolean,
  ) => void,
) {
  const docs = (await getDocs(query(
    collection(db, collectionString)
      .withConverter(converter),
    limit(itemsPerPage + 1),
    orderBy(orderByString),
  ))).docs;
  const nextPageExists = docs.length > itemsPerPage;

  if (nextPageExists) {
    docs.pop();
  }

  const data = docs.map(doc => ({ ...doc.data(), docId: doc.id}));

  setData(data);
  setIsLoading(false);
  initPagination(docs[0], docs.at(-1), nextPageExists);
}

