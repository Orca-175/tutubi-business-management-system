import { HttpsError, onCall } from "firebase-functions/https";
import { db } from ".";
import { Purchase } from "./shared/interfaces/firestore-collections/Purchase";
import { Sale } from "./shared/interfaces/firestore-collections/Sale";

interface Arguments {
  credit: {
    account: string;
    value: number;
  },
  debit: {
    account: string;
    value: number;
  },
  referenceId: string;
  purchase?: Purchase;
  sale?: Sale;
}

// Add sale/purchase details of a transaction to their respective collections
// and then record the transaction into the ledger
export const recordLedgerEntries = onCall<Arguments>(async request => {
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
      (await db
        .collection('purchases')
        .add(purchase)).id,
      'purchases',
    ]
  ) : (
    [
      (await db
      .collection('purchases')
      .add(sale!)).id,
      'sales',
    ]
  );

  await db
    .collection('ledger')
    .add({
      account: debit.account,
      debit: debit.value,
      collection: collection,
      referenceId: referenceId,
    })

  await db
    .collection('ledger')
    .add({
      account: credit.account,
      debit: credit.value,
      collection: collection,
      referenceId: referenceId,
    })
});

