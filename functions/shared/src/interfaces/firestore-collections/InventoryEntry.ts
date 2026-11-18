import type { TimestampBridge } from '../TimestampBridge.js';
import type { FirestoreDocument } from './FirestoreDocument.js';

export interface InventoryEntry extends FirestoreDocument {
  batchNumber: string;
  currentQuantity: number; // Quantities are stored in kg
  expiresAt: TimestampBridge;
  outgoingQuantity: number;
  productId: string;
  productName: string;
  reservedQuantity: number;
  shelfLife: number; // Shelf life in days
  supplierId: string;
  supplierName: string; // Supplier.businessName
}

export interface InventoryEntryData extends InventoryEntry {
  docId: string;
}

