import { getAuth } from 'firebase-admin/auth';
import { HttpsError, onCall } from 'firebase-functions/https';

const auth = getAuth();

interface Arguments {
  email: string;
  password: string;
}

export const createAdminUserWithEmailAndPassword = onCall<Arguments>(async request => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in to perform this operation.');
  }

  // TODO: Check super user (business owner) status rather than just admin claim
  if (!request.auth.token.admin) {
    throw new HttpsError('permission-denied', 'You do not have permission to perform this operation.');
  }

  const { email, password } = request.data;

  if (email === '' || password === '') {
    throw new HttpsError('permission-denied', 'Email or Password is missing');
  }

  const userRecord = await auth.createUser({
    email: email,
    password: password,
  });

  return userRecord.uid;
});

