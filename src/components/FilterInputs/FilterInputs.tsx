import type { FilterFieldValues } from '../../interfaces/FilterFieldValues';

import styles from './FilterInputs.module.scss';

export function FilterSelectInput({
  field,
  filterFieldValues,
  id,
  label,
  options, // filterFieldOptions from useFilters hook
  setFilterFieldValues,
}: {
  field: string;
  filterFieldValues: FilterFieldValues;
  id: string;
  label: string;
  options: (boolean | number | string)[];
  setFilterFieldValues: (filterFieldValues: FilterFieldValues) => void;
}) {
  const stringOptions = options.map(option => String(option));

  return (
    <div className={styles.filterInput}>
      <label htmlFor={id}>{label}:</label>
      <select
        id={id}
        onChange={(event) => {
          const value = event.target.value;
          const tempFilterValues = { ...filterFieldValues };
          tempFilterValues[field] = value;

          setFilterFieldValues(tempFilterValues);
        }}
        value={filterFieldValues[field] || ''}
      >
        <option value="">All</option>
        {stringOptions.map(option => {
          return <option
            key={field + option}
            value={option}
          >
            {option === 'true' ? (
              'True'
            ) : option === 'false' ? (
              'False'
            ) : (
              option
            )}
          </option>;
        })}
      </select>
    </div>
  );
}

export function FilterTextInput({
  field,
  filterFieldValues,
  id,
  label,
  setFilterFieldValues,
}: {
  field: string;
  filterFieldValues: FilterFieldValues;
  id: string;
  label: string;
  setFilterFieldValues: (filterFieldValues: FilterFieldValues) => void;
}) {
  return (
    <div className={styles.filterInput}>
      <label htmlFor={id}>{label}:</label>
      <input
        id={id}
        onChange={(event) => {
          const value = event.target.value;
          const tempFilterValues = {...filterFieldValues};
          tempFilterValues[field] = value;

          setFilterFieldValues(tempFilterValues);
        }}
        type="text"
        value={filterFieldValues[field]}
      />
    </div>
  );
}
