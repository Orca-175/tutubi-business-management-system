// Document ID in Firestore should be the product's document ID
export interface InventorySummary {
  createdAt: string;
  productName: string;
  totalCurrentQuantity: number;
  totalOutgoingQuantity: number;
}

export interface InventorySummaryData extends InventorySummary {
  docId: string;
}

