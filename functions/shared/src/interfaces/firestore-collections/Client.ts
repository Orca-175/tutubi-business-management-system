import type { Address } from '../Address.ts';
import type { FullName } from '../FullName.ts';

export interface Client {
  address: Address;
  avatarPath: string;
  businessName: string;
  email: string;
  name: FullName;
  phone: string;
}

