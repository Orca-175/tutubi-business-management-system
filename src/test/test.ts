import { signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import type { Purchase } from '../interfaces/firestore-collections/Purchase';
import type { Sale } from '../interfaces/firestore-collections/Sale';

import { productConverter, supplierConverter } from '../firebase/converters/collectionConverters';
import { auth, db, functions } from '../firebase/firebase';

// Suppliers
const tonton = {
  address: 'Pasig',
  businessName: 'Tonton Meat Supplier',
  createdAt: new Date().toISOString(),
  ownerName: 'Tonton',
};
const christian = {
  address: 'Mandaluyong',
  businessName: 'Christian Meat Supplier',
  createdAt: new Date().toISOString(),
  ownerName: 'Chirstian',
};
const bob = {
  address: 'Mandaluyong',
  businessName: 'Bob Meat Supplier',
  createdAt: new Date().toISOString(),
  ownerName: 'Bob',
};

// Products
const pig = {
  createdAt: new Date().toISOString(),
  name: 'Pig',
  price: 79,
};
const beef = {
  createdAt: new Date().toISOString(),
  name: 'Beef',
  price: 75,
};
const chicken = {
  createdAt: new Date().toISOString(),
  name: 'Chicken',
  price: 72,
};

const porkBelly = {
  createdAt: new Date().toISOString(),
  name: 'Pork Belly',
  price: 80,
};

const beefTapa = {
  createdAt: new Date().toISOString(),
  name: 'Beef Tapa',
  price: 90,
};

const chickenBreast = {
  createdAt: new Date().toISOString(),
  name: 'Chicken Breast',
  price: 70,
};

async function addProducts() {
  await signInWithEmailAndPassword(auth, 'admin@email.com', 'adminPassword');

  // Adding products to database
  return [
    (await addDoc(
      collection(db, 'products')
        .withConverter(productConverter),
      pig,
    )).id,
    (await addDoc(
      collection(db, 'products')
        .withConverter(productConverter),
      beef,
    )).id,
    (await addDoc(
      collection(db, 'products')
        .withConverter(productConverter),
      chicken,
    )).id,
    (await addDoc(
      collection(db, 'products')
        .withConverter(productConverter),
      porkBelly,
    )).id,
    (await addDoc(
      collection(db, 'products')
        .withConverter(productConverter),
      beefTapa,
    )).id,
    (await addDoc(
      collection(db, 'products')
        .withConverter(productConverter),
      chickenBreast,
    )).id,
  ];
}

async function addSuppliers() {
  await signInWithEmailAndPassword(auth, 'admin@email.com', 'adminPassword');

  // Adding suppliers to database
  return [
    (await addDoc(collection(db, 'suppliers').withConverter(supplierConverter), tonton)).id,
    (await addDoc(collection(db, 'suppliers').withConverter(supplierConverter), christian)).id,
    (await addDoc(collection(db, 'suppliers').withConverter(supplierConverter), bob)).id,
  ];
}

async function recordLedgerEntries(suppliers: string[], products: string[]) {
  await signInWithEmailAndPassword(auth, 'admin@email.com', 'adminPassword');

  const [tontonId, christianId, bobId] = suppliers;
  const [pigId, beefId, chickenId, porkBellyId, beefTapaId, chickenBreastId] = products;

  const recordTransactionToLedger = httpsCallable(functions, 'recordTransactionToLedger');

  let quantity = 200;
  let total = pig.price * quantity;
  await recordTransactionToLedger({
    credit: { account: 'Cash', value: total },
    debit: { account: 'Inventory', value: total },
    purchase: {
      createdAt: new Date().toISOString(),
      date: new Date().toISOString(),
      price: pig.price,
      product: pig.name,
      productId: pigId,
      purchaseInfo: {
        withHead: true,
        withMenudencia: true,
      },
      quantity: quantity,
      source: tonton.businessName,
      supplierId: tontonId,
      total: total,
    },
  });

  quantity = 220;
  total = beef.price * quantity;
  await recordTransactionToLedger({
    credit: { account: 'Cash', value: total },
    debit: { account: 'Inventory', value: total },
    purchase: {
      createdAt: new Date().toISOString(),
      price: beef.price,
      product: beef.name,
      productId: beefId,
      purchaseInfo: {
        withHead: false,
        withMenudencia: false,
      },
      quantity: quantity,
      source: christian.businessName,
      supplierId: christianId,
      total: total,
    },
  });

  quantity = 215;
  total = chicken.price * quantity;
  await recordTransactionToLedger({
    credit: { account: 'Accounts Payable', value: total },
    debit: { account: 'Inventory', value: total },
    purchase: {
      createdAt: new Date().toISOString(),
      price: chicken.price,
      product: chicken.name,
      productId: chickenId,
      purchaseInfo: {
        withHead: false,
        withMenudencia: true,
      },
      quantity: quantity,
      source: bob.businessName,
      supplierId: bobId,
      total: total,
    },
  });

  quantity = 2;
  total = porkBelly.price * quantity;
  await recordTransactionToLedger({
    credit: { account: 'Inventory', value: total },
    debit: { account: 'Cash', value: total },
    sale: {
      createdAt: new Date().toISOString(),
      customer: 'Walk-in',
      price: porkBelly.price,
      product: porkBelly.name,
      productId: porkBellyId,
      quantity: quantity,
      total: total,
    },
  });

  quantity = 3;
  total = beefTapa.price * quantity;
  await recordTransactionToLedger({
    credit: { account: 'Inventory', value: total },
    debit: { account: 'Cash', value: total },
    sale: {
      createdAt: new Date().toISOString(),
      customer: 'Walk-in',
      price: beefTapa.price,
      product: beefTapa.name,
      productId: beefTapaId,
      quantity: quantity,
      total: total,
    },
  });

  quantity = 3;
  total = chickenBreast.price * quantity;
  await recordTransactionToLedger({
    credit: { account: 'Inventory', value: total },
    debit: { account: 'Cash', value: total },
    sale: {
      createdAt: new Date().toISOString(),
      customer: 'Walk-in',
      price: chickenBreast.price,
      product: chickenBreast.name,
      productId: chickenBreastId,
      quantity: quantity,
      total: total,
    },
  });

  console.log('Documents added!');
  return 0;
}

const products = await addProducts();
const suppliers = await addSuppliers();
await recordLedgerEntries(suppliers, products);

