import type { IdTokenResult } from 'firebase/auth';

import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

import { useAuth } from '../../hooks/useAuth';

export function AdminRequired() {
  const { isLoading, user } = useAuth();
  const [tokenResult, setTokenResult] = useState<IdTokenResult | null>(null);

  useEffect(() => {
    async function getTokenResult() {
      if (user) {
        setTokenResult(await user.getIdTokenResult());
      }
    }

    getTokenResult();
  }, [user]);

  if (isLoading) {
    return null;
  } else if (!user) {
    return <Navigate to={'/admin/login'} />;
  } else {
    if (tokenResult?.claims.admin === false) {
      // TODO: Make access forbidden page to replace redirect
      return <Navigate to={'/'} />;
    } else {
      return <Outlet />;
    }
  }
}
