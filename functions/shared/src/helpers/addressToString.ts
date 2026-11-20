import type { Address } from '../interfaces.js';

export function addressToString(address: Address) {
  return `${address.houseNumber} ${address.street}, ${address.barangay}, ${address.city}, ${address.region}`;
}

