import type { FilterFieldValues } from '../../interfaces/FilterFieldValues';

export function FilterSelectInput({ field, filterFieldValues, id, label, options, setFilterFieldValues }: {
  field: string;
  filterFieldValues: FilterFieldValues;
  id: string;
  label: string;
  options: FilterFieldValues;
  setFilterFieldValues: (filterFieldValues: FilterFieldValues) => void;
}) {
  return (
    <div>
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
        {Object.entries(options).map(option => {
          const label = option[0];
          const value = option[1];

          return <option value={value}>{label}</option>;
        })}
      </select>
    </div>
  );
}

export function FilterTextInput({ field, filterFieldValues, id, label, setFilterFieldValues }: {
  field: string;
  filterFieldValues: FilterFieldValues;
  id: string;
  label: string;
  setFilterFieldValues: (filterFieldValues: FilterFieldValues) => void;
}) {
  return (
    <div>
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
