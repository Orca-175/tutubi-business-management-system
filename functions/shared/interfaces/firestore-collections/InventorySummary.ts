export interface InventorySummary {
  createdAt: string;
  productId: string;
  productName: string;
  totalCurrentQuantity: number;
  totalOutgoingQuantity: number;
}

export interface InventorySummaryData extends InventorySummary {
  docId: string;
}

