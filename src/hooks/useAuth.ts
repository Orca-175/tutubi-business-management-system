import { useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthContext is null. useAuth must be used within an AuthProvider.');
  }

  return context;
}
