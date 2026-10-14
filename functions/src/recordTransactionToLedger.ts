import { HttpsError, onCall } from "firebase-functions/https";
import { db } from ".";
import { Purchase } from "./shared/interfaces/firestore-collections/Purchase";
import { Sale } from "./shared/interfaces/firestore-collections/Sale";
import { LedgerEntry } from "./shared/interfaces/firestore-collections/LedgerEntry";

// A single call to recordTransactionToLedger will create two ledger entries, for
// debit and credit
interface Arguments {
  credit: {
    account: string;
    value: number;
  },
  debit: {
    account: string;
    value: number;
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

  const collection = purchase ? 'purchases' : 'sales'

  const debitRef = db.collection('ledger').doc();
  const creditRef = db.collection('ledger').doc();

  const saleOrPurchaseRef = db.collection(collection).doc();
  const saleOrPurchase: Purchase | Sale = (purchase ? purchase : sale)!;

  const countRef = db.collection('counts').doc('transactions');

  await db.runTransaction(async (transaction) => {
    const countSnap = await transaction.get(countRef);
    const count = countSnap.exists ? countSnap.data()!.count : 1;

    transaction.create(saleOrPurchaseRef, { ...saleOrPurchase, transactionId: count});

    const debitEntry: LedgerEntry = {
      account: debit.account,
      collection: collection,
      createdAt: new Date().toISOString(),
      debit: debit.value,
      credit: 0,
      referenceId: saleOrPurchaseRef.id,
      transactionId: count,
      type: collection === 'purchases' ? 'Purchase' : 'Sale',
    };

    const creditEntry: LedgerEntry = {
      account: credit.account,
      collection: collection,
      createdAt: new Date().toISOString(),
      debit: 0,
      credit: credit.value,
      referenceId: saleOrPurchaseRef.id,
      transactionId: count,
      type: collection === 'purchases' ? 'Purchase' : 'Sale',
    };

    transaction.create(debitRef, {
      ...debitEntry,
    });

    transaction.create(creditRef, {
      ...creditEntry,
    });

    if (count === 1) {
      transaction.create(countRef, { count: 1 });
    }
    transaction.update(countRef, { count: count + 1 })
  });
});

