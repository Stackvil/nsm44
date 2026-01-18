import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj9imh4c1sygj_N0fajC7e0QR3hNjcDhw",
  authDomain: "nsmalumini.firebaseapp.com",
  projectId: "nsmalumini",
  storageBucket: "nsmalumini.firebasestorage.app",
  messagingSenderId: "66377924171",
  appId: "1:66377924171:web:e40b25511f1d8b716857ce",
  measurementId: "G-LRHK9V4B4F"
};

// Lazy initialization - only initialize if not already initialized
let appInstance: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

const getApp = (): FirebaseApp => {
    if (!appInstance) {
        const existingApps = getApps();
        if (existingApps.length > 0) {
            appInstance = existingApps[0];
        } else {
            appInstance = initializeApp(firebaseConfig);
        }
    }
    return appInstance;
};

const getAuthInstance = (): Auth => {
    if (!authInstance) {
        authInstance = getAuth(getApp());
    }
    return authInstance;
};

const getFirestoreInstance = (): Firestore => {
    if (!dbInstance) {
        dbInstance = getFirestore(getApp());
    }
    return dbInstance;
};

// Export lazy-initialized instances
// These will be initialized on first access, not on module import
export const auth = getAuthInstance();
export const db = getFirestoreInstance();

export default getApp();
