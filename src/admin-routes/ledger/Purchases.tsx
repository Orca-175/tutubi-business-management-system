
import type { PurchaseData } from 'shared/interfaces/firestore-collections';

import classNames from 'classnames';
import { and, collection, doc, getDoc, getDocs, limit, orderBy, query, startAt } from 'firebase/firestore';
import { Fragment, useContext, useEffect, useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

import { ApplyFiltersButton } from '../../components/FilterInputs/ApplyFiltersButton';
import { FilterSelectInput } from '../../components/FilterInputs/FilterInputs';
import { FilterDateRangeInput, FilterNumberRangeInput } from '../../components/FilterInputs/FilterRangeInputs';
import { PaginationButtons } from '../../components/PaginationButtons/PaginationButtons';
import { purchases } from '../../constants/firebaseCollectionStrings';
import { purchaseConverter } from '../../firebase/converters/collectionConverters';
import { db } from '../../firebase/firebase';
import { useFilters } from '../../hooks/useFilters';
import { usePagination } from '../../hooks/usePagination';
import { useRangeFilters } from '../../hooks/useRangeFilters';
import common from '../../styles/common-styles/AdminCommon.module.scss';
import { capitalize } from '../../utils/strings';
import { LedgerTabContext } from './LedgerTabContext';

export function Purchases() {
  const [purchasesData, setPurchaseData] = useState<PurchaseData[]>([]);
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
  } = usePagination(setPurchaseData, purchases, purchaseConverter, itemsPerPage);

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

  const { tabCursor } = useContext(LedgerTabContext);

  useEffect(() => {
    async function getInitialPurchaseData() {
      const docs = (await getDocs(query(
        collection(db, purchases)
          .withConverter(purchaseConverter),
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
      setPurchaseData(data);
      setIsLoading(false);
    }

    async function getPurchaseDataAtTabCursor() {
      const startAtCursor = await getDoc(doc(db, purchases, tabCursor));

      const docs = (await getDocs(query(
        collection(db, purchases)
          .withConverter(purchaseConverter),
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

      initPagination(docs[0], docs.at(-1)!, nextPageExists);
      setPurchaseData(data);
      setIsLoading(false);
    }

    async function getFilterFieldOptions() {
      const document = await getDoc(doc(db, 'filterFieldOptions', 'purchases'));
      const data = document.data();

      setFilterFieldOptions(data);
    }

    async function refreshPurchaseData() {
      const docs = (await getDocs(query(
        collection(db, purchases)
          .withConverter(purchaseConverter),
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
      setPurchaseData(data);
    }

    if (isLoading) {
      if (tabCursor !== '') {
        getPurchaseDataAtTabCursor();
      } else {
        getInitialPurchaseData();
      }
      getFilterFieldOptions();
    } else if (tabCursor === '') {
      refreshPurchaseData();
    }
  }, [
    initPagination,
    isLoading,
    orderByDirection,
    orderByString,
    queryConstraints,
    rangeQueryConstraints,
    setFilterFieldOptions,
    tabCursor,
  ]);

  return (
    <>
      {Object.keys(filterFieldOptions).length > 0 &&
        <>
          <div className={common.filters}>
            <div className={common.filterInputs}>
              <div className={common.normalInputs}>
                <FilterSelectInput
                  field="source"
                  filterFieldValues={filterFieldValues}
                  id="source"
                  label="Source"
                  options={filterFieldOptions.source}
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
                }}
              />
            </div>
          </div>
        </>
      }

      <div className={common.card}>
        <div className={common.tableContainer}>
          {isLoading ? (
            'Loading...'
          ) : purchasesData.length === 0 ? (
            'Data not found.'
          ) : (
            <PurchasesTable
              highlightFirstRow={tabCursor !== ''}
              purchasesData={purchasesData}
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

function PurchasesTable({ highlightFirstRow, purchasesData }: {
  highlightFirstRow: boolean;
  purchasesData: PurchaseData[];
}) {
  const [expanded, setExpanded] = useState<string[]>([]);

  return (
    <table className={common.tableAdmin}>
      <thead>
        <tr>
          <th>Transaction</th>
          <th>Created at</th>
          <th>Source</th>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th className={common.tableButtonHeading}>More</th>
        </tr>
      </thead>
      <tbody>
        {purchasesData.map((purchaseData, index) => {
          const purchaseInfo = purchaseData.purchaseInfo;

          return (
            <Fragment key={purchaseData.docId}>
              <tr
                className={classNames((index === 0 && highlightFirstRow) && common.highlightRow)}
                key={purchaseData.docId}
              >
                <td>{purchaseData.transactionId}</td>
                <td>{purchaseData.createdAt}</td>
                <td>{purchaseData.source}</td>
                <td>{purchaseData.product}</td>
                <td>{purchaseData.price}</td>
                <td>{purchaseData.quantity}</td>
                <td>{purchaseData.total}</td>
                {purchaseInfo && 
                  <td className={common.tableButtonCell}>
                    <button
                      onClick={() => {
                        if (expanded.includes(purchaseData.docId)) {
                          setExpanded(expanded.toSpliced(expanded.findIndex(id => id === purchaseData.docId), 1));
                        } else {
                          const tempExpanded = [...expanded];
                          tempExpanded.push(purchaseData.docId);
                          setExpanded(tempExpanded);
                        }
                      }}
                    >
                      {expanded.includes(purchaseData.docId) ? (
                        <BiChevronUp />
                      ) : (
                        <BiChevronDown />
                      )}
                    </button>
                  </td>
                }
              </tr>

              {purchaseInfo && expanded.includes(purchaseData.docId) &&
                <tr>
                  <td colSpan={7}>
                    <div className={common.subtableContainer}>
                      <table>
                        <thead>
                          <tr>
                            {Object.keys(purchaseInfo).map(key => {
                              const finalKey = key == 'withHead' ? (
                                'Head'
                              ) : key === 'withMenudencia' ? (
                                'Menudencia'
                              ) : (
                                key
                              );

                              return <th>{capitalize(finalKey)}</th>;
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {Object.values(purchaseInfo).map(value => (
                              <td>{capitalize(String(value))}</td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              }
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

