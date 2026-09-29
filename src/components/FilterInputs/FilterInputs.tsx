export function FilterSelectInput({ field, filterValues, id, label, options, setFilterValues }: {
  field: string;
  filterValues: { [field: string]: string };
  id: string;
  label: string;
  options: { [field: string]: string };
  setFilterValues: (filterValues: { [field: string]: string }) => void;
}) {
  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <select
        id={id}
        onChange={(event) => {
          const value = event.target.value;
          const tempFilterValues = { ...filterValues };
          tempFilterValues[field] = value;

          setFilterValues(tempFilterValues);
        }}
        value={filterValues[field] || ''}
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

export function FilterTextInput({ field, filterValues, id, label, setFilterValues }: {
  field: string;
  filterValues: { [field: string]: string };
  id: string;
  label: string;
  setFilterValues: (filterValues: { [field: string]: string }) => void;
}) {
  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <input
        id={id}
        onChange={(event) => {
          const value = event.target.value;
          const tempFilterValues = {...filterValues};
          tempFilterValues[field] = value;

          setFilterValues(tempFilterValues);
        }}
        type="text"
        value={filterValues[field]}
      />
    </div>
  );
}
