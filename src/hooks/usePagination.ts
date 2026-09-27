import {
  collection,
  endBefore,
  type FirestoreDataConverter,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  QueryConstraint,
  type QueryDocumentSnapshot,
  startAfter,
  startAt,
} from 'firebase/firestore';
import { useCallback, useState } from 'react';

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

  const prevPageExists = currentStartDoc?.id !== pageStack[0]?.id;

  const initPagination = useCallback((
    startDoc: QueryDocumentSnapshot<T>,
    endDoc: QueryDocumentSnapshot<T>,
    nextPageExists: boolean,
  ) => {
    setPageStack([startDoc]);
    setCurrentStartDoc(startDoc);
    setCurrentEndDoc(endDoc);
    setNextPageExists(nextPageExists);
  }, []);

  // For limiting the amount of pagination buttons on a page
  function getFilteredPageStack() {
    const numberOfPageBtns = 5;
    const currentStartDocIndex = pageStack.findIndex(doc => doc?.id === currentStartDoc?.id);

    if (pageStack.length > numberOfPageBtns && currentStartDocIndex > (numberOfPageBtns - 1)) {
      return pageStack.filter((_, index) => (
        index >= (currentStartDocIndex - (numberOfPageBtns - 1)) && index <= currentStartDocIndex
      ));
    }

    return pageStack.toSpliced(numberOfPageBtns);
  }

  // Query objects should have a limit of itemsPerPage + 1 to check for existence of next page
  async function handlePageBtnClick(
    orderByString: string,
    orderByDirection: 'asc' | 'desc',
    pageNumber: number,
    queryConstraints: QueryConstraint[] = [],
  ) {
    const docs = (await getDocs(query(
      collection(db, collectionString)
        .withConverter(converter),
        limit(itemsPerPage + 1),
        orderBy(orderByString, orderByDirection),
        startAt(pageStack[pageNumber - 1]),
        ...queryConstraints,
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
    queryConstraints: QueryConstraint[] = [],
  ) {
    const docs = (await getDocs(query(
      collection(db, collectionString)
        .withConverter(converter),
        limitToLast(itemsPerPage),
        orderBy(orderByString, orderByDirection),
        endBefore(currentStartDoc),
        ...queryConstraints,
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
    queryConstraints: QueryConstraint[] = [],
  ) {
    const docs = (await getDocs(query(
      collection(db, collectionString)
        .withConverter(converter),
        limit(itemsPerPage + 1),
        orderBy(orderByString, orderByDirection),
        startAfter(currentEndDoc),
        ...queryConstraints,
    ))).docs;
    const nextPageExists = docs.length > itemsPerPage;

    if (nextPageExists) {
      docs.pop();
    }

    const data = docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    setData(data);

    if (!pageStack.some(doc => doc.id === docs[0]?.id)) {
      setPageStack([...pageStack, docs[0]]);
    }

    setCurrentStartDoc(docs[0]);
    setCurrentEndDoc(docs.at(-1));
    setNextPageExists(nextPageExists);
  }

  return {
    currentStartDocId: currentStartDoc?.id,
    getFilteredPageStack: getFilteredPageStack,
    handleNextBtnClick: handleNextBtnClick,
    handlePageBtnClick: handlePageBtnClick,
    handlePrevBtnClick: handlePrevBtnClick,
    initPagination: initPagination,
    nextPageExists: nextPageExists,
    pageStack: pageStack,
    prevPageExists: prevPageExists,
  };
}
