export interface Purchase {
  customer: string;
  date: string;
  price: string;
  product: string;
  purchaseInfo?: {
    withHead: boolean;
    withMenudencia: boolean;
  };
  quantity: string;
  total: string;
}

export interface PurchaseData extends Purchase {
  docId: string;
}

