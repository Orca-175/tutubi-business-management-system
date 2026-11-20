import { onCall } from 'firebase-functions/https';
import { Purchase, Sale } from 'shared/interfaces/firestore-collections';

import { recordTransaction } from './helpers/recordTransaction';

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
//
// A callable wrapper for recordTransaction()
export const recordTransactionToLedger = onCall<Arguments>(async request => {
  recordTransaction(request.data);
});

