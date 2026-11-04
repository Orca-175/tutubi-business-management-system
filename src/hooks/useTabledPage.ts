import type { FirestoreDataConverter } from 'firebase/firestore';

import { type Dispatch, type SetStateAction, useState } from 'react';

import { getFilterFieldOptions } from '../firebase/queries/getFilterFieldOptions';
import { refreshData } from '../firebase/queries/refreshData';
import { useFilters } from './useFilters';
import { usePagination } from './usePagination';
import { useRangeFilters } from './useRangeFilters';

// T should be one of the Firestore collection types which exclude the docId
// (ex. Supplier instead of SupplierData)
export function useTabledPage<T>(
  collectionString: string,
  converter: FirestoreDataConverter<T>,
  initialOrderByField: string,
  setData: Dispatch<SetStateAction<(T & { docId: string })[]>>,
  itemsPerPage: number = 20,
) {
  const [orderByField, setOrderByField] = useState(initialOrderByField);
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>('asc');

  const filters = useFilters();
  const rangeFilters = useRangeFilters();

  const pagination = usePagination(setData, collectionString, converter, itemsPerPage);

  const refreshPage = async () => {
    await refreshData(
      collectionString,
      converter,
      [...filters.queryConstraints, ...rangeFilters.rangeQueryConstraints],
      itemsPerPage,
      orderByField,
      setData,
      pagination.initPagination,
    );

    getFilterFieldOptions(collectionString, filters.setFilterFieldOptions);
  };

  return {
    filters: filters,
    itemsPerPage: itemsPerPage,
    orderByDirection: orderByDirection,
    orderByField: orderByField,
    pagination: pagination,
    rangeFilters: rangeFilters,
    refreshPage: refreshPage,
    setOrderByDirection: setOrderByDirection,
    setOrderByField: setOrderByField,
  };
}

