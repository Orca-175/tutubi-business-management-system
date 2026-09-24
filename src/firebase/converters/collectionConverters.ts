import type { FirestoreDataConverter } from 'firebase/firestore';

import type { LedgerEntry } from '../../interfaces/firestore-collections/LedgerEntry';
import type { Product } from '../../interfaces/firestore-collections/Product';
import type { Supplier } from '../../interfaces/firestore-collections/Supplier';

export const ledgerConverter: FirestoreDataConverter<LedgerEntry> = {
  fromFirestore(snapshot) {
    return snapshot.data() as LedgerEntry;
  },
  toFirestore(ledger) {
    return ledger;
  },
};

export const productConverter: FirestoreDataConverter<Product> = {
  fromFirestore(snapshot) {
    return snapshot.data() as Product;
  },
  toFirestore(product) {
    return product;;
  },
};

export const supplierConverter: FirestoreDataConverter<Supplier> = {
  fromFirestore(snapshot) {
    return snapshot.data() as Supplier;
  },
  toFirestore(supplier) {
    return supplier;
  },
};
