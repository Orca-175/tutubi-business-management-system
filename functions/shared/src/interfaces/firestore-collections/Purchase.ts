import type { FirestoreDocument } from './FirestoreDocument.js';

export interface Purchase extends FirestoreDocument {
  price: number;
  product: string;
  purchaseInfo?: {
    [key: string]: boolean | number | string;
  };
  quantity: number;
  source: string;
  total: number;
  transactionId: number;
}

export interface PurchaseData extends Purchase {
  docId: string;
}

