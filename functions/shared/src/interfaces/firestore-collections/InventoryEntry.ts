export interface InventoryEntry {
  batchNumber: string;
  createdAt: string;
  currentQuantity: number;
  outgoingQuantity: number;
  productId: string;
  productName: string;
  reservedQuantity: number;
  shelfLife: number;
  supplierId: string;
  supplierName: string; // Supplier.businessName
}

export interface InventoryEntryData extends InventoryEntry {
  docId: string;
}

