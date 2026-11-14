import type { Address } from 'shared/interfaces';

export function addressToString(address: Address) {
  return `${address.houseNumber} ${address.street}, ${address.barangay}, ${address.city}, ${address.region}`;
}

