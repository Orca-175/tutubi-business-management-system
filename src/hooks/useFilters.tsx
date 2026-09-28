import { type QueryConstraint, where } from 'firebase/firestore';
import { useState } from 'react';

export function useFilters() {
  // Object that stores all the available options for each filter field
  const [fieldOptions, setFieldOptions] = useState<{ [field: string]: (boolean | number | string)[] }>({});

  // Object that stores all the current values of each text or dropdown filter input
  const [filterValues, setFilterValues] = useState<{ [field: string]: string }>({});
  const [queryConstraints, setQueryConstraints] = useState<QueryConstraint[]>([]);

  function applyFilters() {
    const filterValuesEntries = Object.entries(filterValues);
    const tempQueryConstraints = filterValuesEntries.flatMap(filterValue => {
      const field = filterValue[0];
      const value = filterValue[1];

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
    fieldOptions: fieldOptions,
    filterValues: filterValues,
    queryConstraints: queryConstraints,
    setFieldOptions: setFieldOptions,
    setFilterValues: setFilterValues,
  };
}
