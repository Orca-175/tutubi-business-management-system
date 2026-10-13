import { and, collection, doc, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import {  BiChevronRight } from 'react-icons/bi';

import type { LedgerEntryData } from '../../interfaces/firestore-collections/LedgerEntry';

import { ApplyFiltersButton } from '../../components/FilterInputs/ApplyFiltersButton';
import { FilterSelectInput } from '../../components/FilterInputs/FilterInputs';
import { FilterDateRangeInput, FilterNumberRangeInput } from '../../components/FilterInputs/FilterRangeInputs';
import { PaginationButtons } from '../../components/PaginationButtons/PaginationButtons';
import { ledger } from '../../constants/firebaseCollectionStrings';
import { ledgerConverter } from '../../firebase/converters/collectionConverters';
import { db } from '../../firebase/firebase';
import { useFilters } from '../../hooks/useFilters';
import { usePagination } from '../../hooks/usePagination';
import { useRangeFilters } from '../../hooks/useRangeFilters';
import common from '../../styles/common-styles/AdminCommon.module.scss';
import { LedgerTabContext } from './LedgerTabContext';


export function GeneralLedger() {
  const [ledgerData, setLedgerData] = useState<LedgerEntryData[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Loading on initial render
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
  } = usePagination(setLedgerData, ledger, ledgerConverter, itemsPerPage);

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
    async function getInitialLedgerEntries() {
      const docs = (await getDocs(query(
        collection(db, ledger)
          .withConverter(ledgerConverter),
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
      setLedgerData(data);
      setIsLoading(false);
    }

    async function getFilterFieldOptions() {
      const document = await getDoc(doc(db, 'filterFieldOptions', 'ledger'));
      const data = document.data();

      setFilterFieldOptions(data);
    }

    async function refreshLedgerEntries() {
      const docs = (await getDocs(query(
        collection(db, ledger)
          .withConverter(ledgerConverter),
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
      setLedgerData(data);
    }

    if (isLoading) {
      getInitialLedgerEntries();
      getFilterFieldOptions();
    } else {
      refreshLedgerEntries();
    }
  }, [
      filterFieldOptions,
      initPagination,
      isLoading,
      orderByDirection,
      orderByString,
      queryConstraints,
      setFilterFieldOptions,
      rangeQueryConstraints,
  ]);
 
  return (
    <>
      <div className={common.filters}>
        <div className={common.filterInputs}>
          <div className={common.normalInputs}>
            {Object.keys(filterFieldOptions).length > 0 && (
              <>
                <FilterSelectInput
                  field="account"
                  filterFieldValues={filterFieldValues}
                  id="account"
                  label="Account"
                  options={filterFieldOptions.account}
                  setFilterFieldValues={setFilterFieldValues}
                />
                <FilterSelectInput
                  field="type"
                  filterFieldValues={filterFieldValues}
                  id="type"
                  label="Type"
                  options={filterFieldOptions.type}
                  setFilterFieldValues={setFilterFieldValues}
                />
              </>
            )}
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
              field="debit"
              filterRangeFieldValues={filterRangeFieldValues}
              id="debit"
              label="Debit or Credit"
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

      <div className={common.card}>
        <div className={common.tableContainer}>
          {isLoading ? (
            'Loading...'
          ) : ledgerData.length === 0 ? (
            'Data not found.'
          ) : (
            <LedgerTable
              ledgerData={ledgerData}
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

function LedgerTable({ ledgerData }: {
  ledgerData: LedgerEntryData[];
}) {
  const { setTab, setTabCursor } = useContext(LedgerTabContext);

  return (
    <table className={common.tableAdmin}>
      <thead>
        <tr>
          <th>Created at</th>
          <th>Account</th>
          <th>Debit</th>
          <th>Credit</th>
          <th>Type</th>
          <th className={common.tableButtonHeading}>More</th>
        </tr>
      </thead>
      <tbody>
        {ledgerData.map((ledgerEntry) => {
          return (
            <tr key={ledgerEntry.docId}>
              <td>{ledgerEntry.createdAt}</td>
              <td>{ledgerEntry.account}</td>
              <td>{ledgerEntry.debit}</td>
              <td>{ledgerEntry.credit}</td>
              <td>{ledgerEntry.type}</td>
              <td className={common.tableButtonCell}>
                <button
                  onClick={() => {
                    // Change tab
                    setTab(`${ledgerEntry.type}s`);
                    // Pass referenceId to next tab to show on that page
                    setTabCursor(ledgerEntry.referenceId);
                  }}
                >
                  <BiChevronRight />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

