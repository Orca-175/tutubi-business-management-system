import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import type { LedgerEntryData } from '../../interfaces/firestore-collections/LedgerEntry';

import { PaginationButtons } from '../../components/PaginationButtons/PaginationButtons';
import { ledger } from '../../constants/firebaseCollectionStrings';
import { ledgerConverter } from '../../firebase/converters/collectionConverters';
import { db } from '../../firebase/firebase';
import { usePagination } from '../../hooks/usePagination';
import common from '../../styles/common-styles/AdminCommon.module.scss';

export function Ledger() {
  const [ledgerData, setLedgerData] = useState<LedgerEntryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderByString, setOrderByString] = useState('createdAt');
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>('asc');

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

  useEffect(() => {
    async function getInitialLedgerEntries() {
      const ledgerDocSnaps = (await getDocs(query(
        collection(db, ledger)
          .withConverter(ledgerConverter),
        limit(itemsPerPage + 1),
        orderBy(orderByString, orderByDirection),
      ))).docs;
      const nextPageExists = ledgerDocSnaps.length > itemsPerPage;

      if (nextPageExists) {
        ledgerDocSnaps.pop();
      }

      const ledgerData = await Promise.all(
        ledgerDocSnaps.map(async document => ({ docId: document.id, ...document.data() })),
      );

      initPagination(ledgerDocSnaps[0], ledgerDocSnaps.at(-1)!, nextPageExists);
      setLedgerData(ledgerData);
      setIsLoading(false);
    }

    if (isLoading) {
      getInitialLedgerEntries();
    }
  }, [initPagination, isLoading, orderByDirection, orderByString]);

  return (
    <div className={common.root}>
      <h2>View Ledger</h2>
      <hr />
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
    </div>
  );
}

function LedgerTable({ ledgerData }: {
  ledgerData: LedgerEntryData[];
}) {
  return (
    <table className={common.tableAdmin}>
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
          <th>Paid</th>
          <th>Paid At</th>
          <th>Head</th>
          <th>Menudencia</th>
          <th>Supplier</th>
        </tr>
      </thead>
      <tbody>
        {ledgerData.map((ledgerEntry) => {
          const totalPrice = ledgerEntry.price * ledgerEntry.quantity;
          const paidAt = ledgerEntry.paidAt === '' ? 'N/A' : ledgerEntry.paidAt;

          return (
            <tr key={ledgerEntry.docId}>
              <td>{ledgerEntry.productName}</td>
              <td>{ledgerEntry.quantity}kg</td>
              <td>P{ledgerEntry.price}</td>
              <td>P{totalPrice}</td>
              <td>{String(ledgerEntry.paid)}</td>
              <td>{paidAt}</td>
              <td>{String(ledgerEntry.head)}</td>
              <td>{String(ledgerEntry.menudencia)}</td>
              <td>{ledgerEntry.supplierName}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
