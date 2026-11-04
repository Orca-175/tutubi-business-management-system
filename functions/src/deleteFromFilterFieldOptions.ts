import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { onDocumentDeleted } from 'firebase-functions/firestore';
import { FilterFieldOptions } from 'shared/interfaces/firestore-collections';

import { db } from '.';

async function deleteFromFilterFieldOptions(collection: string, doc: QueryDocumentSnapshot) {
  const fieldOptionsDoc = await db
    .collection('filterFieldOptions')
    .doc(collection)
    .get();

  const fieldOptionsData: FilterFieldOptions = fieldOptionsDoc.data()!;
  const docData = doc.data();

  // Flatten deleted data
  const flattenData = (obj: { [field: string]: boolean | number | string }) => {
    const flattened: typeof obj = {};

    for (const key in obj) {
      const value = obj[key];

      if (typeof value === 'object') {
        Object.assign(flattened, flattenData(value));
      } else {
        flattened[key] = value;
      }
    }

    return flattened;
  };

  // Delete values of fields in deleted data from filterFieldOptions document
  for (const [key, value] of Object.entries(flattenData(docData))) {
    if (!fieldOptionsData[key]) {
      continue;
    }

    for (const element of fieldOptionsData[key]) {
      if (value === element) {
        const indexOfIdenticalElement = fieldOptionsData[key].findIndex(element => element === value);

        fieldOptionsData[key].splice(indexOfIdenticalElement, 1);
      }
    }
  }

  await db
    .collection('filterFieldOptions')
    .doc(collection)
    .set(fieldOptionsData);
}






export const deleteLedgerFilterFieldOptions = onDocumentDeleted('ledger/{ledgerEntryId}', async event => {
  const doc = event.data;

  await deleteFromFilterFieldOptions('ledger', doc!);
});

export const deleteProductFilterFieldOptions = onDocumentDeleted('products/{productId}', async event => {
  const doc = event.data;

  await deleteFromFilterFieldOptions('products', doc!);
});

export const deletePurchaseFilterFieldOptions = onDocumentDeleted('purchases/{purchaseId}', async event => {
  const doc = event.data;

  await deleteFromFilterFieldOptions('purchases', doc!);
});

export const deleteSaleFilterFieldOptions = onDocumentDeleted('sales/{saleId}', async event => {
  const doc = event.data;

  await deleteFromFilterFieldOptions('sales', doc!);
});

export const deleteSupplierFilterFieldOptions = onDocumentDeleted('suppliers/{supplierId}', async event => {
  const doc = event.data;

  await deleteFromFilterFieldOptions('suppliers', doc!);
});
