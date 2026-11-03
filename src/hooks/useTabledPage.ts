import type { FirestoreDataConverter } from 'firebase/firestore';

import { type Dispatch, type SetStateAction, useState } from 'react';

import { useFilters } from './useFilters';
import { usePagination } from './usePagination';
import { useRangeFilters } from './useRangeFilters';

// T should be one of the Firestore collection types which exclude the docId
// (ex. Supplier instead of SupplierData)
export function useTabledPage<T>(
  collectionString: string,
  converter: FirestoreDataConverter<T>,
  initialOrderByString: string,
  itemsPerPage: number,
  setData: Dispatch<SetStateAction<(T & { docId: string })[]>>,
) {
  const [orderByString, setOrderByString] = useState(initialOrderByString);
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>('asc');

  const filters = useFilters();
  const rangeFilters = useRangeFilters();
  const pagination = usePagination(setData, collectionString, converter, itemsPerPage);

  return {
    filters: filters,
    orderByDirection: orderByDirection,
    orderByString: orderByString,
    pagination: pagination,
    rangeFilters: rangeFilters,
    setOrderByDirection: setOrderByDirection,
    setOrderByString: setOrderByString,
  };
}

