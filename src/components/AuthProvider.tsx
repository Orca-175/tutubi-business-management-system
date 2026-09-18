import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

import { AuthContext } from '../context/AuthContext';
import { auth } from '../firebase/firebase';

export function AuthProvider() {
  const [user, setUser] = useState<null | User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return null;
  } else if (!user) {
    // TODO: Make login required page to replace this redirect
    return <Navigate to={'/'} />;
  } else {
    return (
      <AuthContext value={{ isLoading: isLoading, user: user}}>
        <Outlet />
      </AuthContext>
    );
  }
}
