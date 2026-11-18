// Bridges the different Timestamp types from
// firestore-admin/firestore and firestore/firestore
export interface TimestampBridge {
  readonly nanoseconds: number;
  readonly seconds: number;
  toDate(): Date;
  toMillis(): number;
}

