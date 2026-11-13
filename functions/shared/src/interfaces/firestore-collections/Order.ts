import type { Address } from "../Address.js";
import type { FullName } from "../FullName.js";

export interface Order {
  batchNumber: string; // Batch number of products alloted by the system
  customerName: FullName;
  customerId: string;
  customerAddress: Address;
  productName: string;
  productId: string;
  quantity: number;
  status: 'Confirmed' | 'Out for delivery' | 'Received';
}

