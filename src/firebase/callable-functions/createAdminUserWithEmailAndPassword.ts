import { httpsCallable } from 'firebase/functions';

import { functions } from '../firebase';

export async function createAdminUserWithEmailAndPassword(email: string, password: string): Promise<string> {
  const createAdminUserCallable = httpsCallable<{ email: string, password: string }, string>(functions, 'createAdminUserWithEmailAndPassword');

  return (await createAdminUserCallable({ email: email, password: password })).data;
}

