import type { QueryFilterConstraint } from 'firebase/firestore/lite';
import type { Dispatch, SetStateAction } from 'react';

import { and, collection, type FirestoreDataConverter, getDocs, limit, orderBy, query, QueryDocumentSnapshot } from 'firebase/firestore';

import { db } from '../firebase';

// Called to refresh table data when filters are set or the page is manually refreshed by the user
export async function refreshData<T>(
  collectionString: string,
  converter: FirestoreDataConverter<T>,
  filterConstraints: QueryFilterConstraint[],
  itemsPerPage: number,
  orderByString: string,
  setData: Dispatch<SetStateAction<(T & { docId: string })[]>>,
  initPagination: (
    startDoc: QueryDocumentSnapshot,
    endDoc: QueryDocumentSnapshot,
    nextPageExists: boolean,
  ) => void,
) {
  const docs = (await getDocs(query(
    collection(db, collectionString)
      .withConverter(converter),
    and(
      ...filterConstraints,
    ),
    limit(itemsPerPage + 1),
    orderBy(orderByString),
  ))).docs;
  const nextPageExists = docs.length > itemsPerPage;

  if (nextPageExists) {
    docs.pop();
  }

  const data = docs.map(doc => ({ ...doc.data(), docId: doc.id}));

  setData(data);
  initPagination(docs[0], docs.at(-1), nextPageExists);
}

