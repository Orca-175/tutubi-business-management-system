import { BiSolidFilterAlt } from 'react-icons/bi';

import styles from './ApplyFiltersButton.module.scss';

export function ApplyFiltersButton({
  onClick,
}: {
    onClick: () => void;
}) {
  return (
    <button
      className={styles.applyFiltersButton}
      onClick={() => onClick()}
    >
      <BiSolidFilterAlt />
      Apply Filters
    </button>
  );
}

