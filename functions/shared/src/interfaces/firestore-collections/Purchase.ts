import type { FirestoreDocument } from "./FirestoreDocument.js";

// TODO: Add further source/supplier information
// NOTE: createdAt is set in onCreate cloud function
export interface Purchase extends FirestoreDocument {
  price: number;
  product: string;
  productId: string;
  purchaseInfo?: {
    withHead: boolean;
    withMenudencia: boolean;
  };
  quantity: number;
  source: string;
  supplierId: string; // If source is a supplier, supplierId should exist
  total: number;
  transactionId: number;
}

export interface PurchaseData extends Purchase {
  docId: string;
}

