import { QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import { onDocumentWritten } from 'firebase-functions/firestore';
import { collections } from 'shared/interfaces/firestore-collection-strings';
import { InventoryEntry, Order } from 'shared/interfaces/firestore-collections';

import { db } from '.';
import { recordTransaction } from './helpers/recordTransaction';

export const handleOrderWrites = onDocumentWritten(`${collections.orders}/{orderId}`, async event => {
  const before = event.data!.before;
  const after = event.data!.after;

  writeBatchInfoFromOrder(before, after);

  const isUpdate = before.exists && after.exists;
  if (isUpdate) {
    const beforeData = before.data()! as Order;
    const afterData = after.data()! as Order;

    if (afterData.status === 'Confirmed' && beforeData.status !== 'Confirmed') {
      recordConfirmedOrderToLedger(afterData);
    }
  }
});

async function recordConfirmedOrderToLedger(confirmedOrder: Order) {
  recordTransaction({
    credit: {
      account: 'Sales Revenue',
      value: confirmedOrder.total,
    },
    debit: {
      account: 'Cash',
      value: confirmedOrder.total,
    },
    sale: {
      createdAt: Timestamp.now(),
      customerId: confirmedOrder.customerId,
      customerName: confirmedOrder.customerName,
      price: confirmedOrder.price,
      product: confirmedOrder.productName,
      productId: confirmedOrder.productId,
      quantity: confirmedOrder.quantity,
      total: confirmedOrder.total,
      transactionId: 0,
    },
  });
}
 
async function writeBatchInfoFromOrder(before: DocumentSnapshot, after: DocumentSnapshot) {
  const isCreated = !before.exists && after.exists;
  const isUpdate = before.exists && after.exists;
  const isDelete = before.exists && !after.exists;

  if (isCreated) {
    const createdDoc = after;
    const createdData = createdDoc.data()! as Order;

    const daysToMillis = (days: number) => {
      const dayInMillis = 24 * 60 * 60 * 1000;

      return days * dayInMillis;
    };

    const now = Timestamp.now();
    // Find batches that have more than 3 days left to expire
    const cutoff = Timestamp.fromMillis(now.toMillis() + daysToMillis(3));

    const inventoryEntriesDocSnaps = (await db.collection(collections.inventory)
      .where('productId', '==', createdData.productId)
      .where('expiresAt', '>', cutoff)
      .orderBy('expiresAt', 'asc')
      .get()
    ).docs as QueryDocumentSnapshot<InventoryEntry>[];

    if (inventoryEntriesDocSnaps.length === 0) {
      return;
    }

    // Find first batch with available quantity
    const inventoryEntryDocSnap = inventoryEntriesDocSnaps.find(docSnap => {
      const data = docSnap.data() as InventoryEntry;

      if (data.currentQuantity >= data.outgoingQuantity + data.reservedQuantity + createdData.quantity) {
        return true;
      }

      return false;
    });
    if (!inventoryEntryDocSnap) {
      // A client should not be able to place an order if no batch satisfies it in the first place
      throw new Error('Available batch not found.');
    }
    const inventoryEntryData = inventoryEntryDocSnap.data() as InventoryEntry;

    // Update quantities of batch in inventory
    if (createdData.status === 'Reserved') {
      await db.collection(collections.inventory)
        .doc(inventoryEntryDocSnap.id)
        .update({
          reservedQuantity: inventoryEntryData.reservedQuantity + createdData.quantity,
        } satisfies Partial<InventoryEntry>);
    } else {
      await db.collection(collections.inventory)
        .doc(inventoryEntryDocSnap.id)
        .update({
          outgoingQuantity: inventoryEntryData.outgoingQuantity + createdData.quantity,
        } satisfies Partial<InventoryEntry>);
    }

    // Update batch number field of order
    await db.collection(collections.orders)
      .doc(createdDoc.id)
      .update({
        batchNumber: inventoryEntryData.batchNumber,
        inventoryEntryId: inventoryEntryDocSnap.id,
      } satisfies Partial<Order>);
  }

  if (isUpdate) {
    const beforeData = before.data()! as Order;
    const afterData = after.data()! as Order;

    // Handle change in status
    if (afterData.status !== beforeData.status) {
      const inventoryEntryDocSnap = await db.collection(collections.inventory)
        .doc(afterData.inventoryEntryId)
        .get();

      if (!inventoryEntryDocSnap.exists) {
        throw Error('Inventory batch not found.');
      }
      const inventoryEntryData = inventoryEntryDocSnap.data()! as InventoryEntry;

      if (afterData.status === 'Received') {
        if (beforeData.status !== 'Out for delivery') {
          throw new Error('Order status set to "Received" before being set to "Out for delivery".');
        }

        await db.collection(collections.inventory)
          .doc(afterData.inventoryEntryId)
          .update({
            currentQuantity: inventoryEntryData.currentQuantity - afterData.quantity,
            outgoingQuantity: inventoryEntryData.outgoingQuantity - afterData.quantity,
          } satisfies Partial<InventoryEntry>);
      }

      if (afterData.status === 'Confirmed' && beforeData.status === 'Reserved') {
        await db.collection(collections.inventory)
          .doc(afterData.inventoryEntryId)
          .update({
            outgoingQuantity: inventoryEntryData.outgoingQuantity + afterData.quantity,
            reservedQuantity: inventoryEntryData.reservedQuantity - afterData.quantity,
          } satisfies Partial<InventoryEntry>);
      }

      if (afterData.status === 'Cancelled') {
        if (beforeData.status === 'Confirmed') {
          await db.collection(collections.inventory)
            .doc(afterData.inventoryEntryId)
            .update({
              outgoingQuantity: inventoryEntryData.outgoingQuantity - afterData.quantity,
            } satisfies Partial<InventoryEntry>);
        }

        if (beforeData.status === 'Reserved') {
          await db.collection(collections.inventory)
            .doc(afterData.inventoryEntryId)
            .update({
              reservedQuantity: inventoryEntryData.reservedQuantity - afterData.quantity,
            } satisfies Partial<InventoryEntry>);
        }
      }
    }
  }

  if (isDelete) {
    const deletedData = before.data()! as Order;

    const inventoryEntryDocSnap = await db.collection(collections.inventory)
      .doc(deletedData.inventoryEntryId)
      .get();

    if (!inventoryEntryDocSnap.exists) {
      throw Error('Inventory batch not found.');
    }
    const inventoryEntryData = inventoryEntryDocSnap.data()! as InventoryEntry;

    if (deletedData.status !== 'Received') {
      const updatedData = deletedData.isReservation ? (
        { reservedQuantity:  inventoryEntryData.reservedQuantity - deletedData.quantity }
      ) : (
        { outgoingQuantity: inventoryEntryData.outgoingQuantity - deletedData.quantity }
      );

      await db.collection(collections.inventory)
        .doc(deletedData.inventoryEntryId)
        .update(updatedData satisfies Partial<InventoryEntry>);
    }
  }
}

