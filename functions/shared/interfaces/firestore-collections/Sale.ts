export interface Sale {
  createdAt: string;
  customer: 'Walk-in' | string;
  price: number;
  product: string;
  productId: string;
  quantity: number;
  total: number;
  transactionId: number;
}

export interface SaleData extends Sale {
  docId: string;
}

