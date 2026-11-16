import { FilterFieldOptions } from 'shared/interfaces/firestore-collections';

import { db } from '../';
import { HttpsError } from 'firebase-functions/ai';
import { DocumentSnapshot } from 'firebase-admin/firestore';

export async function addToFilterFieldOptions(collection: string, doc: DocumentSnapshot) {
  // Getting specific collection document from filterFieldOptions collection
  const fieldOptionsDoc = await db
    .collection('filterFieldOptions')
    .doc(collection)
    .get();

  if (!doc.exists) {
    throw new HttpsError(
      'not-found',
      'Document/s not found.'
    );
  }
  const docData = doc.data()!;
  const fieldOptionsData: FilterFieldOptions = fieldOptionsDoc.exists ? (
    fieldOptionsDoc.data()!
  ) : (
    {}
  );

  // Get entries of the document that was created
  const dataEntries = Object.entries(docData);

  // Recursive function that adds the subfields of object values
  const addFieldOptions = (entries: typeof dataEntries) => {
    for (const [key, value] of entries) {
      if (value && typeof value === 'object') {
        addFieldOptions(Object.entries(value));

        // If value is not a number and not a date
      } else if (typeof value === 'boolean' || Number.isNaN(Number(value))) {

        if (fieldOptionsData[key]) {
          if (!fieldOptionsData[key].some(someValue => someValue == value)) {
            fieldOptionsData[key].push(value);
          }
        } else {
          fieldOptionsData[key] = [value];
        }
      }
    }

    return;
  };
  addFieldOptions(dataEntries);

  await db
    .collection('filterFieldOptions')
    .doc(collection)
    .set(fieldOptionsData);
}

