import type { User } from 'firebase/auth';
import type { EmployeeData, RoleData } from 'shared/interfaces/firestore-collections';

import { createContext } from 'react';

type AuthContext = null | {
  employeeData?: EmployeeData; // Superusers don't have an employee doc
  isLoading: boolean;
  isSuperuser: boolean;
  roleData?: RoleData; // Superusers don't need a role
  user?: User;
};

export const AuthContext = createContext<AuthContext>(null);

