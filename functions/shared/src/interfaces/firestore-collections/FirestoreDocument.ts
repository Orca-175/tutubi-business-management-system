import type { TimestampBridge } from "../TimestampBridge.js";

// A typical Firestore document
// Some collections may not need or want the properties in this interface
// and may choose not to extend it
export interface FirestoreDocument {
  createdAt: TimestampBridge;
}

