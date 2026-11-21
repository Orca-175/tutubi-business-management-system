import { QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/scheduler';
import { collections } from 'shared/interfaces/firestore-collection-strings';
import { Order } from 'shared/interfaces/firestore-collections';

import { db } from '.';

export const unreserveOrders = onSchedule('every 4:00', async _ => {
  const dateToday = new Date();
  dateToday.setHours(0, 0, 0, 0);

  const ordersDocs = (await db.collection(collections.orders)
    .where('reservationInfo.unreserveAt', '>=', Timestamp.fromDate(dateToday))
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

