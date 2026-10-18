import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import bundledConfig from '../../firebase-applet-config.json';

// Support both committed firebase-applet-config.json and Vercel environment variables
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || bundledConfig.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || bundledConfig.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || bundledConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || bundledConfig.authDomain,
  firestoreDatabaseId:
    import.meta.env.VITE_FIREBASE_DATABASE_ID || bundledConfig.firestoreDatabaseId || '(default)',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || bundledConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || bundledConfig.messagingSenderId,
};

// Initialize or retrieve existing Firebase app
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with the provisioned database ID
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Cloud Storage for product and banner images
export const storage = getStorage(app);

export default app;
