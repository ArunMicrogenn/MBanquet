import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app: any;
let auth: any;
let db: any;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  if (getApps().length > 1) {
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } else {
    try {
      db = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
        ignoreUndefinedProperties: true
      }, firebaseConfig.firestoreDatabaseId);
    } catch {
      db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    }
  }
} catch (error) {
  console.warn('Firebase initialization in preview/sandbox fallback mode:', error);
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
  };
  db = {} as any;
}

export const isOfflineOrUnavailable = (error: unknown): boolean => {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  const code = (error as any)?.code || '';
  return (
    msg.includes('offline') ||
    msg.includes('unavailable') ||
    code === 'unavailable' ||
    code === 'failed-precondition' ||
    code === 'permission-denied'
  );
};

export { auth, db };

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // First user might be admin, subsequent are staff
      const usersSnap = await getDocs(collection(db, 'users'));
      const isFirstUser = usersSnap.empty;
      
      await setDoc(userRef, {
        name: user.displayName || 'Unknown',
        email: user.email || '',
        role: isFirstUser ? 'Admin' : 'Banquet Staff', // Admin for first, Staff for others
        createdAt: new Date().toISOString()
      });
    }
    
    return user;
  } catch (error: any) {
    if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
      console.error('Error signing in with Google', error);
    }
    throw error;
  }
};

export const logout = () => signOut(auth);
