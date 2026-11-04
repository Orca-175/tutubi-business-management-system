import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { FilterFieldOptions } from "shared/interfaces/firestore-collections";
import { flattenData } from "./flattenData";
import { db } from ".";
import { onDocumentUpdated } from "firebase-functions/firestore";

async function editFilterFieldOptions(collection: string, beforeDoc: QueryDocumentSnapshot, afterDoc: QueryDocumentSnapshot) {
  const fieldOptionsDoc = await db
    .collection('filterFieldOptions')
    .doc(collection)
    .get();

  const fieldOptionsData: FilterFieldOptions = fieldOptionsDoc.data()!;
  const beforeData = beforeDoc.data();
  const afterData = afterDoc.data();

  // Flatten edited data
  const flattenedBeforeData = flattenData(beforeData);
  const flattenedAfterData = flattenData(afterData);

  // Find elements in fieldOptionsData that are identical to values of flattenedBeforeData
  // Then replace elements at those indexes of fieldOptionsData with values from flattenedAfterData
  for (const [key, value] of Object.entries(flattenedBeforeData)) {
    if (!fieldOptionsData[key]) {
      continue;
    }

    for (const element of fieldOptionsData[key]) {
      if (value === element) {
        const indexOfIdenticalElement = fieldOptionsData[key].findIndex(element => element === value);

        fieldOptionsData[key][indexOfIdenticalElement] = flattenedAfterData[key];
      }
    }
  }

  await db
    .collection('filterFieldOptions')
    .doc(collection)
    .set(fieldOptionsData);
}






export const editLedgerFilterFieldOptions = onDocumentUpdated('ledger/{ledgerEntryId}', async event => {
  const beforeDoc = event.data!.before;
  const afterDoc = event.data!.after;

  await editFilterFieldOptions('ledger', beforeDoc, afterDoc);
});

export const editProductsFilterFieldOptions = onDocumentUpdated('products/{productId}', async event => {
  const beforeDoc = event.data!.before;
  const afterDoc = event.data!.after;

  await editFilterFieldOptions('products', beforeDoc, afterDoc);
});

export const editPurchaseFilterFieldOptions = onDocumentUpdated('purchases/{purchaseId}', async event => {
  const beforeDoc = event.data!.before;
  const afterDoc = event.data!.after;

  await editFilterFieldOptions('purchases', beforeDoc, afterDoc);
});

export const editSaleFilterFieldOptions = onDocumentUpdated('sales/{saleId}', async event => {
  const beforeDoc = event.data!.before;
  const afterDoc = event.data!.after;

  await editFilterFieldOptions('sales', beforeDoc, afterDoc);
});

export const editSuppliersFilterFieldOptions = onDocumentUpdated('suppliers/{supplierId}', async event => {
  const beforeDoc = event.data!.before;
  const afterDoc = event.data!.after;

  await editFilterFieldOptions('suppliers', beforeDoc, afterDoc);
});

