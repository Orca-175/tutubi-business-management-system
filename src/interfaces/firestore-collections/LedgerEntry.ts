export interface LedgerEntry {
  createdAt: string;
  head: boolean;
  menudencia: boolean;
  paid: boolean;
  paidAt: string;
  price: number;
  quantity: number;
  supplierId: string;
}

export interface LedgerEntryData extends LedgerEntry {
  docId: string;
}
