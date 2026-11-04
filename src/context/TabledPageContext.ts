import { createContext, type Dispatch, type SetStateAction } from 'react';

import type { useFilters } from '../hooks/useFilters';
import type { usePagination } from '../hooks/usePagination';
import type { useRangeFilters } from '../hooks/useRangeFilters';

interface TabledPageContextValue {
  filters: ReturnType<typeof useFilters>;
  itemsPerPage: number;
  orderByDirection: 'asc' | 'desc';
  orderByField: string;
  pagination: ReturnType<typeof usePagination>;
  rangeFilters: ReturnType<typeof useRangeFilters>;
  refreshPage: () => void;
  setOrderByDirection: Dispatch<SetStateAction<string>>;
  setOrderByField: Dispatch<SetStateAction<string>>;
}

export const TabledPageContext = createContext<null | TabledPageContextValue>(null);

