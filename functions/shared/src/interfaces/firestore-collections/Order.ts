import type { Address } from '../Address.js';
import type { FullName } from '../FullName.js';
import type { FirestoreDocument } from './FirestoreDocument.js';

export interface Order extends FirestoreDocument {
  batchNumber: string; // Batch number of products alloted by the system
  customerAddress: Address;
  customerId: string;
  customerName: FullName;
  isReservation: boolean;
  productId: string;
  productName: string;
  quantity: number;
  reservationInfo?: {
    isSetToBeDelivered: boolean;

    // Date to un-reserve quantity when client does not follow through
    reservedUntil: string;

  };

  // Cancelled: Order has been cancelled
  //
  // Confirmed: Business has confirmed the order and it is set to be sent
  //
  // Out for delivery: Ordered product is in transit
  //
  // Received: Client has received their order
  //
  // Reserved: The order is a reservation. Will be set to "Confirmed" whe
  // the customer follows through and the business confirms the order
  //
  // '--': A new order whose status has not been set
  status: 'Cancelled' | 'Confirmed' | 'Out for delivery' | 'Received' |
    'Reserved' | '--';
}

export interface OrderData extends Order {
  docId: string;
}

