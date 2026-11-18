import type { FirestoreDocument } from './FirestoreDocument.js';

export interface Supplier extends FirestoreDocument {
  address: {
    barangay: string;
    city: string;
    houseNumber: string;
    region: string;
    street: string;
  };
  businessName: string;
  email: string;
  ownerName: string;
  phone: string;
};

export interface SupplierData extends Supplier {
  docId: string;
}

