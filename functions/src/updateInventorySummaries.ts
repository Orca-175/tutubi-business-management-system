import { onDocumentWritten } from "firebase-functions/firestore";
import { db } from ".";
import { InventoryEntry, InventorySummary } from "shared/interfaces/firestore-collections";

export const updateInventorySummaries = onDocumentWritten('inventory/{inventoryEntryId}',
  async event => {
    const before = event.data!.before;
    const after = event.data!.after;

    const isCreate = !before.exists && after.exists;
    const isUpdate = before.exists && after.exists;
    const isDelete = before.exists && !after.exists;

    if (isCreate) {
      const createdInventoryEntry = after.data() as InventoryEntry;

      // Get existing aggregate summary of inventory entry of productId
      const docs = (await db
        .collection('inventorySummaries')
        .where('productId', '==', createdInventoryEntry.productId)
        .get()).docs;

      // If inventory summary for product does not exist (first time a particular
      // product is added to inventory), create it
      if (docs.length === 0) {
        const inventorySummary: InventorySummary = {
          productName: createdInventoryEntry.productName,
          productId: createdInventoryEntry.productId,
          totalCurrentQuantity: createdInventoryEntry.currentQuantity,
          totalOutgoingQuantity: createdInventoryEntry.outgoingQuantity,
        };

        await db.collection('inventorySummaries')
          .doc()
          .create(inventorySummary);

        return;
      }

      const currentSummaryDoc = docs[0];
      const currentSummaryData = currentSummaryDoc.data() as InventorySummary;
      currentSummaryData.totalCurrentQuantity = createdInventoryEntry.currentQuantity;
      currentSummaryData.totalOutgoingQuantity = createdInventoryEntry.outgoingQuantity;

      // Add values of newly created inventory entry to aggregate summary
      await db.collection('inventorySummaries')
        .doc(currentSummaryDoc.id)
        .set(currentSummaryData);
    }

    if (isUpdate) {

    }

    if (isDelete) {

    }
  }
);

