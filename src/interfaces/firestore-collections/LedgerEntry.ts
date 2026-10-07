export interface LedgerEntry {
  account: string;
  collection: string; // The collection where the document of referenceId is stored
  credit:number;
  debit: number;
  referenceId: string; // The reference sale/purchase document that contains further details of the transaction
}

export interface LedgerEntryData extends LedgerEntry {
  docId: string;
}

