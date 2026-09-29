import { initializeApp } from 'firebase-admin/app';
import { DocumentSnapshot, getFirestore } from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions';
import { onDocumentCreated } from 'firebase-functions/firestore';

setGlobalOptions({maxInstances: 10});

initializeApp();

const db = getFirestore();

export const addLedgerFilterFieldOptions = onDocumentCreated('ledger/{ledgerEntryId}', async event => {
  const doc = event.data;

  // Add current document's field values to ledger document of filterFieldOptions if they are not already there
  await addToFilterFieldOptions('ledger', doc);
});

async function addToFilterFieldOptions(collection: string, doc: DocumentSnapshot | undefined) {
  if (doc) {
    // Getting specific collection document from filterFieldOptions collection
    const fieldOptionsDoc = await db
      .collection('filterFieldOptions')
      .doc(collection)
      .get();

    const fieldOptionsData: {
      [field: string]: (boolean | number | string)[]
    } = fieldOptionsDoc.exists ? (
      fieldOptionsDoc.data()!
    ) : (
      {}
    );

    const data = doc.data();

    for (const field in data) {
      const currentDataValue = data[field];

      // Skip iteration if currentDataValue is a number or date
      if (!Number.isNaN(Number(currentDataValue)) || !isNaN(new Date(currentDataValue).getTime())) {
        continue;
      }

      if (fieldOptionsData[field]) {
        if (!fieldOptionsData[field].some(value => value == currentDataValue)) {
          fieldOptionsData[field].push(currentDataValue);
        }
      } else {
        fieldOptionsData[field] = [currentDataValue];
      }
    }

    await db
      .collection('filterFieldOptions')
      .doc(collection)
      .set(fieldOptionsData);
  }
}
