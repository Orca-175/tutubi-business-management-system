import { signOut } from 'firebase/auth';

import { auth } from '../../firebase/firebase';

export function AdminHome() {
  return (
    <div>
      This is the admin home component.
    <button
      onClick={(event) => {
        event.preventDefault();
        signOut(auth);
      }}
    >
      Logout
    </button>
    </div>
  );
}
