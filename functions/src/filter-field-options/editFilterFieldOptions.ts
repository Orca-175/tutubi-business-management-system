import { FilterFieldOptions } from 'shared/interfaces/firestore-collections';

import { HttpsError } from 'firebase-functions/https';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import { db } from '..';
import { flattenData } from '../helpers/flattenData';

export async function editFilterFieldOptions(
  collection: string,
  beforeDoc: DocumentSnapshot,
  afterDoc: DocumentSnapshot
) {
  const fieldOptionsDoc = await db
    .collection('filterFieldOptions')
    .doc(collection)
    .get();

  if (!beforeDoc.exists || !afterDoc.exists) {
    throw new HttpsError(
      'not-found',
      'Document/s not found.'
    );
  }

  const fieldOptionsData: FilterFieldOptions = fieldOptionsDoc.data()!;
  const beforeData = beforeDoc.data()!;
  const afterData = afterDoc.data()!;

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

