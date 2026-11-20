import type { FullName } from '../FullName.js';
import type { FirestoreDocument } from './FirestoreDocument.js';

export interface Sale extends FirestoreDocument {
  // '' when customerName is 'Walk-in'
  // Otherwise, the Auth UUID of the customer in the system
  customerId: string;

  // 'Walk-in' when the sale is made with a customer in the storefront
  // Otherwise, the full name of the client that made an order in the
  // client portal
  customerName: FullName;

  price: number;
  product: string;
  productId: string;
  quantity: number;
  total: number;
  transactionId: number;
}

export interface SaleData extends Sale {
  docId: string;
}

