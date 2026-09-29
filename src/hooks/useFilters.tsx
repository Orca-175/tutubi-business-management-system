import { type QueryConstraint, where } from 'firebase/firestore';
import { useState } from 'react';

import type { FilterFieldValues } from '../interfaces/FilterFieldValues';
import type { FilterFieldOptions } from '../interfaces/firestore-collections/FilterFieldOptions';

export function useFilters() {
  // Object that stores all the available options for each filter field
  const [filterFieldOptions, setFilterFieldOptions] = useState<FilterFieldOptions>({});

  // Object that stores all the current values of each text or dropdown filter input
  const [filterFieldValues, setFilterFieldValues] = useState<FilterFieldValues>({});
  const [queryConstraints, setQueryConstraints] = useState<QueryConstraint[]>([]);

  function applyFilters() {
    const tempQueryConstraints = Object.entries(filterFieldValues).flatMap(([field, value]) => {
      if (value === '') {
        return [];
      }

      let finalValue;

      if (value === 'true' || value === 'false') {
        finalValue = value === 'true' ? true : false;
      } else if (!Number.isNaN(Number(value))) {
        finalValue = Number(value);
      } else {
        finalValue = value;
      }

      return where(field, '==', finalValue);
    });

    setQueryConstraints(tempQueryConstraints);
  }

  return {
    applyFilters: applyFilters,
    filterFieldOptions: filterFieldOptions,
    filterFieldValues: filterFieldValues,
    queryConstraints: queryConstraints,
    setFilterFieldOptions: setFilterFieldOptions,
    setFilterFieldValues: setFilterFieldValues,
  };
}
