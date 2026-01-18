import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface AlumniUser {
  uid: string;
  email: string;
  displayName?: string;
  batchYear?: string;
  fullName?: string;
  phoneNumber?: string;
  createdAt: Timestamp;
  isExistingMember?: boolean;
  memberId?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    // First, check if user exists in Firestore (existing members)
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw {
        code: 'user-not-found',
        message: 'This email is not registered as an existing member. Please contact support.'
      } as AuthError;
    }

    // User exists in Firestore, now try to sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    // Handle Firebase auth errors
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw {
        code: error.code,
        message: 'Invalid email or password. Please try again.'
      } as AuthError;
    } else if (error.code === 'auth/invalid-email') {
      throw {
        code: error.code,
        message: 'Invalid email address. Please check and try again.'
      } as AuthError;
    } else if (error.code === 'user-not-found') {
      throw error;
    } else {
      throw {
        code: error.code || 'unknown-error',
        message: error.message || 'An error occurred during sign in. Please try again.'
      } as AuthError;
    }
  }
};

// Register new user (for existing members only)
export const register = async (
  email: string,
  password: string,
  fullName: string,
  batchYear?: string,
  phoneNumber?: string
) => {
  try {
    // First, check if user exists in Firestore (existing members)
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw {
        code: 'user-not-found',
        message: 'This email is not registered as an existing member. Please contact support to register your email first.'
      } as AuthError;
    }

    // Get user document to check if already registered
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (userData.uid) {
      throw {
        code: 'already-registered',
        message: 'This email is already registered. Please use the login page instead.'
      } as AuthError;
    }

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    if (fullName) {
      await updateProfile(user, { displayName: fullName });
    }

    // Update Firestore user document with UID and additional info
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      uid: user.uid,
      email: email.toLowerCase(),
      fullName: fullName || userData.fullName,
      batchYear: batchYear || userData.batchYear,
      phoneNumber: phoneNumber || userData.phoneNumber,
      createdAt: userData.createdAt || Timestamp.now(),
      isExistingMember: true,
      registeredAt: Timestamp.now()
    });

    // Also update the original document by email if different
    if (userDoc.id !== user.uid) {
      await setDoc(doc(db, 'users', userDoc.id), {
        uid: user.uid,
        email: email.toLowerCase()
      }, { merge: true });
    }

    return user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw {
        code: error.code,
        message: 'This email is already registered. Please use the login page instead.'
      } as AuthError;
    } else if (error.code === 'auth/weak-password') {
      throw {
        code: error.code,
        message: 'Password should be at least 6 characters long.'
      } as AuthError;
    } else if (error.code === 'auth/invalid-email') {
      throw {
        code: error.code,
        message: 'Invalid email address. Please check and try again.'
      } as AuthError;
    } else if (error.code === 'user-not-found' || error.code === 'already-registered') {
      throw error;
    } else {
      throw {
        code: error.code || 'unknown-error',
        message: error.message || 'An error occurred during registration. Please try again.'
      } as AuthError;
    }
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw {
      code: error.code || 'unknown-error',
      message: error.message || 'An error occurred during sign out.'
    } as AuthError;
  }
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<AlumniUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as AlumniUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Get user by email (for admin use)
export const getUserByEmail = async (email: string): Promise<AlumniUser | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as AlumniUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};
