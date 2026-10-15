export interface LedgerEntry {
  account: string;
  collection: string; // The collection where the document of referenceId is stored
  createdAt: string;
  credit:number;
  debit: number;
  entryType: 0 | 1; // 0 for debit. Used for ensuring that debits can come before credits when fetched
  referenceId: string;
  transactionId: number;
  transactionType: "Purchase" | 'Sale';
}

export interface LedgerEntryData extends LedgerEntry {
  docId: string;
}

