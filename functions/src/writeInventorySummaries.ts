import { Timestamp } from 'firebase-admin/firestore';
import { onDocumentWritten } from 'firebase-functions/firestore';
import { collections } from 'shared/interfaces/firestore-collection-strings';
import { InventoryEntry, InventorySummary } from 'shared/interfaces/firestore-collections';

import { db } from '.';

export const writeInventorySummaries = onDocumentWritten(
  `${collections.inventory}/{inventoryEntryId}`,
  async event => {
    const before = event.data!.before;
    const after = event.data!.after;

    const isCreate = !before.exists && after.exists;
    const isUpdate = before.exists && after.exists;
    const isDelete = before.exists && !after.exists;

    const createdInventoryEntry = after.exists ? (
      after.data() as InventoryEntry
    ) : (
      before.data() as InventoryEntry
    );
    const inventorySummaryRef = db.collection('inventorySummaries')
        .doc(createdInventoryEntry.productId);

    if (isCreate) {
      // Get existing aggregate summary of inventory entry with productId
      await db.runTransaction(async transaction => {
        const inventorySummaryDoc = await transaction.get(inventorySummaryRef);

        // If inventory summary for product does not exist (first time a particular
        // product is added to inventory), create it
        if (!inventorySummaryDoc.exists) {
          const inventorySummary = {
            createdAt: Timestamp.now(),
            productName: createdInventoryEntry.productName,
            totalCurrentQuantity: createdInventoryEntry.currentQuantity,
            totalOutgoingQuantity: createdInventoryEntry.outgoingQuantity,
            totalReservedQuantity: createdInventoryEntry.reservedQuantity,
          } satisfies InventorySummary;

          // Add values of newly created inventory entry to aggregate summary
          transaction.create(inventorySummaryRef, inventorySummary);

          return;
        }

        // Else, update existing inventorySummary
        const inventorySummaryData = inventorySummaryDoc.data() as InventorySummary;

        transaction.update(inventorySummaryRef, {
          totalCurrentQuantity: inventorySummaryData.totalCurrentQuantity +
            createdInventoryEntry.currentQuantity,
        } satisfies Partial<InventorySummary>);
      });
    }

    if (isUpdate) {
      const inventoryEntryBefore = before.data() as InventoryEntry;
      const inventoryEntryAfter = after.data() as InventoryEntry;

      await db.runTransaction(async transaction => {
        const inventorySummaryDoc = await transaction.get(inventorySummaryRef);
        const inventorySummaryData = inventorySummaryDoc.data() as InventorySummary;

        const getNumberDiff = (firstNumber: number, secondNumber: number) => {
          return secondNumber - firstNumber;
        };

        const currentQuantityDiff = getNumberDiff(
          inventoryEntryBefore.currentQuantity,
          inventoryEntryAfter.currentQuantity,
        );

        const outgoingQuantityDiff = getNumberDiff(
          inventoryEntryBefore.outgoingQuantity,
          inventoryEntryAfter.outgoingQuantity,
        );

        const reservedQuantityDiff = getNumberDiff(
          inventoryEntryBefore.reservedQuantity,
          inventoryEntryAfter.reservedQuantity,
        );

        // Update quantities
        transaction.update(inventorySummaryRef, {
          totalCurrentQuantity: 
            inventorySummaryData.totalCurrentQuantity +
            currentQuantityDiff,
          totalOutgoingQuantity:
            inventorySummaryData.totalOutgoingQuantity +
            outgoingQuantityDiff,
          totalReservedQuantity:
            inventorySummaryData.totalReservedQuantity +
            reservedQuantityDiff,
        } satisfies Partial<InventorySummary>);
      });
    }

    if (isDelete) {
      const inventoryEntryBefore = before.data() as InventoryEntry;

      await db.runTransaction(async transaction => {
        const inventorySummaryDoc = await transaction.get(inventorySummaryRef);
        const inventorySummaryData = inventorySummaryDoc.data() as InventorySummary;

        // Update quantities
        transaction.update(inventorySummaryRef, {
          totalCurrentQuantity: inventorySummaryData.totalCurrentQuantity -
            inventoryEntryBefore.currentQuantity,
          totalOutgoingQuantity: inventorySummaryData.totalOutgoingQuantity -
            inventoryEntryBefore.outgoingQuantity,
          totalReservedQuantity: inventorySummaryData.totalReservedQuantity -
            inventoryEntryBefore.reservedQuantity,
        } satisfies Partial<InventorySummary>);
      });
    }
  },
);

