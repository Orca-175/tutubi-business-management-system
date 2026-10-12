import { BiSolidFilterAlt } from 'react-icons/bi';

import styles from './ApplyFiltersButton.module.scss';

export function ApplyFiltersButton({
  applyFilters,
  applyRangeFilters,
}: {
    applyFilters: () => void;
    applyRangeFilters: () => void;
}) {
  return (
    <button
      className={styles.applyFiltersButton}
      onClick={() => {
        applyFilters();
        applyRangeFilters();
      }}
    >
      <BiSolidFilterAlt />
      Apply Filters
    </button>
  );
}

