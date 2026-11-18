import { QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';
import { onDocumentWritten } from 'firebase-functions/firestore';
import { collections } from 'shared/interfaces/firestore-collection-strings';
import { InventoryEntry, Order } from 'shared/interfaces/firestore-collections';

import { db } from '.';

export const writeBatchInfoFromOrder = onDocumentWritten(`${collections.orders}/{orderId}`, async event => {
  const before = event.data!.before;
  const after = event.data!.after;

  const isCreated = !before.exists && after.exists;
  const isUpdate = before.exists && after.exists;
  const isDelete = !before.exists && after.exists;

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
      return;
    }
    const inventoryEntryData = inventoryEntryDocSnap.data() as InventoryEntry;

    // Update quantities of batch in inventory
    if (createdData.status === 'Reserved') {
      await db.collection(collections.inventory)
        .doc(inventoryEntryDocSnap.id)
        .update({
          reservedQuantity: inventoryEntryData.reservedQuantity + createdData.quantity,
        });
    } else {
      await db.collection(collections.inventory)
        .doc(inventoryEntryDocSnap.id)
        .update({
          outgoingQuantity: inventoryEntryData.outgoingQuantity + createdData.quantity,
        });
    }

    // Update batch number field of order
    await db.collection(collections.orders)
      .doc(createdDoc.id)
      .update({
        batchNumber: inventoryEntryData.batchNumber,
        inventoryEntryId: inventoryEntryDocSnap.id,
      });
  }

  if (isUpdate) {
    const beforeData = before.data()! as Order;
    const afterData = after.data()! as Order;

    // Handle change in status
    if (beforeData.status !== afterData.status) {
      const inventoryEntryDocSnap = await db.collection(collections.inventory)
        .doc(afterData.inventoryEntryId)
        .get();

      if (!inventoryEntryDocSnap.exists) {
        throw Error('Inventory batch not found.');
      }
      const inventoryEntryData = inventoryEntryDocSnap.data()! as InventoryEntry;

      // If status changed to Received:
      // Reduce current quantity of batch
      // Reduce outgoing quantity of batch
      if (afterData.status === 'Received') {
        if (beforeData.status !== 'Out for delivery') {
          throw new Error('Order status set to "Received" before being set to "Out for delivery".');
        }

        await db.collection(collections.inventory)
          .doc(afterData.inventoryEntryId)
          .update({
            currentQuantity: inventoryEntryData.currentQuantity - afterData.quantity,
            outgoingQuantity: inventoryEntryData.outgoingQuantity - afterData.quantity,
          });
      }

      // If status changed to Confirmed from Reserved:
      // Remove reserved quantity in batch
      // Add outgoing quantity in batch
      if (afterData.status === 'Confirmed' && beforeData.status === 'Reserved') {
        await db.collection(collections.inventory)
          .doc(afterData.inventoryEntryId)
          .update({
            outgoingQuantity: inventoryEntryData.outgoingQuantity + afterData.quantity,
            reservedQuantity: inventoryEntryData.reservedQuantity - afterData.quantity,
          });
      }

      // If status changed to Cancelled:
      // Remove outgoing quantity in batch
      // Remove reserved quantity in batch
      if (afterData.status === 'Cancelled') {
        if (beforeData.status === 'Confirmed') {
          await db.collection(collections.inventory)
            .doc(afterData.inventoryEntryId)
            .update({
              outgoingQuantity: inventoryEntryData.outgoingQuantity - afterData.quantity,
            });
        }

        if (beforeData.status === 'Reserved') {
          await db.collection(collections.inventory)
            .doc(afterData.inventoryEntryId)
            .update({
              reservedQuantity: inventoryEntryData.reservedQuantity - afterData.quantity,
            });
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
      const updatedData = deletedData.status === 'Reserved' ? (
        { reservedQuantity:  inventoryEntryData.reservedQuantity - deletedData.quantity }
      ) : (
        { outgoingQuantity: inventoryEntryData.outgoingQuantity - deletedData.quantity }
      );

      await db.collection(collections.inventory)
        .doc(deletedData.inventoryEntryId)
        .update(updatedData);
    }
  }
});
 
