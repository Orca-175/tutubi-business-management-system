export interface Sale {
  customer: 'Walk-in' | string;
  date: string;
  price: number;
  product: string;
  productId: string;
  quantity: number;
  total: number;
}

export interface SaleData extends Sale {
  docId: string;
}

