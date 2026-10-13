import type { FilterRangeFieldValues } from '../../interfaces/FIlterRangeFieldValues';

import styles from './FilterInputs.module.scss';

export function FilterDateRangeInput({
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
  return (
    <div className={styles.rangeInput}>
      <div>{label}</div>

      <div className={styles.filterInputs}>
        <div className={styles.filterInput}>
          <label
            className={styles.rangeLabel}
            htmlFor={id + '-min'}
          >
            {'Minimum'}:
          </label>
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
            type="date"
          />
        </div>

        <div className={styles.filterInput}>
          <label
            className={styles.rangeLabel}
            htmlFor={id + '-max'}
          >
            {'Maximum'}:
          </label>
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
            type="date"
          />
        </div>
      </div>
    </div>
  );
}

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
  return (
    <div className={styles.rangeInput}>
      <div>{label}</div>

      <div className={styles.filterInputs}>
        <div className={styles.filterInput}>
          <label
            className={styles.rangeLabel}
            htmlFor={id + '-min'}
          >
            {'Minimum'}:
          </label>
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
            placeholder="Minimum"
            type="number"
          />
        </div>

        <div className={styles.filterInput}>
          <label
            className={styles.rangeLabel}
            htmlFor={id + '-max'}
          >
            {'Maximum'}:
          </label>
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
            placeholder="Maximum"
            type="number"
          />
        </div>
      </div>
    </div>
  );
}

