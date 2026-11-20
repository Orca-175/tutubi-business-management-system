import type { FullName } from '../interfaces.js';

export function fullNameToString(fullName: FullName) {
  return `${fullName.firstName} ${fullName.middleName[0]}. ${fullName.lastName}`;
}

