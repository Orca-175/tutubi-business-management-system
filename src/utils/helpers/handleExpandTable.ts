import type { Dispatch, SetStateAction } from 'react';

export function handleExpandTable(setExpanded: Dispatch<SetStateAction<string[]>>, expanded: string[], docId: string) {
  if (expanded.includes(docId)) {
    setExpanded(expanded.toSpliced(expanded.findIndex(id => id === docId), 1));
  } else {
    const tempExpanded = [...expanded];
    tempExpanded.push(docId);
    setExpanded(tempExpanded);
  }
}

