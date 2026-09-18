import type { User } from 'firebase/auth';

import { createContext } from 'react';

export const AuthContext = createContext<null | { isLoading: boolean; user: null | User; }>(null);
