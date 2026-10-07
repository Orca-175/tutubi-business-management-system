import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { db } from ".";
import { FilterFieldOptions } from "./shared/interfaces/firestore-collections/FilterFieldOptions";
import { onDocumentCreated } from "firebase-functions/firestore";


export async function addToFilterFieldOptions(collection: string, doc: QueryDocumentSnapshot | undefined) {
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
 
    // Get entries of the document that was created
    const dataEntries = Object.entries(doc.data());

    // Recursive function that adds the subfields of object values
    const addFieldOptions = (entries: typeof dataEntries) => {
      for (const [key, value] of entries) {
        if (value && typeof value === 'object') {
          addFieldOptions(Object.entries(value));
        } else if (Number.isNaN(Number(value)) && isNaN(new Date(value).getTime())) {
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
}

export const addLedgerFilterFieldOptions = onDocumentCreated('ledger/{ledgerEntryId}', async event => {
  const doc = event.data;

  // Add current document's field values to ledger document of filterFieldOptions if they are not already there
  await addToFilterFieldOptions('ledger', doc);
});

