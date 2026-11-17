import { onDocumentCreated } from "firebase-functions/firestore";
import { collections } from "shared/interfaces/firestore-collection-strings";
import { InventoryEntry, Order } from "shared/interfaces/firestore-collections";
import { db } from ".";
import { QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";

export const assignBatchToOrder = onDocumentCreated(`${collections.orders}/{orderId}`, async event => {
  const orderDocSnap = event.data!;
  const orderData = orderDocSnap.data()! as Order;

  const daysToMillis = (days: number) => {
    const dayInMillis = 24 * 60 * 60 * 1000;

    return days * dayInMillis;
  };

  const now = Timestamp.now();
  // Find batches that have more than 3 days left to expire
  const cutoff = Timestamp.fromMillis(now.toMillis() + daysToMillis(3));

  const inventoryEntriesDocSnaps = (await db.collection(collections.inventory)
    .where('productId', '==', orderData.productId)
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

    if (data.currentQuantity >= data.outgoingQuantity + data.reservedQuantity + orderData.quantity) {
      return true;
    }

    return false;
  });

  if (!inventoryEntryDocSnap) {
    return;
  }

  const inventoryEntryData = inventoryEntryDocSnap.data();

  // Update quantities of batch in inventory
  if (orderData.status === 'Reserved') {
    await db.collection(collections.inventory)
      .doc(inventoryEntryDocSnap.id)
      .update({
        reservedQuantity: inventoryEntryData.reservedQuantity + orderData.quantity,
      })
  } else {
    await db.collection(collections.inventory)
      .doc(inventoryEntryDocSnap.id)
      .update({
        outgoingQuantity: inventoryEntryData.outgoingQuantity + orderData.quantity,
      })
  }

  // Update batch number field of order
  await db.collection(collections.orders)
    .doc(orderDocSnap.id)
    .update({
      batchNumber: inventoryEntryData.batchNumber,
    });

});

