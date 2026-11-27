import { getFirestore, QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/scheduler';
import { collections } from 'shared/interfaces/firestore-collection-strings';
import { Order } from 'shared/interfaces/firestore-collections';

const db = getFirestore();

export const unreserveOrders = onSchedule({ schedule: 'every day 04:00', timeZone: 'Asia/Manila' }, async () => {
  const dateToday = new Date();
  dateToday.setHours(0, 0, 0, 0);

  const ordersDocs = (await db.collection(collections.orders)
    .where('reservationInfo.unreserveAt', '>=', Timestamp.fromDate(dateToday))
    .where('status', '!=', 'Cancelled')
    .where('status', '!=', 'Received')
    .get()).docs as QueryDocumentSnapshot<Order>[];

  // If no orders are pass their unreserveAt date, then
  if (ordersDocs.length === 0) {
    return;
  }

  const ordersData = ordersDocs.map(doc => ({ ...doc.data(), docId: doc.id }));

  ordersData.map(async data => {
    await db.collection(collections.orders)
      .doc(data.docId)
      .update({
        status: 'Cancelled',
      });
  });
});

