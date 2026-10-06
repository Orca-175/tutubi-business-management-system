import { QueryConstraint, where } from 'firebase/firestore';
import { useState } from 'react';

import type { FilterRangeFieldValues } from '../interfaces/FIlterRangeFieldValues';

// Facillitates range filters on numbers and dates
export function useRangeFilters() {
  const [filterRangeFieldValues, setFilterRangeFieldValues] = useState<FilterRangeFieldValues>({});
  const [rangeQueryConstraints, setRangeQueryConstraints] = useState<QueryConstraint[]>([]);

  function applyRangeFilters() {
    const newQueryConstraints = Object.entries(filterRangeFieldValues).flatMap(([field, valueArray]) => {
      // Converts the elements in the array into the appropriate types
      // If they aren't valid numbers or dates, throw an error
      const typedValues = valueArray.map(value => {
        const number = Number(value);
        const date = new Date(value);

        if (number) {
          return number;
        } else if (date.getTime()) {
          return date.toISOString();
        } else if (value === '') {
          // An empty string is interpreted as no filter for that value
          return value;
        } else {
          // Both number and date.getTime() are NaN
          throw new Error('useRangeFilters should only be used for a range of numbers or dates.');
        }
      });

      const [min, max] = typedValues;

      const finalConstraintPair = [];
      finalConstraintPair.push(min ? where(field, '>=', min) : []);
      finalConstraintPair.push(max ? where(field, '<=', max) : []);

      return finalConstraintPair.flat();
    });

    setRangeQueryConstraints(newQueryConstraints);
  }

  return {
    applyRangeFilters: applyRangeFilters,
    filterRangeFieldValues: filterRangeFieldValues,
    rangeQueryConstraints: rangeQueryConstraints,
    setFilterRangeFieldValues: setFilterRangeFieldValues,
  };
}

