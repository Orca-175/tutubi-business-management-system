import type { FilterRangeFieldValues } from '../../interfaces/FIlterRangeFieldValues';

import styles from './FilterInputs.module.scss';

export function FilterNumberRangeInput({
  field,
  filterRangeFieldValues,
  id,
  label,
  setFilterRangeFieldValues,
}: {
  field: string;
  filterRangeFieldValues: FilterRangeFieldValues;
  id: string,
  label: string;
  setFilterRangeFieldValues: (filterRangeFieldValues: FilterRangeFieldValues) => void;
}) {
  // This component has two inputs, each will set the min and max of a certain field in filterRangeFieldValues, respectively.
  return (
    <fieldset className={styles.rangeInput}>
      <legend>{label}</legend>

      <div className={styles.filterInput}>
        <label htmlFor={id + '-min'}>{'Minimum'}</label>
        <input
          id={id + '-min'}
          onChange={(event) => {
            const value = event.target.value;

            const tempRangeFieldValues = structuredClone(filterRangeFieldValues);

           // Sets min
            if (tempRangeFieldValues[field]) {
              tempRangeFieldValues[field][0] = value;
            } else {
              tempRangeFieldValues[field] = [value, ''];
            }

            setFilterRangeFieldValues(tempRangeFieldValues);
          }}
          type="text"
        />
      </div>

      <div className={styles.filterInput}>
        <label htmlFor={id + '-max'}>{'Maximum'}</label>
        <input
          id={id + '-max'}
          onChange={(event) => {
            const value = event.target.value;

            const tempRangeFieldValues = structuredClone(filterRangeFieldValues);
            // Sets max
            if (tempRangeFieldValues[field]) {
              tempRangeFieldValues[field][1] = value;
            } else {
              tempRangeFieldValues[field] = ['', value];
            }

            setFilterRangeFieldValues(tempRangeFieldValues);
          }}
          type="text"
        />
      </div>
    </fieldset>
  );
}

