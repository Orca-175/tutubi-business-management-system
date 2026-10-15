export interface LedgerEntry {
  account: string;
  collection: string; // The collection where the document of referenceId is stored
  createdAt: string;
  credit:number;
  debit: number;
  referenceId: string;
  transactionId: number;
  type: 'Purchase' | 'Sale';
}

export interface LedgerEntryData extends LedgerEntry {
  docId: string;
}

