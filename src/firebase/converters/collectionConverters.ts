import type { FirestoreDataConverter } from 'firebase/firestore';

import type { LedgerEntry } from '../../interfaces/firestore-collections/LedgerEntry';
import type { Product } from '../../interfaces/firestore-collections/Product';
import type { Purchase } from '../../interfaces/firestore-collections/Purchase';
import type { Sale } from '../../interfaces/firestore-collections/Sale';
import type { Supplier } from '../../interfaces/firestore-collections/Supplier';

export const ledgerConverter: FirestoreDataConverter<LedgerEntry> = {
  fromFirestore(snapshot) {
    return snapshot.data() as LedgerEntry;
  },
  toFirestore(ledgerEntry: LedgerEntry) {
    return ledgerEntry;
  },
};

export const productConverter: FirestoreDataConverter<Product> = {
  fromFirestore(snapshot) {
    return snapshot.data() as Product;
  },
  toFirestore(product: Product) {
    return product;
  },
};

export const purchaseConverter: FirestoreDataConverter<Purchase> = {
  fromFirestore(snapshot) {
    return snapshot.data() as Purchase;
  },
  toFirestore(purchase: Purchase) {
    return purchase;
  },
};

export const saleConverter: FirestoreDataConverter<Sale> = {
  fromFirestore(snapshot) {
    return snapshot.data() as Sale;
  },
  toFirestore(sale: Sale) {
    return sale;
  },
};

export const supplierConverter: FirestoreDataConverter<Supplier> = {
  fromFirestore(snapshot) {
    return snapshot.data() as Supplier;
  },
  toFirestore(supplier: Supplier) {
    return supplier;
  },
};
