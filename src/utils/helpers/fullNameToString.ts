import type { FullName } from '../../../functions/shared/lib/interfaces/FullName';

export function fullNameToString(fullName: FullName) {
  return `${fullName.firstName} ${fullName.middleName[0]}. ${fullName.lastName}`;
}

