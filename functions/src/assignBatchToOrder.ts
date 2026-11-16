// import { onDocumentCreated } from "firebase-functions/firestore";
// import { collections } from "shared/interfaces/firestore-collection-strings";
// import { Order } from "shared/interfaces/firestore-collections";
//
// export const assignBatchToOrder = onDocumentCreated(`${collections.orders}/{orderId}`, async event => {
//   const doc = event.data!;
//
//   // Get product ID
//   const data = doc.data()! as Order;
//
//   // Find available batch in inventory collection
//     // Should add expiresAt field to inventory documents first to check expiry status before assigning batch
//   // Set outgoing quantity of batch in inventory
//   // Update batch number field of order
// });
//
