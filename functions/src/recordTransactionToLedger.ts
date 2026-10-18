import { HttpsError, onCall } from "firebase-functions/https";
import { db } from ".";
import { Purchase, Sale, LedgerEntry } from "shared/interfaces/firestore-collections";

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

  const countRef = db.collection('counts').doc('transactions');

  const saleOrPurchase: Purchase | Sale = (purchase ? purchase : sale)!;


  await db.runTransaction(async (transaction) => {
    const countSnap = await transaction.get(countRef);
    const count = countSnap.exists ? countSnap.data()!.count : 1;

    transaction.create(saleOrPurchaseRef, { ...saleOrPurchase, createdAt: new Date().toISOString(),transactionId: count});

    const debitEntry: LedgerEntry = {
        account: debit.account,
        collection: collection,
        createdAt: new Date().toISOString(),
        credit: 0,
        debit: debit.value,
        entryType: 0,
        referenceId: saleOrPurchaseRef.id,
        transactionId: count,
        transactionType: collection === 'purchases' ? 'Purchase' : 'Sale',
    };

    const creditEntry: LedgerEntry = {
      account: credit.account,
      collection: collection,
      createdAt: new Date().toISOString(),
      credit: credit.value,
      debit: 0,
      entryType: 1,
      referenceId: saleOrPurchaseRef.id,
      transactionId: count,
      transactionType: collection === 'purchases' ? 'Purchase' : 'Sale',
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

