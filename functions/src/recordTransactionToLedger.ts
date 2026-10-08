import { HttpsError, onCall } from "firebase-functions/https";
import { db } from ".";
import { Purchase } from "./shared/interfaces/firestore-collections/Purchase";
import { Sale } from "./shared/interfaces/firestore-collections/Sale";
import { LedgerEntry } from "./shared/interfaces/firestore-collections/LedgerEntry";

interface Arguments {
  credit: {
    account: string;
    value?: number;
  },
  debit: {
    account: string;
    value?: number;
  },
  purchase?: Purchase;
  sale?: Sale;
}

// Add sale/purchase details of a transaction to their respective collections
// and then record the transaction into the ledger
export const recordTransactionToLedger = onCall<Arguments>(async request => {
  const {
    credit,
    debit,
    purchase,
    sale,
  } = request.data;

  if (!purchase && !sale) {
    throw new HttpsError(
      'invalid-argument',
      'Either purchase or sale must exist.',
    );
  }

  const [collection, referenceId] = purchase ? (
    [
      'purchases',
      (await db
        .collection('purchases')
        .add(purchase)).id,
    ]
  ) : (
    [
      'sales',
      (await db
      .collection('sales')
      .add(sale!)).id,
    ]
  );

  const debitEntry: LedgerEntry = {
    account: debit.account,
    collection: collection,
    createdAt: new Date().toISOString(),
    debit: debit.value,
    referenceId: referenceId,
  };

  await db
    .collection('ledger')
    .add({
      ...debitEntry,
    });

  const creditEntry: LedgerEntry = {
    account: credit.account,
    collection: collection,
    createdAt: new Date().toISOString(),
    credit: credit.value,
    referenceId: referenceId,
  };

  await db
    .collection('ledger')
    .add({
      ...creditEntry,
    });
});

