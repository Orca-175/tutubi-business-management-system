import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import type { LedgerEntryData } from '../../interfaces/firestore-collections/LedgerEntry';

import { ledgerConverter } from '../../firebase/converters/collectionConverters';
import { db } from '../../firebase/firebase';
import common from '../../styles/common-styles/AdminCommon.module.scss';

export function Ledger() {
  const [ledgerData, setLedgerData] = useState<LedgerEntryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 20;

  useEffect(() => {
    async function getInitialLedgerEntries() {
      const ledgerDocSnaps = (await getDocs(query(
        collection(db, 'ledger')
          .withConverter(ledgerConverter),
        limit(itemsPerPage),
        orderBy('createdAt'),
      ))).docs;
      const ledgerData = ledgerDocSnaps.map((doc) => ({ docId: doc.id, ...doc.data() }));

      setLedgerData(ledgerData);
      setIsLoading(false);
    }

    getInitialLedgerEntries();
  }, []);

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
          <th>Total</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Paid</th>
          <th>Paid At</th>
          <th>Head</th>
          <th>Menudencia</th>
        </tr>
      </thead>
      <tbody>
        {ledgerData.map((ledgerEntry) => {
          const totalPrice = ledgerEntry.price * ledgerEntry.quantity;
          const paidAt = ledgerEntry.paidAt === '' ? 'N/A' : ledgerEntry.paidAt;

          return (
            <tr key={ledgerEntry.docId}>
              <td>{totalPrice}</td>
              <td>P {ledgerEntry.price}</td>
              <td>{ledgerEntry.quantity}</td>
              <td>{String(ledgerEntry.paid)}</td>
              <td>{paidAt}</td>
              <td>{String(ledgerEntry.head)}</td>
              <td>{String(ledgerEntry.menudencia)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
