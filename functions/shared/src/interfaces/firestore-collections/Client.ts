import type { Address } from '../Address.ts';
import type { FullName } from '../FullName.ts';

export interface Client {
  address: Address;
  avatarPath: string;
  businessName: string;
  createdAt: string;
  email: string;
  name: FullName;
  phone: string;
}

export interface ClientData {
  // User UID from Auth
  docId: string;
}

