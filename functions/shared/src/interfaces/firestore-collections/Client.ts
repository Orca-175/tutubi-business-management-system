import type { Address } from '../Address.ts';
import type { FullName } from '../FullName.ts';
import type { FirestoreDocument } from './FirestoreDocument.js';

export interface Client extends FirestoreDocument {
  address: Address;
  avatarPath: string;
  businessName: string;
  email: string;
  name: FullName;
  phone: string;
}

export interface ClientData {
  // User UID from Auth
  docId: string;
}

