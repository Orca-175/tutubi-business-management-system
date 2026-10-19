import type { LedgerEntryData } from 'shared/interfaces/firestore-collections';

import classNames from 'classnames';
import { and, collection, doc, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { useContext, useEffect, useRef, useState } from 'react';
import {  BiChevronRight, BiPlus } from 'react-icons/bi';

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
import { ModalLedgerForm } from './ModalLedgerForm';


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

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const orderByEntryType = orderByString === 'createdAt' ? (
      orderBy('entryType', orderByDirection)
    ) : (
      null
    );

    async function getInitialLedgerEntries() {
      const docs = (await getDocs(query(
        collection(db, ledger)
          .withConverter(ledgerConverter),
        limit(itemsPerPage + 1),
        orderBy(orderByString, orderByDirection),
        orderByEntryType,
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
      if (!document.exists()) {
        return;
      }

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
        orderByEntryType,
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
      {/* Filters */}
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
                  options={filterFieldOptions.transactionType}
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

      {/* Main content */}
      <div className={common.card}>
        {isLoading ? (
          'Loading...'
        ) : ledgerData.length === 0 ? (
          'Data not found.'
        ) : (
          <>
            <div className={common.newButtonContainer}>
              <button
                className={common.newButton}
                onClick={() => dialogRef.current.showModal()}
              >
                <BiPlus /> New
              </button>
            </div>
            <div className={common.tableContainer}>
              <LedgerTable
                ledgerData={ledgerData}
              />
            </div>
          </>
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

      <ModalLedgerForm
        ledgerFormRef={dialogRef}
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
          <th>Transaction no.</th>
          <th>Created at</th>
          <th>Account</th>
          <th>Debit</th>
          <th>Credit</th>
          <th>Type</th>
          <th className={common.tableButtonHeading}>More</th>
        </tr>
      </thead>
      <tbody>
        {ledgerData.map((ledgerEntry, index) => {
          const even = index % 2 === 0;
          const debit = ledgerEntry.debit === 0 ? '' : ledgerEntry.debit;
          const credit = ledgerEntry.credit === 0 ? '' : ledgerEntry.credit;

          return (
            <tr key={ledgerEntry.docId}>
              <td>{even && ledgerEntry.transactionId}</td>
              <td>{ledgerEntry.createdAt}</td>
              <td>{ledgerEntry.account}</td>
              <td>{debit}</td>
              <td>{credit}</td>
              <td>{ledgerEntry.transactionType}</td>
              <td className={common.tableButtonCell}>
                <button
                  className={classNames(!even && common.tableButtonHidden)}
                  onClick={() => {
                    // Change tab
                    setTab(`${ledgerEntry.transactionType}s`);
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

