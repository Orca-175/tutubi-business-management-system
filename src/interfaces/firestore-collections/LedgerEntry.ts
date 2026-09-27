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
  totalPrice: number;
}

export interface LedgerEntryData extends LedgerEntry {
  docId: string;
}
