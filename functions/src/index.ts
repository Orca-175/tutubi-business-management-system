import { initializeApp } from 'firebase-admin/app';
import { getFirestore, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions';
import { onDocumentCreated } from 'firebase-functions/firestore';

import { FilterFieldOptions } from './shared/firestore-collections/FilterFieldOptions';

setGlobalOptions({maxInstances: 10});

initializeApp();

const db = getFirestore();

export const addLedgerFilterFieldOptions = onDocumentCreated('ledger/{ledgerEntryId}', async event => {
  const doc = event.data;

  // Add current document's field values to ledger document of filterFieldOptions if they are not already there
  await addToFilterFieldOptions('ledger', doc);
});

async function addToFilterFieldOptions(collection: string, doc: QueryDocumentSnapshot | undefined) {
  if (doc) {
    // Getting specific collection document from filterFieldOptions collection
    const fieldOptionsDoc = await db
      .collection('filterFieldOptions')
      .doc(collection)
      .get();

    const fieldOptionsData: FilterFieldOptions = fieldOptionsDoc.exists ? (
      fieldOptionsDoc.data()!
    ) : (
      {}
    );

    const data = doc.data();

    for (const [dataField, dataValue] of Object.entries(data)) {
      // Skip iteration if currentDataValue is a number or date
      if (!Number.isNaN(Number(dataValue)) || !isNaN(new Date(dataValue).getTime())) {
        continue;
      }

      if (fieldOptionsData[dataField]) {
        if (!fieldOptionsData[dataField].some(value => value == dataValue)) {
          fieldOptionsData[dataField].push(dataValue);
        }
      } else {
        fieldOptionsData[dataField] = [dataValue];
      }
    }

    await db
      .collection('filterFieldOptions')
      .doc(collection)
      .set(fieldOptionsData);
  }
}
