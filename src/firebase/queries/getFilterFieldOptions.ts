import type { Dispatch, SetStateAction } from 'react';
import type { FilterFieldOptions } from 'shared/interfaces/firestore-collections';

import { doc, getDoc } from 'firebase/firestore';

import { db } from '../firebase';

// Gets the FilterFieldOptions of a certain collection which are used for select dropdowns
export async function getFilterFieldOptions(
  collectionString: string,
  setFilterFieldOptions: Dispatch<SetStateAction<FilterFieldOptions>>,
) {
  const docSnap = await getDoc(doc(db, 'filterFieldOptions', collectionString));
  if (!docSnap.exists()) {
    return;
  }

  const data = docSnap.data();

  setFilterFieldOptions(data);
}

