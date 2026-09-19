import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB1_Z_bNSf_gdq_Tl4vAXpDtD684SeHlC4',
  appId: '1:574722333804:web:4a5b30872a9d98ab7f0c49',
  authDomain: 'tutubi-bms.firebaseapp.com',
  messagingSenderId: '574722333804',
  projectId: 'tutubi-bms',
  storageBucket: 'tutubi-bms.firebasestorage.app',
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });

export const db = getFirestore(app);
connectFirestoreEmulator(db, 'localhost', 8080);

export const storage = getStorage(app);
connectStorageEmulator(storage, 'localhost', 9199);
