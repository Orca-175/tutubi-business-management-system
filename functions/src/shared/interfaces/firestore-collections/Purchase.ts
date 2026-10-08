export interface Purchase {
  createdAt: string;
  price: number;
  product: string;
  productId: string;
  purchaseInfo?: {
    withHead: boolean;
    withMenudencia: boolean;
  };
  quantity: number;
  source: string;
  supplierId?: string; // If source is a supplier, supplierId should exist
  total: number;
}

export interface PurchaseData extends Purchase {
  docId: string;
}

