import { onSchedule } from "firebase-functions/scheduler";

export const unreserveOrders = onSchedule('every 4:00', async event => {
  const docs = await db
});
