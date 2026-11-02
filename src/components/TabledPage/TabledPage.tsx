import type { FirestoreDataConverter } from 'firebase/firestore';

import { type Dispatch, type ReactElement, type SetStateAction, useEffect, useState } from 'react';

import type { FilterConfig } from '../../interfaces/FilterConfig';

import { getFilterFieldOptions } from '../../firebase/queries/getFilterFieldOptions';
import { getInitialData } from '../../firebase/queries/getInitialData';
import { refreshData } from '../../firebase/queries/refreshData';
import { useFilters } from '../../hooks/useFilters';
import { usePagination } from '../../hooks/usePagination';
import { useRangeFilters } from '../../hooks/useRangeFilters';
import adminCommon from '../../styles/common-styles/AdminCommon.module.scss';
import { ApplyFiltersButton } from '../FilterInputs/ApplyFiltersButton';
import { FilterSelectInput, FilterTextInput } from '../FilterInputs/FilterInputs';
import { FilterDateRangeInput, FilterNumberRangeInput } from '../FilterInputs/FilterRangeInputs';
import { PaginationButtons } from '../PaginationButtons/PaginationButtons';

interface Props<T> {
  children: ReactElement;
  collectionString: string,
  converter: FirestoreDataConverter<T>;
  data: (T & { docId: string })[];
  filterConfig: FilterConfig;
  itemsPerPage?: number;
  orderByDirection: 'asc' | 'desc';
  orderByString: string;
  setData: Dispatch<SetStateAction<(T & { docId: string })[]>>,
  // setOrderByDirection
  // setOrderByString
}

export function TabledPage<T>({
  children,
  collectionString,
  converter,
  data,
  filterConfig,
  itemsPerPage = 20,
  orderByDirection,
  orderByString,
  setData,
}: Props<T>) {
  const [isLoading, setIsLoading] = useState(true);

  const {
    currentStartDocId,
    getFilteredPageStack,
    handleNextBtnClick,
    handlePageBtnClick,
    handlePrevBtnClick,
    initPagination,
    nextPageExists,
    pageStack,
    prevPageExists,
  } = usePagination(setData, collectionString, converter, itemsPerPage);

  const {
    applyFilters,
    filterFieldOptions,
    filterFieldValues,
    queryConstraints,
    setFilterFieldOptions,
    setFilterFieldValues,
  } = useFilters();

  const {
    applyRangeFilters,
    filterRangeFieldValues,
    rangeQueryConstraints,
    setFilterRangeFieldValues,
  } = useRangeFilters();

  useEffect(() => {
    if (isLoading) {
      getInitialData<T>(
        collectionString,
        converter,
        itemsPerPage,
        orderByString,
        setData,
        setIsLoading,
        initPagination,
      );

      getFilterFieldOptions(collectionString, setFilterFieldOptions);
    } else {
      refreshData<T>(
        collectionString,
        converter,
        [...queryConstraints, ...rangeQueryConstraints],
        itemsPerPage,
        orderByString,
        setData,
        initPagination,
      );
    }
  }, [
    collectionString,
    converter,
    initPagination,
    isLoading,
    itemsPerPage,
    orderByString,
    queryConstraints,
    rangeQueryConstraints,
    setData,
    setFilterFieldOptions,
  ]);

  return (
    <>
      <div className={adminCommon.filters}>
        <div className={adminCommon.filterInputs}>
          <div className={adminCommon.normalInputs}>
            {filterConfig.normal.map(filter => {
              // When a field is a nested property in a Firestore map, get
              // the name of the deepest property
              const deepestField = filter.field.split('.').at(-1);

              if (filter.type === 'text') {
                return (
                  <FilterTextInput
                    field={filter.field}
                    filterFieldValues={filterFieldValues}
                    id={deepestField}
                    key={filter.field + filter.type}
                    label={filter.label}
                    setFilterFieldValues={setFilterFieldValues}
                  />
                );
              } else if (
                filter.type === 'select' &&
                Object.values(filterFieldOptions).length > 0
              ) {
                return (
                  <FilterSelectInput
                    field={filter.field}
                    filterFieldValues={filterFieldValues}
                    id={deepestField}
                    key={filter.field + filter.type}
                    label={filter.label}
                    options={filterFieldOptions[deepestField]}
                    setFilterFieldValues={setFilterFieldValues}
                  />
                );
              }
            })}
          </div>

          <div className={adminCommon.rangeInputs}>
            {filterConfig.ranged.map(filter => {
              if (filter.type === 'date') {
                return (
                  <FilterDateRangeInput
                    field={filter.field}
                    filterRangeFieldValues={filterRangeFieldValues}
                    id={filter.field}
                    key={filter.field + filter.type}
                    label={filter.label}
                    setFilterRangeFieldValues={setFilterRangeFieldValues}
                  />
                ); 
              } else if (filter.type === 'number') {
                return (
                  <FilterNumberRangeInput
                    field={filter.field}
                    filterRangeFieldValues={filterRangeFieldValues}
                    id={filter.field}
                    key={filter.field + filter.type}
                    label={filter.label}
                    setFilterRangeFieldValues={setFilterRangeFieldValues}
                  />
                );
              }
            })}
          </div>
        </div>

        <div className={adminCommon.filterButtonContainer}>
          <ApplyFiltersButton
            onClick={() => {
              applyFilters();
              applyRangeFilters();
            }}
          />
        </div>
      </div>

      <div className={adminCommon.card}>
        {isLoading ? (
          'Loading...'
        ) : data.length === 0 ? (
          'Data not found.'
        ) : (
          children
        )}
      </div>

      <PaginationButtons
        currentStartDocId={currentStartDocId}
        getFilteredPageStack={getFilteredPageStack}
        handleNextBtnClick={handleNextBtnClick}
        handlePageBtnClick={handlePageBtnClick}
        handlePrevBtnClick={handlePrevBtnClick}
        nextPageExists={nextPageExists}
        orderByDirection={orderByDirection}
        orderByString={orderByString}
        pageStack={pageStack}
        prevPageExists={prevPageExists}
      />
    </>
  );
}

