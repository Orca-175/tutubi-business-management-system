import type { QueryDocumentSnapshot } from 'firebase/firestore';

type Direction = 'asc' | 'desc';

interface Props {
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

export function PaginationButtons({
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
    <div>
      {prevPageExists &&
        <button
          onClick={() => handlePrevBtnClick(orderByString, orderByDirection)}
        >
          Previous
        </button>
      }

      {pageStack.map((doc, index) => {
        if (getFilteredPageStack().some(filteredDoc => doc?.id === filteredDoc?.id)) {
          return (
            <button
              onClick={() => handlePageBtnClick(orderByString, orderByDirection, index + 1)}
            >
              {index + 1}
            </button>
          );
        }
      })}

      {nextPageExists &&
        <button
          onClick={() => handleNextBtnClick(orderByString, orderByDirection)}
        >
          Next
        </button>
      }
    </div>
  );
}
