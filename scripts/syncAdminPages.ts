import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, Timestamp, writeBatch } from 'firebase/firestore';

import { auth, db } from '../src/firebase/firebase.ts';
import adminPages from './admin-page-collections.json';

async function syncAdminPages() {
  const batch = writeBatch(db);

  for (const page of adminPages) {
    const ref = doc(db, `pages/${page.docId}`);
    const docSnap = await getDoc(ref);

    let data;

    if (!docSnap.exists()) {
      data = {
        collections: page.collections,
        createdAt: Timestamp.now(),
        name: page.name,
      };
    } else {
      data = {
        collections: page.collections,
        name: page.name,
      };
    }

    batch.set(ref, data, { merge: true });
  }

  await batch.commit();
  console.log('Admin pages have been synced!');
}

await signInWithEmailAndPassword(auth, 'enter admin email', 'enter admin password');
await syncAdminPages();
process.exit(0);

