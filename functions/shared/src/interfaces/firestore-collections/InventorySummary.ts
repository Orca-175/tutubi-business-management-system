import type { FirestoreDocument } from './FirestoreDocument.js';

// Document ID in Firestore should be the product's document ID
export interface InventorySummary extends FirestoreDocument {
  productName: string;
  totalCurrentQuantity: number; // Quantities are stored in kg
  totalOutgoingQuantity: number;
  totalReservedQuantity: number;
}

export interface InventorySummaryData extends InventorySummary {
  docId: string;
}

