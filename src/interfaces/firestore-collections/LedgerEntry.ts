export interface LedgerEntry {
  createdAt: string;
  paid: boolean;
  paidAt: string;
  partyCollection?: 'clients' | 'suppliers'; // undefined when transaction is from retail storefront.
  partyId?: string; // Empty when partyCollection is undefined
  partyName: string;
  price: number;
  productId: string;
  productName: string;
  purchaseInfo?: {
    head: boolean;
    menudencia: boolean;
  };
  quantity: number; // In kg
  totalPrice: number;
  transactionType: 'Purchase' | 'Sale';
}

export interface LedgerEntryData extends LedgerEntry {
  docId: string;
}

