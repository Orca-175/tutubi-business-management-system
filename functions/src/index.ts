import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions';

setGlobalOptions({maxInstances: 10});

initializeApp();

export const db = getFirestore();

export {
  addLedgerFilterFieldOptions,
} from './addToFilterFieldOptions';

export {
  recordTransactionToLedger
} from './recordTransactionToLedger';

