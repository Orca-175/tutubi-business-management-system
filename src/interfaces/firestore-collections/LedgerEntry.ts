export interface LedgerEntry {
  account: string;
  credit:number;
  debit: number;
  referenceId: string; // The reference sale/purchase document that contains further details of the transaction
  type: string; // Whether the entry describes a sale or puchase
                // This also determines what Firestore collection referenceId points to
}

export interface LedgerEntryData extends LedgerEntry {
  docId: string;
}

