import type { FirestoreDocument } from "./FirestoreDocument.js";

// NOTE: createdAt is set in onCreate cloud function
export interface Sale extends FirestoreDocument {
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

