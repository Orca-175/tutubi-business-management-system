export interface InventoryEntry {
  productName: string;
  productId: string;
  batchNumber: string;
  currentQuantity: number;
  outgoingQuantity: number;
  dateStored: string;
  daysBeforeExpiry: number;
  supplier: string;
}

export interface InventoryEntryData extends InventoryEntry {
  docId: string;
}

