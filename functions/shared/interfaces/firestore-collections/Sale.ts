export interface Sale {
  createdAt: string; // Set in onCreate cloud function
  customer: 'Walk-in' | string;
  price: number;
  product: string;
  productId: string;
  quantity: number;
  total: number;
  transactionId: number; // Should be set in the onCreate cloud function
}

export interface SaleData extends Sale {
  docId: string;
}

