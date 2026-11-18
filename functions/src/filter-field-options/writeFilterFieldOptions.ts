import { onDocumentWritten } from 'firebase-functions/firestore';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import { addToFilterFieldOptions } from './addToFilterFieldOptions';
import { deleteFromFilterFieldOptions } from './deleteFromFilterFieldOptions';
import { editFilterFieldOptions } from './editFilterFieldOptions';

export function getWriteFilterFieldOptions(collectionString: typeof collections[keyof typeof collections]) {
  return onDocumentWritten(`${collectionString}/{${collectionString}DocumentId}`, async event => {
    const beforeDoc = event.data!.before;
    const afterDoc = event.data!.after;

    const isCreate = !beforeDoc.exists && afterDoc.exists;
    const isUpdate = beforeDoc.exists && afterDoc.exists;
    const isDelete = beforeDoc.exists && !afterDoc.exists;

    if (isCreate) {
      await addToFilterFieldOptions(collectionString, afterDoc);
    }

    if (isUpdate) {
      await editFilterFieldOptions(collectionString, beforeDoc, afterDoc);
    }

    if (isDelete) {
      await deleteFromFilterFieldOptions(collectionString, beforeDoc);
    }
  });
}

