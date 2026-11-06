export interface InventorySummary {
  productName: string;
  productId: string;
  totalCurrentQuantity: number;
  totalOutgoingQuantity: number;
  price: number;
}

export interface InventorySummaryData extends InventorySummary {
  docId: string;
}

