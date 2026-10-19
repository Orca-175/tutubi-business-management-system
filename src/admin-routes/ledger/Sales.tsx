import type { SaleData } from 'shared/interfaces/firestore-collections';

import classNames from 'classnames';
import { and, collection, doc, getDoc, getDocs, limit, orderBy, query, startAt } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';

import { ApplyFiltersButton } from '../../components/FilterInputs/ApplyFiltersButton';
import { FilterSelectInput, FilterTextInput } from '../../components/FilterInputs/FilterInputs';
import { FilterDateRangeInput, FilterNumberRangeInput } from '../../components/FilterInputs/FilterRangeInputs';
import { PaginationButtons } from '../../components/PaginationButtons/PaginationButtons';
import { sales } from '../../constants/firebaseCollectionStrings';
import { saleConverter } from '../../firebase/converters/collectionConverters';
import { db } from '../../firebase/firebase';
import { useFilters } from '../../hooks/useFilters';
import { usePagination } from '../../hooks/usePagination';
import { useRangeFilters } from '../../hooks/useRangeFilters';
import common from '../../styles/common-styles/AdminCommon.module.scss';
import { LedgerTabContext } from './LedgerTabContext';

export function Sales() {
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderByString, setOrderByString] = useState('createdAt');
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>('desc');

  const itemsPerPage = 20;

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
  } = usePagination(setSalesData, sales, saleConverter, itemsPerPage);

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

  const { setTabCursor, tabCursor } = useContext(LedgerTabContext);

  useEffect(() => {
    async function getInitialSalesData() {
      const docs = (await getDocs(query(
        collection(db, sales)
          .withConverter(saleConverter),
        limit(itemsPerPage + 1),
        orderBy(orderByString, orderByDirection),
      ))).docs;
      const nextPageExists = docs.length > itemsPerPage;

      if (nextPageExists) {
        docs.pop();
      }

      const data = docs.map(doc => {
        return { docId: doc.id, ...doc.data() };
      });

      initPagination(docs[0], docs.at(-1)!, nextPageExists);
      setSalesData(data);
      setIsLoading(false);
    }

    async function getSalesDataAtTabCursor() {
      const startAtCursor = await getDoc(doc(db, sales, tabCursor));

      const docs = (await getDocs(query(
        collection(db, sales)
          .withConverter(saleConverter),
        limit(itemsPerPage + 1),
        orderBy(orderByString, orderByDirection),
        startAt(startAtCursor),
      ))).docs;
      const nextPageExists = docs.length > itemsPerPage;

      if (nextPageExists) {
        docs.pop();
      }

      const data = docs.map(doc => {
        return { docId: doc.id, ...doc.data() };
      });

      console.log('getSalesDataAtTabCursor: ', data);

      initPagination(docs[0], docs.at(-1)!, nextPageExists);
      setSalesData(data);
      setIsLoading(false);
    }

    async function getFilterFieldOptions() {
      const document = await getDoc(doc(db, 'filterFieldOptions', 'sales'));
      if (!document.exists()) {
        return;
      }

      const data = document.data();

      setFilterFieldOptions(data);
    }

    async function refreshSalesData() {
      const docs = (await getDocs(query(
        collection(db, sales)
          .withConverter(saleConverter),
        and(
          ...queryConstraints,
          ...rangeQueryConstraints,
        ),
        limit(itemsPerPage + 1),
        orderBy(orderByString, orderByDirection),
      ))).docs;
      const nextPageExists = docs.length > itemsPerPage;

      if (nextPageExists) {
        docs.pop();
      }

      const data = docs.map(doc => ({ docId: doc.id, ...doc.data() }));

      initPagination(docs[0], docs.at(-1)!, nextPageExists);
      setSalesData(data);
    }

    if (isLoading) {
      if (tabCursor !== '') {
        getSalesDataAtTabCursor();
      } else {
        getInitialSalesData();
      }
      getFilterFieldOptions();
    } else if (tabCursor === '') {
      refreshSalesData();
    }
  }, [
    initPagination,
    isLoading,
    orderByDirection,
    orderByString,
    queryConstraints,
    rangeQueryConstraints,
    tabCursor,
    setFilterFieldOptions,
  ]);

  return (
    <>
      {Object.keys(filterFieldOptions).length > 0 &&
        <div className={common.filters}>
          <div className={common.filterInputs}>
            <div className={common.normalInputs}>
              <FilterTextInput
                field="customer"
                filterFieldValues={filterFieldValues}
                id="customer"
                label="Customer"
                setFilterFieldValues={setFilterFieldValues}
              />
              <FilterSelectInput
                field="product"
                filterFieldValues={filterFieldValues}
                id="product"
                label="Product"
                options={filterFieldOptions.product}
                setFilterFieldValues={setFilterFieldValues}
              />
            </div>

            <div className={common.rangeInputs}>
              <FilterDateRangeInput
                field="createdAt"
                filterRangeFieldValues={filterRangeFieldValues}
                id="createdAt"
                label="Created at"
                setFilterRangeFieldValues={setFilterRangeFieldValues}
              />
              <FilterNumberRangeInput
                field="price"
                filterRangeFieldValues={filterRangeFieldValues}
                id="price"
                label="Price"
                setFilterRangeFieldValues={setFilterRangeFieldValues}
              />
              <FilterNumberRangeInput
                field="quantity"
                filterRangeFieldValues={filterRangeFieldValues}
                id="quantity"
                label="Quantity"
                setFilterRangeFieldValues={setFilterRangeFieldValues}
              />
              <FilterNumberRangeInput
                field="total"
                filterRangeFieldValues={filterRangeFieldValues}
                id="total"
                label="Total"
                setFilterRangeFieldValues={setFilterRangeFieldValues}
              />
            </div>
          </div>

          <div className={common.filterButtonContainer}>
            <ApplyFiltersButton
              onClick={() => {
                applyFilters();
                applyRangeFilters();
                setTabCursor('');
              }}
            />
          </div>
        </div>
      }

      <div className={common.card}>
        <div className={common.tableContainer}>
          {isLoading ? (
            'Loading...'
          ) : salesData.length === 0 ? (
            'Data not found.'
          ) : (
            <SalesTable
              salesData={salesData}
              tabCursor={tabCursor}
            />
          )}
        </div>
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

function SalesTable({ salesData, tabCursor }: {
  salesData: SaleData[];
  tabCursor: string;
}) {
  return (
    <table className={common.tableAdmin}>
      <thead>
        <tr>
          <th>Transaction</th>
          <th>Created at</th>
          <th>Customer</th>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {salesData.map(saleData => {
          return (
            <tr
              className={
                classNames(saleData.docId === tabCursor  && common.highlightRow)
              }
              key={saleData.docId}
            >
              <td>{saleData.transactionId}</td>
              <td>{saleData.createdAt}</td>
              <td>{saleData.customer}</td>
              <td>{saleData.product}</td>
              <td>{saleData.price}</td>
              <td>{saleData.quantity}</td>
              <td>{saleData.total}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

