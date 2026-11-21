import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import { getWriteFilterFieldOptions } from './filter-field-options/writeFilterFieldOptions';

setGlobalOptions({ maxInstances: 10 });

initializeApp();

export const db = getFirestore();

export {
  handleOrderWrites,
} from './handleOrderWrites';

export {
  recordTransactionToLedger,
} from './recordTransactionToLedger';

export {
  unreserveOrders,
} from './unreserveOrders';

export {
  writeInventorySummaries,
} from './writeInventorySummaries';

export const writeLedgerFilterFieldOptions = getWriteFilterFieldOptions(collections.ledger);
export const writeOrderFilterFieldOptions = getWriteFilterFieldOptions(collections.orders);
export const writeProductFilterFieldOptions = getWriteFilterFieldOptions(collections.products);
export const writePurchaseFilterFieldOptions = getWriteFilterFieldOptions(collections.purchases);
export const writeSaleFilterFieldOptions = getWriteFilterFieldOptions(collections.sales);
export const writeSupplierFilterFieldOptions = getWriteFilterFieldOptions(collections.suppliers);

