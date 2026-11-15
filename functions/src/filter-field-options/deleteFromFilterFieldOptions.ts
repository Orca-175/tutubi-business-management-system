import { FilterFieldOptions } from 'shared/interfaces/firestore-collections';

import { HttpsError } from 'firebase-functions/ai';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import { db } from '..';
import { flattenData } from '../helpers/flattenData';

export async function deleteFromFilterFieldOptions(collection: string, doc: DocumentSnapshot) {
  const fieldOptionsDoc = await db
    .collection('filterFieldOptions')
    .doc(collection)
    .get();

  if (!doc.exists || !fieldOptionsDoc.exists) {
    throw new HttpsError(
      'not-found',
      'Document/s not found.'
    );
  }
  const docData = doc.data()!;
  const fieldOptionsData: FilterFieldOptions = fieldOptionsDoc.data()!;

  // Flatten deleted data
  const flattenedData = flattenData(docData);

  // Delete values of fields in deleted data from filterFieldOptions document
  for (const [key, value] of Object.entries(flattenedData)) {
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

