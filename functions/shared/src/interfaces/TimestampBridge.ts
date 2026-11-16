// Bridges the different Timestamp types from
// firestore-admin/firestore and firestore/firestore
export interface TimestampBridge {
  readonly seconds: number;
  readonly nanoseconds: number;
  toDate(): Date;
  toMillis(): number;
}

