export interface LedgerEntry {
  createdAt: string;
  head: boolean;
  menudencia: boolean;
  paid: boolean;
  paidAt: string;
  price: number;
  productId: string;
  productName: string;
  quantity: number; // In kg
  supplierId: string;
  supplierName: string;
}

export interface LedgerEntryData extends LedgerEntry {
  docId: string;
}
