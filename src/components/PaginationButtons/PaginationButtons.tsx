import type { QueryDocumentSnapshot } from 'firebase/firestore';

import classNames from 'classnames';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

import styles from './PaginationButtons.module.scss';

type Direction = 'asc' | 'desc';

interface Props {
  currentStartDocId?: string,
  getFilteredPageStack: () => QueryDocumentSnapshot[],
  handleNextBtnClick: (orderByString: string, orderByDirection: Direction) => void;
  handlePageBtnClick: (orderByString: string, orderByDirection: Direction, pageNumber: number) => void;
  handlePrevBtnClick: (orderByString: string, orderByDirection: Direction) => void;
  nextPageExists: boolean;
  orderByDirection: Direction;
  orderByString: string;
  pageStack: QueryDocumentSnapshot[],
  prevPageExists: boolean;
}

// Should be used along with the usePagination hook
export function PaginationButtons({
  currentStartDocId,
  getFilteredPageStack,
  handleNextBtnClick,
  handlePageBtnClick,
  handlePrevBtnClick,
  nextPageExists,
  orderByDirection,
  orderByString,
  pageStack,
  prevPageExists,
}: Props) {
  return (
    <div className={styles.paginationButtons}>
      <div>
        {prevPageExists &&
          <button
            className={classNames(styles.paginationButton, styles.inactive)}
            onClick={() => handlePrevBtnClick(orderByString, orderByDirection)}
          >
            <BiChevronLeft />
          </button>
        }
      </div>

      <div className={styles.pageButtons}>
        {pageStack.map((doc, index) => {
          if (getFilteredPageStack().some(filteredDoc => doc?.id === filteredDoc?.id)) {
            return (
              <button
                className={classNames(
                  styles.paginationButton,
                  currentStartDocId === doc.id ||
                  pageStack.length === 0 ? styles.active : styles.inactive,
                )}
                key={`pageButton${doc.id}`}
                onClick={() => handlePageBtnClick(orderByString, orderByDirection, index + 1)}
              >
                {index + 1}
              </button>
            );
          }
        })}
      </div>

      <div>
        {nextPageExists &&
          <button
            className={classNames(styles.paginationButton, styles.inactive)}
            onClick={() => handleNextBtnClick(orderByString, orderByDirection)}
          >
            <BiChevronRight />
          </button>
        }
      </div>
    </div>
  );
}
