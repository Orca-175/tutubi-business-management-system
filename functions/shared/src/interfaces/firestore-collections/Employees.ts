import type { Address } from '../Address.js';
import type { FullName } from '../FullName.js';
import type { FirestoreDocument } from './FirestoreDocument.js';

export interface Employee extends FirestoreDocument {
  address: Address;
  email: string;
  fullName: FullName;
  phone: string;
}

export interface EmployeeData extends Employee {
  docId: string;
}

