export interface InventoryEntry {
  batchNumber: string;
  createdAt: string;
  currentQuantity: number;
  outgoingQuantity: number;
  productId: string;
  productName: string;
  shelfLife: number;
  supplierName: string; // Supplier.businessName
  supplierId: string;
}

export interface InventoryEntryData extends InventoryEntry {
  docId: string;
}

