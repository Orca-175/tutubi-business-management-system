export interface InventoryEntry {
  batchNumber: string;
  createdAt: string;
  currentQuantity: number;
  outgoingQuantity: number;
  productId: string;
  productName: string;
  shelfLife: number;
  supplier: string;
  supplierId: string;
}

export interface InventoryEntryData extends InventoryEntry {
  docId: string;
}

