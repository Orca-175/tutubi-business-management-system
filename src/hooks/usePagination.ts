import { collection, endAt, type FirestoreDataConverter, getDocs, limit, orderBy, query, type QueryDocumentSnapshot, startAfter, startAt } from 'firebase/firestore';
import { useState } from 'react';

import { db } from '../firebase/firebase';

export function usePagination<T>(
  setData: (data: (T & { docId: string })[]) => void,
  collectionString: string,
  converter: FirestoreDataConverter<T>,
  itemsPerPage: number,
) {
  const [pageStack, setPageStack] = useState<QueryDocumentSnapshot<T>[]>([]);
  const [currentStartDoc, setCurrentStartDoc] = useState<QueryDocumentSnapshot<T>>();
  const [currentEndDoc, setCurrentEndDoc] = useState<QueryDocumentSnapshot<T>>();
  const [nextPageExists, setNextPageExists] = useState(true);

  // Query objects should have a limit of itemsPerPage + 1 to check for existence of next page
  async function handlePageBtnClick(
    orderByString: string,
    orderByDirection: 'asc' | 'desc',
    pageNumber: number,
  ) {
    const docs = (await getDocs(query(
      collection(db, collectionString)
        .withConverter(converter),
        limit(itemsPerPage + 1),
        orderBy(orderByString, orderByDirection),
        startAt(pageStack[pageNumber - 1]),
    ))).docs;
    const nextPageExists = docs.length > itemsPerPage;

    if (nextPageExists) {
      docs.pop();
    }

    const data = docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    setData(data);
    setCurrentStartDoc(docs[0]);
    setCurrentEndDoc(docs.at(-1));
    setNextPageExists(nextPageExists);
  }

  async function handlePrevBtnClick(
    orderByString: string,
    orderByDirection: 'asc' | 'desc',
  ) {
    const docs = (await getDocs(query(
      collection(db, collectionString)
        .withConverter(converter),
        limit(itemsPerPage),
        orderBy(orderByString, orderByDirection),
        endAt(currentStartDoc),
    ))).docs;

    const data = docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    setData(data);
    setCurrentStartDoc(docs[0]);
    setCurrentEndDoc(docs.at(-1));
    setNextPageExists(true);
  }

  async function handleNextBtnClick(
    orderByString: string,
    orderByDirection: 'asc' | 'desc',
  ) {
    const docs = (await getDocs(query(
      collection(db, collectionString)
        .withConverter(converter),
        limit(itemsPerPage + 1),
        orderBy(orderByString, orderByDirection),
        startAfter(currentEndDoc),
    ))).docs;
    const nextPageExists = docs.length > itemsPerPage;

    if (nextPageExists) {
      docs.pop();
    }

    const data = docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    setData(data);
    setPageStack([...pageStack, docs[0]]);
    setCurrentStartDoc(docs[0]);
    setCurrentEndDoc(docs.at(-1));
    setNextPageExists(nextPageExists);
  }

  return {
    handleNextBtnClick: handleNextBtnClick,
    handlePageBtnClick: handlePageBtnClick,
    handlePrevBtnClick: handlePrevBtnClick,
    nextPageExists: nextPageExists,
  };
}
