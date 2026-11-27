import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/https';
import { collections } from 'shared/interfaces/firestore-collection-strings';
import { LedgerEntry, Purchase, Sale } from 'shared/interfaces/firestore-collections';

const db = getFirestore();

interface TransactionInfo {
  credit: {
    account: string;
    value: number;
  },
  debit: {
    account: string;
    value: number;
  },
  purchase?: Purchase,
  sale?: Sale,
}

export async function recordTransaction(transactionInfo: TransactionInfo) {
  const {
    credit,
    debit,
    purchase,
    sale,
  } = transactionInfo;

  if (!purchase && !sale) {
    throw new HttpsError(
      'invalid-argument',
      'Either purchase or sale must exist.',
    );
  }

  const collection = purchase ? collections.purchases : collections.sales;

  const debitRef = db.collection('ledger').doc();
  const creditRef = db.collection('ledger').doc();

  const saleOrPurchaseRef = db.collection(collection).doc();

  const countRef = db.collection('counts').doc('transactions');

  const saleOrPurchase: Purchase | Sale = (purchase ? purchase : sale)!;


  await db.runTransaction(async (transaction) => {
    const countSnap = await transaction.get(countRef);
    const count = countSnap.exists ? countSnap.data()!.count : 1;

    transaction.create(saleOrPurchaseRef, { ...saleOrPurchase, createdAt: Timestamp.now(),transactionId: count});

    const debitEntry: LedgerEntry = {
        account: debit.account,
        collection: collection,
        createdAt: Timestamp.now(),
        credit: 0,
        debit: debit.value,
        entryType: 0,
        referenceId: saleOrPurchaseRef.id,
        transactionId: count,
        transactionType: collection === collections.purchases ? 'Purchase' : 'Sale',
    };

    const creditEntry: LedgerEntry = {
      account: credit.account,
      collection: collection,
      createdAt: Timestamp.now(),
      credit: credit.value,
      debit: 0,
      entryType: 1,
      referenceId: saleOrPurchaseRef.id,
      transactionId: count,
      transactionType: collection === collections.purchases ? 'Purchase' : 'Sale',
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
    transaction.update(countRef, { count: count + 1 });
  });
}

